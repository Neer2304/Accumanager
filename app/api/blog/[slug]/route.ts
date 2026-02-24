// app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { verifyToken } from '@/lib/jwt';

// ─── Shared auth helper ───────────────────────────────────────────────────────

function requireAdmin(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  if (!authToken) return { error: 'Authentication required', status: 401 };

  try {
    const decoded: any = verifyToken(authToken);
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return { error: 'Admin privileges required.', status: 403 };
    }
    return { decoded };
  } catch {
    return { error: 'Invalid or expired token', status: 401 };
  }
}

// ─── Find post by slug OR ObjectId ───────────────────────────────────────────

async function findPost(slug: string, publishedOnly = false) {
  const filter: Record<string, any> = { slug };
  if (publishedOnly) filter.published = true;

  let post = await BlogPost.findOne(filter).populate('categoryId', 'name slug');

  // Fallback: treat slug as ObjectId
  if (!post && /^[0-9a-fA-F]{24}$/.test(slug)) {
    const idFilter: Record<string, any> = { _id: slug };
    if (publishedOnly) idFilter.published = true;
    post = await BlogPost.findOne(idFilter).populate('categoryId', 'name slug');
  }

  return post;
}

// ─── GET /api/blog/[slug] - Public ───────────────────────────────────────────

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // Next.js 15 App Router: params is a Promise
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const post = await findPost(slug, true); // publishedOnly = true for public

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    // Related posts (same category, exclude current)
    const relatedPosts = await BlogPost.find({
      _id:        { $ne: post._id },
      categoryId: post.categoryId,
      published:  true,
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    const formatted = {
      id:          post._id.toString(),
      title:       post.title,
      slug:        post.slug,
      excerpt:     post.excerpt,
      content:     post.content,
      author:      post.author || { name: 'Anonymous', role: 'Author' },
      category:    post.categoryId
        ? {
            id:   (post.categoryId as any)._id?.toString(),
            name: (post.categoryId as any).name,
            slug: (post.categoryId as any).slug,
          }
        : { id: 'uncategorized', name: 'Uncategorized', slug: 'uncategorized' },
      tags:        post.tags        || [],
      coverImage:  post.coverImage  || '',
      readTime:    post.readTime    || 5,
      featured:    post.featured    || false,
      publishedAt: post.publishedAt || post.createdAt,
      views:       (post.views || 0) + 1,
      likes:       post.likes       || 0,
      relatedPosts: relatedPosts.map((p) => ({
        id:         p._id.toString(),
        title:      p.title,
        slug:       p.slug,
        excerpt:    p.excerpt,
        readTime:   p.readTime   || 5,
        coverImage: p.coverImage || '',
      })),
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error('❌ Get blog post error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── PUT /api/blog/[slug] - Admin Only ───────────────────────────────────────

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
    }

    const auth = requireAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    await connectToDatabase();
    const data = await request.json();

    const post = await findPost(slug);
    if (!post) {
      return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
    }

    Object.assign(post, data);
    await post.save();

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data:    formatBlogPost(post.toObject()),
    });
  } catch (error: any) {
    console.error('❌ Update blog post error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/blog/[slug] - Admin Only ────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
    }

    const auth = requireAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    await connectToDatabase();

    let post = await BlogPost.findOneAndDelete({ slug });

    if (!post && /^[0-9a-fA-F]{24}$/.test(slug)) {
      post = await BlogPost.findByIdAndDelete(slug);
    }

    if (!post) {
      return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error: any) {
    console.error('❌ Delete blog post error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── Formatter ────────────────────────────────────────────────────────────────

function formatBlogPost(post: any) {
  return {
    id:          post._id?.toString(),
    title:       post.title,
    slug:        post.slug,
    excerpt:     post.excerpt,
    author:      post.author,
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