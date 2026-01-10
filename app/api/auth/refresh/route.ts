// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verify, sign } from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value
    
    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token' },
        { status: 401 }
      )
    }

    // Verify refresh token
    const decoded = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any
    
    // Generate new tokens
    const newAuthToken = sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' } // Short-lived access token
    )
    
    const newRefreshToken = sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' } // Long-lived refresh token
    )

    // Set new cookies
    const response = NextResponse.json({ 
      success: true, 
      user: { userId: decoded.userId, email: decoded.email }
    })

    response.cookies.set('auth_token', newAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    })

    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Refresh token error:', error)
    
    // Clear invalid tokens
    const response = NextResponse.json(
      { message: 'Invalid refresh token' },
      { status: 401 }
    )
    
    response.cookies.delete('auth_token')
    response.cookies.delete('refresh_token')
    
    return response
  }
}