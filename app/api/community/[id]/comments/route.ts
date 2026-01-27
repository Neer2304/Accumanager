// app/api/community/[id]/comments/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';
import { error } from 'console';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('💬 COMMENT API - FIXED VERSION');
  
  try {
    const { id: postId } = await params;
    console.log('Post ID for comment:', postId);
    
    if (!postId) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find post
    let post = null;
    
    // Method 1: Direct find
    try {
      post = await Community.findById(postId);
    } catch (e) {
      console.log('Method 1 failed:', error.name);
    }
    
    // Method 2: With ObjectId
    if (!post && mongoose.Types.ObjectId.isValid(postId)) {
      try {
        const objectId = new mongoose.Types.ObjectId(postId);
        post = await Community.findById(objectId);
      } catch (e) {
        console.log('Method 2 failed:', error.name);
      }
    }
    
    if (!post) {
      console.log('❌ Post not found for comment');
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Post found: ${post.title}`);
    
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
    
    const userId = new mongoose.Types.ObjectId(decoded.userId);
    const body = await request.json();
    
    if (!body.content?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Comment content is required' },
        { status: 400 }
      );
    }
    
    // Check if post is locked
    if (post.isLocked && !['moderator', 'admin'].includes(decoded.role || 'user')) {
      return NextResponse.json(
        { success: false, message: 'This post is locked for new comments' },
        { status: 403 }
      );
    }
    
    // Get user details from token or fetch from DB
    const userName = decoded.name || 'User';
    const userRole = decoded.role || 'user';
    const userAvatar = decoded.avatar || '';
    
    // Create comment object
    const comment = {
      user: userId,
      userName: userName,
      userAvatar: userAvatar,
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
    
    // Get the added comment
    const savedComment = post.comments[post.comments.length - 1];
    const commentWithId = {
      ...savedComment.toObject(),
      _id: savedComment._id.toString()
    };
    
    console.log(`✅ Comment added by ${userName}`);
    console.log(`New comment count: ${post.commentCount}`);
    
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