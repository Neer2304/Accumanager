// app/api/admin/payment-stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { verifyToken } from '@/lib/jwt';
import { PRICING_PLANS } from '@/config/pricing';

export async function GET(request: NextRequest) {
  try {
    console.log('💰 GET /api/admin/payment-stats - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 });
      }
    } catch (authError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    // Get all users for stats
    const users = await User.find({}).select('subscription');

    // Calculate revenue stats
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let activeSubscriptions = 0;
    let trialUsers = 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    users.forEach(user => {
      const plan = user.subscription.plan;
      
      // Calculate total revenue based on plan prices
      if (plan !== 'trial' && user.subscription.status === 'active') {
        const planPrice = PRICING_PLANS[plan as keyof typeof PRICING_PLANS].price;
        totalRevenue += planPrice;
        activeSubscriptions++;

        // Check if subscription is active this month
        const lastPayment = user.subscription.lastPaymentDate;
        if (lastPayment) {
          const paymentDate = new Date(lastPayment);
          if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
            monthlyRevenue += planPrice;
          }
        }
      }

      if (user.subscription.status === 'trial') {
        trialUsers++;
      }
    });

    // Get payment records for more accurate stats
    const payments = await Payment.find({ status: 'completed' });
    const actualRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Use actual payment data if available
    if (payments.length > 0) {
      totalRevenue = actualRevenue;
      
      const monthlyPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      });
      
      monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
    }

    const stats = {
      totalRevenue,
      monthlyRevenue,
      activeSubscriptions,
      trialUsers,
      totalUsers: users.length,
      paymentCount: payments.length
    };

    console.log('✅ Payment stats calculated:', stats);
    
    return NextResponse.json({
      stats,
      success: true
    });

  } catch (error: any) {
    console.error('❌ Get payment stats error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}