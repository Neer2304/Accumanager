// app/api/admin/blog/posts/[id]/route.ts - GET, PUT, DELETE single post
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { verifyToken } from '@/lib/jwt'

// GET /api/admin/blog/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(authToken)
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await connectToDatabase()

    const post = await BlogPost.findById(params.id)
      .populate('categoryId', 'name slug')

    if (!post) {
      return NextResponse.json({
        success: false,
        message: 'Post not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: formatBlogPost(post.toObject())
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}

// PUT /api/admin/blog/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(authToken)
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await connectToDatabase()
    const data = await request.json()

    // If slug is being updated, check if it already exists
    if (data.slug) {
      const existing = await BlogPost.findOne({
        slug: data.slug,
        _id: { $ne: params.id }
      })
      if (existing) {
        return NextResponse.json({
          success: false,
          message: 'Post with this slug already exists'
        }, { status: 400 })
      }
    }

    const post = await BlogPost.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name slug')

    if (!post) {
      return NextResponse.json({
        success: false,
        message: 'Post not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: formatBlogPost(post.toObject())
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}

// DELETE /api/admin/blog/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(authToken)
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await connectToDatabase()

    const post = await BlogPost.findByIdAndDelete(params.id)

    if (!post) {
      return NextResponse.json({
        success: false,
        message: 'Post not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}

function formatBlogPost(post: any) {
  return {
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    category: {
      id: post.categoryId?._id || post.categoryId,
      name: post.categoryId?.name || 'Uncategorized',
      slug: post.categoryId?.slug || 'uncategorized'
    },
    tags: post.tags,
    coverImage: post.coverImage,
    readTime: post.readTime,
    featured: post.featured,
    published: post.published,
    publishedAt: post.publishedAt,
    views: post.views,
    likes: post.likes,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  }
}