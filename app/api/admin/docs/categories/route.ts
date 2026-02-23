// app/api/admin/docs/categories/route.ts - GET (list) & POST (create)
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DocCategory from '@/models/DocCategory';
import { verifyToken } from '@/lib/jwt';

// GET /api/admin/docs/categories - List all categories
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

    const categories = await DocCategory.find().sort({ order: 1 });

    return NextResponse.json({
      success: true,
      data: categories
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

// POST /api/admin/docs/categories - Create new category (you already have this)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
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

    // Check if user is admin
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.slug || !body.description) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Name, slug, and description are required' 
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await DocCategory.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Category with this slug already exists' 
        },
        { status: 400 }
      );
    }

    const category = new DocCategory(body);
    await category.save();

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        order: category.order
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Create category error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

