// app/api/advance/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import Customer from '@/models/Customer'
import Product from '@/models/Product'
import AdvanceScreenTime from '@/models/AdvanceScreenTime'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/advance/dashboard - Starting...')
    
    // Check authentication
    const authToken = request.cookies.get('auth_token')?.value
    const authHeader = request.headers.get('authorization')
    
    const token = authHeader?.replace('Bearer ', '') || authToken
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    await connectToDatabase()
    console.log('✅ Database connected for advance dashboard')

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'monthly'
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    // Calculate date range
    let startDate: Date, endDate: Date = new Date()
    
    switch (timeRange) {
      case 'today':
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        break
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

    console.log(`📅 Dashboard period: ${startDate.toISOString()} to ${endDate.toISOString()}`)

    // Get all data in parallel
    const [user, orders, customers, products, advanceScreenTime] = await Promise.all([
      User.findOne({ _id: userId }),
      Order.find({
        userId: userId,
        createdAt: { $gte: startDate, $lte: endDate }
      }).sort({ createdAt: -1 }).lean(),
      Customer.find({ userId: userId }).lean(),
      Product.find({ userId: userId, isActive: true }).lean(),
      AdvanceScreenTime.findOne({ userId: userId }).lean()
    ])

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    console.log(`📊 Data loaded: ${orders.length} orders, ${customers.length} customers, ${products.length} products`)

    // 1. Business Metrics
    const businessMetrics = calculateBusinessMetrics(orders, customers, products, startDate)

    // 2. Engagement Metrics
    const engagementMetrics = calculateEngagementMetrics(user, advanceScreenTime)

    // 3. Recent Activity
    const recentActivity = getRecentActivity(orders, advanceScreenTime)

    // 4. Monthly Trends
    const monthlyTrends = getMonthlyTrends(orders, customers, user, startDate, endDate)

    // 5. Goals
    const goals = calculateGoals(user, advanceScreenTime, businessMetrics)

    // 6. Insights
    const insights = generateInsights(businessMetrics, engagementMetrics, goals, products, orders)

    // 7. Summary
    const summary = {
      quickStats: [
        {
          title: 'Monthly Revenue',
          value: `₹${businessMetrics.monthlyRevenue.toLocaleString()}`,
          change: businessMetrics.revenueGrowth,
          icon: '💰'
        },
        {
          title: 'Total Customers',
          value: businessMetrics.totalCustomers.toString(),
          change: `${businessMetrics.newCustomers} new`,
          icon: '👥'
        },
        {
          title: 'Screen Time',
          value: `${engagementMetrics.totalHours.toFixed(1)}h`,
          change: `${engagementMetrics.streakDays} day streak`,
          icon: '⏱️'
        },
        {
          title: 'Productivity',
          value: `${engagementMetrics.productivityScore}`,
          change: engagementMetrics.mostUsedFeature,
          icon: '🚀'
        }
      ],
      subscription: {
        plan: user.subscription.plan,
        status: user.subscription.status,
        trialEndsAt: user.subscription.trialEndsAt,
        features: user.subscription.features
      },
      usage: user.usage
    }

    console.log('✅ Advance dashboard data prepared successfully')

    return NextResponse.json({
      success: true,
      message: 'Advance dashboard data fetched successfully',
      data: {
        businessMetrics,
        engagementMetrics,
        recentActivity,
        monthlyTrends,
        goals,
        insights,
        summary,
        timeRange,
        period: { startDate, endDate }
      }
    })

  } catch (error: any) {
    console.error('❌ Advance dashboard error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
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

// Helper Functions
function calculateBusinessMetrics(orders: any[], customers: any[], products: any[], startDate: Date) {
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  // Revenue calculations
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.grandTotal || 0), 0)
  const monthlyRevenue = orders
    .filter((order: any) => new Date(order.createdAt) >= thisMonthStart)
    .reduce((sum: number, order: any) => sum + (order.grandTotal || 0), 0)

  // Revenue growth
  const lastMonthRevenue = orders
    .filter((order: any) => 
      new Date(order.createdAt) >= lastMonthStart && 
      new Date(order.createdAt) <= lastMonthEnd
    )
    .reduce((sum: number, order: any) => sum + (order.grandTotal || 0), 0)
  
  const revenueGrowth = lastMonthRevenue === 0 
    ? (monthlyRevenue > 0 ? '+100%' : '0%')
    : `${((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100) > 0 ? '+' : ''}${Math.round((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100)}%`

  // Order metrics
  const totalOrders = orders.length
  const monthlyOrders = orders.filter((order: any) => 
    new Date(order.createdAt) >= thisMonthStart
  ).length
  const avgOrderValue = totalOrders > 0 
    ? Math.round(totalRevenue / totalOrders)
    : 0

  // Customer metrics
  const totalCustomers = customers.length
  const newCustomers = customers.filter((customer: any) => 
    new Date(customer.createdAt) >= thisMonthStart
  ).length

  // Retention rate
  const returningCustomers = customers.filter((c: any) => (c.totalOrders || 0) > 1).length
  const customerRetention = totalCustomers > 0 
    ? `${Math.round((returningCustomers / totalCustomers) * 100)}%`
    : '0%'

  // Product metrics
  const totalProducts = products.length
  const lowStockProducts = products.filter((product: any) => {
    const stock = calculateProductStock(product)
    return stock < 10
  }).length

  // Top products
  const topProducts = getTopProducts(orders, products)

  return {
    totalRevenue,
    monthlyRevenue,
    revenueGrowth,
    totalOrders,
    monthlyOrders,
    avgOrderValue,
    totalCustomers,
    newCustomers,
    customerRetention,
    totalProducts,
    lowStockProducts,
    topProducts
  }
}

function calculateEngagementMetrics(user: any, advanceScreenTime: any) {
  const screenTime = user.screenTime || {}
  const today = new Date().toISOString().split('T')[0]
  
  // Today's hours
  const todayStat = screenTime.dailyStats?.find((stat: any) => stat.date === today)
  const todayHours = todayStat?.hours || 0

  // Productivity score
  const productivityScore = advanceScreenTime?.focus?.productivityScore || 0

  // Most used feature
  const mostUsedFeature = advanceScreenTime?.focus?.mostUsedFeature || 'dashboard'

  // Time distribution
  const timeDistribution = {
    dashboard: advanceScreenTime?.focus?.timeOnDashboard || 0,
    reports: advanceScreenTime?.focus?.timeOnReports || 0,
    settings: advanceScreenTime?.focus?.timeOnSettings || 0
  }

  // Engagement stats
  const engagementStats = {
    pageViews: advanceScreenTime?.engagement?.pageViews || 0,
    formsSubmitted: advanceScreenTime?.engagement?.formsSubmitted || 0,
    exportsGenerated: advanceScreenTime?.engagement?.exportsGenerated || 0,
    reportsViewed: advanceScreenTime?.engagement?.reportsViewed || 0
  }

  return {
    totalHours: screenTime.totalHours || 0,
    weeklyAverage: screenTime.weeklyAverage || 0,
    avgSessionLength: screenTime.avgSessionLength || 0,
    peakHour: screenTime.peakHour || 0,
    streakDays: advanceScreenTime?.achievements?.streakDays || 0,
    todayHours,
    productivityScore,
    mostUsedFeature,
    timeDistribution,
    ...engagementStats
  }
}

function getRecentActivity(orders: any[], advanceScreenTime: any) {
  const activity = []

  // Recent orders
  const recentOrders = orders.slice(0, 5).map((order: any) => ({
    type: 'order',
    id: order._id.toString(),
    title: `New Order #${order.invoiceNumber || order._id.toString().slice(-6)}`,
    description: `${order.customer?.name || 'Customer'} - ₹${order.grandTotal || 0}`,
    timestamp: order.createdAt,
    status: order.paymentStatus || 'pending',
    amount: order.grandTotal || 0
  }))

  activity.push(...recentOrders)

  // Recent sessions
  if (advanceScreenTime?.sessionHistory) {
    const recentSessions = advanceScreenTime.sessionHistory
      .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 3)
      .map((session: any) => ({
        type: 'session',
        id: session.sessionId,
        title: 'Platform Session',
        description: `${session.duration.toFixed(0)} minutes - ${session.pagesVisited.length} pages`,
        timestamp: session.startTime,
        status: 'completed',
        duration: session.duration
      }))

    activity.push(...recentSessions)
  }

  // Sort by timestamp and limit
  return activity
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)
}

function getMonthlyTrends(orders: any[], customers: any[], user: any, startDate: Date, endDate: Date) {
  const trends = []
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // Get last 6 months
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const month = new Date()
    month.setMonth(now.getMonth() - i)
    const monthName = monthNames[month.getMonth()]
    
    // Filter data for this month
    const monthOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt)
      return orderDate.getMonth() === month.getMonth() && 
             orderDate.getFullYear() === month.getFullYear()
    })
    
    const monthRevenue = monthOrders.reduce((sum: number, order: any) => sum + (order.grandTotal || 0), 0)
    
    const monthCustomers = customers.filter((customer: any) => {
      const customerDate = new Date(customer.createdAt)
      return customerDate.getMonth() === month.getMonth() && 
             customerDate.getFullYear() === month.getFullYear()
    }).length
    
    // Calculate screen time for month
    const monthScreenTime = user.screenTime?.dailyStats
      ?.filter((stat: any) => {
        const statDate = new Date(stat.date)
        return statDate.getMonth() === month.getMonth() && 
               statDate.getFullYear() === month.getFullYear()
      })
      .reduce((sum: number, stat: any) => sum + stat.hours, 0) || 0
    
    trends.push({
      month: monthName,
      revenue: monthRevenue,
      customers: monthCustomers,
      screenTime: parseFloat(monthScreenTime.toFixed(1)),
      orders: monthOrders.length
    })
  }
  
  return trends
}

function calculateGoals(user: any, advanceScreenTime: any, businessMetrics: any) {
  const today = new Date().toISOString().split('T')[0]
  const todayStat = user.screenTime?.dailyStats?.find((stat: any) => stat.date === today)
  const todayHours = todayStat?.hours || 0
  
  const dailyGoal = advanceScreenTime?.achievements?.dailyGoal || 2
  const dailyProgress = (todayHours / dailyGoal) * 100
  
  // Revenue goal (20% growth target)
  const revenueGoal = {
    target: Math.round(businessMetrics.monthlyRevenue * 1.2),
    progress: businessMetrics.monthlyRevenue > 0 
      ? Math.min(Math.round((businessMetrics.monthlyRevenue / (businessMetrics.monthlyRevenue * 1.2)) * 100), 100)
      : 0,
    current: businessMetrics.monthlyRevenue
  }
  
  // Customer goal (10 new customers per month)
  const customerGoal = {
    target: 10,
    progress: Math.min(Math.round((businessMetrics.newCustomers / 10) * 100), 100),
    current: businessMetrics.newCustomers
  }
  
  return {
    dailyScreenTimeGoal: dailyGoal,
    currentDailyProgress: todayHours,
    dailyProgressPercentage: dailyProgress,
    revenueGoal,
    customerGoal,
    achievements: advanceScreenTime?.achievements?.badges || []
  }
}

function generateInsights(businessMetrics: any, engagementMetrics: any, goals: any, products: any[], orders: any[]) {
  const insights = []
  
  // Revenue insights
  if (businessMetrics.revenueGrowth.includes('+')) {
    insights.push({
      type: 'success',
      title: 'Revenue Growth 📈',
      message: `Your revenue is growing by ${businessMetrics.revenueGrowth} this month!`,
      suggestion: 'Consider expanding your product line or increasing marketing efforts.'
    })
  }
  
  // Low stock alert
  if (businessMetrics.lowStockProducts > 0) {
    insights.push({
      type: 'warning',
      title: 'Low Stock Alert ⚠️',
      message: `${businessMetrics.lowStockProducts} products are running low on stock.`,
      suggestion: 'Restock these products to avoid missing sales opportunities.'
    })
  }
  
  // Engagement insights
  if (engagementMetrics.streakDays >= 7) {
    insights.push({
      type: 'success',
      title: 'Consistent Usage 🔥',
      message: `You've maintained a ${engagementMetrics.streakDays}-day streak!`,
      suggestion: 'Keep up the consistency to build better business habits.'
    })
  }
  
  // Productivity insights
  if (engagementMetrics.productivityScore > 500) {
    insights.push({
      type: 'success',
      title: 'High Productivity 🚀',
      message: 'Your productivity score is excellent this week!',
      suggestion: 'Focus on high-value tasks during your peak hours.'
    })
  }
  
  // Goal completion insights
  if (goals.dailyProgressPercentage >= 100) {
    insights.push({
      type: 'success',
      title: 'Daily Goal Achieved! ✅',
      message: `You've reached your daily screen time goal of ${goals.dailyScreenTimeGoal} hours.`,
      suggestion: 'Consider setting a higher goal to continue improving.'
    })
  } else if (goals.dailyProgressPercentage >= 50) {
    insights.push({
      type: 'info',
      title: 'Halfway There! 🎯',
      message: `You're ${Math.round(goals.dailyProgressPercentage)}% towards your daily goal.`,
      suggestion: 'A few more minutes of focused work will complete your goal.'
    })
  }
  
  // Customer retention insights
  if (businessMetrics.customerRetention > '70%') {
    insights.push({
      type: 'success',
      title: 'Excellent Retention 👥',
      message: `Customer retention rate: ${businessMetrics.customerRetention}`,
      suggestion: 'Your customers are satisfied! Consider implementing a referral program.'
    })
  }
  
  // Peak hour insight
  if (engagementMetrics.peakHour) {
    const peakTime = engagementMetrics.peakHour >= 12 
      ? `${engagementMetrics.peakHour - 12 || 12} PM`
      : `${engagementMetrics.peakHour} AM`
    
    insights.push({
      type: 'info',
      title: 'Peak Activity Time 🕐',
      message: `You're most productive around ${peakTime}`,
      suggestion: 'Schedule important tasks during this time for maximum efficiency.'
    })
  }
  
  return insights
}

// Utility functions
function calculateProductStock(product: any): number {
  let totalStock = 0
  
  if (product.variations && Array.isArray(product.variations)) {
    totalStock += product.variations.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
  }
  
  if (product.batches && Array.isArray(product.batches)) {
    totalStock += product.batches.reduce((sum: number, b: any) => sum + (b.quantity || 0), 0)
  }
  
  if (totalStock === 0 && product.stock) {
    totalStock = product.stock
  }
  
  return totalStock
}

function getTopProducts(orders: any[], products: any[]) {
  const productSales: Record<string, { name: string; sales: number; revenue: number }> = {}
  
  orders.forEach((order: any) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        const productName = item.productName || 'Unknown Product'
        if (!productSales[productName]) {
          productSales[productName] = {
            name: productName,
            sales: 0,
            revenue: 0
          }
        }
        productSales[productName].sales += item.quantity || 0
        productSales[productName].revenue += item.total || 0
      })
    }
  })
  
  return Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
}