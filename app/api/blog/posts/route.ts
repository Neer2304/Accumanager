// app/api/blog/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import BlogCategory from '@/models/BlogCategory';
import { verifyToken } from '@/lib/jwt';

// GET /api/blog/posts - Public
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page      = parseInt(searchParams.get('page')  || '1');
    const limit     = parseInt(searchParams.get('limit') || '9');
    const category  = searchParams.get('category');
    const search    = searchParams.get('search');
    const featured  = searchParams.get('featured') === 'true';

    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { success: false, message: 'Invalid pagination parameters. Page must be >=1, limit between 1-50' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { published: true };

    if (category && category !== 'all') {
      const categoryDoc = await BlogCategory.findOne({
        $or: [{ slug: category }, { _id: category }],
      });
      if (categoryDoc) filter.categoryId = categoryDoc._id;
    }

    if (search) {
      filter.$or = [
        { title:   { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (featured) filter.featured = true;

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .populate('categoryId', 'name slug')
      .sort({ featured: -1, publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        posts: posts.map(formatBlogPost),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error: any) {
    console.error('❌ Blog posts API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Admin Only
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = verifyToken(authToken);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const data = await request.json();

    if (!data.title || !data.slug || !data.excerpt || !data.content || !data.categoryId) {
      return NextResponse.json(
        { success: false, message: 'Title, slug, excerpt, content, and categoryId are required' },
        { status: 400 }
      );
    }

    const existing = await BlogPost.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Post with this slug already exists' },
        { status: 400 }
      );
    }

    const category = await BlogCategory.findById(data.categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const post = new BlogPost({
      ...data,
      author: {
        name:   decoded.name   || 'Admin',
        role:   decoded.role   || 'Admin',
        avatar: data.author?.avatar,
      },
    });
    await post.save();

    return NextResponse.json(
      { success: true, message: 'Blog post created successfully', data: formatBlogPost(post.toObject()) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Create blog post error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

function formatBlogPost(post: any) {
  return {
    id:          post._id?.toString(),
    title:       post.title,
    slug:        post.slug,
    excerpt:     post.excerpt,
    author:      post.author,
    category: {
      id:   (post.categoryId as any)?._id?.toString() || post.categoryId?.toString(),
      name: (post.categoryId as any)?.name  || 'Uncategorized',
      slug: (post.categoryId as any)?.slug  || 'uncategorized',
    },
    tags:        post.tags,
    coverImage:  post.coverImage,
    readTime:    post.readTime,
    featured:    post.featured,
    published:   post.published,
    publishedAt: post.publishedAt,
    views:       post.views,
    likes:       post.likes,
    createdAt:   post.createdAt,
  };
}