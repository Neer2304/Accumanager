import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get all counts in parallel
    const [
      totalUsers,
      activeUsers,
      trialUsers,
      totalProducts
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ 'subscription.status': 'active' }), // Changed from isActive
      User.countDocuments({ 'subscription.status': 'trial' }),
      Product.countDocuments(),
    ]);

    // Calculate revenue properly
    const revenueAggregation = await User.aggregate([
      { 
        $match: { 
          'subscription.status': 'active',
          'subscription.plan': { $in: ['monthly', 'quarterly', 'yearly'] }
        } 
      },
      { 
        $addFields: {
          planAmount: {
            $switch: {
              branches: [
                { case: { $eq: ['$subscription.plan', 'monthly'] }, then: 499 },
                { case: { $eq: ['$subscription.plan', 'quarterly'] }, then: 1299 },
                { case: { $eq: ['$subscription.plan', 'yearly'] }, then: 3999 },
              ],
              default: 0
            }
          }
        }
      },
      { 
        $group: {
          _id: null,
          totalRevenue: { $sum: '$planAmount' }
        }
      }
    ]);

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role subscription isActive createdAt');

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        trialUsers,
        totalProducts,
        revenue: revenueAggregation[0]?.totalRevenue || 0,
      },
      recentUsers: recentUsers.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription || {
          plan: 'none',
          status: 'inactive',
          currentPeriodStart: null,
          currentPeriodEnd: null,
          features: []
        },
        isActive: user.isActive || false,
        createdAt: user.createdAt
      }))
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}