// app/api/advance/customer-360/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import AdvancedCustomer from '@/models/AdvancedCustomer'
import Customer from '@/models/Customer'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) {
    throw new Error('Authentication required')
  }
  
  const decoded = verifyToken(token)
  await connectToDatabase()
  return { userId: decoded.userId }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/advance/customer-360/analytics - Starting...')
    
    const { userId } = await verifyAuth(request)
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // day, week, month, year
    
    // Calculate date ranges
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }
    
    // 1. Customer segmentation analytics
    const segmentation = await AdvancedCustomer.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          byLifecycle: [
            { $group: { _id: '$lifecycleStage', count: { $sum: 1 } } }
          ],
          byLoyalty: [
            { $group: { _id: '$loyaltyLevel', count: { $sum: 1 } } }
          ],
          byScore: [
            {
              $bucket: {
                groupBy: '$customerScore',
                boundaries: [0, 25, 50, 75, 100],
                default: 'Other',
                output: {
                  count: { $sum: 1 },
                  avgScore: { $avg: '$customerScore' }
                }
              }
            }
          ]
        }
      }
    ])
    
    // 2. Communication analytics
    const communicationStats = await AdvancedCustomer.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$communications' },
      {
        $group: {
          _id: {
            type: '$communications.type',
            outcome: '$communications.outcome'
          },
          count: { $sum: 1 },
          avgDuration: { $avg: '$communications.duration' }
        }
      },
      {
        $group: {
          _id: '$_id.type',
          outcomes: {
            $push: {
              outcome: '$_id.outcome',
              count: '$count'
            }
          },
          total: { $sum: '$count' },
          avgDuration: { $avg: '$avgDuration' }
        }
      }
    ])
    
    // 3. Customer value over time
    const valueTrend = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$grandTotal' },
          orders: { $sum: 1 },
          customers: { $addToSet: '$customer.customerId' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          revenue: 1,
          orders: 1,
          customerCount: { $size: '$customers' }
        }
      }
    ])
    
    // 4. Top customers by value
    const topCustomers = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$customer.customerId',
          name: { $first: '$customer.name' },
          email: { $first: '$customer.email' },
          totalSpent: { $sum: '$grandTotal' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$grandTotal' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ])
    
    // 5. Customer acquisition and churn
    const customerActivity = await Customer.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          newCustomers: [
            {
              $match: {
                createdAt: { $gte: startDate }
              }
            },
            { $count: 'count' }
          ],
          activeCustomers: [
            {
              $match: {
                lastOrderDate: { $gte: startDate },
                totalOrders: { $gt: 0 }
              }
            },
            { $count: 'count' }
          ],
          atRiskCustomers: [
            {
              $match: {
                lastOrderDate: { $lt: startDate },
                totalOrders: { $gt: 0 }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ])
    
    // 6. Customer satisfaction indicators
    const satisfaction = {
      highValueCustomers: topCustomers.filter(c => c.totalSpent > 10000).length,
      repeatCustomers: topCustomers.filter(c => c.orderCount > 3).length,
      avgOrderFrequency: valueTrend.length > 0 ? 
        valueTrend.reduce((sum, day) => sum + day.orders, 0) / valueTrend.length : 0
    }
    
    return NextResponse.json({
      success: true,
      data: {
        segmentation: segmentation[0] || {},
        communicationStats,
        valueTrend,
        topCustomers,
        customerActivity: customerActivity[0] || {},
        satisfaction,
        summary: {
          totalRevenue: valueTrend.reduce((sum, day) => sum + day.revenue, 0),
          totalOrders: valueTrend.reduce((sum, day) => sum + day.orders, 0),
          avgOrderValue: valueTrend.length > 0 ? 
            valueTrend.reduce((sum, day) => sum + day.revenue, 0) / 
            valueTrend.reduce((sum, day) => sum + day.orders, 0) : 0
        }
      }
    })
    
  } catch (error: any) {
    console.error('❌ Customer analytics GET error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}