// app/api/community/settings/blocked-users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Check authentication
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken) as any;
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // In a real implementation, you would fetch blocked users from the database
    // For now, return empty array
    return NextResponse.json({
      success: true,
      data: []
    });
    
  } catch (error: any) {
    console.error('GET /api/community/settings/blocked-users error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch blocked users' },
      { status: 500 }
    );
  }
}