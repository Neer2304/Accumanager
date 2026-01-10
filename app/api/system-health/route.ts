// app/api/system-health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

interface CollectionStats {
  name: string;
  stats?: any;
  userDocumentCount: number;
  error?: string;
}

interface SystemAlert {
  id: string;
  serviceId: string;
  serviceName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date | string;
  resolved: boolean;
  userId?: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/system-health - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('⚠️ No auth token found in request cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken) as { userId: string };
      console.log('👤 Decoded user:', decoded.userId);
      
      await connectToDatabase();
      console.log('✅ Database connected');

      const db = mongoose.connection.db;
      
      if (!db) {
        throw new Error('Database not connected');
      }

      // Get database stats
      const dbStats = await db.stats();
      
      // Get user-specific collection stats
      const userCollections = ['users', 'customers', 'projects', 'tasks', 'invoices', 'meetings'];
      const collectionStatsPromises: Promise<CollectionStats>[] = userCollections.map(async (collectionName) => {
        try {
          const collection = db.collection(collectionName);
          const stats = await collection.stats();
          
          // Get count of documents belonging to this user
          let userDocCount = 0;
          if (collectionName === 'users') {
            userDocCount = await collection.countDocuments({ 
              _id: new mongoose.Types.ObjectId(decoded.userId) 
            });
          } else {
            userDocCount = await collection.countDocuments({ userId: decoded.userId });
          }
          
          return { 
            name: collectionName, 
            stats,
            userDocumentCount: userDocCount
          };
        } catch (error: any) {
          console.error(`Error fetching stats for ${collectionName}:`, error);
          return { 
            name: collectionName, 
            error: error.message || 'Unable to fetch stats',
            userDocumentCount: 0
          };
        }
      });

      const collectionStats = await Promise.all(collectionStatsPromises);

      // Get user-specific error logs
      let userRecentErrors: any[] = [];
      try {
        const collections = await db.listCollections({ name: 'logs' }).toArray();
        if (collections.length > 0) {
          userRecentErrors = await db.collection('logs')
            .find({ 
              level: 'error',
              userId: decoded.userId,
              timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            })
            .sort({ timestamp: -1 })
            .limit(10)
            .toArray();
        }
      } catch (error) {
        console.log('Logs collection not available');
      }

      // Get connection pool stats
      const readyState = mongoose.connection.readyState;

      // Transform to system services format with user-specific data
      const services = transformToServices(dbStats, collectionStats, userRecentErrors, readyState, decoded.userId);
      
      // Generate alerts based on user-specific metrics
      const alerts = generateAlerts(dbStats, collectionStats, userRecentErrors, readyState, decoded.userId);

      return NextResponse.json({
        services,
        alerts,
        lastUpdated: new Date().toISOString(),
        userStats: {
          totalDocuments: collectionStats.reduce((sum, col) => sum + col.userDocumentCount, 0),
          storageUsage: calculateStorageUsage(dbStats, collectionStats),
          collectionsUsed: collectionStats.filter(c => c.userDocumentCount > 0).length,
          recentErrors: userRecentErrors.length
        }
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ System health API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

function calculateStorageUsage(dbStats: any, collectionStats: CollectionStats[]): number {
  const totalUserDocuments = collectionStats.reduce((sum, col) => sum + col.userDocumentCount, 0);
  const avgDocSize = dbStats.dataSize / (dbStats.objects || 1);
  const userMemoryUsage = (totalUserDocuments * avgDocSize) / (1024 * 1024);
  return Number(userMemoryUsage.toFixed(2));
}

function transformToServices(
  dbStats: any, 
  collectionStats: CollectionStats[], 
  userRecentErrors: any[], 
  readyState: number, 
  userId: string
) {
  const totalUserDocuments = collectionStats.reduce((sum, col) => sum + col.userDocumentCount, 0);
  const avgDocSize = dbStats.dataSize / (dbStats.objects || 1);
  const userMemoryUsage = (totalUserDocuments * avgDocSize) / (1024 * 1024);
  
  const maxMemoryPerUser = 50;
  const memoryPercent = Math.min(100, (userMemoryUsage / maxMemoryPerUser) * 100);

  const userDiskUsage = userMemoryUsage * 1.2;
  const maxDiskPerUser = 60;
  const diskPercent = Math.min(100, (userDiskUsage / maxDiskPerUser) * 100);

  let dbStatus: 'healthy' | 'degraded' | 'down' = 'healthy';
  if (readyState !== 1) {
    dbStatus = 'down';
  } else if (userRecentErrors.length > 3 || memoryPercent > 80) {
    dbStatus = 'degraded';
  }

  return [
    {
      id: 'mongodb-primary',
      name: 'Database Service',
      type: 'database' as const,
      status: dbStatus,
      responseTime: getResponseTime(readyState),
      uptime: 99.95,
      lastChecked: new Date().toISOString(),
      resources: {
        cpu: getCPUUsage(readyState),
        memory: Math.round(memoryPercent),
        disk: Math.round(diskPercent)
      },
      details: {
        connectionState: getConnectionStateText(readyState),
        userDocuments: totalUserDocuments,
        userCollections: collectionStats.filter(c => c.userDocumentCount > 0).length,
        estimatedUsage: `${userMemoryUsage.toFixed(2)} MB`
      }
    },
    {
      id: 'api-server',
      name: 'API Gateway',
      type: 'api' as const,
      status: userRecentErrors.length > 5 ? 'degraded' : 'healthy',
      responseTime: 25,
      uptime: 99.98,
      lastChecked: new Date().toISOString(),
      resources: {
        cpu: 15,
        memory: 45,
        disk: 12
      },
      details: {
        recentErrors: userRecentErrors.length,
        lastError: userRecentErrors[0]?.timestamp || 'None'
      }
    },
    {
      id: 'authentication',
      name: 'Auth Service',
      type: 'authentication' as const,
      status: 'healthy',
      responseTime: 8,
      uptime: 99.99,
      lastChecked: new Date().toISOString(),
      resources: {
        cpu: 8,
        memory: 22,
        disk: 5
      }
    },
    {
      id: 'file-storage',
      name: 'File Storage',
      type: 'storage' as const,
      status: 'healthy',
      responseTime: 45,
      uptime: 99.97,
      lastChecked: new Date().toISOString(),
      resources: {
        cpu: 5,
        memory: 15,
        disk: Math.min(100, (userDiskUsage / 100) * 100)
      },
      details: {
        userFiles: 'Active',
        storageUsed: `${userDiskUsage.toFixed(1)} MB`
      }
    }
  ];
}

function generateAlerts(
  dbStats: any, 
  collectionStats: CollectionStats[], 
  userRecentErrors: any[], 
  readyState: number, 
  userId: string
): SystemAlert[] {
  const alerts: SystemAlert[] = [];

  // Connection state alert
  if (readyState !== 1) {
    alerts.push({
      id: `connection-${Date.now()}`,
      serviceId: 'mongodb-primary',
      serviceName: 'Database Service',
      severity: 'critical',
      message: `Database connection issue: ${getConnectionStateText(readyState)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      userId: userId
    });
  }

  // Check for high user memory usage
  const totalUserDocuments = collectionStats.reduce((sum, col) => sum + col.userDocumentCount, 0);
  const avgDocSize = dbStats.dataSize / (dbStats.objects || 1);
  const userMemoryUsage = (totalUserDocuments * avgDocSize) / (1024 * 1024);
  
  if (userMemoryUsage > 40) {
    alerts.push({
      id: `memory-${Date.now()}`,
      serviceId: 'mongodb-primary',
      serviceName: 'Database Service',
      severity: userMemoryUsage > 45 ? 'high' : 'medium',
      message: `High storage usage: ${userMemoryUsage.toFixed(2)}MB used`,
      timestamp: new Date().toISOString(),
      resolved: false,
      userId: userId
    });
  }

  // Check for high user error rate
  if (userRecentErrors.length > 2) {
    alerts.push({
      id: `errors-${Date.now()}`,
      serviceId: 'api-server',
      serviceName: 'API Gateway',
      severity: userRecentErrors.length > 5 ? 'high' : 'medium',
      message: `High error rate: ${userRecentErrors.length} errors in last 24 hours`,
      timestamp: new Date().toISOString(),
      resolved: false,
      userId: userId
    });
  }

  return alerts;
}

// Helper functions
function getConnectionStateText(readyState: number): string {
  switch (readyState) {
    case 0: return 'disconnected';
    case 1: return 'connected';
    case 2: return 'connecting';
    case 3: return 'disconnecting';
    default: return 'unknown';
  }
}

function getResponseTime(readyState: number): number {
  if (readyState !== 1) return 999;
  return Math.floor(Math.random() * 20 + 5);
}

function getCPUUsage(readyState: number): number {
  if (readyState !== 1) return 0;
  return Math.min(100, Math.floor(Math.random() * 30 + 10));
}