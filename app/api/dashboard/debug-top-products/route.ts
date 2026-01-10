// app/api/dashboard/debug-top-products/route.ts - DEBUG VERSION
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: GET /api/dashboard/debug-top-products - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(authToken)
    const userId = decoded.userId
    console.log('👤 DEBUG: User ID:', userId)
    
    await connectToDatabase()

    // Get ALL orders for debugging
    const orders = await Order.find({
      userId: userId
    }).lean()

    console.log(`📦 DEBUG: Total orders found: ${orders.length}`)

    // Analyze order structure
    const analysis = {
      totalOrders: orders.length,
      ordersWithItems: 0,
      totalItems: 0,
      orderStatuses: {},
      itemStructures: {},
      sampleItems: []
    }

    orders.forEach(order => {
      // Count statuses
      analysis.orderStatuses[order.status] = (analysis.orderStatuses[order.status] || 0) + 1
      
      // Check if order has items
      if (order.items && Array.isArray(order.items)) {
        analysis.ordersWithItems++
        analysis.totalItems += order.items.length
        
        // Analyze first few items to understand structure
        order.items.slice(0, 2).forEach((item, index) => {
          const itemKey = `item_${index}`
          analysis.itemStructures[itemKey] = Object.keys(item)
          
          // Store a sample item
          if (analysis.sampleItems.length < 3) {
            analysis.sampleItems.push({
              orderId: order._id,
              orderStatus: order.status,
              itemStructure: Object.keys(item),
              itemData: item
            })
          }
        })
      }
    })

    // Get detailed sample of 5 orders
    const sampleOrders = orders.slice(0, 5).map(order => ({
      _id: order._id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      totalAmount: order.totalAmount,
      items: order.items ? order.items.slice(0, 3) : []
    }))

    const debugData = {
      analysis,
      sampleOrders,
      totalOrders: orders.length
    }

    console.log('🔍 DEBUG Analysis:', JSON.stringify(debugData, null, 2))

    return NextResponse.json(debugData)

  } catch (error: any) {
    console.error('❌ DEBUG Error:', error)
    return NextResponse.json(
      { 
        message: 'Debug error',
        error: error.message 
      },
      { status: 500 }
    )
  }
}