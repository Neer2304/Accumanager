// app/api/admin/docs/articles/route.ts - GET (list) & POST (create)
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DocArticle from '@/models/DocArticle';
import { verifyToken } from '@/lib/jwt';

// GET /api/admin/docs/articles - List all articles
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(authToken);
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {}
    
    if (category) {
      filter.categoryId = category
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    const [articles, total] = await Promise.all([
      DocArticle.find(filter)
        .populate('categoryId', 'name slug')
        .sort({ order: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DocArticle.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        articles: articles.map(formatDocArticle),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/docs/articles - Create new article
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(authToken);
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.slug || !data.description || !data.content || !data.categoryId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Title, slug, description, content, and categoryId are required' 
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await DocArticle.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Article with this slug already exists' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await DocCategory.findById(data.categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const article = new DocArticle(data);
    await article.save();

    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      data: formatDocArticle(article.toObject())
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

function formatDocArticle(article: any) {
  return {
    id: article._id,
    title: article.title,
    slug: article.slug,
    description: article.description,
    content: article.content,
    category: {
      id: article.categoryId?._id || article.categoryId,
      name: article.categoryId?.name || 'Uncategorized',
      slug: article.categoryId?.slug || 'uncategorized'
    },
    order: article.order,
    isActive: article.isActive,
    views: article.views,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt
  }
}