import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import { verifyToken } from '@/lib/jwt';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    await connectToDatabase();
    
    const { id: postId, commentId } = params;
    
    // Check authentication
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken);
    const userId = decoded.userId;
    
    const body = await request.json();
    const { content } = body;
    
    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }
    
    // Find post
    const post = await Community.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Find comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check permissions
    const isCommentAuthor = comment.user.toString() === userId.toString();
    const isModerator = ['moderator', 'admin'].includes(decoded.role);
    
    if (!isCommentAuthor && !isModerator) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to edit this comment' },
        { status: 403 }
      );
    }
    
    // Update comment
    comment.content = content.trim();
    comment.editedAt = new Date();
    post.lastActivityAt = new Date();
    
    await post.save();
    
    return NextResponse.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });
    
  } catch (error: any) {
    console.error('PUT /api/community/[id]/comments/[commentId] error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    await connectToDatabase();
    
    const { id: postId, commentId } = params;
    
    // Check authentication
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken);
    const userId = decoded.userId;
    
    // Find post
    const post = await Community.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Find comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check permissions
    const isCommentAuthor = comment.user.toString() === userId.toString();
    const isModerator = ['moderator', 'admin'].includes(decoded.role);
    const isPostAuthor = post.author.toString() === userId.toString();
    
    if (!isCommentAuthor && !isModerator && !isPostAuthor) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete this comment' },
        { status: 403 }
      );
    }
    
    // Remove comment
    post.comments.pull(commentId);
    
    // If this was a solution, unmark it
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
    console.error('DELETE /api/community/[id]/comments/[commentId] error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete comment' },
      { status: 500 }
    );
  }
}