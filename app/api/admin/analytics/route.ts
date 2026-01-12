import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('📈 GET /api/admin/analytics - Starting...');
    
    // 1. Authentication Check
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unauthorized - No authentication token found' 
        }, 
        { status: 401 }
      );
    }

    let decoded;
    try {
      // 2. Verify JWT Token
      decoded = verifyToken(authToken);
      
      // 3. Authorization Check - Only admin/superadmin can access
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Forbidden - Insufficient permissions' 
          }, 
          { status: 403 }
        );
      }
    } catch (authError: any) {
      console.error('❌ Authentication error:', authError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unauthorized - Invalid or expired token' 
        }, 
        { status: 401 }
      );
    }

    // 4. Connect to Database
    await connectToDatabase();

    // 5. Parse Query Parameters
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'monthly';

    // 6. Calculate Date Range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case 'weekly':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(endDate.getMonth() - 6); // Last 6 months for monthly view
        break;
      case 'quarterly':
        startDate.setMonth(endDate.getMonth() - 12); // Last 4 quarters
        break;
      case 'yearly':
        startDate.setFullYear(endDate.getFullYear() - 3); // Last 3 years
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 6); // Default to last 6 months
    }

    console.log(`📊 Fetching analytics for range: ${range}, from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // 7. Get Basic Stats in Parallel (Performance optimization)
    const [totalUsers, activeUsers, trialUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ 'subscription.status': 'active' }),
      User.countDocuments({ 'subscription.status': 'trial' })
    ]);

    // 8. Get Revenue Statistics
    const revenueStats = await Payment.aggregate([
      {
        $match: { 
          status: 'completed',
          userId: { $exists: true } // Ensure valid user ID
        }
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
          paymentCount: { $sum: 1 },
          averagePayment: { $avg: '$amount' }
        }
      }
    ]);

    // 9. Get Monthly Revenue Data
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate },
          userId: { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' },
          payments: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // 10. Format Monthly Data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyData = monthlyRevenue.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year.toString().slice(2)}`,
      revenue: item.revenue || 0,
      payments: item.payments || 0,
      uniqueUsers: item.uniqueUsers?.length || 0
    }));

    // 11. Get User Growth Data
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          newUsers: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [{ $eq: ['$subscription.status', 'active'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // 12. Merge Data with proper alignment
    const completeMonthlyData = formattedMonthlyData.map((item, index) => {
      const growthData = userGrowth.find(g => 
        g._id.year === parseInt(item.month.split(' ')[1]) + 2000 && 
        monthNames.indexOf(item.month.split(' ')[0]) + 1 === g._id.month
      );
      
      return {
        ...item,
        users: growthData?.newUsers || 0,
        activeUsers: growthData?.activeUsers || 0
      };
    });

    // 13. Get Plan Distribution
    const planDistribution = await User.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 },
          activeCount: {
            $sum: {
              $cond: [{ $eq: ['$subscription.status', 'active'] }, 1, 0]
            }
          },
          revenue: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ['$subscription.plan', 'monthly'] }, then: 499 },
                  { case: { $eq: ['$subscription.plan', 'quarterly'] }, then: 1299 },
                  { case: { $eq: ['$subscription.plan', 'yearly'] }, then: 3999 },
                  { case: { $eq: ['$subscription.plan', 'trial'] }, then: 0 }
                ],
                default: 0
              }
            }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const formattedPlanDistribution = planDistribution
      .filter(plan => plan.count > 0)
      .map(plan => ({
        name: plan._id || 'No Plan',
        value: plan.count || 0,
        activeCount: plan.activeCount || 0,
        revenue: plan.revenue || 0,
        color: plan._id === 'quarterly' ? '#00C49F' :
               plan._id === 'monthly' ? '#FFBB28' :
               plan._id === 'trial' ? '#FF8042' : '#0088FE'
      }));

    // 14. Get Top Users by Revenue
    const topUsers = await Payment.aggregate([
      {
        $match: { 
          status: 'completed',
          userId: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$amount' },
          paymentCount: { $sum: 1 },
          lastPayment: { $max: '$createdAt' }
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 10
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
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          name: { $ifNull: ['$user.name', 'Unknown User'] },
          email: { $ifNull: ['$user.email', 'No email'] },
          plan: { $ifNull: ['$user.subscription.plan', 'No Plan'] },
          status: { $ifNull: ['$user.subscription.status', 'inactive'] },
          joined: { $ifNull: ['$user.createdAt', new Date()] },
          revenue: '$totalSpent',
          paymentCount: 1,
          lastPayment: 1
        }
      }
    ]);

    // 15. Prepare Statistics
    const stats = {
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
      monthlyRevenue: revenueStats[0]?.monthlyRevenue || 0,
      averagePayment: revenueStats[0]?.averagePayment || 0,
      activeSubscriptions: activeUsers,
      trialUsers: trialUsers,
      totalUsers: totalUsers,
      paymentCount: revenueStats[0]?.paymentCount || 0,
      conversionRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : '0.0',
      avgRevenuePerUser: totalUsers > 0 ? (revenueStats[0]?.totalRevenue || 0) / totalUsers : 0
    };

    console.log(`✅ Analytics data fetched successfully by admin: ${decoded.email}`);
    console.log(`📊 Stats: ${totalUsers} total users, ₹${stats.totalRevenue} total revenue`);
    
    // 16. Return Response with Metadata
    return NextResponse.json({
      success: true,
      stats,
      monthlyData: completeMonthlyData,
      planDistribution: formattedPlanDistribution,
      topUsers: topUsers.length > 0 ? topUsers : [],
      meta: {
        range,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        fetchedAt: new Date().toISOString(),
        requestedBy: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        },
        dataPoints: {
          monthly: completeMonthlyData.length,
          plans: formattedPlanDistribution.length,
          topUsers: topUsers.length
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Get analytics error:', error);
    
    // Return appropriate error response
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch analytics data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Optional: POST method for custom analytics queries
export async function POST(request: NextRequest) {
  try {
    // Authentication Check
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        return NextResponse.json(
          { success: false, message: 'Insufficient permissions' },
          { status: 403 }
        );
      }
    } catch (authError) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const data = await request.json();
    
    // Validate custom query parameters
    if (!data.startDate || !data.endDate) {
      return NextResponse.json(
        { success: false, message: 'Missing date range' },
        { status: 400 }
      );
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    // Custom query logic based on request
    let result: any = {};
    
    if (data.type === 'revenue_trend') {
      const revenueTrend = await Payment.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            revenue: { $sum: '$amount' },
            payments: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      result = { revenueTrend };
    }
    // Add more custom query types as needed

    return NextResponse.json({
      success: true,
      data: result,
      query: {
        type: data.type,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });

  } catch (error: any) {
    console.error('Custom analytics query error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to execute custom query'
      },
      { status: 500 }
    );
  }
}