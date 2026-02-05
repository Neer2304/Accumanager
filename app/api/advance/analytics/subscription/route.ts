// app/api/advance/analytics/subscription/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'

// Mock data for subscriptions (replace with actual model)
const mockSubscriptions = [
  {
    id: '1',
    customer: 'Acme Corp',
    plan: 'Enterprise',
    monthlyAmount: 499,
    status: 'active',
    startDate: '2024-01-01',
    nextBillingDate: '2024-02-01',
    autoRenew: true,
    totalPaid: 499,
    churnRisk: 'low',
    customerSatisfaction: 4.8
  },
  // Add more mock subscriptions...
]

export async function GET(request: NextRequest) {
  try {
    console.log('💰 GET /api/advance/analytics/subscription - Starting...')
    
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
    console.log('✅ Database connected for subscription analytics')

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'monthly'

    // Calculate date range
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
      default:
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
    }

    // Filter subscriptions by date
    const filteredSubscriptions = mockSubscriptions.filter(sub => {
      const subDate = new Date(sub.startDate)
      return subDate >= startDate && subDate <= endDate
    })

    // Calculate metrics
    const totalSubscriptions = filteredSubscriptions.length
    const activeSubscriptions = filteredSubscriptions.filter(s => s.status === 'active').length
    const trialSubscriptions = filteredSubscriptions.filter(s => s.status === 'trial').length
    const cancelledSubscriptions = filteredSubscriptions.filter(s => s.status === 'cancelled').length
    
    const mrr = filteredSubscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.monthlyAmount, 0)
    
    const arr = mrr * 12 // Annual Recurring Revenue
    
    const totalRevenue = filteredSubscriptions.reduce((sum, s) => sum + s.totalPaid, 0)
    
    // Churn calculation
    const churnedThisMonth = filteredSubscriptions.filter(s => 
      s.status === 'cancelled' && 
      new Date(s.startDate).getMonth() === new Date().getMonth()
    ).length
    
    const churnRate = totalSubscriptions > 0 
      ? (churnedThisMonth / totalSubscriptions) * 100 
      : 0

    // Customer Lifetime Value
    const avgMonthlyRevenuePerUser = totalSubscriptions > 0 
      ? mrr / totalSubscriptions 
      : 0
    
    const avgCustomerLifetime = 12 // months (simplified)
    const clv = avgMonthlyRevenuePerUser * avgCustomerLifetime

    // Plan distribution
    const planDistribution = filteredSubscriptions.reduce((acc, sub) => {
      acc[sub.plan] = (acc[sub.plan] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Monthly trend
    const monthlyTrend = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date()
      month.setMonth(month.getMonth() - i)
      const monthName = monthNames[month.getMonth()]
      
      const monthSubs = filteredSubscriptions.filter(sub => {
        const subDate = new Date(sub.startDate)
        return subDate.getMonth() === month.getMonth() && 
               subDate.getFullYear() === month.getFullYear()
      })
      
      const monthActive = monthSubs.filter(s => s.status === 'active').length
      const monthMRR = monthSubs
        .filter(s => s.status === 'active')
        .reduce((sum, s) => sum + s.monthlyAmount, 0)
      
      const monthChurned = monthSubs.filter(s => 
        s.status === 'cancelled' && 
        new Date(s.startDate).getMonth() === month.getMonth()
      ).length
      
      monthlyTrend.push({
        month: monthName,
        total: monthSubs.length,
        active: monthActive,
        mrr: monthMRR,
        churned: monthChurned,
        churnRate: monthSubs.length > 0 ? (monthChurned / monthSubs.length) * 100 : 0
      })
    }

    // Revenue forecast
    const growthRate = 0.1 // 10% monthly growth (simplified)
    const forecast = []
    
    for (let i = 0; i < 6; i++) {
      const forecastDate = new Date()
      forecastDate.setMonth(forecastDate.getMonth() + i)
      const monthName = monthNames[forecastDate.getMonth()]
      
      const forecastMRR = mrr * Math.pow(1 + growthRate, i)
      const forecastARR = forecastMRR * 12
      
      forecast.push({
        month: monthName,
        year: forecastDate.getFullYear(),
        mrr: Math.round(forecastMRR),
        arr: Math.round(forecastARR),
        customers: Math.round(totalSubscriptions * Math.pow(1 + growthRate, i))
      })
    }

    // Churn risk analysis
    const churnRiskAnalysis = {
      highRisk: filteredSubscriptions.filter(s => s.churnRisk === 'high').length,
      mediumRisk: filteredSubscriptions.filter(s => s.churnRisk === 'medium').length,
      lowRisk: filteredSubscriptions.filter(s => s.churnRisk === 'low').length,
      totalAtRisk: filteredSubscriptions.filter(s => s.churnRisk === 'high' || s.churnRisk === 'medium').length
    }

    // Top customers by revenue
    const topCustomers = [...filteredSubscriptions]
      .sort((a, b) => b.totalPaid - a.totalPaid)
      .slice(0, 5)
      .map(sub => ({
        customer: sub.customer,
        plan: sub.plan,
        monthlyAmount: sub.monthlyAmount,
        totalPaid: sub.totalPaid,
        status: sub.status,
        satisfaction: sub.customerSatisfaction
      }))

    // Prepare response
    const stats = {
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      cancelledSubscriptions,
      mrr: Math.round(mrr),
      arr: Math.round(arr),
      totalRevenue,
      churnRate: churnRate.toFixed(1) + '%',
      clv: Math.round(clv),
      avgMonthlyRevenue: totalSubscriptions > 0 ? Math.round(totalRevenue / totalSubscriptions) : 0,
      renewalRate: (100 - churnRate).toFixed(1) + '%',
      customerAcquisitionCost: 0, // Would come from marketing data
      lifetimeValueRatio: clv > 0 ? (clv / 100).toFixed(2) : '0.00' // Assuming CAC of 100
    }

    console.log('✅ Subscription Analytics data prepared successfully')

    return NextResponse.json({
      success: true,
      data: {
        stats,
        planDistribution,
        monthlyTrend,
        forecast,
        churnRiskAnalysis,
        topCustomers,
        allSubscriptions: filteredSubscriptions,
        timeRange,
        period: {
          startDate,
          endDate
        }
      },
      message: 'Subscription analytics data fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Subscription Analytics API error:', error)
    
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