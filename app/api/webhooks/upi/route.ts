import { NextRequest, NextResponse } from 'next/server';
import { UPIWebhookHandler } from '@/lib/upi-verification';

const upiWebhook = new UPIWebhookHandler(process.env.NEXTAUTH_URL || 'http://localhost:3000');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook signature (add your verification logic)
    const signature = request.headers.get('x-webhook-signature');
    if (!signature) {
      return NextResponse.json(
        { message: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    // Process the webhook
    const result = await upiWebhook.processWebhook(body);

    if (result.success) {
      return NextResponse.json({ message: 'Webhook processed successfully' });
    } else {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transaction_id');

    if (!transactionId) {
      return NextResponse.json(
        { message: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const isValid = await upiWebhook.verifyTransaction(transactionId);

    return NextResponse.json({
      success: true,
      data: {
        transaction_id: transactionId,
        verified: isValid,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}