// app/api/analytics/route.ts - COMPLETE ANALYTICS API
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import Customer from '@/models/Customer'
import Product from '@/models/Product'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/analytics - Starting...')
    
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
    console.log('✅ Database connected for analytics')

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

    console.log(`📅 Analytics period: ${startDate.toISOString()} to ${endDate.toISOString()}`)

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

    // Calculate statistics
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Calculate total sales (quantity)
    let totalSales = 0
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        totalSales += order.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
      }
    })

    // Calculate monthly revenue
    const monthlyOrders = orders.filter(order => {
      if (!order.invoiceDate) return false
      const orderDate = new Date(order.invoiceDate)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })
    
    const monthlyRevenue = monthlyOrders.reduce((sum: number, order: any) => sum + (order.grandTotal || 0), 0)

    // Calculate pending bills
    const pendingBills = orders.filter(order => 
      order.paymentStatus === 'pending' || 
      order.paymentStatus === 'unpaid' ||
      !order.paymentStatus
    ).length

    // Calculate low stock products
    const lowStockProducts = products.filter(product => {
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
      
      return totalStock < 10
    })

    // Calculate monthly data for charts
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
      
      monthlyDataArray.push({
        month: monthName,
        revenue: monthRevenue,
        sales: monthSales,
        profit: Math.round(monthRevenue * 0.3), // 30% profit margin
        invoices: monthOrders.length
      })
    }

    // Calculate category data
    const categoryMap: Record<string, number> = {}
    
    products.forEach(product => {
      const category = product.category || 'Uncategorized'
      if (!categoryMap[category]) {
        categoryMap[category] = 0
      }
    })
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const product = products.find(p => p.name === item.productName)
          const category = product?.category || 'Uncategorized'
          categoryMap[category] = (categoryMap[category] || 0) + (item.total || 0)
        })
      }
    })
    
    const categoryData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)

    // Calculate top products
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {}
    
    orders.forEach(order => {
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
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Get recent invoices (last 10)
    const recentInvoices = orders.slice(0, 10).map(order => ({
      _id: order._id.toString(),
      id: order._id.toString(),
      invoiceNumber: order.invoiceNumber,
      invoiceDate: order.invoiceDate,
      customer: {
        name: order.customer?.name || 'Customer',
        phone: order.customer?.phone || ''
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
      createdAt: order.createdAt
    }))

    // Get recent customers (last 5)
    const recentCustomers = customers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(customer => ({
        _id: customer._id.toString(),
        id: customer._id.toString(),
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || 0,
        lastOrderDate: customer.lastOrderDate,
        createdAt: customer.createdAt
      }))

    // Prepare response
    const stats = {
      totalProducts: products.length,
      totalCustomers: customers.length,
      totalSales,
      monthlyRevenue,
      lowStockProducts: lowStockProducts.length,
      pendingBills,
      totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.grandTotal || 0), 0),
      avgOrderValue: orders.length > 0 
        ? Math.round(orders.reduce((sum: number, order: any) => sum + (order.grandTotal || 0), 0) / orders.length)
        : 0
    }

    console.log('✅ Analytics data prepared successfully')

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentInvoices,
        recentCustomers,
        lowStockProducts: lowStockProducts.slice(0, 5),
        monthlyData: monthlyDataArray,
        categoryData,
        topProducts,
        timeRange,
        period: {
          startDate,
          endDate
        }
      },
      message: 'Analytics data fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Analytics API error:', error)
    
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