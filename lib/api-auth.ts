// lib/api-auth.ts
import { NextRequest } from 'next/server'
import { verifyToken } from './jwt'

export const getAuthUserFromRequest = (request: NextRequest) => {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return null
    }

    const decoded = verifyToken(authToken)
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}