// app/api/community/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    
    if (!postId) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find post
    let post = null;
    if (mongoose.Types.ObjectId.isValid(postId)) {
      post = await Community.findById(postId);
    }
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Authentication
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
    const body = await request.json();
    
    if (!body.content?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Comment content is required' },
        { status: 400 }
      );
    }
    
    // Get REAL user name from database
    const user = await User.findById(userId).select('name email');
    const communityUser = await CommunityUser.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    
    const realUserName = user?.name || communityUser?.username || 'Community Member';
    const realUserAvatar = communityUser?.avatar || '';
    const userRole = decoded.role || 'user';
    
    // Create comment object
    const comment = {
      user: new mongoose.Types.ObjectId(userId),
      userName: realUserName,
      userAvatar: realUserAvatar,
      userRole: userRole,
      content: body.content.trim(),
      likes: [],
      likeCount: 0,
      replies: [],
      isSolution: false,
      createdAt: new Date(),
    };
    
    // Add comment to post
    post.comments.push(comment);
    post.commentCount = post.comments.length;
    post.lastActivityAt = new Date();
    
    await post.save();
    
    // ✅ FIX: Safely get the added comment with proper error handling
    const savedComment = post.comments[post.comments.length - 1];
    
    // Check if savedComment exists and has _id
    if (!savedComment || !savedComment._id) {
      return NextResponse.json(
        { success: false, message: 'Failed to retrieve saved comment' },
        { status: 500 }
      );
    }
    
    const commentWithId = {
      _id: savedComment._id.toString(),
      user: savedComment.user.toString(),
      userName: savedComment.userName,
      userAvatar: savedComment.userAvatar,
      userRole: savedComment.userRole,
      content: savedComment.content,
      likes: savedComment.likes || [],
      likeCount: savedComment.likeCount || 0,
      replies: savedComment.replies || [],
      isSolution: savedComment.isSolution || false,
      createdAt: savedComment.createdAt,
    };
    
    return NextResponse.json({
      success: true,
      message: 'Comment added successfully',
      data: commentWithId
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ COMMENT API ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add comment' },
      { status: 500 }
    );
  }
}