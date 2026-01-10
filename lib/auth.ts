// lib/auth.ts - UPDATED WITH CONSISTENT EXPIRATION
import { generateToken, verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'

export const generateTokens = (user: any) => {
  console.log('🔐 Generating tokens for user:', user.id)
  
  const payload = { 
    userId: user.id, 
    email: user.email 
  }

  // Use consistent expiration - 7 days for both
  const authToken = generateToken(payload)
  const refreshToken = generateToken({ ...payload, type: 'refresh' })

  console.log('✅ Tokens generated successfully')
  return { authToken, refreshToken }
}

export const setTokenCookies = (tokens: { authToken: string; refreshToken: string }) => {
  try {
    const cookieStore = cookies()
    
    console.log('🍪 Setting auth token cookie for 7 days')
    cookieStore.set('auth_token', tokens.authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days - MATCHES JWT EXPIRATION
      path: '/',
    })

    console.log('🍪 Setting refresh token cookie for 30 days')
    cookieStore.set('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days for refresh token
      path: '/',
    })

    console.log('✅ Token cookies set successfully')
  } catch (error) {
    console.error('❌ Error setting token cookies:', error)
    throw error
  }
}

export const verifyAuthToken = (token: string) => {
  return verifyToken(token)
}