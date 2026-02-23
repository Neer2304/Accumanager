// app/api/admin/docs/articles/[id]/route.ts - GET, PUT, DELETE
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DocArticle from '@/models/DocArticle';
import { verifyToken } from '@/lib/jwt';

// GET /api/admin/docs/articles/[id] - Get single article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const article = await DocArticle.findById(params.id)
      .populate('categoryId', 'name slug');

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: formatDocArticle(article.toObject())
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

// PUT /api/admin/docs/articles/[id] - Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // If slug is being updated, check if it already exists
    if (data.slug) {
      const existing = await DocArticle.findOne({
        slug: data.slug,
        _id: { $ne: params.id }
      });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Article with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const article = await DocArticle.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name slug');

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      data: formatDocArticle(article.toObject())
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

// DELETE /api/admin/docs/articles/[id] - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const article = await DocArticle.findByIdAndDelete(params.id);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
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