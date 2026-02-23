// app/api/admin/blog/categories/route.ts - GET (list) & POST (create)
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import BlogCategory from '@/models/BlogCategory'
import { verifyToken } from '@/lib/jwt'

// GET /api/admin/blog/categories - List all categories
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

    const categories = await BlogCategory.find().sort({ name: 1 })

    return NextResponse.json({
      success: true,
      data: categories
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}

// POST /api/admin/blog/categories - Create new category
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

    if (!data.name || !data.slug) {
      return NextResponse.json({
        success: false,
        message: 'Name and slug are required'
      }, { status: 400 })
    }

    // Check if slug already exists
    const existing = await BlogCategory.findOne({ slug: data.slug })
    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'Category with this slug already exists'
      }, { status: 400 })
    }

    const category = new BlogCategory(data)
    await category.save()

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: category
    }, { status: 201 })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}