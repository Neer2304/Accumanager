// app/api/admin/subscriptions/route.ts - ENHANCED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/admin/subscriptions - Starting...');
    
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const plan = searchParams.get('plan');
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    // Build filter
    const filter: any = {};
    if (plan) filter['subscription.plan'] = plan;
    if (status) filter['subscription.status'] = status;
    if (role) filter.role = role;

    // Get users with pagination and detailed subscription info
    const users = await User.find(filter)
      .select('name email role shopName subscription usage createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Get subscription statistics
    const subscriptionStats = await User.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ['$subscription.status', 'active'] }, 1, 0]
            }
          }
        }
      }
    ]);

    console.log(`✅ Found ${users.length} users`);
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        subscriptionStats,
        totalUsers: total
      }
    });

  } catch (error: any) {
    console.error('❌ Get admin subscriptions error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}