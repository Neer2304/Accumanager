import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const popularTags = await Community.getPopularTags(limit);
    
    // Get tag usage over time (last 30 days)
    const tagTrends = await Community.aggregate([
      {
        $match: {
          status: 'active',
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      { $unwind: '$tags' },
      {
        $group: {
          _id: {
            tag: '$tags',
            week: { $week: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.week': -1, count: -1 } },
      { $limit: 50 }
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        popularTags,
        tagTrends,
        totalTags: popularTags.length
      }
    });
    
  } catch (error: any) {
    console.error('GET /api/community/tags error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch popular tags' },
      { status: 500 }
    );
  }
}