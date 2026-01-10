// app/api/system-health/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/system-health/stats - Starting...');
    
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

      const dbStats = await db.stats();
      const collections = await db.listCollections().toArray();
      
      // Get user-specific collection stats
      const userCollections = ['users', 'customers', 'projects', 'tasks', 'invoices', 'meetings'];
      const collectionDetails = await Promise.all(
        userCollections.map(async (collectionName: string) => {
          try {
            const stats = await db.collection(collectionName).stats();
            
            // Get user-specific document count
            let userDocCount = 0;
            if (collectionName === 'users') {
              userDocCount = await db.collection(collectionName).countDocuments({ 
                _id: new mongoose.Types.ObjectId(decoded.userId) 
              });
            } else {
              userDocCount = await db.collection(collectionName).countDocuments({ 
                userId: decoded.userId 
              });
            }

            return {
              name: collectionName,
              totalCount: stats.count,
              userCount: userDocCount,
              size: stats.size,
              storageSize: stats.storageSize,
              avgObjSize: stats.avgObjSize,
              indexes: stats.nindexes
            };
          } catch (error) {
            return {
              name: collectionName,
              error: error.message,
              userCount: 0,
              totalCount: 0
            };
          }
        })
      );

      // Calculate user-specific storage usage
      const totalUserDocuments = collectionDetails.reduce((sum, col) => sum + col.userCount, 0);
      const avgDocSize = dbStats.dataSize / (dbStats.objects || 1);
      const userStorageUsage = (totalUserDocuments * avgDocSize) / (1024 * 1024); // MB

      return NextResponse.json({
        user: {
          id: decoded.userId,
          totalDocuments: totalUserDocuments,
          storageUsage: userStorageUsage,
          collectionsUsed: collectionDetails.filter(col => col.userCount > 0).length
        },
        database: {
          name: db.databaseName,
          collections: collections.length,
          totalDocuments: dbStats.objects,
          dataSize: dbStats.dataSize,
          storageSize: dbStats.storageSize,
          indexSize: dbStats.indexSize,
          connectionState: getConnectionStateText(mongoose.connection.readyState)
        },
        collections: collectionDetails,
        connection: {
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name,
          readyState: mongoose.connection.readyState
        }
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Database stats API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch database stats' },
      { status: 500 }
    );
  }
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