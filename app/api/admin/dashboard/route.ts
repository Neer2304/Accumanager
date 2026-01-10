// app/api/admin/dashboard/route.ts - UPDATED WITH REAL SCREEN TIME DATA
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get all basic counts in parallel for performance
    const [
      totalUsers,
      activeUsers,
      trialUsers,
      totalProducts,
      allUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ 'subscription.status': 'active' }),
      User.countDocuments({ 'subscription.status': 'trial' }),
      Product.countDocuments(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('name email role subscription isActive createdAt lastLogin screenTime')
        .lean()
    ]);

    // Calculate revenue from active subscriptions
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

    // Get plan distribution with usage stats
    const planDistribution = await User.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          users: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [{ $eq: ['$subscription.status', 'active'] }, 1, 0]
            }
          },
          totalUsageHours: { $sum: { $ifNull: ['$screenTime.totalHours', 0] } },
          last30DaysHours: {
            $sum: {
              $reduce: {
                input: '$screenTime.dailyStats',
                initialValue: 0,
                in: {
                  $add: [
                    '$$value',
                    {
                      $cond: [
                        {
                          $gte: [
                            { $dateFromString: { dateString: '$$this.date' } },
                            startDate
                          ]
                        },
                        '$$this.hours',
                        0
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          name: { $ifNull: ['$_id', 'none'] },
          users: 1,
          activeUsers: 1,
          totalUsageHours: { $ifNull: ['$totalUsageHours', 0] },
          last30DaysHours: { $ifNull: ['$last30DaysHours', 0] },
          avgUsageHours: {
            $cond: [
              { $gt: ['$users', 0] },
              { $divide: ['$totalUsageHours', '$users'] },
              0
            ]
          }
        }
      },
      {
        $sort: { users: -1 }
      }
    ]);

    // Calculate aggregate screen time statistics
    const screenTimeStats = await User.aggregate([
      {
        $match: {
          'screenTime.totalHours': { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          totalUsageHours: { $sum: '$screenTime.totalHours' },
          avgDailyUsage: {
            $avg: {
              $divide: [
                { $sum: { $ifNull: ['$screenTime.totalHours', 0] } },
                {
                  $divide: [
                    { $subtract: [new Date(), { $ifNull: ['$createdAt', new Date()] }] },
                    1000 * 60 * 60 * 24 // Convert ms to days
                  ]
                }
              ]
            }
          },
          peakConcurrentUsers: {
            $max: {
              $size: {
                $filter: {
                  input: '$screenTime.dailyStats',
                  as: 'stat',
                  cond: {
                    $gte: [
                      { $dateFromString: { dateString: '$$stat.date' } },
                      { $subtract: [new Date(), 1000 * 60 * 60 * 24] } // Last 24 hours
                    ]
                  }
                }
              }
            }
          },
          activeUsersCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ['$screenTime.totalHours', 0] },
                    {
                      $gte: [
                        '$screenTime.lastActive',
                        { $subtract: [new Date(), 1000 * 60 * 60 * 24 * 7] } // Last 7 days
                      ]
                    }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get daily usage data for charts (last 30 days)
    const dailyUsageData = await User.aggregate([
      {
        $unwind: {
          path: '$screenTime.dailyStats',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $match: {
          'screenTime.dailyStats.date': {
            $gte: startDate.toISOString().split('T')[0],
            $lte: endDate.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: '$screenTime.dailyStats.date',
          hours: { $sum: '$screenTime.dailyStats.hours' },
          activeUsers: { $addToSet: '$_id' },
          sessions: { $sum: '$screenTime.dailyStats.sessions' }
        }
      },
      {
        $project: {
          date: '$_id',
          hours: { $round: ['$hours', 2] },
          activeUsers: { $size: '$activeUsers' },
          sessions: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    // Fill in missing dates in daily usage data
    const allDates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      allDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const completeDailyUsage = allDates.map(date => {
      const existing = dailyUsageData.find(d => d.date === date);
      return existing || {
        date,
        hours: 0,
        activeUsers: 0,
        sessions: 0
      };
    });

    // Get recent users with screen time data
    const recentUsersWithUsage = allUsers.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      totalUsageHours: user.screenTime?.totalHours || 0,
      lastActive: user.screenTime?.lastActive || user.lastLogin,
      dailyStats: user.screenTime?.dailyStats?.slice(-7) || [] // Last 7 days
    }));

    // Calculate growth percentages (placeholder - you can implement real comparison)
    const userGrowth = totalUsers > 10 ? 15 : 0; // Example growth
    const revenueGrowth = revenueAggregation[0]?.totalRevenue > 10000 ? 25 : 0;

    // Generate revenue trend data (last 6 months)
    const revenueTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleString('default', { month: 'short' });
      
      // This is mock data - in production, you'd query actual revenue data
      const baseRevenue = revenueAggregation[0]?.totalRevenue || 0;
      const monthlyRevenue = Math.floor((baseRevenue / 12) * (0.8 + Math.random() * 0.4));
      const newUsers = Math.floor(Math.random() * 15) + 5;
      
      revenueTrend.push({
        month: monthStr,
        revenue: monthlyRevenue,
        newUsers: newUsers
      });
    }

    // Prepare the response
    const stats = {
      totalUsers,
      activeUsers,
      trialUsers,
      totalProducts,
      revenue: revenueAggregation[0]?.totalRevenue || 0,
      
      // Screen time metrics
      totalUsageHours: screenTimeStats[0]?.totalUsageHours || 0,
      avgDailyUsage: screenTimeStats[0]?.avgDailyUsage || 0,
      peakConcurrentUsers: screenTimeStats[0]?.peakConcurrentUsers || 0,
      
      // Growth metrics
      userGrowth,
      revenueGrowth,
      
      // Chart data
      dailyUsage: completeDailyUsage,
      planDistribution: planDistribution.map(p => ({
        name: p.name,
        users: p.users,
        value: p.users,
        revenue: p.name === 'monthly' ? p.users * 499 :
                p.name === 'quarterly' ? p.users * 1299 :
                p.name === 'yearly' ? p.users * 3999 : 0,
        avgUsageHours: Number(p.avgUsageHours.toFixed(2))
      })),
      revenueTrend,
      
      // Recent users with usage data
      recentUsers: recentUsersWithUsage,
      
      // Additional metrics
      monthlyStats: {
        totalUsers,
        activeUsers,
        revenue: revenueAggregation[0]?.totalRevenue || 0,
        totalUsageHours: screenTimeStats[0]?.totalUsageHours || 0
      }
    };

    return NextResponse.json(stats);
    
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch dashboard data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}