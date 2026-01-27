// app/api/community/[id]/bookmark/route.ts - FIXED VERSION
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
  console.log('🔖 BOOKMARK API - FIXED VERSION');
  
  try {
    const { id: postId } = await params;
    console.log('Post ID for bookmark:', postId);
    
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
      console.log('❌ Post not found for bookmark');
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
    
    // Initialize bookmarks array if it doesn't exist
    if (!post.bookmarks) {
      post.bookmarks = [];
    }
    
    // Toggle bookmark
    const userIdStr = userId.toString();
    const bookmarkIndex = post.bookmarks.findIndex((id: any) => 
      id.toString() === userIdStr
    );
    
    let message = '';
    let action = '';
    
    if (bookmarkIndex > -1) {
      // Remove bookmark
      post.bookmarks.splice(bookmarkIndex, 1);
      post.bookmarkCount = Math.max(0, (post.bookmarkCount || 0) - 1);
      message = 'Bookmark removed';
      action = 'removed';
    } else {
      // Add bookmark
      post.bookmarks.push(userId);
      post.bookmarkCount = (post.bookmarkCount || 0) + 1;
      message = 'Post bookmarked';
      action = 'added';
    }
    
    post.lastActivityAt = new Date();
    
    await post.save();
    
    console.log(`✅ Bookmark ${action} by user: ${userIdStr}`);
    console.log(`New bookmark count: ${post.bookmarkCount}`);
    
    // Convert bookmarks to string array
    const bookmarksArray = (post.bookmarks || []).map((id: any) => 
      id.toString()
    );
    
    return NextResponse.json({
      success: true,
      message,
      data: {
        bookmarks: bookmarksArray,
        bookmarkCount: post.bookmarkCount || 0,
        action: action
      }
    });
    
  } catch (error: any) {
    console.error('❌ BOOKMARK API ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to toggle bookmark' },
      { status: 500 }
    );
  }
}