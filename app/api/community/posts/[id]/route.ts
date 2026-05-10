// app/api/community/posts/[id]/route.ts (GET endpoint)
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import { Types } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const postId = params.id;
    
    if (!Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    const post = await Community.findById(postId).lean();
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Transform comments to ensure proper user structure
    const transformedComments = post.comments?.map((comment: any) => {
      // If comment already has user object structure, use it
      if (comment.user && typeof comment.user === 'object' && comment.user.name) {
        return comment;
      }
      
      // If comment has userName field, transform it to user object
      if (comment.userName) {
        return {
          ...comment,
          user: {
            _id: comment.userId || comment.user,
            name: comment.userName,
            avatar: comment.userAvatar,
            username: comment.userName.toLowerCase().replace(/\s/g, ''),
            role: comment.userRole || 'user',
          },
          userName: undefined,
          userAvatar: undefined,
          userRole: undefined,
          userId: undefined,
        };
      }
      
      return comment;
    });
    
    return NextResponse.json({
      success: true,
      data: {
        ...post,
        comments: transformedComments || [],
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch post' },
      { status: 500 }
    );
  }
}