// app/api/notifications/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 GET /api/notifications/test - Testing notifications...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();
      
      // 1. Check existing notifications
      const existingNotifications = await Notification.find({ 
        userId: decoded.userId 
      }).countDocuments();
      
      console.log(`📊 User ${decoded.userId} has ${existingNotifications} notifications`);
      
      // 2. Create a test notification
      const testNotification = new Notification({
        userId: decoded.userId,
        title: 'Test Notification ✅',
        message: 'This is a test notification to verify the system is working.',
        type: 'success',
        actionUrl: '/dashboard',
      });
      
      await testNotification.save();
      console.log('✅ Test notification created');
      
      // 3. Get updated count
      const updatedCount = await Notification.find({ 
        userId: decoded.userId 
      }).countDocuments();
      
      return NextResponse.json({
        success: true,
        message: 'Notification system test completed',
        data: {
          previousCount: existingNotifications,
          newCount: updatedCount,
          testNotification: {
            id: testNotification._id,
            title: testNotification.title,
            message: testNotification.message
          }
        }
      });

    } catch (authError) {
      console.error('❌ Auth error in test:', authError);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Test notifications error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}