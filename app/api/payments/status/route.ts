// app/api/payments/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    // Mock payment status - replace with your payment verification
    const status = Math.random() > 0.3 ? 'completed' : 'pending'; // 70% success rate for demo

    return NextResponse.json({
      paymentId,
      status,
      upiTransactionId: status === 'completed' ? `UPI${Date.now()}` : null
    });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}