// app/api/admin/analysis/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

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

    // **1. User Analysis**
    const userAnalysis = await User.aggregate([
      {
        $facet: {
          // Total users
          totalUsers: [{ $count: "count" }],
          
          // Active users (logged in within last timeframe)
          activeUsers: [
            { 
              $match: { 
                lastLogin: { $gte: startDate } 
              } 
            },
            { $count: "count" }
          ],
          
          // Users by role
          usersByRole: [
            { $group: { _id: "$role", count: { $sum: 1 } } }
          ],
          
          // New users per day
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
            { $group: { _id: "$isActive", count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    // **2. Notes Usage Analysis**
    const notesAnalysis = await Notes.aggregate([
      {
        $facet: {
          // Total notes
          totalNotes: [{ $count: "count" }],
          
          // Notes created in timeframe
          recentNotes: [
            { 
              $match: { 
                createdAt: { $gte: startDate } 
              } 
            },
            { $count: "count" }
          ],
          
          // Notes by category
          notesByCategory: [
            { $group: { _id: "$category", count: { $sum: 1 } } }
          ],
          
          // Notes by priority
          notesByPriority: [
            { $group: { _id: "$priority", count: { $sum: 1 } } }
          ],
          
          // Daily notes creation
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
          
          // Top users by notes count
          topUsersByNotes: [
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
              $project: {
                userId: "$_id",
                noteCount: 1,
                lastCreated: 1,
                userDetails: {
                  $arrayElemAt: ["$userDetails", 0]
                }
              }
            },
            {
              $project: {
                userId: 1,
                noteCount: 1,
                lastCreated: 1,
                name: "$userDetails.name",
                email: "$userDetails.email",
                role: "$userDetails.role"
              }
            }
          ],
          
          // Average notes per user
          avgNotesPerUser: [
            {
              $group: {
                _id: "$userId",
                noteCount: { $sum: 1 }
              }
            },
            {
              $group: {
                _id: null,
                avgNotes: { $avg: "$noteCount" },
                maxNotes: { $max: "$noteCount" },
                minNotes: { $min: "$noteCount" }
              }
            }
          ],
          
          // Notes by status
          notesByStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          
          // Shared notes statistics
          sharedNotesStats: [
            {
              $match: {
                sharedWith: { $exists: true, $ne: [] }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    // **3. User Engagement Analysis**
    const engagementAnalysis = await User.aggregate([
      {
        $match: {
          lastLogin: { $gte: startDate }
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
          // Users with no notes
          usersWithNoNotes: [
            {
              $match: {
                userNotes: { $size: 0 }
              }
            },
            { $count: "count" }
          ],
          
          // Users with 1-5 notes
          usersWithFewNotes: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gt: [{ $size: "$userNotes" }, 0] },
                    { $lte: [{ $size: "$userNotes" }, 5] }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          
          // Users with 6-20 notes
          usersWithModerateNotes: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gt: [{ $size: "$userNotes" }, 5] },
                    { $lte: [{ $size: "$userNotes" }, 20] }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          
          // Users with 20+ notes
          usersWithManyNotes: [
            {
              $match: {
                $expr: {
                  $gt: [{ $size: "$userNotes" }, 20]
                }
              }
            },
            { $count: "count" }
          ],
          
          // Average login frequency
          loginFrequency: [
            {
              $project: {
                name: 1,
                email: 1,
                loginCount: { $size: "$loginHistory" },
                lastLogin: 1,
                daysSinceLastLogin: {
                  $divide: [
                    { $subtract: [new Date(), "$lastLogin"] },
                    1000 * 60 * 60 * 24
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                avgLoginCount: { $avg: "$loginCount" },
                avgDaysSinceLogin: { $avg: "$daysSinceLastLogin" },
                totalUsers: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    // **4. System Overview**
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const systemOverview = {
      currentTime: now.toISOString(),
      timeframe: `${timeframe} days`,
      dataRange: {
        start: startDate.toISOString(),
        end: now.toISOString()
      },
      databaseStats: {
        totalUsers: userAnalysis[0]?.totalUsers[0]?.count || 0,
        totalNotes: notesAnalysis[0]?.totalNotes[0]?.count || 0,
        activeUsers: userAnalysis[0]?.activeUsers[0]?.count || 0,
        recentNotes: notesAnalysis[0]?.recentNotes[0]?.count || 0,
        sharedNotes: notesAnalysis[0]?.sharedNotesStats[0]?.count || 0
      }
    };

    console.log('✅ Analysis completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Analysis data retrieved successfully',
      data: {
        systemOverview,
        userAnalysis: userAnalysis[0],
        notesAnalysis: notesAnalysis[0],
        engagementAnalysis: engagementAnalysis[0],
        summary: {
          activeUserPercentage: userAnalysis[0]?.totalUsers[0]?.count 
            ? Math.round((userAnalysis[0]?.activeUsers[0]?.count / userAnalysis[0]?.totalUsers[0]?.count) * 100)
            : 0,
          notesPerActiveUser: userAnalysis[0]?.activeUsers[0]?.count 
            ? Math.round(notesAnalysis[0]?.recentNotes[0]?.count / userAnalysis[0]?.activeUsers[0]?.count)
            : 0,
          growthRate: calculateGrowthRate(userAnalysis[0]?.newUsersByDay || []),
          engagementScore: calculateEngagementScore(
            userAnalysis[0]?.activeUsers[0]?.count || 0,
            notesAnalysis[0]?.recentNotes[0]?.count || 0
          )
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

// Helper function to calculate growth rate
function calculateGrowthRate(dailyData: any[]): number {
  if (dailyData.length < 2) return 0;
  
  const firstDay = dailyData[0]?.count || 0;
  const lastDay = dailyData[dailyData.length - 1]?.count || 0;
  
  if (firstDay === 0) return lastDay > 0 ? 100 : 0;
  
  return Math.round(((lastDay - firstDay) / firstDay) * 100);
}

// Helper function to calculate engagement score (0-100)
function calculateEngagementScore(activeUsers: number, recentNotes: number): number {
  if (activeUsers === 0) return 0;
  
  const notesPerUser = recentNotes / activeUsers;
  let score = 0;
  
  if (notesPerUser >= 10) score = 100;
  else if (notesPerUser >= 5) score = 75;
  else if (notesPerUser >= 2) score = 50;
  else if (notesPerUser >= 1) score = 25;
  else if (notesPerUser > 0) score = 10;
  
  return score;
}