// app/api/dashboard/stats/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'
import Customer from '@/models/Customer'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'
import { PaymentService } from '@/services/paymentService'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/dashboard/stats - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('❌ No auth token in dashboard stats request')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(authToken)
      const userId = decoded.userId
      console.log('👤 Dashboard stats for user:', userId)
      
      await connectToDatabase()
      console.log('✅ Database connected for dashboard stats')

      // Get subscription info first
      const subscription = await PaymentService.checkSubscription(userId)
      
      // Get all data in parallel
      const [
        totalProducts,
        totalCustomers,
        orders,
        products,
        pendingOrders
      ] = await Promise.all([
        // Total Products count
        Product.countDocuments({ userId }),
        
        // Total Customers count
        Customer.countDocuments({ userId }),
        
        // Get all orders for sales calculation
        Order.find({ userId })
          .select('invoiceDate grandTotal status paymentStatus items')
          .lean(),
        
        // Get all products for stock calculation
        Product.find({ userId }).select('variations').lean(),
        
        // Pending orders count
        Order.countDocuments({ 
          userId, 
          status: 'pending' 
        })
      ])

      console.log(`📦 Found ${orders.length} total orders`)
      console.log(`📦 Found ${products.length} total products`)

      // Calculate REAL SALES - only completed and paid orders
      const completedOrders = orders.filter((order: any) => 
        order.status === 'completed' || 
        order.paymentStatus === 'paid' ||
        (order.status === 'draft' && order.paymentStatus === 'paid')
      )

      console.log(`💰 ${completedOrders.length} completed/paid orders`)
      
      const totalSales = completedOrders.length
      
      // Calculate REAL MONTHLY REVENUE - current month only
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const monthlyOrders = completedOrders.filter((order: any) => {
        const orderDate = order.invoiceDate 
          ? new Date(order.invoiceDate)
          : new Date(order.createdAt || Date.now())
        
        return orderDate.getMonth() === currentMonth && 
               orderDate.getFullYear() === currentYear
      })

      const monthlyRevenue = monthlyOrders.reduce((sum: number, order: any) => 
        sum + (order.grandTotal || 0), 0
      )

      // Calculate TOTAL REVENUE
      const totalRevenue = completedOrders.reduce((sum: number, order: any) => 
        sum + (order.grandTotal || 0), 0
      )

      // Calculate LOW STOCK PRODUCTS
      const lowStockProducts = products.filter((product: any) => {
        // Check variations stock
        const variationsStock = product.variations?.reduce(
          (sum: number, v: any) => sum + (v.stock || 0), 
          0
        ) || 0
        
        // Check batches stock
        const batchesStock = product.batches?.reduce(
          (sum: number, b: any) => sum + (b.quantity || 0), 
          0
        ) || 0
        
        const totalStock = variationsStock + batchesStock
        return totalStock < 10 && totalStock > 0
      }).length

      console.log('📊 Calculated statistics:', {
        totalProducts,
        totalCustomers,
        totalSales,
        monthlyRevenue,
        totalRevenue,
        lowStockProducts,
        pendingOrders
      })

      const stats = {
        totalProducts,
        totalCustomers,
        totalSales,
        monthlyRevenue,
        totalRevenue,
        lowStockProducts,
        pendingBills: pendingOrders,
        subscription: {
          plan: subscription.plan,
          isActive: subscription.isActive,
          limits: subscription.limits
        }
      }
      
      return NextResponse.json(stats)
      
    } catch (authError) {
      console.error('❌ Auth error in dashboard stats:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Dashboard stats error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}