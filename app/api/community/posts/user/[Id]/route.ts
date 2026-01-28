import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import User from '@/models/User';
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
    
    // Check if it's a valid ObjectId
    let queryUserId: Types.ObjectId;
    
    if (Types.ObjectId.isValid(userId)) {
      queryUserId = new Types.ObjectId(userId);
    } else {
      // If it's a username, find the user first
      const user = await User.findOne({ username: userId.toLowerCase() });
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
      queryUserId = user._id;
    }
    
    // Get total count
    const total = await Community.countDocuments({ 
      author: queryUserId,
      status: 'active'
    });
    
    // Get user posts
    const posts = await Community.find({ 
      author: queryUserId,
      status: 'active'
    })
    .select('-content -comments -flags -metadata')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
    // Transform the posts for frontend
    const transformedPosts = posts.map(post => ({
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
      isSolved: post.isSolved,
      attachments: post.attachments,
      bookmarks: post.bookmarks?.map((b: any) => b.toString()) || [],
      bookmarkCount: post.bookmarkCount,
      shares: post.shares
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
    console.error('GET /api/community/posts/user/[userId] error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch user posts' },
      { status: 500 }
    );
  }
}