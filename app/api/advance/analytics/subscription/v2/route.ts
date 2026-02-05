// app/api/advance/analytics/subscription/v2/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import AdvanceSubscription from '@/models/AdvanceSubscription'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('💰 GET /api/advance/analytics/subscription/v2 - Starting...')
    
    // Authentication
    const authToken = request.cookies.get('auth_token')?.value
    const authHeader = request.headers.get('authorization')
    
    const token = authHeader?.replace('Bearer ', '') || authToken
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    await connectToDatabase()

    // Get user data
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Get or create advance subscription
    let advanceSubscription = await AdvanceSubscription.findOne({ userId: user._id })
    
    // If no advance subscription exists, create one from user data
    if (!advanceSubscription) {
      advanceSubscription = new AdvanceSubscription({
        userId: user._id,
        subscription: user.subscription,
        usageMetrics: {
          productsCreated: user.usage.products,
          customersAdded: user.usage.customers,
          invoicesGenerated: user.usage.invoices,
          reportsExported: 0,
          apiCalls: 0
        }
      })
      await advanceSubscription.save()
    }

    // Get orders for revenue calculation
    const orders = await Order.find({ userId: user._id }).lean()

    // Update usage metrics from user data
    advanceSubscription.usageMetrics = {
      productsCreated: user.usage.products,
      customersAdded: user.usage.customers,
      invoicesGenerated: user.usage.invoices,
      reportsExported: advanceSubscription.usageMetrics.reportsExported,
      apiCalls: advanceSubscription.usageMetrics.apiCalls
    }

    // Calculate value metrics
    advanceSubscription.valueMetrics = calculateValueMetrics(advanceSubscription, orders)

    // Update analytics
    advanceSubscription.analytics = updateAnalytics(advanceSubscription, orders)

    await advanceSubscription.save()

    // Prepare response
    const responseData = {
      currentSubscription: advanceSubscription.subscription,
      paymentHistory: advanceSubscription.paymentHistory,
      usageMetrics: advanceSubscription.usageMetrics,
      valueMetrics: advanceSubscription.valueMetrics,
      analytics: advanceSubscription.analytics,
      insights: generateSubscriptionInsights(advanceSubscription),
      recommendations: generateRecommendations(advanceSubscription)
    }

    console.log('✅ Advance Subscription Analytics data prepared successfully')

    return NextResponse.json({
      success: true,
      message: 'Advance subscription analytics fetched successfully',
      data: responseData
    })

  } catch (error: any) {
    console.error('❌ Advance Subscription Analytics error:', error)
    
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

// Helper functions for v2 API
function calculateValueMetrics(subscription: any, orders: any[]) {
  const paidOrders = orders.filter(order => 
    order.paymentStatus === 'paid' || order.paymentStatus === 'completed'
  )
  
  const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0)
  const monthlyRevenue = totalRevenue / 12 // Simplified
  
  // Calculate subscription cost
  let subscriptionCost = 0
  switch (subscription.subscription.plan) {
    case 'monthly': subscriptionCost = 499; break
    case 'quarterly': subscriptionCost = 1399 / 3; break
    case 'yearly': subscriptionCost = 4999 / 12; break
    default: subscriptionCost = 0
  }
  
  const estimatedMonthlyValue = monthlyRevenue
  const costPerFeature = subscriptionCost / (subscription.subscription.features?.length || 1)
  const roiPercentage = subscriptionCost > 0 ? ((monthlyRevenue - subscriptionCost) / subscriptionCost) * 100 : 0
  
  // Calculate break-even date
  let breakEvenDate = null
  if (roiPercentage > 0 && subscription.subscription.currentPeriodStart) {
    const daysToBreakEven = Math.ceil(subscriptionCost / (monthlyRevenue / 30))
    breakEvenDate = new Date(subscription.subscription.currentPeriodStart)
    breakEvenDate.setDate(breakEvenDate.getDate() + daysToBreakEven)
  }
  
  return {
    estimatedMonthlyValue: Math.round(estimatedMonthlyValue),
    costPerFeature: Math.round(costPerFeature),
    roiPercentage: Math.round(roiPercentage),
    breakEvenDate
  }
}

function updateAnalytics(subscription: any, orders: any[]) {
  const now = new Date()
  const monthlyRevenue = []
  const customerGrowth = []
  
  // Calculate last 6 months revenue
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    
    const monthRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= month && orderDate <= monthEnd && 
               (order.paymentStatus === 'paid' || order.paymentStatus === 'completed')
      })
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0)
    
    monthlyRevenue.push(Math.round(monthRevenue))
  }
  
  // Usage growth (simplified)
  const usageGrowth = [
    subscription.usageMetrics.productsCreated,
    subscription.usageMetrics.customersAdded,
    subscription.usageMetrics.invoicesGenerated
  ]
  
  // Churn probability (simplified)
  let churnProbability = 0
  if (subscription.subscription.status === 'trial' && subscription.subscription.trialEndsAt) {
    const daysToTrialEnd = Math.ceil((new Date(subscription.subscription.trialEndsAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (daysToTrialEnd <= 3) churnProbability = 80
    else if (daysToTrialEnd <= 7) churnProbability = 50
    else if (daysToTrialEnd <= 14) churnProbability = 20
  }
  
  // Predicted lifetime value
  const predictedLifetimeValue = subscription.valueMetrics.estimatedMonthlyValue * 12 * 3 // 3 years
  
  return {
    monthlyRevenue,
    customerGrowth,
    usageGrowth,
    churnProbability,
    predictedLifetimeValue: Math.round(predictedLifetimeValue)
  }
}

function generateSubscriptionInsights(subscription: any) {
  const insights = []
  const now = new Date()
  
  // Trial insights
  if (subscription.subscription.status === 'trial' && subscription.subscription.trialEndsAt) {
    const daysRemaining = Math.ceil((new Date(subscription.subscription.trialEndsAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysRemaining <= 3) {
      insights.push({
        type: 'warning',
        title: 'Trial Ending Soon ⚠️',
        message: `Your trial ends in ${daysRemaining} days`,
        action: 'upgrade'
      })
    } else if (daysRemaining <= 7) {
      insights.push({
        type: 'info',
        title: 'Trial Period',
        message: `${daysRemaining} days remaining in your trial`,
        action: 'explore_features'
      })
    }
  }
  
  // ROI insights
  if (subscription.valueMetrics.roiPercentage > 100) {
    insights.push({
      type: 'success',
      title: 'Excellent ROI 🎯',
      message: `Your subscription is generating ${Math.round(subscription.valueMetrics.roiPercentage)}% return`,
      action: 'continue'
    })
  }
  
  // Usage insights
  if (subscription.usageMetrics.productsCreated > 50) {
    insights.push({
      type: 'success',
      title: 'High Product Usage 📦',
      message: `You've created ${subscription.usageMetrics.productsCreated} products`,
      action: 'analyze_products'
    })
  }
  
  if (subscription.usageMetrics.customersAdded > 100) {
    insights.push({
      type: 'success',
      title: 'Growing Customer Base 👥',
      message: `${subscription.usageMetrics.customersAdded} customers added`,
      action: 'customer_analytics'
    })
  }
  
  return insights
}

function generateRecommendations(subscription: any) {
  const recommendations = []
  
  // Plan upgrade recommendations
  if (subscription.subscription.plan === 'trial' && subscription.usageMetrics.productsCreated > 20) {
    recommendations.push({
      priority: 'high',
      title: 'Upgrade to Paid Plan',
      description: 'You have substantial product data. Upgrade to unlock unlimited features.',
      action: 'upgrade',
      estimatedValue: 'Increase productivity by 40%'
    })
  }
  
  if (subscription.valueMetrics.roiPercentage > 200 && subscription.subscription.plan !== 'yearly') {
    recommendations.push({
      priority: 'medium',
      title: 'Switch to Yearly Plan',
      description: 'Save 20% by switching to yearly billing.',
      action: 'change_billing',
      estimatedValue: 'Save ₹1,000 annually'
    })
  }
  
  // Feature recommendations
  if (subscription.usageMetrics.reportsExported < 5 && subscription.usageMetrics.invoicesGenerated > 50) {
    recommendations.push({
      priority: 'low',
      title: 'Export Sales Reports',
      description: 'Generate detailed reports to analyze your sales performance.',
      action: 'export_reports',
      estimatedValue: 'Gain insights into top products'
    })
  }
  
  return recommendations
}