import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/jwt'; // <-- Use the Edge version!

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Skip middleware for static files and standard auth APIs
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // 2. Protect Admin Routes
  if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));

    const user = await verifyTokenEdge(token); // Async call for jose
    if (!user || !['admin', 'superadmin'].includes(user.role)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/admin/:path*',],
};