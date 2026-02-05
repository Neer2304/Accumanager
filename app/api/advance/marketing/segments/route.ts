import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import Customer from '@/models/Customer'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('👥 GET /api/advance/marketing/segments - Fetching segments...')
    
    // Authentication
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    await connectToDatabase()

    // Get user
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'User not found' 
      }, { status: 404 })
    }

    // Get customers and orders for segment calculations
    const customers = await Customer.find({ userId: user._id }).lean()
    const orders = await Order.find({ userId: user._id }).lean()

    // Calculate customer metrics for segmentation
    const customerMetrics = await Promise.all(customers.map(async (customer) => {
      const customerOrders = orders.filter(order => 
        order.customerId?.toString() === customer._id.toString()
      )
      
      const totalSpent = customerOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0)
      const orderCount = customerOrders.length
      const lastOrderDate = customerOrders.length > 0 
        ? new Date(Math.max(...customerOrders.map(o => new Date(o.createdAt || o.createdDate).getTime())))
        : null
      
      const daysSinceLastOrder = lastOrderDate 
        ? Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
        : Infinity
      
      const daysSinceSignup = Math.floor((Date.now() - new Date(customer.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        customerId: customer._id,
        totalSpent,
        orderCount,
        daysSinceLastOrder,
        daysSinceSignup,
        lastOrderDate,
        email: customer.email,
        phone: customer.phone,
        createdAt: new Date(customer.createdAt || Date.now()),
      }
    }))

    // Generate dynamic segments based on actual data
    const segments = [
      {
        _id: 'all_customers',
        name: 'All Customers',
        type: 'static',
        customerCount: customers.length,
        criteria: [
          { field: 'status', operator: '=', value: 'active' }
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        _id: 'active_customers',
        name: 'Active Customers',
        type: 'dynamic',
        customerCount: customerMetrics.filter(c => c.orderCount > 0 && c.daysSinceLastOrder <= 90).length,
        criteria: [
          { field: 'last_purchase_date', operator: '<=', value: '90_days_ago' },
          { field: 'order_count', operator: '>', value: 0 }
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        _id: 'new_customers',
        name: 'New Customers',
        type: 'dynamic',
        customerCount: customerMetrics.filter(c => c.daysSinceSignup <= 30).length,
        criteria: [
          { field: 'signup_date', operator: '>=', value: '30_days_ago' }
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        _id: 'frequent_buyers',
        name: 'Frequent Buyers',
        type: 'dynamic',
        customerCount: customerMetrics.filter(c => c.orderCount >= 3).length,
        criteria: [
          { field: 'order_count', operator: '>=', value: 3 },
          { field: 'last_purchase_date', operator: '<=', value: '180_days_ago' }
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        _id: 'high_value',
        name: 'High Value Customers',
        type: 'dynamic',
        customerCount: customerMetrics.filter(c => c.totalSpent >= 5000).length,
        criteria: [
          { field: 'total_spent', operator: '>=', value: 5000 }
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        _id: 'inactive_customers',
        name: 'Inactive Customers',
        type: 'dynamic',
        customerCount: customerMetrics.filter(c => c.daysSinceLastOrder > 90 && c.orderCount > 0).length,
        criteria: [
          { field: 'last_purchase_date', operator: '>', value: '90_days_ago' },
          { field: 'order_count', operator: '>', value: 0 }
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        _id: 'recent_purchasers',
        name: 'Recent Purchasers',
        type: 'dynamic',
        customerCount: customerMetrics.filter(c => c.daysSinceLastOrder <= 30 && c.orderCount > 0).length,
        criteria: [
          { field: 'last_purchase_date', operator: '<=', value: '30_days_ago' },
          { field: 'order_count', operator: '>=', value: 1 }
        ],
        lastUpdated: new Date().toISOString(),
      },
    ].filter(segment => segment.customerCount > 0) // Only include segments with customers

    console.log(`✅ Generated ${segments.length} segments for ${customers.length} customers`)

    return NextResponse.json({
      success: true,
      data: segments,
      message: 'Segments fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Segments GET error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  const authToken = request.cookies.get('auth_token')?.value
  if (authToken) {
    return authToken
  }
  
  return null
}