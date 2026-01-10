// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

// Simple in-memory cache to prevent rapid successive calls
let lastCallTime = 0
const DEBOUNCE_MS = 1000 // 1 second

export async function GET(request: NextRequest) {
  const now = Date.now()
  
  // Debounce rapid successive calls
  if (now - lastCallTime < DEBOUNCE_MS) {
    console.log('⚡ Debouncing rapid auth check')
    return NextResponse.json({ isAuthenticated: false, debounced: true }, { status: 200 })
  }
  
  lastCallTime = now

  try {
    console.log('🔍 Checking auth status...')
    
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('❌ No auth token found')
      return NextResponse.json({ isAuthenticated: false }, { status: 200 })
    }

    const decoded = verifyToken(authToken)
    console.log('✅ User authenticated:', decoded.userId)
    
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      }
    })
  } catch (error) {
    console.log('❌ Auth check failed:', error)
    return NextResponse.json({ isAuthenticated: false }, { status: 200 })
  }
}