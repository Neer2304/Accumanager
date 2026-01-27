import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get category counts with stats
    const categoryStats = await Community.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          totalPosts: { $sum: 1 },
          totalComments: { $sum: '$commentCount' },
          totalLikes: { $sum: '$likeCount' },
          totalViews: { $sum: '$views' },
          avgComments: { $avg: '$commentCount' },
          avgLikes: { $avg: '$likeCount' },
          latestPost: { $max: '$createdAt' }
        }
      },
      { $sort: { totalPosts: -1 } }
    ]);
    
    // Get predefined categories
    const predefinedCategories = Community.getCategories();
    
    // Merge with stats
    const categories = predefinedCategories.map(category => {
      const stats = categoryStats.find(s => s._id === category.id) || {
        totalPosts: 0,
        totalComments: 0,
        totalLikes: 0,
        totalViews: 0,
        avgComments: 0,
        avgLikes: 0,
        latestPost: null
      };
      
      return {
        ...category,
        ...stats,
        activityLevel: calculateActivityLevel(stats.totalPosts, stats.latestPost)
      };
    });
    
    // Calculate activity level
    function calculateActivityLevel(totalPosts: number, latestPost: Date | null) {
      if (totalPosts === 0) return 'low';
      
      if (!latestPost) return 'medium';
      
      const daysSinceLastPost = (Date.now() - new Date(latestPost).getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastPost < 1) return 'very-high';
      if (daysSinceLastPost < 3) return 'high';
      if (daysSinceLastPost < 7) return 'medium';
      return 'low';
    }
    
    // Get trending categories (based on recent activity)
    const trendingCategories = await Community.aggregate([
      {
        $match: {
          status: 'active',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$category',
          recentPosts: { $sum: 1 },
          recentComments: { $sum: '$commentCount' },
          recentLikes: { $sum: '$likeCount' }
        }
      },
      {
        $project: {
          category: '$_id',
          recentPosts: 1,
          recentComments: 1,
          recentLikes: 1,
          engagementScore: {
            $add: [
              { $multiply: ['$recentPosts', 1] },
              { $multiply: ['$recentComments', 1.5] },
              { $multiply: ['$recentLikes', 1] }
            ]
          }
        }
      },
      { $sort: { engagementScore: -1 } },
      { $limit: 5 }
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        categories,
        trendingCategories,
        totalCategories: categories.length,
        mostActiveCategory: categories.reduce((prev, current) => 
          (prev.totalPosts > current.totalPosts) ? prev : current
        )
      }
    });
    
  } catch (error: any) {
    console.error('GET /api/community/categories error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}