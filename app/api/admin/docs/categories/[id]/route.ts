// app/api/admin/docs/categories/[id]/route.ts - GET, PUT, DELETE
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DocCategory from '@/models/DocCategory';
import DocArticle from '@/models/DocArticle';
import { verifyToken } from '@/lib/jwt';

// GET /api/admin/docs/categories/[id] - Get single category
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

    const category = await DocCategory.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category
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

// PUT /api/admin/docs/categories/[id] - Update category
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
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/docs/categories/[id] - Delete category
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
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}