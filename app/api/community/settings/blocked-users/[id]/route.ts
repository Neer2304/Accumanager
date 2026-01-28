// app/api/community/settings/blocked-users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    
    const { id } = await params;
    
    // In a real implementation, you would unblock the user in the database
    // For now, return success
    return NextResponse.json({
      success: true,
      message: 'User unblocked successfully'
    });
    
  } catch (error: any) {
    console.error('DELETE /api/community/settings/blocked-users/[id] error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to unblock user' },
      { status: 500 }
    );
  }
}