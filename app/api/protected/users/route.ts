// app/api/protected/users/route.ts (Example of protected route)
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { ApiResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated (via middleware headers)
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    const disclaimerAccepted = request.headers.get('x-disclaimer-accepted')
    
    if (!userId) {
      return ApiResponse.unauthorized()
    }
    
    // Check disclaimer acceptance for protected routes
    if (disclaimerAccepted !== 'true') {
      return ApiResponse.forbidden('Legal disclaimer must be accepted')
    }
    
    await connectToDatabase()
    
    // Get user's own profile
    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      return ApiResponse.notFound('User not found')
    }
    
    return ApiResponse.success({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        isActive: user.isActive,
        subscription: user.subscription,
        legal: user.legal
      }
    })
  } catch (error: any) {
    return ApiResponse.error(error.message, 500)
  }
}