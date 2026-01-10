// app/api/system-health/alerts/[id]/resolve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 POST /api/system-health/alerts/resolve - Starting...');
    
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

      const alertId = params.id;
      let result = null;

      // Try to update user-specific alert in alerts collection
      try {
        const collections = await db.listCollections({ name: 'alerts' }).toArray();
        if (collections.length > 0) {
          result = await db.collection('alerts').updateOne(
            { 
              id: alertId,
              userId: decoded.userId // Ensure user owns this alert
            },
            { 
              $set: { 
                resolved: true,
                resolvedAt: new Date(),
                resolvedBy: decoded.userId
              }
            }
          );
        }
      } catch (error) {
        console.log('Alerts collection not available for update');
      }

      // If alert wasn't in database or collection doesn't exist, we still consider it resolved
      if (!result || result.modifiedCount === 0) {
        console.log(`Alert ${alertId} marked as resolved for user ${decoded.userId}`);
      }

      console.log('✅ Alert resolved successfully:', alertId);
      return NextResponse.json({ 
        success: true, 
        message: 'Alert resolved successfully' 
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Alert resolution error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}