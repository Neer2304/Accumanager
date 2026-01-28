import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import { verifyToken } from '@/lib/jwt';
import { Types } from 'mongoose';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    const userId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Get posts liked by this user
    const likedPosts = await Community.find({
      'likes': new Types.ObjectId(userId),
      'status': 'active'
    })
    .select('-content -comments -flags -metadata')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
    const total = await Community.countDocuments({
      'likes': new Types.ObjectId(userId),
      'status': 'active'
    });
    
    // Transform the posts
    const transformedPosts = likedPosts.map(post => ({
      _id: post._id.toString(),
      title: post.title,
      excerpt: post.excerpt,
      author: {
        _id: post.author.toString(),
        name: post.authorName,
        avatar: post.authorAvatar,
        role: post.authorRole
      },
      category: post.category,
      tags: post.tags,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      views: post.views,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isPinned: post.isPinned,
      isSolved: post.isSolved
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error: any) {
    console.error('GET /api/community/profile/[userId]/likes error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch liked posts' },
      { status: 500 }
    );
  }
}