// app/api/dashboard/sales/route.ts - WORKING VERSION
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('📈 GET /api/dashboard/sales - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('❌ No auth token in sales data request')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(authToken)
      const userId = decoded.userId
      console.log('👤 Sales data for user:', userId)
      
      await connectToDatabase()
      console.log('✅ Database connected for sales data')

      const { searchParams } = new URL(request.url)
      const range = searchParams.get('range') || 'month'
      const includeDrafts = searchParams.get('includeDrafts') === 'true'

      // Calculate date range
      const now = new Date()
      const startDate = new Date()

      switch (range) {
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setDate(1) // Start from 1st of current month
          break
        case 'year':
          startDate.setFullYear(now.getFullYear(), 0, 1) // Start from Jan 1
          break
      }

      console.log(`📅 Date range: ${startDate.toISOString()} to ${now.toISOString()}`)

      // Build match query - USING BOTH invoiceDate AND createdAt
      const matchQuery: any = {
        userId: userId,
        $or: [
          { invoiceDate: { $gte: startDate, $lte: now } },
          { createdAt: { $gte: startDate, $lte: now } }
        ]
      }

      // If not including drafts, only get confirmed/paid orders
      if (!includeDrafts) {
        matchQuery.$and = [
          { status: { $in: ['completed', 'confirmed', 'paid', 'processed'] } },
          { paymentStatus: { $in: ['paid', 'completed'] } }
        ]
      }

      console.log('🔍 Match query:', JSON.stringify(matchQuery, null, 2))

      // FIRST: Get all orders to debug
      const allOrders = await Order.find({ userId }).limit(5).lean()
      console.log('🔍 Sample orders structure:')
      allOrders.forEach((order: any, index: number) => {
        console.log(`${index + 1}. ${order.invoiceNumber}:`, {
          invoiceDate: order.invoiceDate,
          createdAt: order.createdAt,
          grandTotal: order.grandTotal,
          status: order.status,
          paymentStatus: order.paymentStatus
        })
      })

      // Try aggregation with proper field handling
      let aggregationPipeline = []

      // Use invoiceDate if exists, otherwise use createdAt
      aggregationPipeline.push(
        {
          $match: {
            userId: userId,
            $or: [
              { invoiceDate: { $gte: startDate, $lte: now } },
              { createdAt: { $gte: startDate, $lte: now } }
            ]
          }
        }
      )

      // Add status filter if not including drafts
      if (!includeDrafts) {
        aggregationPipeline[0].$match.$and = [
          { status: { $in: ['completed', 'confirmed', 'paid', 'processed'] } },
          { paymentStatus: { $in: ['paid', 'completed'] } }
        ]
      }

      // Add grouping stage
      aggregationPipeline.push(
        {
          $group: {
            _id: {
              $dateToString: { 
                format: '%Y-%m-%d', 
                date: { $ifNull: ['$invoiceDate', '$createdAt'] }
              }
            },
            sales: { $sum: 1 },
            revenue: { $sum: { $ifNull: ['$grandTotal', 0] } },
            totalItems: { 
              $sum: { 
                $cond: [
                  { $isArray: '$items' },
                  { 
                    $reduce: {
                      input: '$items',
                      initialValue: 0,
                      in: { $add: ['$$value', { $ifNull: ['$$this.quantity', 0] }] }
                    }
                  },
                  0
                ]
              }
            }
          }
        }
      )

      aggregationPipeline.push({ $sort: { _id: 1 } })

      console.log('🔧 Aggregation pipeline:', JSON.stringify(aggregationPipeline, null, 2))

      const salesData = await Order.aggregate(aggregationPipeline)

      console.log(`📈 Aggregation result: ${salesData.length} data points`)
      console.log('📊 Sales data:', salesData)

      // If aggregation returns empty but we have orders, let's manually calculate
      if (salesData.length === 0) {
        console.log('🔄 Aggregation empty, checking with find...')
        const orders = await Order.find(matchQuery).lean()
        
        if (orders.length > 0) {
          console.log(`📦 Found ${orders.length} orders via find`)
          
          // Manually group orders by date
          const manualGrouping: Record<string, any> = {}
          
          orders.forEach((order: any) => {
            const dateKey = order.invoiceDate 
              ? new Date(order.invoiceDate).toISOString().split('T')[0]
              : new Date(order.createdAt).toISOString().split('T')[0]
            
            if (!manualGrouping[dateKey]) {
              manualGrouping[dateKey] = {
                sales: 0,
                revenue: 0,
                totalItems: 0
              }
            }
            
            manualGrouping[dateKey].sales += 1
            manualGrouping[dateKey].revenue += order.grandTotal || 0
            
            // Calculate total items
            if (Array.isArray(order.items)) {
              order.items.forEach((item: any) => {
                manualGrouping[dateKey].totalItems += item.quantity || 0
              })
            }
          })
          
          // Convert to array format
          const formattedData = Object.keys(manualGrouping)
            .sort()
            .map(date => ({
              date: date,
              sales: manualGrouping[date].sales,
              revenue: manualGrouping[date].revenue,
              totalItems: manualGrouping[date].totalItems
            }))
          
          console.log('📊 Manual grouping data:', formattedData)
          return NextResponse.json(formattedData)
        }
      }

      // Format the data for charts
      const formattedData = salesData.map((item: any) => ({
        date: item._id,
        sales: item.sales || 0,
        revenue: item.revenue || 0,
        totalItems: item.totalItems || 0
      }))

      console.log('📊 Final formatted data:', formattedData)

      return NextResponse.json(formattedData)
      
    } catch (authError) {
      console.error('❌ Auth error in sales data:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Sales data error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}