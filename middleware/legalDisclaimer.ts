// middleware/legalDisclaimer.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function legalDisclaimerMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip for disclaimer page itself and auth pages
  if (
    pathname.startsWith('/legal-disclaimer') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/api/') ||
    pathname === '/'
  ) {
    return NextResponse.next()
  }

  // Check if user is logged in (has auth cookie)
  const authToken = request.cookies.get('auth_token')
  
  if (authToken) {
    // Check for disclaimer acceptance in cookies
    const disclaimerAccepted = request.cookies.get('legal_disclaimer_accepted')
    
    if (!disclaimerAccepted && !pathname.startsWith('/legal-disclaimer')) {
      // Redirect to disclaimer page
      const url = request.nextUrl.clone()
      url.pathname = '/legal-disclaimer'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}