// app/api/admin/analysis/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/admin/analysis - Starting...');

    // Authentication check
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(authToken);
    
    // Check if user is admin
    if (!decoded.role || !['superadmin', 'admin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    console.log('✅ Database connected for analysis');

    // Get timeframe from query params (default: last 30 days)
    const searchParams = request.nextUrl.searchParams;
    const timeframe = parseInt(searchParams.get('timeframe') || '30'); // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframe);

    console.log(`📅 Timeframe: ${timeframe} days, Start date: ${startDate.toISOString()}`);

    // **1. Get Total Users Count First**
    const totalUsers = await User.countDocuments();
    console.log(`👥 Total users in database: ${totalUsers}`);

    // **2. Get Active Users (logged in within last timeframe OR updated recently)**
    const activeUsers = await User.countDocuments({
      $or: [
        { lastLogin: { $gte: startDate } },
        { updatedAt: { $gte: startDate } },
        { createdAt: { $gte: startDate } } // New users are also active
      ]
    });
    console.log(`👥 Active users: ${activeUsers}`);

    // **3. Get New Users in Timeframe**
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });
    console.log(`👥 New users: ${newUsers}`);

    // **4. User Analysis Aggregation for detailed data**
    const userAnalysis = await User.aggregate([
      {
        $facet: {
          // Users by role
          usersByRole: [
            { $group: { _id: "$role", count: { $sum: 1 } } }
          ],
          
          // New users per day for chart
          newUsersByDay: [
            { 
              $match: { 
                createdAt: { $gte: startDate } 
              } 
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ],
          
          // Users by status
          usersByStatus: [
            { 
              $group: { 
                _id: { 
                  $cond: [
                    { $eq: ["$isActive", true] },
                    "active",
                    "inactive"
                  ]
                }, 
                count: { $sum: 1 } 
              } 
            }
          ],
          
          // Top users by activity
          topActiveUsers: [
            {
              $match: {
                $or: [
                  { lastLogin: { $gte: startDate } },
                  { createdAt: { $gte: startDate } }
                ]
              }
            },
            {
              $lookup: {
                from: "notes",
                localField: "_id",
                foreignField: "userId",
                as: "userNotes"
              }
            },
            {
              $project: {
                name: 1,
                email: 1,
                role: 1,
                lastLogin: 1,
                createdAt: 1,
                noteCount: { $size: "$userNotes" }
              }
            },
            { $sort: { lastLogin: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ]);

    // **5. Notes Analysis**
    const notesAnalysis = await Notes.aggregate([
      {
        $facet: {
          totalNotes: [{ $count: "count" }],
          
          recentNotes: [
            { 
              $match: { 
                createdAt: { $gte: startDate } 
              } 
            },
            { $count: "count" }
          ],
          
          notesByCategory: [
            { 
              $match: { 
                category: { $exists: true, $ne: null } 
              } 
            },
            { $group: { _id: "$category", count: { $sum: 1 } } }
          ],
          
          notesByDay: [
            { 
              $match: { 
                createdAt: { $gte: startDate } 
              } 
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ],
          
          topUsersByNotes: [
            {
              $match: {
                userId: { $exists: true, $ne: null }
              }
            },
            {
              $group: {
                _id: "$userId",
                noteCount: { $sum: 1 },
                lastCreated: { $max: "$createdAt" }
              }
            },
            { $sort: { noteCount: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDetails"
              }
            },
            {
              $unwind: {
                path: "$userDetails",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                userId: "$_id",
                noteCount: 1,
                lastCreated: 1,
                name: "$userDetails.name",
                email: "$userDetails.email",
                role: "$userDetails.role"
              }
            }
          ]
        }
      }
    ]);

    // **6. Engagement Analysis**
    const engagementAnalysis = await User.aggregate([
      {
        $match: {
          $or: [
            { lastLogin: { $gte: startDate } },
            { createdAt: { $gte: startDate } }
          ]
        }
      },
      {
        $lookup: {
          from: "notes",
          localField: "_id",
          foreignField: "userId",
          as: "userNotes"
        }
      },
      {
        $facet: {
          usersWithNoNotes: [
            {
              $match: {
                userNotes: { $size: 0 }
              }
            },
            { $count: "count" }
          ],
          
          usersWithManyNotes: [
            {
              $match: {
                $expr: {
                  $gt: [{ $size: "$userNotes" }, 20]
                }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    // **7. Calculate Growth Rate**
    const newUsersByDay = userAnalysis[0]?.newUsersByDay || [];
    const growthRate = calculateGrowthRate(newUsersByDay, totalUsers);

    // **8. Calculate Engagement Score**
    const recentNotes = notesAnalysis[0]?.recentNotes[0]?.count || 0;
    const engagementScore = calculateEngagementScore(activeUsers, recentNotes, totalUsers);

    // **9. Prepare System Overview**
    const systemOverview = {
      databaseStats: {
        totalUsers: totalUsers,
        totalNotes: notesAnalysis[0]?.totalNotes[0]?.count || 0,
        activeUsers: activeUsers,
        recentNotes: recentNotes,
        recentUsers: newUsers,
        userGrowthRate: growthRate
      }
    };

    console.log('📊 Final Summary:', {
      totalUsers: systemOverview.databaseStats.totalUsers,
      activeUsers: systemOverview.databaseStats.activeUsers,
      recentNotes: systemOverview.databaseStats.recentNotes,
      recentUsers: systemOverview.databaseStats.recentUsers,
      growthRate: systemOverview.databaseStats.userGrowthRate,
      engagementScore
    });

    console.log('✅ Analysis completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Analysis data retrieved successfully',
      data: {
        systemOverview,
        userAnalysis: {
          ...userAnalysis[0],
          totalUsers: [{ count: totalUsers }],
          activeUsers: [{ count: activeUsers }],
          newUsers: [{ count: newUsers }]
        },
        notesAnalysis: notesAnalysis[0],
        engagementAnalysis: engagementAnalysis[0],
        summary: {
          activeUserPercentage: totalUsers > 0 
            ? Math.round((activeUsers / totalUsers) * 100)
            : 0,
          notesPerActiveUser: activeUsers > 0 
            ? (recentNotes / activeUsers).toFixed(1)
            : '0.0',
          growthRate: growthRate,
          engagementScore: engagementScore
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Analysis error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Improved growth rate calculation
function calculateGrowthRate(dailyData: any[], totalUsers: number): number {
  if (dailyData.length === 0) return 0;
  
  // Calculate total new users from daily data
  const totalNewUsers = dailyData.reduce((sum, day) => sum + (day?.count || 0), 0);
  
  if (totalNewUsers === 0) return 0;
  
  // If we have historical data, calculate weekly comparison
  if (dailyData.length >= 7) {
    const firstWeek = dailyData.slice(0, 7).reduce((sum, day) => sum + (day.count || 0), 0);
    const lastWeek = dailyData.slice(-7).reduce((sum, day) => sum + (day.count || 0), 0);
    
    if (firstWeek > 0) {
      return parseFloat((((lastWeek - firstWeek) / firstWeek) * 100).toFixed(1));
    }
  }
  
  // Simple growth calculation based on new users vs total
  const existingUsers = Math.max(totalUsers - totalNewUsers, 0);
  if (existingUsers > 0) {
    return parseFloat(((totalNewUsers / existingUsers) * 100).toFixed(1));
  }
  
  return totalNewUsers > 0 ? 100 : 0;
}

// Improved engagement score calculation
function calculateEngagementScore(activeUsers: number, recentNotes: number, totalUsers: number): number {
  if (totalUsers === 0) return 0;
  
  // Calculate base scores
  const activityRate = (activeUsers / totalUsers) * 100;
  const notesRate = Math.min((recentNotes / totalUsers) * 50, 100); // Cap at 100
  
  // Weighted average
  const score = (activityRate * 0.6) + (notesRate * 0.4);
  
  return Math.round(Math.min(score, 100)); // Cap at 100
}