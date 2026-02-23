// app/api/blog/category/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogCategory from '@/models/BlogCategory';
import BlogPost from '@/models/BlogPost';
import { verifyToken } from '@/lib/jwt';

// GET /api/blog/category - Public - Everyone can view categories
export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/blog/category - Fetching blog categories');
    
    await connectToDatabase();

    let categories = await BlogCategory.find({ isActive: true }).sort({ name: 1 });

    // If no categories exist, create defaults (public view)
    if (categories.length === 0) {
      console.log('⚠️ No blog categories found, creating defaults...');
      categories = await BlogCategory.insertMany([
        { name: 'Product Updates', slug: 'product-updates' },
        { name: 'Tutorials', slug: 'tutorials' },
        { name: 'Case Studies', slug: 'case-studies' },
        { name: 'Company News', slug: 'company-news' },
        { name: 'Industry Insights', slug: 'industry-insights' },
        { name: 'Best Practices', slug: 'best-practices' }
      ]);
    }

    // Get post counts for each category (only published posts)
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await BlogPost.countDocuments({
          categoryId: category._id,
          published: true
        });
        
        return {
          id: category._id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          count
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesWithCounts,
        total: categoriesWithCounts.length
      }
    });

  } catch (error: any) {
    console.error('❌ Blog categories API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// POST /api/blog/category - Admin Only - Create new category
export async function POST(request: NextRequest) {
  try {
    console.log('🆕 POST /api/blog/category - Creating blog category');
    
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
          message: 'Admin privileges required. Only administrators can create blog categories.' 
        },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const data = await request.json();

    if (!data.name || !data.slug) {
      return NextResponse.json(
        { success: false, message: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await BlogCategory.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    const category = new BlogCategory(data);
    await category.save();

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Create blog category error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}