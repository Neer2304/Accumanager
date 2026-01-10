// app/api/admin/subscriptions/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { PRICING_PLANS } from '@/config/pricing';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    console.log('🔄 PUT /api/admin/subscriptions/[userId] - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
      // Check if user is admin
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 });
      }
    } catch (authError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const { userId } = await params;
    const updateData = await request.json();

    // Validate plan
    if (updateData.plan && !['trial', 'monthly', 'quarterly', 'yearly'].includes(updateData.plan)) {
      return NextResponse.json(
        { message: 'Invalid plan' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update subscription
    if (updateData.plan) {
      const planConfig = PRICING_PLANS[updateData.plan as keyof typeof PRICING_PLANS];
      const currentDate = new Date();
      const periodEnd = new Date(currentDate.getTime() + planConfig.duration * 24 * 60 * 60 * 1000);

      user.subscription.plan = updateData.plan;
      user.subscription.status = updateData.status || 'active';
      user.subscription.currentPeriodStart = currentDate;
      user.subscription.currentPeriodEnd = periodEnd;
      user.subscription.features = planConfig.features;
      
      if (updateData.plan === 'trial') {
        user.subscription.trialEndsAt = periodEnd;
      }
    }

    if (updateData.status) {
      user.subscription.status = updateData.status;
    }

    await user.save();

    console.log('✅ User subscription updated:', user.email);
    
    return NextResponse.json({
      success: true,
      message: 'Subscription updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });

  } catch (error: any) {
    console.error('❌ Update user subscription error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}