// app/api/admin/blog/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { verifyToken } from '@/lib/jwt'

// GET /api/admin/blog/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(authToken)
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    // Await the params in Next.js 15
    const { id } = await context.params
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Post ID is required' 
      }, { status: 400 })
    }

    await connectToDatabase()

    const post = await BlogPost.findById(id)
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
    console.error('❌ GET admin post error:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error'
    }, { status: 500 })
  }
}

// PUT /api/admin/blog/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(authToken)
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    // Await the params in Next.js 15
    const { id } = await context.params
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Post ID is required' 
      }, { status: 400 })
    }

    await connectToDatabase()
    const data = await request.json()

    // If slug is being updated, check if it already exists
    if (data.slug) {
      const existing = await BlogPost.findOne({
        slug: data.slug,
        _id: { $ne: id }
      })
      if (existing) {
        return NextResponse.json({
          success: false,
          message: 'Post with this slug already exists'
        }, { status: 400 })
      }
    }

    const post = await BlogPost.findByIdAndUpdate(
      id,
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
    console.error('❌ PUT admin post error:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE /api/admin/blog/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(authToken)
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    // Await the params in Next.js 15
    const { id } = await context.params
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Post ID is required' 
      }, { status: 400 })
    }

    await connectToDatabase()

    const post = await BlogPost.findByIdAndDelete(id)

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
    console.error('❌ DELETE admin post error:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error'
    }, { status: 500 })
  }
}

function formatBlogPost(post: any) {
  return {
    id: post._id?.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author || { name: 'Anonymous', role: 'Author' },
    category: {
      id: post.categoryId?._id?.toString() || post.categoryId?.toString() || 'uncategorized',
      name: post.categoryId?.name || 'Uncategorized',
      slug: post.categoryId?.slug || 'uncategorized'
    },
    tags: post.tags || [],
    coverImage: post.coverImage || '',
    readTime: post.readTime || 5,
    featured: post.featured || false,
    published: post.published || false,
    publishedAt: post.publishedAt || post.createdAt,
    views: post.views || 0,
    likes: post.likes || 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  }
}