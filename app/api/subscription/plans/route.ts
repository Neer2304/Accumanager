// app/api/subscription/plans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PRICING_PLANS } from '@/config/pricing';

export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/subscription/plans - Starting...');
    
    // Return all pricing plans
    const plans = Object.entries(PRICING_PLANS).map(([key, plan]) => ({
      id: key,
      ...plan
    }));

    console.log('✅ Returning pricing plans');
    return NextResponse.json(plans);
  } catch (error: any) {
    console.error('❌ Get plans error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}