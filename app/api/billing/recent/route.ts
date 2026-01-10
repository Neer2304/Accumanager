// app/api/billing/recent/route.ts - NEW ENDPOINT FOR RECENT ACTIVITY
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/billing/recent - Starting...')
    
    // Check authentication
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = verifyToken(authToken)
    const userId = decoded.userId

    await connectToDatabase()
    console.log('✅ Database connected for recent activity')

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const days = parseInt(searchParams.get('days') || '7')

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch recent orders
    const orders = await Order.find({
      userId: userId,
      createdAt: { $gte: startDate }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('_id invoiceNumber invoiceDate customer items subtotal totalDiscount grandTotal paymentMethod paymentStatus status notes createdAt updatedAt')
    .lean()

    console.log(`✅ Found ${orders.length} recent orders for user ${userId}`)

    // Transform data for frontend
    const transformedOrders = orders.map(order => ({
      _id: order._id.toString(),
      id: order._id.toString(),
      invoiceNumber: order.invoiceNumber,
      invoiceDate: order.invoiceDate,
      customer: {
        name: order.customer?.name || 'Customer',
        phone: order.customer?.phone || '',
        email: order.customer?.email || '',
        gstin: order.customer?.gstin || '',
        state: order.customer?.state || '',
        isInterState: order.customer?.isInterState || false
      },
      items: order.items?.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })) || [],
      subtotal: order.subtotal || 0,
      totalDiscount: order.totalDiscount || 0,
      grandTotal: order.grandTotal || 0,
      paymentMethod: order.paymentMethod || 'cash',
      paymentStatus: order.paymentStatus || 'pending',
      status: order.status || 'draft',
      notes: order.notes || '',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }))

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      count: transformedOrders.length,
      message: 'Recent orders fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Get recent orders error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        orders: []
      },
      { status: 500 }
    )
  }
}