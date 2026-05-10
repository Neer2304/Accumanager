// lib/proxy.ts or wherever your proxy function is
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/jwt';

// 1. Routes that should NEVER be checked by middleware
const PUBLIC_AUTH_PATHS = [
  '/login', '/register', '/signup', '/google-login', 
  '/github-login', '/verify-otp', '/change-password', '/forgot-password',
  '/admin/login', '/admin/setup/init'
];

// Add CORS headers helper
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // 2. BYPASS LOGIC (Crucial Fix)
  // Skip middleware for:
  // - Internal Next.js files (_next)
  // - Static files (public folder)
  // - ALL API routes related to Auth (login, signup, etc.)
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('/favicon.ico') ||
    pathname.startsWith('/api/auth') || // <-- Your user login API
    pathname.startsWith('/api/admin/auth') // <-- Your admin login API
  ) {
    const response = NextResponse.next();
    return addCorsHeaders(response);
  }

  const isPublicPage = PUBLIC_AUTH_PATHS.some(path => pathname === path);

  // 3. Logic for Unauthenticated Users
  if (!token) {
    if (isPublicPage) {
      const response = NextResponse.next();
      return addCorsHeaders(response);
    }
    
    const loginUrl = pathname.startsWith('/admin') ? '/admin/login' : '/login';
    const response = NextResponse.redirect(new URL(loginUrl, request.url));
    return addCorsHeaders(response);
  }

  // 4. Logic for Authenticated Users
  try {
    const user = await verifyTokenEdge(token);

    if (!user) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return addCorsHeaders(response);
    }

    // Don't let logged-in users go to login/signup pages
    if (isPublicPage) {
      const homeUrl = ['admin', 'superadmin'].includes(user.role) ? '/admin/dashboard' : '/dashboard';
      const response = NextResponse.redirect(new URL(homeUrl, request.url));
      return addCorsHeaders(response);
    }

    // Role-based check for Admin
    if (pathname.startsWith('/admin') && !['admin', 'superadmin'].includes(user.role)) {
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      return addCorsHeaders(response);
    }

  } catch (error) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return addCorsHeaders(response);
  }

  const response = NextResponse.next();
  return addCorsHeaders(response);
}

export const config = {
  matcher: ['/((?!api/public|_next/static|_next/image|favicon.ico).*)'],
};