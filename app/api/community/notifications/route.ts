import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Check authentication
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken) as any;
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = decoded.userId;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Get notifications (mock implementation)
    const notifications = [
      { _id: '1', message: 'New follower: John Doe', createdAt: new Date() },
      { _id: '2', message: 'Your post got 5 likes', createdAt: new Date() },
      { _id: '3', message: 'New comment on your post', createdAt: new Date() },
    ];
    
    const unreadCount = 3;
    
    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount
    });
    
  } catch (error: any) {
    console.error('GET /api/community/notifications error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}