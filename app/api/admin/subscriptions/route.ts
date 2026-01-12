import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/admin/subscriptions - Starting...');
    
    // 1. Authentication Check
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unauthorized - No token provided' 
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
            message: 'Insufficient permissions - Admin access required' 
          }, 
          { status: 403 }
        );
      }
    } catch (authError: any) {
      console.error('❌ Authentication error:', authError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired token' 
        }, 
        { status: 401 }
      );
    }

    // 4. Connect to Database
    await connectToDatabase();

    // 5. Parse Query Parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const plan = searchParams.get('plan');
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const search = searchParams.get('search') || '';

    // 6. Build Filter Query
    const filter: any = {};
    
    // Subscription plan filter
    if (plan) filter['subscription.plan'] = plan;
    
    // Subscription status filter
    if (status) filter['subscription.status'] = status;
    
    // User role filter
    if (role) filter.role = role;
    
    // Search filter (name, email, shopName)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } }
      ];
    }

    // 7. Get Users with Pagination
    const skip = (page - 1) * limit;
    const users = await User.find(filter)
      .select('-password') // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Convert to plain JS objects

    // 8. Get Total Count for Pagination
    const total = await User.countDocuments(filter);

    // 9. Get Subscription Statistics
    const subscriptionStats = await User.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ['$subscription.status', 'active'] }, 1, 0]
            }
          },
          trial: {
            $sum: {
              $cond: [{ $eq: ['$subscription.status', 'trial'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // 10. Get Active and Trial Users Count
    const activeUsers = await User.countDocuments({ 
      'subscription.status': 'active',
      isActive: true 
    });
    
    const trialUsers = await User.countDocuments({ 
      'subscription.status': 'trial',
      isActive: true 
    });

    // 11. Get Revenue Statistics
    const revenueStats = await Payment.aggregate([
      {
        $match: { 
          status: 'completed',
          userId: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          monthly: {
            $sum: {
              $cond: [
                { 
                  $gte: [
                    '$createdAt', 
                    new Date(new Date().setDate(new Date().getDate() - 30))
                  ] 
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

    // 12. Get Recent Users (last 30 days)
    const recentUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    });

    // 13. Prepare Response - FIXED: Ensure users have proper subscription structure
    const stats = {
      totalUsers: total,
      subscriptionStats,
      activeUsers,
      trialUsers,
      recentUsers,
      revenueStats: revenueStats[0] || { 
        total: 0, 
        monthly: 0, 
        paymentCount: 0 
      }
    };

    // 14. Transform users to ensure proper structure
    const transformedUsers = users.map((user: any) => {
      const subscription = user.subscription || {};
      
      // Ensure currentPeriodEnd exists, set default if not
      let currentPeriodEnd = subscription.currentPeriodEnd;
      if (!currentPeriodEnd) {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        currentPeriodEnd = thirtyDaysFromNow.toISOString();
      }
      
      return {
        ...user,
        subscription: {
          plan: subscription.plan || 'No Plan',
          status: subscription.status || 'inactive',
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: currentPeriodEnd,
          trialEndsAt: subscription.trialEndsAt,
          features: subscription.features || []
        },
        usage: user.usage || {
          products: 0,
          customers: 0,
          invoices: 0,
          storageMB: 0
        }
      };
    });

    console.log(`✅ Admin ${decoded.email} fetched ${transformedUsers.length} users`);

    return NextResponse.json({
      success: true,
      users: transformedUsers, // Use transformed users
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats,
      meta: {
        filteredBy: {
          plan,
          status,
          role,
          search: search || 'none'
        },
        requestBy: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Get admin subscriptions error:', error);
    
    // Return appropriate error response
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

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
    
    // Validate required fields
    if (!data.userId || !data.plan) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(data.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Update subscription
    user.subscription.plan = data.plan;
    user.subscription.status = data.status || 'active';
    user.subscription.currentPeriodStart = new Date();
    
    // Set period end based on plan
    const periodEnd = new Date();
    switch (data.plan) {
      case 'monthly':
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        break;
      case 'quarterly':
        periodEnd.setMonth(periodEnd.getMonth() + 3);
        break;
      case 'yearly':
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        break;
      case 'trial':
        periodEnd.setDate(periodEnd.getDate() + 14);
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid plan' },
          { status: 400 }
        );
    }
    
    user.subscription.currentPeriodEnd = periodEnd;
    
    if (data.plan === 'trial') {
      user.subscription.trialEndsAt = periodEnd;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      subscription: user.subscription
    });

  } catch (error: any) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}