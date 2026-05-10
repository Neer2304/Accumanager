// app/api/admin/about/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import About from '@/models/About'
import { verifyToken } from '@/lib/jwt'

// GET - Get all about data
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const authToken = request.cookies.get('auth_token')?.value
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    
    let aboutData = await About.findOne().lean()
    
    if (!aboutData) {
      const defaultAbout = new About()
      await defaultAbout.save()
      aboutData = defaultAbout.toObject()
    }
    
    // Check if admin
    let isAdmin = false
    if (authToken) {
      try {
        const decoded = verifyToken(authToken)
        if (decoded.role && ['admin', 'superadmin'].includes(decoded.role)) {
          isAdmin = true
        }
      } catch {
        // Invalid token, continue as public
      }
    }
    
    if (isAdmin) {
      return NextResponse.json({
        success: true,
        data: section ? aboutData[section as keyof typeof aboutData] : aboutData,
        isAdmin: true
      })
    }
    
    // Return public data
    const publicData = {
      companyName: aboutData.companyName,
      companyDescription: aboutData.companyDescription,
      companyLogo: aboutData.companyLogo,
      contact: aboutData.contact,
      socialMedia: aboutData.socialMedia,
      labels: aboutData.labels,
      seo: aboutData.seo,
      theme: aboutData.theme,
      system: {
        timezone: aboutData.system?.timezone,
        dateFormat: aboutData.system?.dateFormat,
        timeFormat: aboutData.system?.timeFormat,
        currency: aboutData.system?.currency,
        currencySymbol: aboutData.system?.currencySymbol,
        language: aboutData.system?.language
      }
    }
    
    return NextResponse.json({
      success: true,
      data: section ? publicData[section as keyof typeof publicData] : publicData,
      isAdmin: false
    })
    
  } catch (error) {
    console.error('❌ Get about error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch about data',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// POST - Update specific section
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
    const body = await request.json()
    const { section, updates } = body
    
    if (!section || !updates) {
      return NextResponse.json(
        { success: false, message: 'Missing section or updates' },
        { status: 400 }
      )
    }
    
    let aboutData = await About.findOne()
    if (!aboutData) {
      aboutData = new About()
    }
    
    // Update the specific section
    if (section === 'company') {
      Object.assign(aboutData, updates)
    } else if (section === 'labels') {
      aboutData.labels = { ...aboutData.labels.toObject(), ...updates }
    } else {
      aboutData[section as keyof typeof aboutData] = {
        ...(aboutData[section as keyof typeof aboutData] as object),
        ...updates
      }
    }
    
    aboutData.updatedBy = decoded.id
    await aboutData.save()
    
    return NextResponse.json({
      success: true,
      message: `${section} updated successfully`,
      data: aboutData[section as keyof typeof aboutData]
    })
    
  } catch (error) {
    console.error('❌ Update error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// PUT - Bulk update
export async function PUT(request: NextRequest) {
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
    
    Object.assign(aboutData, data)
    aboutData.updatedBy = decoded.id
    await aboutData.save()
    
    return NextResponse.json({
      success: true,
      message: 'All settings updated successfully',
      data: aboutData.toObject()
    })
    
  } catch (error) {
    console.error('❌ Bulk update error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// DELETE - Reset to defaults
export async function DELETE(request: NextRequest) {
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
    await About.deleteMany({})
    
    const defaultAbout = new About({
      createdBy: decoded.id,
      updatedBy: decoded.id
    })
    await defaultAbout.save()
    
    return NextResponse.json({
      success: true,
      message: 'Reset to defaults successfully',
      data: defaultAbout.toObject()
    })
    
  } catch (error) {
    console.error('❌ Reset error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to reset',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}