// app/api/community/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

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
    
    const userId = new mongoose.Types.ObjectId(decoded.userId);
    
    // Get bookmarked posts
    const bookmarkedPosts = await Community.find({
      bookmarks: userId,
      status: 'active'
    })
    .populate('author', 'name avatar role')
    .sort({ lastActivityAt: -1 })
    .lean();
    
    return NextResponse.json({
      success: true,
      data: bookmarkedPosts,
      count: bookmarkedPosts.length
    });
    
  } catch (error: any) {
    console.error('GET /api/community/bookmarks error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}