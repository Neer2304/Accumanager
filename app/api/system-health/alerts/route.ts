// app/api/system-health/alerts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/system-health/alerts - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('⚠️ No auth token found in request cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      console.log('👤 Decoded user:', decoded.userId);
      
      await connectToDatabase();
      const db = mongoose.connection.db;
      
      if (!db) {
        throw new Error('Database not connected');
      }

      let userAlerts = [];

      // Try to get user-specific alerts from alerts collection
      try {
        const collections = await db.listCollections({ name: 'alerts' }).toArray();
        if (collections.length > 0) {
          userAlerts = await db.collection('alerts')
            .find({ 
              userId: decoded.userId,
              resolved: false 
            })
            .sort({ timestamp: -1 })
            .toArray();
        }
      } catch (error) {
        console.log('Alerts collection not available, generating real-time alerts');
      }

      // If no alerts in collection, generate based on current user system state
      if (userAlerts.length === 0) {
        const dbStats = await db.stats();
        
        // Get user-specific collections stats
        const userCollections = ['users', 'customers', 'projects', 'tasks', 'invoices', 'meetings'];
        const collectionStats = await Promise.all(
          userCollections.map(async (collectionName) => {
            try {
              const collection = db.collection(collectionName);
              let userDocCount = 0;
              if (collectionName === 'users') {
                userDocCount = await collection.countDocuments({ _id: new mongoose.Types.ObjectId(decoded.userId) });
              } else {
                userDocCount = await collection.countDocuments({ userId: decoded.userId });
              }
              return { name: collectionName, userDocumentCount: userDocCount };
            } catch (error) {
              return { name: collectionName, userDocumentCount: 0 };
            }
          })
        );
        
        let userRecentErrors = [];
        try {
          const collections = await db.listCollections({ name: 'logs' }).toArray();
          if (collections.length > 0) {
            userRecentErrors = await db.collection('logs')
              .find({ 
                level: 'error',
                userId: decoded.userId,
                timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
              })
              .limit(10)
              .toArray();
          }
        } catch (error) {
          // Logs collection doesn't exist
        }
        
        const readyState = mongoose.connection.readyState;
        userAlerts = generateRealTimeAlerts(dbStats, collectionStats, userRecentErrors, readyState, decoded.userId);
      }

      console.log(`✅ Found ${userAlerts.length} alerts for user ${decoded.userId}`);
      return NextResponse.json({ alerts: userAlerts });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Alerts API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateRealTimeAlerts(dbStats: any, collectionStats: any[], userRecentErrors: any[], readyState: number, userId: string) {
  const alerts = [];

  // Calculate user memory usage
  const totalUserDocuments = collectionStats.reduce((sum, col) => sum + col.userDocumentCount, 0);
  const avgDocSize = dbStats.dataSize / (dbStats.objects || 1);
  const userMemoryUsage = (totalUserDocuments * avgDocSize) / (1024 * 1024);

  // Connection alert
  if (readyState !== 1) {
    alerts.push({
      id: `conn-${Date.now()}`,
      serviceId: 'mongodb-primary',
      serviceName: 'Database Service',
      severity: 'critical',
      message: `Database connection is ${getConnectionStateText(readyState)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      userId: userId
    });
  }

  // Memory alert for user
  if (userMemoryUsage > 35) {
    alerts.push({
      id: `mem-${Date.now()}`,
      serviceId: 'mongodb-primary',
      serviceName: 'Database Service',
      severity: userMemoryUsage > 45 ? 'critical' : userMemoryUsage > 40 ? 'high' : 'medium',
      message: `High storage usage: ${userMemoryUsage.toFixed(2)}MB used`,
      timestamp: new Date().toISOString(),
      resolved: false,
      userId: userId
    });
  }

  // Error rate alert for user
  if (userRecentErrors.length > 1) {
    alerts.push({
      id: `error-${Date.now()}`,
      serviceId: 'api-server',
      serviceName: 'API Gateway',
      severity: userRecentErrors.length > 4 ? 'high' : userRecentErrors.length > 2 ? 'medium' : 'low',
      message: `${userRecentErrors.length} errors in last 24 hours`,
      timestamp: new Date().toISOString(),
      resolved: false,
      userId: userId
    });
  }

  return alerts;
}

function getConnectionStateText(readyState: number): string {
  switch (readyState) {
    case 0: return 'disconnected';
    case 1: return 'connected';
    case 2: return 'connecting';
    case 3: return 'disconnecting';
    default: return 'unknown';
  }
}