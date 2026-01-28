// app/api/community/posts/[id]/solution/route.ts
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
    const body = await request.json();
    const { commentId } = body;
    
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(commentId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post or comment ID' },
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
    
    // Check if user is the post author
    if (post.author.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: 'Only the post author can mark comments as solution' },
        { status: 403 }
      );
    }
    
    // Check if post is already solved
    if (post.isSolved) {
      return NextResponse.json(
        { success: false, message: 'Post already has a solution' },
        { status: 400 }
      );
    }
    
    // Find and mark the comment as solution
    const commentIndex = post.comments.findIndex(
      (comment: any) => comment._id.toString() === commentId
    );
    
    if (commentIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Mark as solution
    post.comments[commentIndex].isSolution = true;
    post.isSolved = true;
    post.solutionCommentId = commentId;
    post.lastActivityAt = new Date();
    await post.save();
    
    return NextResponse.json({
      success: true,
      message: 'Comment marked as solution',
      data: post
    });
    
  } catch (error: any) {
    console.error('POST /api/community/posts/[id]/solution error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to mark as solution' },
      { status: 500 }
    );
  }
}