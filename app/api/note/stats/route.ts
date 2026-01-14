import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';

// GET /api/note/stats - Get note statistics
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    // Get stats for the user
    const stats = await Notes.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(decoded.userId),
          status: { $ne: 'deleted' }
        }
      },
      {
        $facet: {
          // Total stats
          total: [
            { $count: 'count' }
          ],
          // By category
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          // By priority
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ],
          // By status
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          // Recent activity
          recentActivity: [
            { $sort: { updatedAt: -1 } },
            { $limit: 10 },
            { 
              $project: {
                title: 1,
                category: 1,
                priority: 1,
                updatedAt: 1,
                editCount: 1,
                readCount: 1
              }
            }
          ],
          // Word count stats
          wordStats: [
            {
              $group: {
                _id: null,
                totalWords: { $sum: '$wordCount' },
                avgWords: { $avg: '$wordCount' },
                maxWords: { $max: '$wordCount' },
                minWords: { $min: '$wordCount' }
              }
            }
          ],
          // Daily notes created last 7 days
          dailyNotes: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
              }
            },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);

    // Calculate summary stats
    const summary = {
      totalNotes: stats[0]?.total[0]?.count || 0,
      totalWords: stats[0]?.wordStats[0]?.totalWords || 0,
      avgWords: Math.round(stats[0]?.wordStats[0]?.avgWords || 0),
      categories: stats[0]?.byCategory || [],
      priorities: stats[0]?.byPriority || [],
      statuses: stats[0]?.byStatus || [],
      recentActivity: stats[0]?.recentActivity || [],
      dailyNotes: stats[0]?.dailyNotes || []
    };

    return NextResponse.json({
      success: true,
      data: summary
    });

  } catch (error: any) {
    console.error('Get note stats error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}