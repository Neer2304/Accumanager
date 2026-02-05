// app/api/advance/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import Customer from '@/models/Customer'
import Product from '@/models/Product'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/advance/analytics - Starting...')
    
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
    console.log('✅ Database connected for advance analytics')

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

    console.log(`📅 Advance Analytics period: ${startDate.toISOString()} to ${endDate.toISOString()}`)

    // 1. Fetch orders for the period
    const orders = await Order.find({
      userId: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    })
    .sort({ createdAt: -1 })
    .lean()

    // 2. Fetch all customers
    const customers = await Customer.find({ userId: userId }).lean()

    // 3. Fetch all products
    const products = await Product.find({ userId: userId, isActive: true }).lean()

    console.log(`📈 Data fetched: ${orders.length} orders, ${customers.length} customers, ${products.length} products`)

    // Calculate advanced statistics
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Calculate total sales with product categories
    let totalSales = 0
    let totalRevenue = 0
    const categorySales: Record<string, number> = {}
    const productPerformance: Record<string, { sales: number, revenue: number, returns: number }> = {}
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          totalSales += item.quantity || 0
          totalRevenue += item.total || 0
          
          // Find product category
          const product = products.find(p => p.name === item.productName || p._id.toString() === item.productId)
          const category = product?.category || 'Uncategorized'
          categorySales[category] = (categorySales[category] || 0) + item.total
          
          // Track product performance
          const productName = item.productName || 'Unknown'
          if (!productPerformance[productName]) {
            productPerformance[productName] = { sales: 0, revenue: 0, returns: 0 }
          }
          productPerformance[productName].sales += item.quantity || 0
          productPerformance[productName].revenue += item.total || 0
        })
      }
      totalRevenue += order.grandTotal || 0
    })

    // Calculate monthly revenue trends
    const monthlyDataArray = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date()
      month.setMonth(now.getMonth() - i)
      const monthName = monthNames[month.getMonth()]
      
      const monthOrders = orders.filter(order => {
        if (!order.invoiceDate) return false
        const orderDate = new Date(order.invoiceDate)
        return orderDate.getMonth() === month.getMonth() && 
               orderDate.getFullYear() === month.getFullYear()
      })
      
      const monthRevenue = monthOrders.reduce((sum: number, order: any) => sum + (order.grandTotal || 0), 0)
      
      const monthSales = monthOrders.reduce((sum: number, order: any) => {
        if (order.items && Array.isArray(order.items)) {
          return sum + order.items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0)
        }
        return sum
      }, 0)
      
      // Calculate profit (assuming 25-40% margin based on product category)
      const profitMargin = 0.3 // 30% average
      const monthProfit = Math.round(monthRevenue * profitMargin)
      
      monthlyDataArray.push({
        month: monthName,
        revenue: monthRevenue,
        sales: monthSales,
        profit: monthProfit,
        invoices: monthOrders.length,
        avgOrderValue: monthOrders.length > 0 ? Math.round(monthRevenue / monthOrders.length) : 0
      })
    }

    // Calculate customer analytics
    const customerAnalytics = {
      total: customers.length,
      newCustomers: customers.filter((c: any) => {
        const customerDate = new Date(c.createdAt)
        return customerDate >= startDate && customerDate <= endDate
      }).length,
      returningCustomers: customers.filter((c: any) => (c.totalOrders || 0) > 1).length,
      topCustomers: customers
        .filter((c: any) => (c.totalSpent || 0) > 0)
        .sort((a: any, b: any) => (b.totalSpent || 0) - (a.totalSpent || 0))
        .slice(0, 5)
        .map((c: any) => ({
          name: c.name || 'Customer',
          totalSpent: c.totalSpent || 0,
          orders: c.totalOrders || 0
        }))
    }

    // Calculate product analytics
    const productAnalytics = {
      total: products.length,
      lowStock: products.filter((p: any) => {
        let totalStock = 0
        if (p.variations?.length) {
          totalStock += p.variations.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
        }
        if (p.batches?.length) {
          totalStock += p.batches.reduce((sum: number, b: any) => sum + (b.quantity || 0), 0)
        }
        if (totalStock === 0 && p.stock) {
          totalStock = p.stock
        }
        return totalStock < 10
      }).length,
      topSelling: Object.values(productPerformance)
        .map((data: any, index: number) => ({
          name: Object.keys(productPerformance)[index],
          ...data
        }))
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5),
      categoryBreakdown: Object.entries(categorySales)
        .map(([name, value]) => ({ name, value: Math.round(value) }))
        .sort((a: any, b: any) => b.value - a.value)
    }

    // Calculate order analytics
    const orderAnalytics = {
      total: orders.length,
      completed: orders.filter((o: any) => o.status === 'completed' || o.paymentStatus === 'paid').length,
      pending: orders.filter((o: any) => 
        o.paymentStatus === 'pending' || 
        o.paymentStatus === 'unpaid' ||
        !o.paymentStatus
      ).length,
      cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
      avgProcessingTime: calculateAvgProcessingTime(orders),
      paymentMethods: calculatePaymentMethodDistribution(orders)
    }

    // Calculate financial metrics
    const financialMetrics = {
      totalRevenue,
      totalProfit: Math.round(totalRevenue * 0.3),
      monthlyRecurringRevenue: calculateMRR(orders),
      customerLifetimeValue: calculateCLV(customers, totalRevenue),
      customerAcquisitionCost: 0, // This would come from marketing data
      grossMargin: '70%',
      netMargin: '25%'
    }

    // Get recent activity (last 10 orders)
    const recentActivity = orders.slice(0, 10).map((order: any) => ({
      type: 'order',
      id: order._id.toString(),
      title: `New Order #${order.invoiceNumber}`,
      description: `${order.customer?.name || 'Customer'} - ₹${order.grandTotal || 0}`,
      timestamp: order.createdAt,
      status: order.paymentStatus || 'pending',
      amount: order.grandTotal || 0
    }))

    // Prepare response
    const stats = {
      totalRevenue,
      totalSales,
      totalCustomers: customerAnalytics.total,
      totalProducts: productAnalytics.total,
      monthlyGrowth: calculateMonthlyGrowth(monthlyDataArray),
      conversionRate: '4.2%', // Would come from marketing data
      avgOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
      customerRetention: calculateRetentionRate(customers),
      inventoryValue: calculateInventoryValue(products)
    }

    console.log('✅ Advance Analytics data prepared successfully')

    return NextResponse.json({
      success: true,
      data: {
        stats,
        customerAnalytics,
        productAnalytics,
        orderAnalytics,
        financialMetrics,
        monthlyData: monthlyDataArray,
        recentActivity,
        categoryData: productAnalytics.categoryBreakdown,
        topProducts: productAnalytics.topSelling,
        topCustomers: customerAnalytics.topCustomers,
        timeRange,
        period: {
          startDate,
          endDate
        }
      },
      message: 'Advance analytics data fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Advance Analytics API error:', error)
    
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

// Helper functions
function calculateAvgProcessingTime(orders: any[]): number {
  const processedOrders = orders.filter((o: any) => o.createdAt && o.updatedAt)
  if (processedOrders.length === 0) return 0
  
  const totalTime = processedOrders.reduce((sum: number, order: any) => {
    const created = new Date(order.createdAt).getTime()
    const updated = new Date(order.updatedAt || order.createdAt).getTime()
    return sum + (updated - created)
  }, 0)
  
  return Math.round(totalTime / processedOrders.length / (1000 * 60 * 60)) // Hours
}

function calculatePaymentMethodDistribution(orders: any[]): any[] {
  const methods: Record<string, number> = {}
  
  orders.forEach((order: any) => {
    const method = order.paymentMethod || 'cash'
    methods[method] = (methods[method] || 0) + 1
  })
  
  return Object.entries(methods).map(([method, count]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    value: count,
    percentage: Math.round((count / orders.length) * 100)
  }))
}

function calculateMRR(orders: any[]): number {
  const monthlyOrders = orders.filter((order: any) => {
    const orderDate = new Date(order.createdAt)
    const now = new Date()
    return orderDate.getMonth() === now.getMonth() && 
           orderDate.getFullYear() === now.getFullYear()
  })
  
  return monthlyOrders.reduce((sum: number, order: any) => sum + (order.grandTotal || 0), 0)
}

function calculateCLV(customers: any[], totalRevenue: number): number {
  if (customers.length === 0) return 0
  return Math.round(totalRevenue / customers.length)
}

function calculateMonthlyGrowth(monthlyData: any[]): string {
  if (monthlyData.length < 2) return '0%'
  
  const current = monthlyData[monthlyData.length - 1].revenue
  const previous = monthlyData[monthlyData.length - 2].revenue
  
  if (previous === 0) return '100%'
  
  const growth = ((current - previous) / previous) * 100
  return `${growth > 0 ? '+' : ''}${Math.round(growth)}%`
}

function calculateRetentionRate(customers: any[]): string {
  const returning = customers.filter((c: any) => (c.totalOrders || 0) > 1).length
  const total = customers.length
  
  if (total === 0) return '0%'
  return `${Math.round((returning / total) * 100)}%`
}

function calculateInventoryValue(products: any[]): number {
  let totalValue = 0
  
  products.forEach((product: any) => {
    let totalStock = 0
    let avgPrice = product.price || 0
    
    if (product.variations?.length) {
      product.variations.forEach((v: any) => {
        totalStock += v.stock || 0
        if (v.price && v.price > avgPrice) avgPrice = v.price
      })
    }
    
    if (product.batches?.length) {
      product.batches.forEach((b: any) => {
        totalStock += b.quantity || 0
        if (b.price && b.price > avgPrice) avgPrice = b.price
      })
    }
    
    if (totalStock === 0 && product.stock) {
      totalStock = product.stock
    }
    
    totalValue += totalStock * avgPrice
  })
  
  return Math.round(totalValue)
}