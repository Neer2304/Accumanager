// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('📈 GET /api/admin/analytics - Starting...');
    
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

    // Get stats summary
    const [totalUsers, activeUsers, trialUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ 'subscription.status': 'active' }),
      User.countDocuments({ 'subscription.status': 'trial' })
    ]);

    // Get revenue stats
    const revenueStats = await Payment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          monthlyRevenue: { 
            $sum: { 
              $cond: [
                { 
                  $gte: ['$createdAt', new Date(new Date().setDate(new Date().getDate() - 30))]
                }, 
                '$amount', 
                0 
              ]
            }
          },
          paymentCount: { $sum: 1 }
        }
      }
    ]);

    // Get last 6 months data for charts
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' },
          payments: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format monthly data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyData = monthlyData.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year.toString().slice(2)}`,
      revenue: item.revenue || 0,
      payments: item.payments || 0
    }));

    // Get user growth data
    const userGrowthData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          users: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Merge user growth with monthly data
    const completeMonthlyData = formattedMonthlyData.map((item, index) => ({
      ...item,
      users: userGrowthData[index]?.users || 0
    }));

    // Get plan distribution
    const planDistribution = await User.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedPlanDistribution = planDistribution.map(plan => {
      let color = '#0088FE';
      if (plan._id === 'quarterly') color = '#00C49F';
      if (plan._id === 'monthly') color = '#FFBB28';
      if (plan._id === 'trial') color = '#FF8042';
      
      return {
        name: plan._id || 'No Plan',
        value: plan.count || 0,
        color
      };
    }).filter(plan => plan.value > 0);

    // Get top users by revenue
    const topUsers = await Payment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$amount' }
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          plan: '$user.subscription.plan',
          joined: '$user.createdAt',
          revenue: '$totalSpent'
        }
      }
    ]);

    const stats = {
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
      monthlyRevenue: revenueStats[0]?.monthlyRevenue || 0,
      activeSubscriptions: activeUsers,
      trialUsers: trialUsers,
      totalUsers: totalUsers,
      paymentCount: revenueStats[0]?.paymentCount || 0
    };

    console.log('✅ Analytics data fetched successfully');
    
    return NextResponse.json({
      success: true,
      stats,
      monthlyData: completeMonthlyData,
      planDistribution: formattedPlanDistribution,
      topUsers: topUsers.length > 0 ? topUsers : [
        { name: 'No users found', email: '-', plan: '-', joined: '-', revenue: 0 }
      ]
    });

  } catch (error: any) {
    console.error('❌ Get analytics error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}