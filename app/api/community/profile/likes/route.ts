import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Get posts liked by user
    const likedPosts = await Community.find({
      'likes.user': userId,
      status: 'active'
    })
    .populate('author', 'name avatar role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
    const total = await Community.countDocuments({
      'likes.user': userId,
      status: 'active'
    });
    
    return NextResponse.json({
      success: true,
      data: likedPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error: any) {
    console.error('GET /api/community/profile/likes error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch liked posts' },
      { status: 500 }
    );
  }
}