// app/api/community/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    console.log('GET /api/community params:', Object.fromEntries(searchParams.entries()));
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const author = searchParams.get('author') || '';
    const status = searchParams.get('status') || 'active';
    
    // Build query
    const query: any = { status: 'active' }; // Always show active posts
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }
    
    if (author) {
      query.author = author;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort
    let sortOptions: any = {};
    switch (sort) {
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'oldest':
        sortOptions.createdAt = 1;
        break;
      case 'popular':
        sortOptions.likeCount = -1;
        break;
      case 'most_commented':
        sortOptions.commentCount = -1;
        break;
      case 'most_viewed':
        sortOptions.views = -1;
        break;
      case 'trending':
        sortOptions.lastActivityAt = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }
    
    // Always show pinned posts first
    if (sort === 'newest' || sort === 'trending') {
      sortOptions.isPinned = -1;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get total count
    const total = await Community.countDocuments(query);
    console.log('Total posts found:', total);
    
    // Get posts with populated author
    const posts = await Community.find(query)
      .populate('author', 'name avatar role')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();
    
    console.log('Posts retrieved:', posts.length);
    
    return NextResponse.json({
      success: true,
      data: posts,
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
    console.error('GET /api/community error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    
    // Get user details
    const user = await User.findById(userId).select('name avatar role');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }
    
    if (!body.content?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }
    
    // Create post
    const postData = {
      title: body.title.trim(),
      content: body.content.trim(),
      excerpt: body.excerpt?.trim() || body.content.substring(0, 200).trim() + '...',
      author: userId,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: user.role || 'user',
      category: body.category || 'general',
      tags: Array.isArray(body.tags) 
        ? body.tags.map((t: string) => t.toLowerCase().trim()).filter(Boolean)
        : [],
    };
    
    const post = new Community(postData);
    await post.save();
    
    // Populate author info
    await post.populate('author', 'name avatar role');
    
    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      data: post
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('POST /api/community error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}