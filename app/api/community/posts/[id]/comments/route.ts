// app/api/community/posts/[id]/comments/route.ts
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
    const { content } = body;
    
    if (!Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Comment content is required' },
        { status: 400 }
      );
    }
    
    // Get user info
    const User = (await import('@/models/User')).default;
    const user = await User.findById(userId).select('name role avatar').lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Find the post and add comment
    const post = await Community.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Add comment
    const newComment = {
      _id: new Types.ObjectId(),
      user: new Types.ObjectId(userId),
      userName: user.name,
      userAvatar: user.avatar,
      userRole: user.role || 'user',
      content: content.trim(),
      likes: [],
      likeCount: 0,
      replies: [],
      isSolution: false,
      createdAt: new Date(),
    };
    
    post.comments.push(newComment as any);
    post.commentCount = post.comments.length;
    post.lastActivityAt = new Date();
    await post.save();
    
    return NextResponse.json({
      success: true,
      message: 'Comment added',
      data: post
    });
    
  } catch (error: any) {
    console.error('POST /api/community/posts/[id]/comments error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add comment' },
      { status: 500 }
    );
  }
}