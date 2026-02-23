// app/api/blog/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import BlogCategory from '@/models/BlogCategory';
import { verifyToken } from '@/lib/jwt';

// GET /api/blog/posts - Public - Everyone can view
export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/blog/posts - Fetching blog posts');
    
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid pagination parameters. Page must be >=1, limit between 1-50' 
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build filter - ONLY SHOW PUBLISHED POSTS TO PUBLIC
    const filter: any = { published: true };
    
    if (category && category !== 'all') {
      const categoryDoc = await BlogCategory.findOne({ 
        $or: [
          { slug: category },
          { _id: category }
        ]
      });
      if (categoryDoc) {
        filter.categoryId = categoryDoc._id;
      }
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (featured) {
      filter.featured = true;
    }

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .populate('categoryId', 'name slug')
      .sort({ featured: -1, publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // If no posts exist, create sample published posts (public view only)
    if (total === 0 && page === 1) {
      console.log('⚠️ No blog posts found, creating samples...');
      const samplePosts = await createSampleBlogPosts();
      return NextResponse.json({
        success: true,
        data: {
          posts: samplePosts,
          pagination: {
            page: 1,
            limit,
            total: samplePosts.length,
            totalPages: Math.ceil(samplePosts.length / limit),
            hasNextPage: samplePosts.length > limit,
            hasPrevPage: false
          }
        }
      });
    }

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
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Blog posts API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Admin Only - Create new blog post
export async function POST(request: NextRequest) {
  try {
    console.log('🆕 POST /api/blog/posts - Creating blog post');
    
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

    // Strict admin check - ONLY ADMIN CAN CREATE
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Admin privileges required. Only administrators can create blog posts.' 
        },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.slug || !data.excerpt || !data.content || !data.categoryId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Title, slug, excerpt, content, and categoryId are required' 
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await BlogPost.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Post with this slug already exists' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await BlogCategory.findById(data.categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Set author from authenticated user
    const postData = {
      ...data,
      author: {
        name: decoded.name || 'Admin',
        role: decoded.role || 'Admin',
        avatar: data.author?.avatar
      }
    };

    const post = new BlogPost(postData);
    await post.save();

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: formatBlogPost(post.toObject())
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Create blog post error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Helper function to format blog post
function formatBlogPost(post: any) {
  return {
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    author: post.author,
    category: {
      id: (post.categoryId as any)?._id || post.categoryId,
      name: (post.categoryId as any)?.name || 'Uncategorized',
      slug: (post.categoryId as any)?.slug || 'uncategorized'
    },
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

// Helper function to create sample blog posts (public view only)
async function createSampleBlogPosts() {
  let categories = await BlogCategory.find();
  
  if (categories.length === 0) {
    categories = await BlogCategory.insertMany([
      { name: 'Product Updates', slug: 'product-updates' },
      { name: 'Tutorials', slug: 'tutorials' },
      { name: 'Company News', slug: 'company-news' }
    ]);
  }

  const samplePosts = [
    {
      title: 'Introducing AI-Powered Inventory Forecasting',
      slug: 'introducing-ai-inventory-forecasting',
      excerpt: 'Leverage machine learning to predict stock levels and optimize your inventory management.',
      content: getSampleBlogContent('AI Inventory Forecasting'),
      author: { name: 'Sarah Johnson', role: 'Product Manager' },
      categoryId: categories[0]._id,
      tags: ['AI', 'Inventory', 'Features'],
      featured: true,
      published: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'How to Streamline Your Invoicing Process',
      slug: 'how-to-streamline-invoicing',
      excerpt: 'Learn best practices for creating and managing invoices efficiently.',
      content: getSampleBlogContent('Invoicing Tips'),
      author: { name: 'Michael Chen', role: 'Customer Success' },
      categoryId: categories[1]._id,
      tags: ['Invoicing', 'Tips'],
      featured: false,
      published: true,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Case Study: How ABC Corp Reduced Costs by 30%',
      slug: 'case-study-abc-corp-cost-reduction',
      excerpt: 'Discover how a manufacturing company optimized their operations with AccuManage.',
      content: getSampleBlogContent('Case Study'),
      author: { name: 'Emily Rodriguez', role: 'Solutions Architect' },
      categoryId: categories[2]._id,
      tags: ['Case Study', 'ROI'],
      featured: true,
      published: true,
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
    }
  ];

  const createdPosts = await BlogPost.insertMany(samplePosts);
  return createdPosts.map(formatBlogPost);
}

function getSampleBlogContent(topic: string): string {
  return `# ${topic}

## Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Key Points

1. Point one with detailed explanation
2. Point two with detailed explanation
3. Point three with detailed explanation

## Main Content

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## Conclusion

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
}