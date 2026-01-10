// app/api/debug-token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('🔐 Debug Token - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('❌ No auth token found')
      return NextResponse.json({ 
        status: 'no_token',
        message: 'No auth token found in cookies' 
      })
    }

    console.log('✅ Auth token found, length:', authToken.length)
    console.log('🔍 Token preview:', authToken.substring(0, 50) + '...')

    try {
      const decoded = verifyToken(authToken)
      console.log('✅ Token verified successfully')
      console.log('👤 User ID:', decoded.userId)
      console.log('📧 User Email:', decoded.email)
      
      return NextResponse.json({
        status: 'valid',
        user: decoded,
        tokenInfo: {
          length: authToken.length,
          userId: decoded.userId,
          email: decoded.email
        }
      })
    } catch (tokenError: any) {
      console.error('❌ Token verification failed:', tokenError.message)
      return NextResponse.json({
        status: 'invalid',
        error: tokenError.message,
        tokenPreview: authToken.substring(0, 50) + '...'
      }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Debug token error:', error)
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 })
  }
}