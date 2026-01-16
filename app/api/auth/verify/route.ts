// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({
        success: false,
        message: 'No auth token found'
      });
    }
    
    const decoded = verifyToken(authToken);
    
    return NextResponse.json({
      success: true,
      data: {
        userId: decoded.userId,
        expires: decoded.exp ? new Date(decoded.exp * 1000) : 'No expiration',
        issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : 'No issue time'
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
}