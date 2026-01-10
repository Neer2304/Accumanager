// app/api/products/test/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { PaymentService } from '@/services/paymentService';

export async function GET(request: Request) {
  try {
    const authToken = request.headers.get('authorization')?.replace('Bearer ', '') || 
                     new URL(request.url).searchParams.get('token');
    
    if (!authToken) {
      return NextResponse.json({ message: 'Token required' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    const subscription = await PaymentService.checkSubscription(decoded.userId);
    
    return NextResponse.json({
      message: 'API is working!',
      user: decoded.userId,
      subscription: {
        isActive: subscription.isActive,
        plan: subscription.plan,
        productsUsage: `${subscription.usage.products}/${subscription.limits.products}`
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Test failed' },
      { status: 500 }
    );
  }
}