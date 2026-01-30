// app/api/billing/summary/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/billing/summary - Starting...')
    
    // Check authentication
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = verifyToken(authToken)
    const userId = decoded.userId

    await connectToDatabase()

    // Get date range from query params
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, week, year, all

    let startDate = new Date()
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      case 'all':
        startDate = new Date(0) // Beginning of time
        break
    }

    // Get summary data
    const summary = await Order.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalRevenue: { $sum: '$grandTotal' },
          totalDiscount: { $sum: '$totalDiscount' },
          totalTax: { $sum: { $add: ['$totalCgst', '$totalSgst', '$totalIgst'] } },
          pendingAmount: {
            $sum: {
              $cond: [
                { $eq: ['$paymentStatus', 'pending'] },
                '$grandTotal',
                0
              ]
            }
          },
          partiallyPaidAmount: {
            $sum: {
              $cond: [
                { $eq: ['$paymentStatus', 'partially_paid'] },
                '$grandTotal',
                0
              ]
            }
          }
        }
      }
    ])

    // Get status counts
    const statusCounts = await Order.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Get payment method counts
    const paymentMethodCounts = await Order.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$grandTotal' }
        }
      }
    ])

    // Get recent invoices
    const recentInvoices = await Order.find({
      userId: userId,
      createdAt: { $gte: startDate }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('invoiceNumber invoiceDate customer.name customer.phone grandTotal paymentStatus status')
    .lean()

    const result = {
      summary: summary[0] || {
        totalInvoices: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalTax: 0,
        pendingAmount: 0,
        partiallyPaidAmount: 0
      },
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count
        return acc
      }, {}),
      paymentMethodCounts,
      recentInvoices,
      period
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Summary fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Get billing summary error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}