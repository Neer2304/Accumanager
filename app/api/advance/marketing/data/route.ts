import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import Customer from '@/models/Customer'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('📧 GET /api/advance/marketing/data - Starting...')
    
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

    // Get customers for segmentation
    const customers = await Customer.find({ userId: user._id }).lean()
    
    // Get orders for revenue calculation
    const orders = await Order.find({ userId: user._id }).lean()

    // Generate mock campaigns based on user's data
    const campaigns = generateCampaigns(user, customers, orders)
    
    // Generate email sequences
    const sequences = generateSequences(user, customers)
    
    // Generate customer segments
    const segments = generateSegments(customers, orders)
    
    // Calculate analytics
    const analytics = calculateAnalytics(campaigns, orders)

    return NextResponse.json({
      success: true,
      data: {
        campaigns,
        sequences,
        segments,
        analytics,
      },
      message: 'Marketing automation data fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Marketing Automation API error:', error)
    
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
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Check cookies
  const authToken = request.cookies.get('auth_token')?.value
  if (authToken) {
    return authToken
  }
  
  return null
}

function generateCampaigns(user: any, customers: any[], orders: any[]) {
  const customerCount = customers.length
  const orderCount = orders.length
  
  // Base campaigns for every user
  const baseCampaigns = [
    {
      id: '1',
      name: 'Welcome Series',
      type: 'email' as const,
      status: 'active' as const,
      segment: 'new_customers',
      recipients: customerCount,
      sent: Math.min(customerCount, 1000),
      delivered: Math.min(customerCount - 50, 950),
      opened: Math.floor(Math.min(customerCount - 50, 950) * 0.68),
      clicked: Math.floor(Math.min(customerCount - 50, 950) * 0.24),
      converted: Math.floor(Math.min(customerCount - 50, 950) * 0.12),
      revenue: Math.floor(Math.min(customerCount - 50, 950) * 0.12 * 500), // Assuming ₹500 avg order
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Product Recommendations',
      type: 'email' as const,
      status: 'active' as const,
      segment: 'recent_purchasers',
      recipients: Math.floor(customerCount * 0.3),
      sent: Math.floor(customerCount * 0.25),
      delivered: Math.floor(customerCount * 0.23),
      opened: Math.floor(customerCount * 0.23 * 0.55),
      clicked: Math.floor(customerCount * 0.23 * 0.18),
      converted: Math.floor(customerCount * 0.23 * 0.08),
      revenue: Math.floor(customerCount * 0.23 * 0.08 * 1200),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Abandoned Cart Recovery',
      type: 'sms' as const,
      status: 'paused' as const,
      segment: 'cart_abandoners',
      recipients: Math.floor(orderCount * 0.2),
      sent: Math.floor(orderCount * 0.15),
      delivered: Math.floor(orderCount * 0.14),
      opened: Math.floor(orderCount * 0.14 * 0.85), // Higher for SMS
      clicked: Math.floor(orderCount * 0.14 * 0.35),
      converted: Math.floor(orderCount * 0.14 * 0.15),
      revenue: Math.floor(orderCount * 0.14 * 0.15 * 2000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      name: 'Seasonal Sale',
      type: 'push' as const,
      status: 'completed' as const,
      segment: 'all_customers',
      recipients: customerCount,
      sent: Math.min(customerCount, 2000),
      delivered: Math.min(customerCount - 100, 1900),
      opened: Math.floor(Math.min(customerCount - 100, 1900) * 0.45),
      clicked: Math.floor(Math.min(customerCount - 100, 1900) * 0.22),
      converted: Math.floor(Math.min(customerCount - 100, 1900) * 0.10),
      revenue: Math.floor(Math.min(customerCount - 100, 1900) * 0.10 * 1500),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      name: 'Loyalty Program Launch',
      type: 'email' as const,
      status: 'draft' as const,
      segment: 'frequent_buyers',
      recipients: Math.floor(customerCount * 0.1),
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
    },
  ]

  // Filter out campaigns with no recipients if user has very few customers
  return baseCampaigns.filter(campaign => campaign.recipients > 0 || campaign.status === 'draft')
}

function generateSequences(user: any, customers: any[]) {
  const customerCount = customers.length
  
  return [
    {
      id: '1',
      name: 'Onboarding Sequence',
      steps: [
        { id: '1-1', step: 1, trigger: 'Sign Up', action: 'Welcome Email', delay: 'Immediate', delayType: 'hours', template: 'welcome' },
        { id: '1-2', step: 2, trigger: 'Day 1', action: 'Feature Introduction', delay: '1 day', delayType: 'days', template: 'tutorial' },
        { id: '1-3', step: 3, trigger: 'Day 3', action: 'Getting Started Guide', delay: '3 days', delayType: 'days', template: 'guide' },
        { id: '1-4', step: 4, trigger: 'Day 7', action: 'First Purchase Offer', delay: '7 days', delayType: 'days', template: 'offer' },
        { id: '1-5', step: 5, trigger: 'Day 14', action: 'Feedback Request', delay: '14 days', delayType: 'days', template: 'feedback' },
      ],
      status: 'active' as const,
      totalRecipients: customerCount,
      completionRate: 65,
    },
    {
      id: '2',
      name: 'Re-engagement Sequence',
      steps: [
        { id: '2-1', step: 1, trigger: '30 Days Inactive', action: 'We Miss You Email', delay: 'Immediate', delayType: 'hours', template: 'reengagement' },
        { id: '2-2', step: 2, trigger: 'Day 3', action: 'Special Offer', delay: '3 days', delayType: 'days', template: 'offer' },
        { id: '2-3', step: 3, trigger: 'Day 7', action: 'Last Chance Reminder', delay: '7 days', delayType: 'days', template: 'reminder' },
      ],
      status: 'active' as const,
      totalRecipients: Math.floor(customerCount * 0.2),
      completionRate: 42,
    },
    {
      id: '3',
      name: 'Win-back Sequence',
      steps: [
        { id: '3-1', step: 1, trigger: '90 Days Inactive', action: 'Come Back Offer', delay: 'Immediate', delayType: 'hours', template: 'winback' },
        { id: '3-2', step: 2, trigger: 'Day 7', action: 'Updated Features', delay: '7 days', delayType: 'days', template: 'features' },
        { id: '3-3', step: 3, trigger: 'Day 14', action: 'Final Attempt', delay: '14 days', delayType: 'days', template: 'final' },
      ],
      status: 'paused' as const,
      totalRecipients: Math.floor(customerCount * 0.05),
      completionRate: 28,
    },
  ]
}

function generateSegments(customers: any[], orders: any[]) {
  // Calculate customer metrics
  const customerMetrics = customers.map(customer => {
    const customerOrders = orders.filter(order => order.customerId?.toString() === customer._id.toString())
    const totalSpent = customerOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0)
    const orderCount = customerOrders.length
    const daysSinceLastOrder = customerOrders.length > 0 
      ? Math.floor((Date.now() - new Date(customerOrders[customerOrders.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : Infinity
    
    return {
      customerId: customer._id,
      totalSpent,
      orderCount,
      daysSinceLastOrder,
      createdAt: new Date(customer.createdAt || Date.now()),
    }
  })

  return [
    {
      id: 'new_customers',
      name: 'New Customers',
      type: 'dynamic' as const,
      customerCount: customerMetrics.filter(c => {
        const daysSinceSignup = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceSignup <= 30
      }).length,
      criteria: [
        { field: 'signup_date', operator: '>=', value: '30_days_ago' },
      ],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'frequent_buyers',
      name: 'Frequent Buyers',
      type: 'dynamic' as const,
      customerCount: customerMetrics.filter(c => c.orderCount >= 3).length,
      criteria: [
        { field: 'order_count', operator: '>=', value: 3 },
        { field: 'last_purchase_date', operator: '<=', value: '90_days_ago' },
      ],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'high_value',
      name: 'High Value Customers',
      type: 'dynamic' as const,
      customerCount: customerMetrics.filter(c => c.totalSpent >= 5000).length,
      criteria: [
        { field: 'total_spent', operator: '>=', value: 5000 },
      ],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'cart_abandoners',
      name: 'Cart Abandoners',
      type: 'static' as const,
      customerCount: Math.floor(customerMetrics.length * 0.15),
      criteria: [
        { field: 'cart_abandoned', operator: '=', value: true },
        { field: 'abandoned_date', operator: '>=', value: '7_days_ago' },
      ],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'inactive_customers',
      name: 'Inactive Customers',
      type: 'dynamic' as const,
      customerCount: customerMetrics.filter(c => c.daysSinceLastOrder > 90 && c.orderCount > 0).length,
      criteria: [
        { field: 'last_purchase_date', operator: '<=', value: '90_days_ago' },
        { field: 'order_count', operator: '>', value: 0 },
      ],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'recent_purchasers',
      name: 'Recent Purchasers',
      type: 'dynamic' as const,
      customerCount: customerMetrics.filter(c => c.daysSinceLastOrder <= 30).length,
      criteria: [
        { field: 'last_purchase_date', operator: '>=', value: '30_days_ago' },
        { field: 'order_count', operator: '>=', value: 1 },
      ],
      lastUpdated: new Date().toISOString(),
    },
  ]
}

function calculateAnalytics(campaigns: any[], orders: any[]) {
  const activeCampaigns = campaigns.filter(c => c.status === 'active')
  const completedCampaigns = campaigns.filter(c => c.status === 'completed')
  
  // Calculate average metrics
  const avgOpenRate = campaigns.length > 0
    ? campaigns.reduce((sum, c) => {
        const rate = c.sent > 0 ? (c.opened / c.sent * 100) : 0
        return sum + rate
      }, 0) / campaigns.length
    : 0

  const avgClickRate = campaigns.length > 0
    ? campaigns.reduce((sum, c) => {
        const rate = c.sent > 0 ? (c.clicked / c.sent * 100) : 0
        return sum + rate
      }, 0) / campaigns.length
    : 0

  const avgConversionRate = campaigns.length > 0
    ? campaigns.reduce((sum, c) => {
        const rate = c.sent > 0 ? (c.converted / c.sent * 100) : 0
        return sum + rate
      }, 0) / campaigns.length
    : 0

  // Calculate total revenue from completed campaigns
  const totalRevenue = completedCampaigns.reduce((sum, c) => sum + (c.revenue || 0), 0)

  // Get top performing campaigns
  const topPerforming = [...campaigns]
    .filter(c => c.status === 'completed')
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5)

  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: activeCampaigns.length,
    averageOpenRate: parseFloat(avgOpenRate.toFixed(1)),
    averageClickRate: parseFloat(avgClickRate.toFixed(1)),
    averageConversionRate: parseFloat(avgConversionRate.toFixed(1)),
    totalRevenue,
    topPerforming,
  }
}