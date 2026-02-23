// app/api/docs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DocCategory from '@/models/DocCategory';
import DocArticle from '@/models/DocArticle';
import { verifyToken } from '@/lib/jwt';

// GET /api/docs - Public - Everyone can view docs
export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/docs - Fetching documentation');
    
    await connectToDatabase();

    // Get all active categories
    let categories = await DocCategory.find({ isActive: true }).sort({ order: 1 });

    // If no categories exist, create default ones (public view)
    if (categories.length === 0) {
      console.log('⚠️ No docs categories found, creating defaults...');
      categories = await createDefaultDocs();
    }

    // Get articles for each category
    const categoriesWithArticles = await Promise.all(
      categories.map(async (category) => {
        const articles = await DocArticle.find({ 
          categoryId: category._id,
          isActive: true 
        }).sort({ order: 1 });
        
        return {
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
            createdAt: article.createdAt
          }))
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesWithArticles,
        totalCategories: categories.length,
        totalArticles: await DocArticle.countDocuments({ isActive: true })
      }
    });

  } catch (error: any) {
    console.error('❌ Docs API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// POST /api/docs - Admin Only - Create new category or article
export async function POST(request: NextRequest) {
  try {
    console.log('🆕 POST /api/docs - Creating documentation content');
    
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
          message: 'Admin privileges required. Only administrators can create documentation content.' 
        },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { success: false, message: 'Type and data are required' },
        { status: 400 }
      );
    }

    if (type === 'category') {
      // Create category
      if (!data.name || !data.slug || !data.description) {
        return NextResponse.json(
          { success: false, message: 'Category name, slug, and description are required' },
          { status: 400 }
        );
      }

      // Check if slug already exists
      const existing = await DocCategory.findOne({ slug: data.slug });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Category with this slug already exists' },
          { status: 400 }
        );
      }

      const category = new DocCategory(data);
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

    } else if (type === 'article') {
      // Create article
      if (!data.title || !data.slug || !data.description || !data.content || !data.categoryId) {
        return NextResponse.json(
          { success: false, message: 'Title, slug, description, content, and categoryId are required' },
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
        data: {
          id: article._id,
          title: article.title,
          slug: article.slug,
          description: article.description,
          categoryId: article.categoryId
        }
      }, { status: 201 });

    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid type. Must be "category" or "article"' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Create docs error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Helper function to create default docs (for public view only)
async function createDefaultDocs() {
  const categories = await DocCategory.insertMany([
    {
      name: 'Getting Started',
      slug: 'getting-started',
      description: 'Learn the basics of using AccuManage',
      icon: '🚀',
      order: 1
    },
    {
      name: 'API Reference',
      slug: 'api-reference',
      description: 'Complete API documentation',
      icon: '🔌',
      order: 2
    },
    {
      name: 'Guides',
      slug: 'guides',
      description: 'In-depth guides for specific use cases',
      icon: '📚',
      order: 3
    }
  ]);

  await DocArticle.insertMany([
    {
      title: 'Quick Start Guide',
      slug: 'quick-start-guide',
      description: 'Get up and running in 5 minutes',
      content: getDefaultDocContent('Quick Start Guide'),
      categoryId: categories[0]._id,
      order: 1
    },
    {
      title: 'Account Setup',
      slug: 'account-setup',
      description: 'Configure your account and team settings',
      content: getDefaultDocContent('Account Setup'),
      categoryId: categories[0]._id,
      order: 2
    },
    {
      title: 'Authentication API',
      slug: 'authentication-api',
      description: 'Learn how to authenticate API requests',
      content: getDefaultDocContent('Authentication API'),
      categoryId: categories[1]._id,
      order: 1
    }
  ]);

  return categories;
}

function getDefaultDocContent(title: string): string {
  return `# ${title}

## Overview

This document provides comprehensive information about ${title}.

## Getting Started

To get started with ${title}, follow these steps:

1. Step one: Description of step one
2. Step two: Description of step two
3. Step three: Description of step three

## Key Features

- Feature 1: Description of feature 1
- Feature 2: Description of feature 2
- Feature 3: Description of feature 3

## Best Practices

Here are some best practices to keep in mind:

- Best practice 1
- Best practice 2
- Best practice 3

## Troubleshooting

If you encounter any issues, here are some common solutions:

### Issue 1
Solution for issue 1

### Issue 2
Solution for issue 2

## Additional Resources

- Link to related documentation
- Link to API reference
- Link to community forum

For further assistance, please contact our support team.`;
}