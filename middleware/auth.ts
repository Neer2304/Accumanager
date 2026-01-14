// middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// Define roles and their permissions
const ROLE_PERMISSIONS = {
  user: ['/api/user', '/api/dashboard', '/api/customers', '/api/invoices', '/api/products'],
  admin: ['/api/admin', '/api/users', '/api/analytics', '/api/system'],
  superadmin: ['/api/superadmin', '/api/system', '/api/audit']
} as const;

export async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip auth for public routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/legal') ||
    pathname === '/api/health' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(authToken);
    
    // Check if user has permission for this route
    if (!hasPermission(pathname, decoded.role)) {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Add user info to headers for downstream handlers
    const headers = new Headers(request.headers);
    headers.set('x-user-id', decoded.userId);
    headers.set('x-user-role', decoded.role);
    headers.set('x-user-email', decoded.email);

    return NextResponse.next({
      request: {
        headers: headers,
      },
    });
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    
    if (error.message === 'Token expired') {
      // Clear expired token
      const response = NextResponse.json(
        { message: 'Session expired. Please login again.' },
        { status: 401 }
      );
      response.cookies.delete('auth_token');
      return response;
    }
    
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 401 }
    );
  }
}

function hasPermission(pathname: string, role: string = 'user'): boolean {
  // Admin routes require admin or superadmin role
  if (pathname.startsWith('/api/admin') && !['admin', 'superadmin'].includes(role)) {
    return false;
  }
  
  // Superadmin routes require superadmin role
  if (pathname.startsWith('/api/superadmin') && role !== 'superadmin') {
    return false;
  }
  
  // User routes require at least user role
  if (pathname.startsWith('/api/user') && !['user', 'admin', 'superadmin'].includes(role)) {
    return false;
  }
  
  // Default to allowing access for authenticated users
  return true;
}