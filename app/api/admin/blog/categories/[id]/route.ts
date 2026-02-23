// app/api/admin/blog/categories/[id]/route.ts - GET, PUT, DELETE
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import BlogCategory from '@/models/BlogCategory'
import BlogPost from '@/models/BlogPost'
import { verifyToken } from '@/lib/jwt'

// GET /api/admin/blog/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const category = await BlogCategory.findById(params.id)

    if (!category) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: category
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}

// PUT /api/admin/blog/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // If slug is being updated, check if it already exists
    if (data.slug) {
      const existing = await BlogCategory.findOne({
        slug: data.slug,
        _id: { $ne: params.id }
      })
      if (existing) {
        return NextResponse.json({
          success: false,
          message: 'Category with this slug already exists'
        }, { status: 400 })
      }
    }

    const category = await BlogCategory.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    )

    if (!category) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}

// DELETE /api/admin/blog/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if category has posts
    const postsCount = await BlogPost.countDocuments({ categoryId: params.id })
    if (postsCount > 0) {
      return NextResponse.json({
        success: false,
        message: 'Cannot delete category with existing posts. Move or delete posts first.'
      }, { status: 400 })
    }

    const category = await BlogCategory.findByIdAndDelete(params.id)

    if (!category) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}