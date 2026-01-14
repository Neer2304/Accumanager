// lib/api-middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function apiMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public API endpoints (no auth required)
  if (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/legals/') ||
    pathname === '/api/health'
  ) {
    return NextResponse.next()
  }
  
  // Admin API auth endpoints (special handling)
  if (pathname.startsWith('/api/admin/auth/')) {
    // Allow access but add rate limiting headers
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', '100')
    response.headers.set('X-RateLimit-Remaining', '99')
    return response
  }
  
  // Check authentication for all other API endpoints
  const authToken = request.cookies.get('auth_token')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!authToken) {
    return NextResponse.json(
      {
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHENTICATED'
      },
      { status: 401 }
    )
  }
  
  let decoded
  try {
    decoded = verifyToken(authToken)
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      },
      { status: 401 }
    )
  }
  
  // Check role-based access for API
  const requiredRole = getApiRequiredRole(pathname)
  const userRole = decoded.role || 'user'
  
  if (!hasApiAccess(userRole, requiredRole)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Insufficient permissions',
        code: 'FORBIDDEN',
        userRole,
        requiredRole
      },
      { status: 403 }
    )
  }
  
  // Add user info to headers for API handlers
  const headers = new Headers(request.headers)
  headers.set('x-user-id', decoded.userId)
  headers.set('x-user-role', userRole)
  headers.set('x-user-email', decoded.email || '')
  
  return NextResponse.next({
    request: {
      headers: headers
    }
  })
}

function getApiRequiredRole(pathname: string): string {
  // Admin APIs
  if (pathname.startsWith('/api/admin/')) {
    return 'admin'
  }
  
  // Superadmin APIs (if you add them)
  if (pathname.startsWith('/api/superadmin/')) {
    return 'superadmin'
  }
  
  // User APIs (dashboard, customers, etc.)
  if (
    pathname.startsWith('/api/dashboard/') ||
    pathname.startsWith('/api/customers/') ||
    pathname.startsWith('/api/attendance/') ||
    pathname.startsWith('/api/billing/') ||
    pathname.startsWith('/api/analytics/') ||
    pathname.startsWith('/api/reports/') ||
    pathname.startsWith('/api/settings/') ||
    pathname.startsWith('/api/profile/')
  ) {
    return 'user'
  }
  
  // Default to user
  return 'user'
}

function hasApiAccess(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'superadmin': ['superadmin', 'admin', 'user'],
    'admin': ['admin', 'user'],
    'user': ['user']
  }
  
  const userAllowedRoles = roleHierarchy[userRole as keyof typeof roleHierarchy] || ['user']
  return userAllowedRoles.includes(requiredRole)
}