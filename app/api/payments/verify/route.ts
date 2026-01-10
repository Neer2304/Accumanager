// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/paymentService';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Verify auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    
    const { paymentId, upiTransactionId } = await request.json();
    
    if (!paymentId || !upiTransactionId) {
      return NextResponse.json({ message: 'Payment ID and transaction ID are required' }, { status: 400 });
    }
    
    const result = await PaymentService.verifyPayment(paymentId, upiTransactionId);
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { message: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}