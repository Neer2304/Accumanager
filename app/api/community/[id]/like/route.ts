// app/api/community/[id]/like/route.ts - WORKING VERSION
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';
import { error } from 'console';

// IMPORTANT: Make sure this is a dynamic route
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔵 LIKE API CALLED');
    
    // Await the params since Next.js 15 uses async params
    const { id: postId } = await params;
    console.log('Post ID from params:', postId);
    
    if (!postId || postId === '[id]') {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    console.log('✅ Database connected');
    
    // DEBUG: List all posts
    const allPosts = await Community.find({}, '_id title').lean();
    console.log('Posts in DB:', allPosts.map(p => ({
      id: p._id.toString(),
      title: p.title
    })));
    
    // Try to find the post
    let post;
    
    // Method 1: Try with findById
    try {
      post = await Community.findById(postId).lean();
      console.log('Method 1 (findById) result:', post ? 'Found' : 'Not found');
    } catch (e) {
      console.log('Method 1 error:', error.name);
    }
    
    // Method 2: If not found, try with ObjectId
    if (!post && mongoose.Types.ObjectId.isValid(postId)) {
      try {
        const objectId = new mongoose.Types.ObjectId(postId);
        post = await Community.findById(objectId).lean();
        console.log('Method 2 (ObjectId) result:', post ? 'Found' : 'Not found');
      } catch (e) {
        console.log('Method 2 error:', error.name);
      }
    }
    
    // Method 3: Try findOne with string
    if (!post) {
      post = await Community.findOne({ _id: postId }).lean();
      console.log('Method 3 (findOne) result:', post ? 'Found' : 'Not found');
    }
    
    if (!post) {
      console.log('❌ Post not found with ID:', postId);
      console.log('Available IDs:', allPosts.map(p => p._id.toString()));
      return NextResponse.json(
        { 
          success: false, 
          message: 'Post not found',
          debug: {
            searchedId: postId,
            availableIds: allPosts.map(p => p._id.toString())
          }
        },
        { status: 404 }
      );
    }
    
    console.log('✅ Post found:', post.title);
    console.log('Post ID in DB:', post._id.toString());
    
    // Get the full document for updates
    const postDoc = await Community.findById(post._id);
    if (!postDoc) {
      return NextResponse.json(
        { success: false, message: 'Post document not found' },
        { status: 404 }
      );
    }
    
    // Authentication
    const cookies = request.headers.get('cookie');
    if (!cookies) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const authToken = cookies.match(/auth_token=([^;]+)/)?.[1];
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
    console.log('User ID from token:', userId);
    
    // Ensure likes array exists
    if (!postDoc.likes) {
      postDoc.likes = [];
    }
    
    // Check if user already liked the post
    const userIdStr = userId.toString();
    const userLikedIndex = postDoc.likes.findIndex((likeId: any) => {
      if (!likeId) return false;
      const likeIdStr = likeId.toString();
      return likeIdStr === userIdStr;
    });
    
    console.log('User liked index:', userLikedIndex);
    console.log('Current likes array:', postDoc.likes.map(l => l.toString()));
    
    let action = '';
    if (userLikedIndex > -1) {
      // Remove like
      postDoc.likes.splice(userLikedIndex, 1);
      action = 'unliked';
      console.log('Removed like for user:', userId);
    } else {
      // Add like
      const userIdObj = new mongoose.Types.ObjectId(userId);
      postDoc.likes.push(userIdObj);
      action = 'liked';
      console.log('Added like for user:', userId);
    }
    
    // Update counts
    postDoc.likeCount = postDoc.likes.length;
    postDoc.lastActivityAt = new Date();
    
    await postDoc.save();
    
    console.log('✅ Like toggled. New count:', postDoc.likeCount);
    console.log('Updated likes:', postDoc.likes.map(l => l.toString()));
    
    // Get updated post for response
    const updatedPost = await Community.findById(post._id)
      .select('likes likeCount')
      .lean();
    
    // Convert likes to string array for frontend
    const likesArray = (updatedPost?.likes || []).map((id: any) => 
      id?.toString() || id
    ).filter(Boolean);
    
    return NextResponse.json({
      success: true,
      message: action === 'liked' ? 'Post liked successfully' : 'Like removed successfully',
      data: {
        likes: likesArray,
        likeCount: updatedPost?.likeCount || 0,
        action: action
      }
    });
    
  } catch (error: any) {
    console.error('❌ LIKE API ERROR:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to toggle like',
      },
      { status: 500 }
    );
  }
}