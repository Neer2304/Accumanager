// app/api/community/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityNotification from '@/models/CommunityNotification';
import CommunityUser from '@/models/CommunityUser';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
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
    
    // Get community user ID
    const communityUser = await CommunityUser.findOne({ userId });
    if (!communityUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Community profile not found',
          data: [],
          unreadCount: 0
        },
        { status: 404 }
      );
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    
    // Build query
    const query: any = { 
      userId,
      communityUserId: communityUser._id
    };
    
    if (type) {
      query.type = type;
    }
    
    if (unreadOnly) {
      query.isRead = false;
    }
    
    // Get notifications
    const notifications = await CommunityNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate([
        {
          path: 'metadata.userId',
          select: 'name email',
          model: 'User'
        },
        {
          path: 'metadata.communityUserId',
          select: 'username avatar',
          model: 'CommunityUser'
        },
        {
          path: 'metadata.postId',
          select: 'title slug',
          model: 'CommunityPost'
        }
      ])
      .lean();
    
    // Get unread count
    const unreadCount = await CommunityNotification.countDocuments({
      userId,
      communityUserId: communityUser._id,
      isRead: false
    });
    
    // Format notifications with human-readable dates
    const formattedNotifications = notifications.map(notification => ({
      ...notification,
      _id: notification._id.toString(),
      createdAt: notification.createdAt.toISOString(),
      readAt: notification.readAt?.toISOString(),
      formattedDate: formatNotificationDate(notification.createdAt),
      metadata: {
        ...notification.metadata,
        userId: notification.metadata?.userId?._id?.toString(),
        communityUserId: notification.metadata?.communityUserId?._id?.toString(),
        postId: notification.metadata?.postId?._id?.toString(),
        user: notification.metadata?.userId,
        communityUser: notification.metadata?.communityUserId,
        post: notification.metadata?.postId
      }
    }));
    
    return NextResponse.json({
      success: true,
      message: 'Notifications fetched successfully',
      data: formattedNotifications,
      unreadCount
    });
    
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch notifications',
        data: [],
        unreadCount: 0
      },
      { status: 500 }
    );
  }
}

// Helper function to format date
function formatNotificationDate(date: Date): string {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffMs = now.getTime() - notificationDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return notificationDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: diffDays > 365 ? 'numeric' : undefined
    });
  }
}