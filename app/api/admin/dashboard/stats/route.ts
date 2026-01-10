import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (!decoded.role || !['superadmin', 'admin'].includes(decoded.role)) {
      return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 });
    }

    await connectToDatabase();

    const [
      totalUsers,
      activeUsers,
      trialUsers,
      totalProducts,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ 'subscription.status': 'trial' }),
      Product.countDocuments(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role subscription')
    ]);

    // Calculate revenue (simplified)
    const revenue = await User.aggregate([
      { $match: { 'subscription.status': 'active' } },
      { $group: {
        _id: null,
        revenue: {
          $sum: {
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
      }}
    ]);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      trialUsers,
      totalProducts,
      revenue: revenue[0]?.revenue || 0,
      recentUsers
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}