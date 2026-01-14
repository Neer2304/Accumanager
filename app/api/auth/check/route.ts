// app/api/auth/check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json({ 
        isAuthenticated: false,
        message: 'No authentication token'
      })
    }

    const decoded = verifyToken(authToken)
    
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      isAuthenticated: false,
      message: 'Invalid or expired token'
    })
  }
}