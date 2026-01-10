// app/api/debug-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔐 Debug Auth - Checking authentication...');
    
    // Get all cookies for debugging
    const allCookies = request.cookies.getAll();
    console.log('🍪 All cookies:', allCookies);
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('❌ No auth_token cookie found');
      return NextResponse.json({ 
        authenticated: false,
        message: 'No auth_token cookie',
        cookies: allCookies.map(c => c.name)
      }, { status: 401 });
    }

    console.log('✅ Auth token found, length:', authToken.length);
    
    try {
      const decoded = verifyToken(authToken);
      console.log('✅ Token verified for user:', decoded.userId);
      
      return NextResponse.json({
        authenticated: true,
        user: decoded,
        tokenInfo: {
          length: authToken.length,
          userId: decoded.userId,
        }
      });
    } catch (authError) {
      console.error('❌ Token verification failed:', authError);
      return NextResponse.json({
        authenticated: false,
        message: 'Token verification failed',
        error: authError
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Debug auth error:', error);
    return NextResponse.json({
      authenticated: false,
      message: 'Debug error',
      error: error.message
    }, { status: 500 });
  }
}