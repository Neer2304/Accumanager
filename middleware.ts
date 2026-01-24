import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/jwt';

// 1. Routes that should NEVER be checked by middleware
const PUBLIC_AUTH_PATHS = [
  '/login', '/register', '/signup', '/google-login', 
  '/github-login', '/verify-otp', '/change-password', '/forgot-password',
  '/admin/login', '/admin/setup/init'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

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
    return NextResponse.next();
  }

  const isPublicPage = PUBLIC_AUTH_PATHS.some(path => pathname === path);

  // 3. Logic for Unauthenticated Users
  if (!token) {
    if (isPublicPage) return NextResponse.next();
    
    const loginUrl = pathname.startsWith('/admin') ? '/admin/login' : '/login';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  // 4. Logic for Authenticated Users
  try {
    const user = await verifyTokenEdge(token);

    if (!user) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }

    // Don't let logged-in users go to login/signup pages
    if (isPublicPage) {
      const homeUrl = ['admin', 'superadmin'].includes(user.role) ? '/admin/dashboard' : '/dashboard';
      return NextResponse.redirect(new URL(homeUrl, request.url));
    }

    // Role-based check for Admin
    if (pathname.startsWith('/admin') && !['admin', 'superadmin'].includes(user.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

  } catch (error) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/public|_next/static|_next/image|favicon.ico).*)'],
};