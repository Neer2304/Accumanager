// app/api/community/[id]/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';
import { error } from 'console';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('👁️ VIEWS API CALLED');
    
    // Await params (Next.js 15)
    const { id: postId } = await params;
    console.log('Post ID for views:', postId);
    
    if (!postId) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Try multiple ways to find post
    let post;
    
    // Method 1: Direct find
    try {
      post = await Community.findById(postId)
        .populate('author', 'name avatar role')
        .lean();
    } catch (e) {
      console.log('Method 1 failed:', error.name);
    }
    
    // Method 2: With ObjectId
    if (!post && mongoose.Types.ObjectId.isValid(postId)) {
      try {
        const objectId = new mongoose.Types.ObjectId(postId);
        post = await Community.findById(objectId)
          .populate('author', 'name avatar role')
          .lean();
      } catch (e) {
        console.log('Method 2 failed:', error.name);
      }
    }
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Post found for views:', post.title);
    
    // Increment view count
    try {
      // Get user ID if authenticated
      let userId = null;
      const cookies = request.headers.get('cookie');
      const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
      
      if (authToken) {
        try {
          const decoded = verifyToken(authToken) as any;
          if (decoded?.userId) {
            userId = new mongoose.Types.ObjectId(decoded.userId);
          }
        } catch (error) {
          console.log('Token error, viewing anonymously');
        }
      }
      
      // Update view count
      const updateData: any = {
        $inc: { views: 1 },
        lastActivityAt: new Date(),
      };
      
      // Add to view history if user is authenticated
      if (userId) {
        // Check if user already viewed
        const alreadyViewed = await Community.findOne({
          _id: post._id,
          'viewHistory.user': userId
        });
        
        if (!alreadyViewed) {
          updateData.$addToSet = {
            viewHistory: {
              user: userId,
              viewedAt: new Date(),
            },
          };
        }
      }
      
      await Community.findByIdAndUpdate(post._id, updateData);
      
      // Update the views in the returned post
      post.views = (post.views || 0) + 1;
      
      console.log(`✅ View counted. Total views: ${post.views}`);
      
    } catch (updateError) {
      console.error('Failed to update view count:', updateError);
      // Continue even if view count fails
    }
    
    return NextResponse.json({
      success: true,
      data: post,
    });
    
  } catch (error: any) {
    console.error('❌ VIEWS API ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch post' },
      { status: 500 }
    );
  }
}