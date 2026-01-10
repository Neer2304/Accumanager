// app/api/settings/theme/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Setting from '@/models/Setting'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('🎨 GET /api/settings/theme - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(authToken)
    await connectToDatabase()

    const settings = await Setting.findOne({ userId: decoded.userId })
    
    if (!settings) {
      return NextResponse.json({
        success: true,
        data: {
          mode: 'light',
          primaryColor: '#2563eb',
          secondaryColor: '#8b5cf6',
          backgroundColor: '#f8fafc',
          fontFamily: 'Inter',
          fontSize: 'medium',
          borderRadius: 'md',
          sidebarWidth: 280,
          compactMode: false,
          animations: true,
          highContrast: false,
          reduceMotion: false
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings.theme || {
        mode: 'light',
        primaryColor: '#2563eb',
        secondaryColor: '#8b5cf6',
        backgroundColor: '#f8fafc',
        fontFamily: 'Inter',
        fontSize: 'medium',
        borderRadius: 'md',
        sidebarWidth: 280,
        compactMode: false,
        animations: true,
        highContrast: false,
        reduceMotion: false
      }
    })

  } catch (error: any) {
    console.error('❌ Get theme error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🎨 PUT /api/settings/theme - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(authToken)
    const themeData = await request.json()
    
    if (!themeData || typeof themeData !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid theme data' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Update theme settings
    const settings = await Setting.findOneAndUpdate(
      { userId: decoded.userId },
      { 
        $set: { 
          'theme': themeData,
          updatedAt: new Date()
        }
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    )

    // Update localStorage for immediate effect on frontend
    if (themeData.mode) {
      // This will be picked up by the ThemeContext
      // We could send a response header or cookie for server-side rendering
    }

    return NextResponse.json({
      success: true,
      message: 'Theme updated successfully',
      data: settings.theme
    })

  } catch (error: any) {
    console.error('❌ Update theme error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}