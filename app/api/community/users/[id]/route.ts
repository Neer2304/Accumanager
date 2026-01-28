// app/api/community/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Community from '@/models/Community';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Get user basic info
    const user = await User.findById(userId)
      .select('name email role avatar businessName location bio createdAt')
      .lean();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user stats
    const [totalPosts, totalComments, totalLikes, totalBookmarks] = await Promise.all([
      Community.countDocuments({ author: userId, status: 'active' }),
      Community.aggregate([
        { $match: { status: 'active' } },
        { $unwind: '$comments' },
        { $match: { 'comments.user': userId } },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0),
      Community.aggregate([
        { $match: { status: 'active', likes: userId } },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0),
      Community.aggregate([
        { $match: { status: 'active', bookmarks: userId } },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0),
    ]);
    
    const userWithStats = {
      ...user,
      stats: {
        totalPosts,
        totalComments,
        totalLikes,
        totalBookmarks,
      }
    };
    
    return NextResponse.json({
      success: true,
      data: userWithStats
    });
    
  } catch (error: any) {
    console.error('GET /api/community/users/[id] error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}