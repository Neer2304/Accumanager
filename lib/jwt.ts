// lib/jwt.ts - UPDATED AND FIXED
import jwt from 'jsonwebtoken'

// Use consistent JWT secret
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined in environment variables')
  throw new Error('JWT_SECRET is required')
}

export const generateToken = (payload: any) => {
  console.log('🔐 Generating token with payload:', payload)
  console.log('🔐 JWT Secret length:', JWT_SECRET?.length)
  
  const token = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN
  })
  
  console.log('✅ Token generated, length:', token.length)
  return token
}

export const verifyToken = (token: string) => {
  try {
    console.log('🔍 Verifying token...')
    console.log('   Token length:', token.length)
    console.log('   JWT Secret exists:', !!JWT_SECRET)
    
    if (!token || token === 'undefined') {
      throw new Error('No token provided')
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured')
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    console.log('✅ Token verified successfully')
    console.log('   User ID:', decoded.userId)
    console.log('   Expires:', new Date(decoded.exp * 1000))
    return decoded
  } catch (error: any) {
    console.error('❌ Token verification failed:')
    console.error('   Error name:', error.name)
    console.error('   Error message:', error.message)
    
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired')
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not yet active')
    } else {
      throw new Error('Token verification failed: ' + error.message)
    }
  }
}