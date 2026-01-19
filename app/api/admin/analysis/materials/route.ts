// app/api/admin/analysis/materials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material from '@/models/Material';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    console.log('📦 GET /api/admin/analysis/materials - Starting...');

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
    console.log('✅ Database connected for materials analysis');

    // Get timeframe from query params
    const searchParams = request.nextUrl.searchParams;
    const timeframe = parseInt(searchParams.get('timeframe') || '30'); // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframe);

    // **1. Material Usage Analysis**
    const materialAnalysis = await Material.aggregate([
      {
        $facet: {
          // Total materials created
          totalMaterials: [{ $count: "count" }],
          
          // Materials created in timeframe
          recentMaterials: [
            { 
              $match: { 
                createdAt: { $gte: startDate } 
              } 
            },
            { $count: "count" }
          ],
          
          // Materials by category
          materialsByCategory: [
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // Materials by status
          materialsByStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          
          // Daily materials creation
          materialsByDay: [
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
                count: { $sum: 1 },
                totalValue: { $sum: "$totalValue" }
              }
            },
            { $sort: { _id: 1 } }
          ],
          
          // Top users by materials count
          topUsersByMaterials: [
            {
              $group: {
                _id: "$userId",
                materialCount: { $sum: 1 },
                totalInventoryValue: { $sum: "$totalValue" },
                avgUnitCost: { $avg: "$unitCost" },
                lastCreated: { $max: "$createdAt" }
              }
            },
            { $sort: { materialCount: -1 } },
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
                materialCount: 1,
                totalInventoryValue: 1,
                avgUnitCost: 1,
                lastCreated: 1,
                userDetails: {
                  $arrayElemAt: ["$userDetails", 0]
                }
              }
            },
            {
              $project: {
                userId: 1,
                materialCount: 1,
                totalInventoryValue: 1,
                avgUnitCost: 1,
                lastCreated: 1,
                name: "$userDetails.name",
                email: "$userDetails.email",
                company: "$userDetails.company"
              }
            }
          ],
          
          // Stock statistics
          stockStatistics: [
            {
              $group: {
                _id: null,
                totalStockValue: { $sum: "$totalValue" },
                avgCurrentStock: { $avg: "$currentStock" },
                totalLowStockItems: { 
                  $sum: { $cond: [{ $eq: ["$status", "low-stock"] }, 1, 0] }
                },
                totalOutOfStockItems: { 
                  $sum: { $cond: [{ $eq: ["$status", "out-of-stock"] }, 1, 0] }
                },
                avgReorderPoint: { $avg: "$reorderPoint" }
              }
            }
          ],
          
          // Category value breakdown
          categoryValue: [
            {
              $group: {
                _id: "$category",
                itemCount: { $sum: 1 },
                totalValue: { $sum: "$totalValue" },
                avgStock: { $avg: "$currentStock" }
              }
            },
            { $sort: { totalValue: -1 } }
          ],
          
          // Price range distribution
          priceDistribution: [
            {
              $bucket: {
                groupBy: "$unitCost",
                boundaries: [0, 10, 50, 100, 500, 1000, 5000, 10000],
                default: "Above 10000",
                output: {
                  count: { $sum: 1 },
                  totalValue: { $sum: "$totalValue" }
                }
              }
            }
          ]
        }
      }
    ]);

    // **2. User Engagement with Materials**
    const userEngagement = await User.aggregate([
      {
        $lookup: {
          from: "materials",
          localField: "_id",
          foreignField: "userId",
          as: "userMaterials"
        }
      },
      {
        $facet: {
          // Users with no materials
          usersWithNoMaterials: [
            {
              $match: {
                userMaterials: { $size: 0 }
              }
            },
            { $count: "count" }
          ],
          
          // Users with 1-10 materials
          usersWithFewMaterials: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gt: [{ $size: "$userMaterials" }, 0] },
                    { $lte: [{ $size: "$userMaterials" }, 10] }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          
          // Users with 11-50 materials
          usersWithModerateMaterials: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gt: [{ $size: "$userMaterials" }, 10] },
                    { $lte: [{ $size: "$userMaterials" }, 50] }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          
          // Users with 50+ materials
          usersWithManyMaterials: [
            {
              $match: {
                $expr: {
                  $gt: [{ $size: "$userMaterials" }, 50]
                }
              }
            },
            { $count: "count" }
          ],
          
          // Materials per user distribution
          materialsPerUser: [
            {
              $project: {
                name: 1,
                email: 1,
                materialCount: { $size: "$userMaterials" },
                totalValue: {
                  $sum: "$userMaterials.totalValue"
                },
                lastMaterialCreated: {
                  $max: "$userMaterials.createdAt"
                }
              }
            },
            {
              $match: {
                materialCount: { $gt: 0 }
              }
            },
            {
              $group: {
                _id: null,
                avgMaterialsPerUser: { $avg: "$materialCount" },
                maxMaterialsPerUser: { $max: "$materialCount" },
                minMaterialsPerUser: { $min: "$materialCount" },
                avgInventoryValue: { $avg: "$totalValue" },
                totalAnalyzedUsers: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    console.log('✅ Materials analysis completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Materials analysis data retrieved successfully',
      data: {
        materialAnalysis: materialAnalysis[0],
        userEngagement: userEngagement[0],
        summary: {
          totalMaterials: materialAnalysis[0]?.totalMaterials[0]?.count || 0,
          recentMaterials: materialAnalysis[0]?.recentMaterials[0]?.count || 0,
          totalStockValue: materialAnalysis[0]?.stockStatistics[0]?.totalStockValue || 0,
          lowStockItems: materialAnalysis[0]?.stockStatistics[0]?.totalLowStockItems || 0,
          outOfStockItems: materialAnalysis[0]?.stockStatistics[0]?.totalOutOfStockItems || 0,
          avgMaterialsPerUser: userEngagement[0]?.materialsPerUser[0]?.avgMaterialsPerUser || 0,
          materialGrowthRate: calculateGrowthRate(materialAnalysis[0]?.materialsByDay || []),
          activeMaterialUsers: calculateActiveMaterialUsers(userEngagement[0])
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Materials analysis error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateGrowthRate(dailyData: any[]): number {
  if (dailyData.length < 2) return 0;
  
  const firstWeek = dailyData.slice(0, 7).reduce((sum, day) => sum + (day.count || 0), 0);
  const lastWeek = dailyData.slice(-7).reduce((sum, day) => sum + (day.count || 0), 0);
  
  if (firstWeek === 0) return lastWeek > 0 ? 100 : 0;
  
  return Math.round(((lastWeek - firstWeek) / firstWeek) * 100);
}

function calculateActiveMaterialUsers(userEngagement: any): number {
  let activeUsers = 0;
  
  if (userEngagement?.usersWithFewMaterials?.[0]?.count) {
    activeUsers += userEngagement.usersWithFewMaterials[0].count;
  }
  
  if (userEngagement?.usersWithModerateMaterials?.[0]?.count) {
    activeUsers += userEngagement.usersWithModerateMaterials[0].count;
  }
  
  if (userEngagement?.usersWithManyMaterials?.[0]?.count) {
    activeUsers += userEngagement.usersWithManyMaterials[0].count;
  }
  
  return activeUsers;
}