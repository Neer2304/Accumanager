// app/api/dashboard/test-data/route.ts - TEST YOUR ORDER DATA
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 GET /api/dashboard/test-data - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(authToken)
      const userId = decoded.userId
      
      await connectToDatabase()

      // Get ALL orders to see what data you have
      const allOrders = await Order.find({ userId }).lean()

      console.log(`📋 Found ${allOrders.length} total orders for user ${userId}`)

      // Show order structure
      const sampleOrder = allOrders.length > 0 ? allOrders[0] : null
      
      // Group orders by status
      const ordersByStatus: Record<string, any[]> = {}
      allOrders.forEach(order => {
        const status = order.status || 'unknown'
        if (!ordersByStatus[status]) {
          ordersByStatus[status] = []
        }
        ordersByStatus[status].push(order)
      })

      // Calculate totals
      const totals = {
        totalOrders: allOrders.length,
        completedOrders: allOrders.filter(o => o.status === 'completed').length,
        paidOrders: allOrders.filter(o => o.paymentStatus === 'paid').length,
        draftOrders: allOrders.filter(o => o.status === 'draft').length,
        totalRevenue: allOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0),
        paidRevenue: allOrders
          .filter(o => o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + (o.grandTotal || 0), 0)
      }

      return NextResponse.json({
        success: true,
        totals,
        statusBreakdown: ordersByStatus,
        sampleOrder,
        message: `Found ${allOrders.length} orders with ₹${totals.totalRevenue} total revenue`
      })
      
    } catch (authError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Test data error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}