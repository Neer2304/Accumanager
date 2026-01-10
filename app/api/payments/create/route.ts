// app/api/payments/create/route.ts
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
    
    const { plan } = await request.json();
    
    if (!['monthly', 'quarterly', 'yearly'].includes(plan)) {
      return NextResponse.json({ message: 'Invalid plan' }, { status: 400 });
    }
    
    const paymentData = await PaymentService.createUPIPayment(decoded.userId, plan);
    
    return NextResponse.json({
      success: true,
      data: paymentData
    });
    
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { message: error.message || 'Payment creation failed' },
      { status: 500 }
    );
  }
}