import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import Customer from '@/models/Customer'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('💰 GET /api/advance/analytics/subscription - Starting...')
    
    // Debug logging for authentication
    console.log('🔍 Auth Debug Info:')
    console.log('- Authorization Header:', request.headers.get('authorization'))
    console.log('- Has auth_token cookie:', request.cookies.has('auth_token'))
    
    // Check authentication - try multiple sources
    let token: string | null = null
    
    // 1. Check Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
      console.log('✅ Token found in Authorization header')
    }
    
    // 2. Check cookies (if header not found)
    if (!token) {
      const authToken = request.cookies.get('auth_token')?.value
      if (authToken) {
        token = authToken
        console.log('✅ Token found in cookies')
      }
    }
    
    // 3. Check for token in query parameters (for debugging in development)
    if (!token && process.env.NODE_ENV === 'development') {
      const { searchParams } = new URL(request.url)
      const debugToken = searchParams.get('debug_token')
      if (debugToken) {
        token = debugToken
        console.log('⚠️ Using debug token from URL (development only)')
      }
    }
    
    if (!token) {
      console.log('❌ No authentication token found')
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required. Please log in again.' 
      }, { status: 401 })
    }

    // Verify the token
    let decoded
    try {
      decoded = verifyToken(token)
      console.log('✅ Token verified successfully, user ID:', decoded.userId)
    } catch (error: any) {
      console.error('❌ Token verification failed:', error.message)
      return NextResponse.json({ 
        success: false,
        message: 'Invalid or expired token. Please log in again.' 
      }, { status: 401 })
    }
    
    const userId = decoded.userId

    await connectToDatabase()
    console.log('✅ Database connected for subscription analytics')

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'monthly'
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    // Calculate date range based on timeRange
    let startDate: Date, endDate: Date = new Date()
    
    switch (timeRange) {
      case 'weekly':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'monthly':
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'quarterly':
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case 'yearly':
        startDate = new Date()
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      case 'custom':
        if (startDateParam && endDateParam) {
          startDate = new Date(startDateParam)
          endDate = new Date(endDateParam)
        } else {
          startDate = new Date()
          startDate.setMonth(startDate.getMonth() - 1)
        }
        break
      default:
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
    }

    console.log(`📅 Subscription Analytics period: ${startDate.toISOString()} to ${endDate.toISOString()}`)

    // Get the current user with their subscription data
    const user = await User.findOne({ _id: userId })
    if (!user) {
      console.log('❌ User not found:', userId)
      return NextResponse.json({ 
        success: false,
        message: 'User not found' 
      }, { status: 404 })
    }

    console.log('✅ User found:', user.email)
    
    // Get user's subscription data
    const userSubscription = user.subscription || {
      plan: 'trial',
      status: 'trial',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      autoRenew: false,
      features: [],
      lastPaymentDate: null,
      upiTransactionId: null
    }

    // Get all orders to calculate subscription revenue
    const orders = await Order.find({
      userId: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    }).lean()

    // Get customers to analyze subscription base
    const customers = await Customer.find({ userId: userId }).lean()

    console.log(`📊 Data loaded: ${orders.length} orders, ${customers.length} customers`)

    // Calculate subscription metrics based on user's subscription
    const subscriptionMetrics = calculateSubscriptionMetrics(userSubscription, orders)

    // Calculate customer metrics for subscription business
    const customerMetrics = calculateCustomerMetrics(customers, userSubscription, startDate, endDate)

    // Calculate revenue metrics
    const revenueMetrics = calculateRevenueMetrics(orders, userSubscription)

    // Calculate churn and retention (simplified for single user)
    const retentionMetrics = calculateRetentionMetrics(userSubscription, orders)

    // Monthly trend for subscription usage
    const monthlyTrend = calculateMonthlyTrend(orders, startDate, endDate, userSubscription)

    // Subscription health and insights
    const healthMetrics = calculateHealthMetrics(userSubscription)

    // Forecast based on current subscription
    const forecast = calculateForecast(userSubscription, orders)

    // Subscription details
    const subscriptionDetails = {
      plan: userSubscription.plan,
      status: userSubscription.status,
      currentPeriodStart: userSubscription.currentPeriodStart?.toISOString() || new Date().toISOString(),
      currentPeriodEnd: userSubscription.currentPeriodEnd?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      trialEndsAt: userSubscription.trialEndsAt?.toISOString() || null,
      autoRenew: userSubscription.autoRenew || false,
      features: userSubscription.features || [],
      lastPaymentDate: userSubscription.lastPaymentDate?.toISOString() || null,
      upiTransactionId: userSubscription.upiTransactionId || null
    }

    // Prepare response
    console.log('✅ Subscription Analytics data prepared successfully')

    return NextResponse.json({
      success: true,
      data: {
        // User's current subscription
        currentSubscription: subscriptionDetails,
        
        // Metrics
        subscriptionMetrics,
        customerMetrics,
        revenueMetrics,
        retentionMetrics,
        healthMetrics,
        
        // Trends and forecasts
        monthlyTrend,
        forecast,
        
        // Time period info
        timeRange,
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      },
      message: 'Subscription analytics data fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Subscription Analytics API error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required. Please log in again.' 
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

// Helper Functions (Keep these the same as before, but I'll include them for completeness)
function calculateSubscriptionMetrics(subscription: any, orders: any[]) {
  // Determine subscription value based on plan
  let monthlyAmount = 0
  switch (subscription.plan) {
    case 'trial':
      monthlyAmount = 0
      break
    case 'monthly':
      monthlyAmount = 499 // Example price
      break
    case 'quarterly':
      monthlyAmount = 1399 / 3 // Example: 1399 per quarter
      break
    case 'yearly':
      monthlyAmount = 4999 / 12 // Example: 4999 per year
      break
    default:
      monthlyAmount = 0
  }

  // Calculate MRR (Monthly Recurring Revenue)
  const mrr = subscription.status === 'active' ? monthlyAmount : 0
  const arr = mrr * 12 // Annual Recurring Revenue

  // Calculate total paid from orders
  const totalPaid = orders
    .filter(order => order.paymentStatus === 'paid' || order.paymentStatus === 'completed')
    .reduce((sum, order) => sum + (order.grandTotal || 0), 0)

  // Days remaining in subscription
  const daysRemaining = subscription.currentPeriodEnd 
    ? Math.max(0, Math.ceil((new Date(subscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  // Trial status
  const isTrial = subscription.plan === 'trial'
  const trialDaysRemaining = subscription.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(subscription.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return {
    plan: subscription.plan,
    status: subscription.status,
    monthlyAmount,
    mrr: Math.round(mrr),
    arr: Math.round(arr),
    totalPaid: Math.round(totalPaid),
    daysRemaining,
    isTrial,
    trialDaysRemaining,
    autoRenew: subscription.autoRenew,
    lastPaymentDate: subscription.lastPaymentDate,
    totalOrders: orders.length
  }
}

function calculateCustomerMetrics(customers: any[], subscription: any, startDate: Date, endDate: Date) {
  const totalCustomers = customers.length
  
  // Filter customers by subscription period
  const activeCustomers = customers.filter(customer => {
    const customerDate = new Date(customer.createdAt || customer.createdDate || Date.now())
    return customerDate >= startDate && customerDate <= endDate
  }).length

  // Customer lifetime value (simplified)
  const totalOrders = customers.reduce((sum, customer) => sum + (customer.totalOrders || 0), 0)
  const totalSpent = customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0)
  const avgCustomerValue = totalCustomers > 0 ? totalSpent / totalCustomers : 0

  // Customer segmentation based on subscription type
  const customerSegments = {
    premium: customers.filter(c => (c.totalSpent || 0) > 1000).length,
    regular: customers.filter(c => (c.totalSpent || 0) > 100 && (c.totalSpent || 0) <= 1000).length,
    new: customers.filter(c => (c.totalOrders || 0) <= 1).length,
    returning: customers.filter(c => (c.totalOrders || 0) > 1).length
  }

  // Calculate new customers in current period
  const newCustomers = customers.filter(customer => {
    const customerDate = new Date(customer.createdAt || customer.createdDate || Date.now())
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    return customerDate >= oneMonthAgo
  }).length

  return {
    totalCustomers,
    activeCustomers,
    newCustomers,
    totalOrders,
    totalSpent: Math.round(totalSpent),
    avgCustomerValue: Math.round(avgCustomerValue),
    customerSegments
  }
}

function calculateRevenueMetrics(orders: any[], subscription: any) {
  // Filter paid orders
  const paidOrders = orders.filter(order => 
    order.paymentStatus === 'paid' || order.paymentStatus === 'completed'
  )

  const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0)
  const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0
  
  // Monthly revenue trend
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  const monthlyRevenue = paidOrders
    .filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= currentMonthStart && orderDate <= currentMonthEnd
    })
    .reduce((sum, order) => sum + (order.grandTotal || 0), 0)

  // Revenue growth (simplified)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  
  const previousMonthRevenue = paidOrders
    .filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= previousMonthStart && orderDate <= previousMonthEnd
    })
    .reduce((sum, order) => sum + (order.grandTotal || 0), 0)

  const revenueGrowth = previousMonthRevenue > 0
    ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
    : monthlyRevenue > 0 ? 100 : 0

  // Revenue by payment method
  const revenueByMethod = paidOrders.reduce((acc, order) => {
    const method = order.paymentMethod || 'cash'
    acc[method] = (acc[method] || 0) + (order.grandTotal || 0)
    return acc
  }, {} as Record<string, number>)

  return {
    totalRevenue: Math.round(totalRevenue),
    monthlyRevenue: Math.round(monthlyRevenue),
    avgOrderValue: Math.round(avgOrderValue),
    revenueGrowth: Math.round(revenueGrowth),
    revenueByMethod: Object.entries(revenueByMethod).map(([method, amount]) => ({
      method,
      amount: Math.round(amount),
      percentage: Math.round((amount / (totalRevenue || 1)) * 100) || 0
    })),
    totalOrders: paidOrders.length
  }
}

function calculateRetentionMetrics(subscription: any, orders: any[]) {
  // Simplified retention calculation for single user
  const orderDates = orders
    .filter(order => order.paymentStatus === 'paid' || order.paymentStatus === 'completed')
    .map(order => new Date(order.createdAt))
    .sort((a, b) => a.getTime() - b.getTime())

  if (orderDates.length < 2) {
    return {
      retentionRate: '100%',
      churnRisk: 'low',
      churnProbability: 0,
      customerLifetime: 0,
      repeatPurchaseRate: '0%',
      avgDaysBetweenOrders: 0,
      totalPurchases: orderDates.length
    }
  }

  // Calculate days between orders
  const daysBetweenOrders: number[] = []
  for (let i = 1; i < orderDates.length; i++) {
    const diff = (orderDates[i].getTime() - orderDates[i-1].getTime()) / (1000 * 60 * 60 * 24)
    daysBetweenOrders.push(diff)
  }

  const avgDaysBetweenOrders = daysBetweenOrders.length > 0
    ? daysBetweenOrders.reduce((a, b) => a + b, 0) / daysBetweenOrders.length
    : 0

  // Determine churn risk based on subscription status and order pattern
  let churnRisk = 'low'
  let churnProbability = 0
  
  if (subscription.status === 'trial' && subscription.trialEndsAt) {
    const daysToTrialEnd = Math.ceil((new Date(subscription.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysToTrialEnd < 3) {
      churnRisk = 'high'
      churnProbability = 80
    } else if (daysToTrialEnd < 7) {
      churnRisk = 'medium'
      churnProbability = 50
    } else if (daysToTrialEnd < 14) {
      churnRisk = 'low'
      churnProbability = 20
    }
  } else if (avgDaysBetweenOrders > 30 && subscription.status === 'active') {
    churnRisk = 'medium'
    churnProbability = 40
  }

  // Calculate retention and repeat purchase rates
  const retentionRate = '95%' // Simplified
  const repeatPurchaseRate = orderDates.length > 1 ? '80%' : '0%'

  return {
    retentionRate,
    churnRisk,
    churnProbability,
    customerLifetime: Math.round(avgDaysBetweenOrders),
    repeatPurchaseRate,
    avgDaysBetweenOrders: Math.round(avgDaysBetweenOrders),
    totalPurchases: orderDates.length
  }
}

function calculateMonthlyTrend(orders: any[], startDate: Date, endDate: Date, subscription: any) {
  const monthlyTrend = []
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // Get last 6 months
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const month = new Date()
    month.setMonth(now.getMonth() - i)
    const monthName = monthNames[month.getMonth()]
    const monthYear = month.getFullYear()
    
    // Orders for this month
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate.getMonth() === month.getMonth() && 
             orderDate.getFullYear() === month.getFullYear()
    })
    
    const monthRevenue = monthOrders
      .filter(order => order.paymentStatus === 'paid' || order.paymentStatus === 'completed')
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0)
    
    // Count unique customers for this month
    const customerIds = new Set()
    monthOrders.forEach(order => {
      if (order.customerId) customerIds.add(order.customerId.toString())
      if (order.customer?._id) customerIds.add(order.customer._id.toString())
    })
    const monthCustomers = customerIds.size
    
    // Subscription status for this month (simplified)
    const subscriptionActive = subscription.status === 'active' || 
      (subscription.plan === 'trial' && subscription.trialEndsAt && new Date(subscription.trialEndsAt) > month)

    monthlyTrend.push({
      month: monthName,
      year: monthYear,
      revenue: Math.round(monthRevenue),
      customers: monthCustomers,
      orders: monthOrders.length,
      subscriptionActive,
      avgOrderValue: monthOrders.length > 0 ? Math.round(monthRevenue / monthOrders.length) : 0
    })
  }
  
  return monthlyTrend
}

function calculateHealthMetrics(subscription: any) {
  const now = new Date()
  const health = {
    status: 'healthy',
    score: 85, // out of 100
    issues: [] as string[],
    recommendations: [] as string[]
  }

  // Check subscription status
  if (subscription.status === 'trial') {
    if (subscription.trialEndsAt) {
      const daysToTrialEnd = Math.ceil((new Date(subscription.trialEndsAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (daysToTrialEnd <= 3) {
        health.status = 'critical'
        health.score = 30
        health.issues.push('Trial ending in ' + daysToTrialEnd + ' days')
        health.recommendations.push('Upgrade to a paid plan to continue using all features')
      } else if (daysToTrialEnd <= 7) {
        health.status = 'warning'
        health.score = 60
        health.issues.push('Trial ending in ' + daysToTrialEnd + ' days')
        health.recommendations.push('Consider upgrading before trial ends')
      }
    }
  } else if (subscription.status === 'expired') {
    health.status = 'critical'
    health.score = 20
    health.issues.push('Subscription expired')
    health.recommendations.push('Renew your subscription to restore access')
  } else if (subscription.status === 'cancelled') {
    health.status = 'inactive'
    health.score = 10
    health.issues.push('Subscription cancelled')
    health.recommendations.push('Reactivate your subscription')
  }

  // Check auto-renew
  if (!subscription.autoRenew && subscription.status === 'active') {
    health.issues.push('Auto-renew disabled')
    health.recommendations.push('Enable auto-renew to avoid service interruption')
    health.score = Math.min(health.score, 70)
  }

  // Check payment status
  if (subscription.status === 'active' && !subscription.lastPaymentDate) {
    health.issues.push('No recent payment')
    health.recommendations.push('Verify your payment method')
    health.score = Math.min(health.score, 65)
  }

  // Ensure score is within bounds
  health.score = Math.max(0, Math.min(100, health.score))

  return health
}

function calculateForecast(subscription: any, orders: any[]) {
  const forecast = []
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // Calculate growth rate from historical data
  const paidOrders = orders.filter(order => 
    order.paymentStatus === 'paid' || order.paymentStatus === 'completed'
  )
  
  // Group by month to find growth trend
  const monthlyRevenue: Record<string, number> = {}
  paidOrders.forEach(order => {
    const date = new Date(order.createdAt)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (order.grandTotal || 0)
  })
  
  // Calculate average monthly growth (simplified)
  const monthlyValues = Object.values(monthlyRevenue)
  let growthRate = 0.1 // Default 10%
  
  if (monthlyValues.length >= 2) {
    const lastMonth = monthlyValues[monthlyValues.length - 1]
    const prevMonth = monthlyValues[monthlyValues.length - 2]
    growthRate = lastMonth > 0 && prevMonth > 0 ? (lastMonth - prevMonth) / prevMonth : 0.1
  }
  
  // Forecast next 6 months
  const baseRevenue = monthlyValues.length > 0 ? monthlyValues[monthlyValues.length - 1] : 0
  const now = new Date()
  
  for (let i = 1; i <= 6; i++) {
    const forecastDate = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const monthName = monthNames[forecastDate.getMonth()]
    
    const forecastRevenue = baseRevenue * Math.pow(1 + growthRate, i)
    const forecastCustomers = Math.round(50 * Math.pow(1 + growthRate, i)) // Simplified customer growth
    
    forecast.push({
      month: monthName,
      year: forecastDate.getFullYear(),
      revenue: Math.round(forecastRevenue),
      customers: forecastCustomers,
      growth: Math.round(growthRate * 100),
      subscriptionValue: subscription.status === 'active' ? 499 : 0 // Example value
    })
  }
  
  return forecast
}