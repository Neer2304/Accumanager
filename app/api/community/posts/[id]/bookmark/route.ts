// app/api/community/posts/[id]/bookmark/route.ts
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
    
    // Initialize bookmarks array if it doesn't exist
    if (!post.bookmarks) {
      post.bookmarks = [];
      post.bookmarkCount = 0;
    }
    
    // Check if user has already bookmarked the post
    const alreadyBookmarked = post.bookmarks.some((bookmarkId: Types.ObjectId) => 
      bookmarkId.toString() === userId
    );
    
    if (alreadyBookmarked) {
      // Remove bookmark
      post.bookmarks = post.bookmarks.filter((bookmarkId: Types.ObjectId) => 
        bookmarkId.toString() !== userId
      );
      post.bookmarkCount = Math.max(0, post.bookmarkCount - 1);
      await post.save();
      
      return NextResponse.json({
        success: true,
        message: 'Bookmark removed',
        data: {
          bookmarks: post.bookmarks.map((id: Types.ObjectId) => id.toString()),
          bookmarkCount: post.bookmarkCount
        }
      });
    } else {
      // Add bookmark
      post.bookmarks.push(new Types.ObjectId(userId));
      post.bookmarkCount += 1;
      await post.save();
      
      return NextResponse.json({
        success: true,
        message: 'Post bookmarked',
        data: {
          bookmarks: post.bookmarks.map((id: Types.ObjectId) => id.toString()),
          bookmarkCount: post.bookmarkCount
        }
      });
    }
    
  } catch (error: any) {
    console.error('POST /api/community/posts/[id]/bookmark error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to toggle bookmark' },
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
    
    // Remove bookmark
    if (post.bookmarks) {
      post.bookmarks = post.bookmarks.filter((bookmarkId: Types.ObjectId) => 
        bookmarkId.toString() !== userId
      );
      post.bookmarkCount = Math.max(0, post.bookmarkCount - 1);
      await post.save();
    }
    
    return NextResponse.json({
      success: true,
      message: 'Bookmark removed',
      data: {
        bookmarks: post.bookmarks?.map((id: Types.ObjectId) => id.toString()) || [],
        bookmarkCount: post.bookmarkCount || 0
      }
    });
    
  } catch (error: any) {
    console.error('DELETE /api/community/posts/[id]/bookmark error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to remove bookmark' },
      { status: 500 }
    );
  }
}