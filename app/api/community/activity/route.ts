// app/api/community/activity/route.ts
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
    const userName = decoded.name || 'User';
    
    // Get user's liked posts
    const likedPosts = await Community.find({
      likes: userId,
      status: 'active'
    })
    .select('_id title excerpt category likeCount commentCount views createdAt updatedAt lastActivityAt')
    .sort({ lastActivityAt: -1 })
    .limit(50)
    .lean();
    
    // Get user's bookmarked posts
    const bookmarkedPosts = await Community.find({
      bookmarks: userId,
      status: 'active'
    })
    .select('_id title excerpt category likeCount commentCount views createdAt updatedAt lastActivityAt')
    .sort({ lastActivityAt: -1 })
    .limit(50)
    .lean();
    
    // Get user's created posts
    const createdPosts = await Community.find({
      author: userId,
      status: 'active'
    })
    .select('_id title excerpt category likeCount commentCount views createdAt updatedAt lastActivityAt')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
    
    // Get posts where user commented
    const commentedPosts = await Community.find({
      'comments.user': userId,
      status: 'active'
    })
    .select('_id title excerpt category comments likeCount commentCount views createdAt updatedAt lastActivityAt')
    .sort({ lastActivityAt: -1 })
    .limit(50)
    .lean();
    
    // Process commented posts to get user's comments
    const userCommentedPosts = commentedPosts.map(post => {
      const userComments = post.comments.filter((comment: any) => 
        comment.user.toString() === userId.toString()
      );
      
      const latestComment = userComments[0]; // Get latest comment
      
      return {
        ...post,
        commentContent: latestComment?.content,
        commentDate: latestComment?.createdAt || post.updatedAt
      };
    });
    
    // Combine all activities
    const allActivities = [
      ...likedPosts.map(post => ({
        ...post,
        type: 'liked' as const
      })),
      ...bookmarkedPosts.map(post => ({
        ...post,
        type: 'bookmarked' as const
      })),
      ...userCommentedPosts.map(post => ({
        ...post,
        type: 'commented' as const
      })),
      ...createdPosts.map(post => ({
        ...post,
        type: 'created' as const
      }))
    ];
    
    // Sort by date (most recent first)
    allActivities.sort((a, b) => {
      const dateA = a.type === 'commented' 
        ? new Date((a as any).commentDate).getTime()
        : new Date(a.lastActivityAt).getTime();
      const dateB = b.type === 'commented'
        ? new Date((b as any).commentDate).getTime()
        : new Date(b.lastActivityAt).getTime();
      
      return dateB - dateA;
    });
    
    // Get stats
    const stats = {
      totalLikes: likedPosts.length,
      totalBookmarks: bookmarkedPosts.length,
      totalComments: userCommentedPosts.length,
      totalPosts: createdPosts.length,
      recentActivity: allActivities.slice(0, 100) // Limit to 100 most recent
    };
    
    return NextResponse.json({
      success: true,
      data: stats
    });
    
  } catch (error: any) {
    console.error('GET /api/community/activity error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}