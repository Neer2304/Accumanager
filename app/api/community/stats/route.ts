import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const stats = await Community.getStats();
    
    // Get top contributors (users with most posts)
    const topContributors = await Community.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          avatar: '$user.avatar',
          role: '$user.role',
          postCount: '$count'
        }
      }
    ]);
    
    // Get recent activity
    const recentActivity = await Community.find({ status: 'active' })
      .sort({ lastActivityAt: -1 })
      .limit(10)
      .select('title category authorName lastActivityAt likeCount commentCount')
      .lean();
    
    // Get category distribution
    const categoryDistribution = await Community.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        topContributors,
        recentActivity,
        categoryDistribution,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('GET /api/community/stats error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch community statistics' },
      { status: 500 }
    );
  }
}