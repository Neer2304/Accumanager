// app/api/usage/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/paymentService';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
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
    const { resource, increment = 1 } = await request.json();
    
    if (!resource || !['products', 'customers', 'invoices', 'storageMB'].includes(resource)) {
      return NextResponse.json({ message: 'Valid resource is required' }, { status: 400 });
    }
    
    const limitCheck = await PaymentService.checkUsageLimit(decoded.userId, resource, increment);
    
    return NextResponse.json({
      success: true,
      data: limitCheck
    });
    
  } catch (error: any) {
    console.error('Usage check error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to check usage' },
      { status: 500 }
    );
  }
}