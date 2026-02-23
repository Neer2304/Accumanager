// app/api/docs/category/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DocCategory from '@/models/DocCategory';
import DocArticle from '@/models/DocArticle';
import { verifyToken } from '@/lib/jwt';

// GET /api/docs/category/[id] - Public - Everyone can view
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📋 GET /api/docs/category/${params.id} - Fetching category`);
    
    await connectToDatabase();

    const category = await DocCategory.findOne({ 
      _id: params.id,
      isActive: true 
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const articles = await DocArticle.find({ 
      categoryId: category._id,
      isActive: true 
    }).sort({ order: 1 });

    return NextResponse.json({
      success: true,
      data: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        articles: articles.map(article => ({
          id: article._id,
          title: article.title,
          description: article.description,
          slug: article.slug,
          order: article.order,
          views: article.views,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt
        }))
      }
    });

  } catch (error: any) {
    console.error('❌ Get category error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/docs/category/[id] - Admin Only - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📝 PUT /api/docs/category/${params.id} - Updating category`);
    
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
          message: 'Admin privileges required. Only administrators can update documentation.' 
        },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const data = await request.json();

    // Check if slug is being changed and if it already exists
    if (data.slug) {
      const existing = await DocCategory.findOne({
        slug: data.slug,
        _id: { $ne: params.id }
      });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const category = await DocCategory.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });

  } catch (error: any) {
    console.error('❌ Update category error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/docs/category/[id] - Admin Only - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🗑️ DELETE /api/docs/category/${params.id} - Deleting category`);
    
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
          message: 'Admin privileges required. Only administrators can delete documentation.' 
        },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Check if category has articles
    const articlesCount = await DocArticle.countDocuments({ categoryId: params.id });
    
    if (articlesCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cannot delete category with existing articles. Move or delete articles first.' 
        },
        { status: 400 }
      );
    }

    const category = await DocCategory.findByIdAndDelete(params.id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Delete category error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}