// app/api/community/[id]/comments/[commentId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id: postId, commentId } = await params;
    
    await connectToDatabase();
    
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken) as any;
    const userId = decoded.userId;
    
    const body = await request.json();
    const { content } = body;
    
    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }
    
    const post = await Community.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    if (comment.user.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to edit this comment' },
        { status: 403 }
      );
    }
    
    comment.content = content.trim();
    comment.editedAt = new Date();
    post.lastActivityAt = new Date();
    
    await post.save();
    
    // Safe access with null check
    const commentIdStr = comment._id ? comment._id.toString() : '';
    
    return NextResponse.json({
      success: true,
      message: 'Comment updated successfully',
      data: {
        _id: commentIdStr,
        content: comment.content,
        editedAt: comment.editedAt,
        user: comment.user.toString(),
        userName: comment.userName,
        userAvatar: comment.userAvatar,
        createdAt: comment.createdAt,
      }
    });
    
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id: postId, commentId } = await params;
    
    await connectToDatabase();
    
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken) as any;
    const userId = decoded.userId;
    
    const post = await Community.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    const isCommentAuthor = comment.user.toString() === userId;
    const isPostAuthor = post.author.toString() === userId;
    
    if (!isCommentAuthor && !isPostAuthor) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete this comment' },
        { status: 403 }
      );
    }
    
    post.comments.pull(commentId);
    
    if (post.solutionCommentId?.toString() === commentId) {
      post.isSolved = false;
      post.solutionCommentId = undefined;
    }
    
    post.commentCount = post.comments.length;
    post.lastActivityAt = new Date();
    
    await post.save();
    
    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });
    
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete comment' },
      { status: 500 }
    );
  }
}