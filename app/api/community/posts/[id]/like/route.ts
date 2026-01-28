// app/api/community/posts/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import { verifyToken } from '@/lib/jwt';
import { Types } from 'mongoose';

interface RouteParams {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const postId = params.id;
    
    if (!Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    // Find the post
    const post = await Community.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if user has already liked the post
    const alreadyLiked = post.likes.some((likeId: Types.ObjectId) => 
      likeId.toString() === userId
    );
    
    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter((likeId: Types.ObjectId) => 
        likeId.toString() !== userId
      );
      post.likeCount = Math.max(0, post.likeCount - 1);
      await post.save();
      
      return NextResponse.json({
        success: true,
        message: 'Post unliked',
        data: {
          likes: post.likes.map((id: Types.ObjectId) => id.toString()),
          likeCount: post.likeCount
        }
      });
    } else {
      // Like the post
      post.likes.push(new Types.ObjectId(userId));
      post.likeCount += 1;
      post.lastActivityAt = new Date();
      await post.save();
      
      return NextResponse.json({
        success: true,
        message: 'Post liked',
        data: {
          likes: post.likes.map((id: Types.ObjectId) => id.toString()),
          likeCount: post.likeCount
        }
      });
    }
    
  } catch (error: any) {
    console.error('POST /api/community/posts/[id]/like error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    const postId = params.id;
    
    if (!Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    // Find the post
    const post = await Community.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Remove like
    post.likes = post.likes.filter((likeId: Types.ObjectId) => 
      likeId.toString() !== userId
    );
    post.likeCount = Math.max(0, post.likeCount - 1);
    await post.save();
    
    return NextResponse.json({
      success: true,
      message: 'Post unliked',
      data: {
        likes: post.likes.map((id: Types.ObjectId) => id.toString()),
        likeCount: post.likeCount
      }
    });
    
  } catch (error: any) {
    console.error('DELETE /api/community/posts/[id]/like error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to unlike post' },
      { status: 500 }
    );
  }
}