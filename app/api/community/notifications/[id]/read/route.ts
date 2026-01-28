// app/api/community/notifications/[id]/read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityNotification from '@/models/CommunityNotification';
import CommunityUser from '@/models/CommunityUser';
import { getToken } from 'next-auth/jwt';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get current user ID from token
    const token = await getToken({ req: request });
    if (!token?.sub) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = token.sub;
    const notificationId = params.id;
    
    // Get community user ID
    const communityUser = await CommunityUser.findOne({ userId });
    if (!communityUser) {
      return NextResponse.json(
        { success: false, message: 'Community profile not found' },
        { status: 404 }
      );
    }
    
    // Find and update notification
    const notification = await CommunityNotification.findOneAndUpdate(
      {
        _id: notificationId,
        userId,
        communityUserId: communityUser._id
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      },
      { new: true }
    );
    
    if (!notification) {
      return NextResponse.json(
        { success: false, message: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
    
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to mark notification as read'
      },
      { status: 500 }
    );
  }
}