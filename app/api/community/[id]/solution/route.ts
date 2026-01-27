import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community, { ICommunity } from '@/models/Community';
import { verifyToken } from '@/lib/jwt';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id: postId } = params;
    
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
    const userId = decoded.userId;
    
    const body = await request.json();
    const { commentId } = body;
    
    if (!commentId) {
      return NextResponse.json(
        { success: false, message: 'Comment ID is required' },
        { status: 400 }
      );
    }
    
    // Find post with proper typing
    const post = await Community.findById(postId) as ICommunity | null;
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author or has moderator privileges
    const isAuthor = post.author.toString() === userId.toString();
    const isModerator = ['moderator', 'admin'].includes(decoded.role);
    
    if (!isAuthor && !isModerator) {
      return NextResponse.json(
        { success: false, message: 'Only the post author or moderators can mark solutions' },
        { status: 403 }
      );
    }
    
    // Check if comment exists
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Mark as solution - use type assertion
    const postDoc = post as any;
    
    if (post.isSolved) {
      // Unmark if already solved
      postDoc.isSolved = false;
      postDoc.solutionCommentId = undefined;
      comment.isSolution = false;
    } else {
      // Use the method
      postDoc.markAsSolution(commentId);
    }
    
    await postDoc.save();
    
    return NextResponse.json({
      success: true,
      message: postDoc.isSolved ? 'Comment marked as solution' : 'Solution unmarked',
      data: {
        isSolved: postDoc.isSolved,
        solutionCommentId: postDoc.solutionCommentId
      }
    });
    
  } catch (error: any) {
    console.error('POST /api/community/[id]/solution error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to mark solution' },
      { status: 500 }
    );
  }
}