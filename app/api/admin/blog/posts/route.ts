// app/api/admin/blog/posts/route.ts - GET (list all posts) & POST (create)
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { verifyToken } from '@/lib/jwt'

// GET /api/admin/blog/posts - List all posts (including drafts)
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // 'published', 'draft', or 'all'
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    
    if (status && status !== 'all') {
      filter.published = status === 'published'
    }
    
    if (category) {
      filter.categoryId = category
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .populate('categoryId', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter)
    ])

    return NextResponse.json({
      success: true,
      data: {
        posts: posts.map(formatBlogPost),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}

// POST /api/admin/blog/posts - Create new blog post
export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!data.title || !data.slug || !data.excerpt || !data.content || !data.categoryId) {
      return NextResponse.json({
        success: false,
        message: 'Title, slug, excerpt, content, and categoryId are required'
      }, { status: 400 })
    }

    // Check if slug already exists
    const existing = await BlogPost.findOne({ slug: data.slug })
    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'Post with this slug already exists'
      }, { status: 400 })
    }

    // Set author from authenticated user
    const postData = {
      ...data,
      author: {
        name: decoded.name || 'Admin',
        role: decoded.role || 'Admin',
        avatar: data.author?.avatar
      }
    }

    const post = new BlogPost(postData)
    await post.save()

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: formatBlogPost(post.toObject())
    }, { status: 201 })

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