// app/api/admin/about/label/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import About from '@/models/About'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const aboutData = await About.findOne().select('labels').lean()
    
    return NextResponse.json({
      success: true,
      data: aboutData?.labels || {}
    })
    
  } catch (error) {
    console.error('❌ Get labels error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch labels',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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
          { success: false, message: 'Forbidden' },
          { status: 403 }
        )
      }
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    const data = await request.json()
    
    let aboutData = await About.findOne()
    if (!aboutData) {
      aboutData = new About()
    }
    
    aboutData.labels = { ...aboutData.labels.toObject(), ...data }
    aboutData.updatedBy = decoded.id
    await aboutData.save()
    
    return NextResponse.json({
      success: true,
      message: 'Labels updated successfully',
      data: aboutData.labels
    })
    
  } catch (error) {
    console.error('❌ Update labels error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update labels',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}