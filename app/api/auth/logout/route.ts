// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🚪 POST /api/auth/logout - Starting...')
    
    const response = NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    })
    
    // Clear auth cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    })

    // Clear user data cookie
    response.cookies.set('user_data', '', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    console.log('✅ Logout successful - cookies cleared')
    
    return response
  } catch (error) {
    console.error('❌ Logout error:', error)
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    )
  }
}