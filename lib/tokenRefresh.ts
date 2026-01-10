// lib/tokenRefresh.ts - NEW FILE
import { verifyToken, generateToken } from '@/lib/jwt'
import { cookies } from 'next/headers'

export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const cookieStore = cookies()
    const refreshToken = (await cookieStore).get('refresh_token')?.value
    const currentAuthToken = (await cookieStore).get('auth_token')?.value

    if (!refreshToken) {
      console.log('❌ No refresh token available')
      return null
    }

    console.log('🔄 Attempting to refresh auth token...')
    
    // Verify the refresh token
    const decoded = verifyToken(refreshToken)
    
    // Generate new auth token
    const newAuthToken = generateToken({
      userId: decoded.userId,
      email: decoded.email
    })

    // Update the auth token cookie
    cookieStore.set('auth_token', newAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    console.log('✅ Auth token refreshed successfully')
    return newAuthToken

  } catch (error) {
    console.error('❌ Failed to refresh auth token:', error)
    return null
  }
}