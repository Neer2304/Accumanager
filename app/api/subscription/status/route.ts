// app/api/subscription/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/paymentService';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Verify auth token
    const authHeader = request.headers.get('authorization');
    const tokenFromCookie = request.cookies.get('auth_token')?.value;
    
    const token = authHeader?.replace('Bearer ', '') || tokenFromCookie;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    const subscriptionData = await PaymentService.checkSubscription(decoded.userId);
    
    return NextResponse.json({
      success: true,
      data: subscriptionData
    });
    
  } catch (error: any) {
    console.error('Subscription check error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to check subscription' },
      { status: 500 }
    );
  }
}