import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ isAuthenticated: false });
    }

    const decoded = verifyToken(authToken);
    
    if (!decoded.role || !['superadmin', 'admin'].includes(decoded.role)) {
      return NextResponse.json({ isAuthenticated: false });
    }

    return NextResponse.json({ 
      isAuthenticated: true,
      user: {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    return NextResponse.json({ isAuthenticated: false });
  }
}