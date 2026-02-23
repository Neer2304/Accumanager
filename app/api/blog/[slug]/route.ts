// app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { verifyToken } from '@/lib/jwt';

// GET /api/blog/[slug] - Public - Everyone can view
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log(`📋 GET /api/blog/${params.slug} - Fetching blog post`);
    
    await connectToDatabase();

    const post = await BlogPost.findOne({ 
      slug: params.slug,
      published: true  // Only show published posts to public
    }).populate('categoryId', 'name slug');

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment view count (public action)
    post.views += 1;
    await post.save();

    // Get related posts (same category, excluding current)
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      categoryId: post.categoryId,
      published: true
    })
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

    return NextResponse.json({
      success: true,
      data: {
        id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: {
          id: (post.categoryId as any)._id,
          name: (post.categoryId as any).name,
          slug: (post.categoryId as any).slug
        },
        tags: post.tags,
        coverImage: post.coverImage,
        readTime: post.readTime,
        publishedAt: post.publishedAt,
        views: post.views,
        likes: post.likes,
        relatedPosts: relatedPosts.map(p => ({
          id: p._id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          readTime: p.readTime
        }))
      }
    });

  } catch (error: any) {
    console.error('❌ Get blog post error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[slug] - Admin Only - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log(`📝 PUT /api/blog/${params.slug} - Updating blog post`);
    
    // Verify authentication - REQUIRED
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user info
    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Strict admin check - ONLY ADMIN CAN UPDATE
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Admin privileges required. Only administrators can update blog posts.' 
        },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const data = await request.json();

    const post = await BlogPost.findOne({ slug: params.slug });

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Update fields
    Object.assign(post, data);
    await post.save();

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: formatBlogPost(post.toObject())
    });

  } catch (error: any) {
    console.error('❌ Update blog post error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[slug] - Admin Only - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log(`🗑️ DELETE /api/blog/${params.slug} - Deleting blog post`);
    
    // Verify authentication - REQUIRED
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user info
    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Strict admin check - ONLY ADMIN CAN DELETE
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Admin privileges required. Only administrators can delete blog posts.' 
        },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const post = await BlogPost.findOneAndDelete({ slug: params.slug });

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Delete blog post error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

function formatBlogPost(post: any) {
  return {
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    author: post.author,
    tags: post.tags,
    coverImage: post.coverImage,
    readTime: post.readTime,
    featured: post.featured,
    published: post.published,
    publishedAt: post.publishedAt,
    views: post.views,
    likes: post.likes,
    createdAt: post.createdAt
  };
}