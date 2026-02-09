import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import About from '@/models/About'
import { verifyToken } from '@/lib/jwt'

// GET - Get all labels
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const aboutData = await About.findOne().select('labels').lean()
    
    if (!aboutData) {
      return NextResponse.json({
        success: true,
        data: {},
        message: 'No about data found'
      })
    }
    
    return NextResponse.json({
      success: true,
      data: aboutData.labels || {}
    })
    
  } catch (error: any) {
    console.error('❌ Get labels error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch labels',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// POST - Update specific labels (admin only)
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    let decoded
    try {
      decoded = verifyToken(authToken)
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        return NextResponse.json(
          { success: false, message: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        )
      }
    } catch (authError: any) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    const data = await request.json()
    
    // Find existing about data
    let aboutData = await About.findOne()
    
    if (!aboutData) {
      aboutData = new About({
        createdBy: decoded.id,
        updatedBy: decoded.id
      })
    }
    
    // Update labels with new data
    const updatedLabels = {
      ...aboutData.labels.toObject(),
      ...data
    }
    
    aboutData.labels = updatedLabels
    aboutData.updatedBy = decoded.id
    aboutData.updatedAt = new Date()
    
    await aboutData.save()
    
    return NextResponse.json({
      success: true,
      message: 'Labels updated successfully',
      data: aboutData.labels
    })
    
  } catch (error: any) {
    console.error('❌ Update labels error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update labels',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}