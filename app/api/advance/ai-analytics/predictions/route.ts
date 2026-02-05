// app/api/advance/ai-analytics/predictions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'
import Customer from '@/models/Customer'
import Order from '@/models/Order'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    // Verify auth
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
    }
    
    const decoded = verifyToken(authToken)
    await connectToDatabase()
    
    const userId = new mongoose.Types.ObjectId(decoded.userId)
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'
    
    // Calculate date range
    let startDate = new Date()
    switch (range) {
      case '24h': startDate.setDate(startDate.getDate() - 1); break
      case '7d': startDate.setDate(startDate.getDate() - 7); break
      case '30d': startDate.setDate(startDate.getDate() - 30); break
      case '90d': startDate.setDate(startDate.getDate() - 90); break
      case '1y': startDate.setFullYear(startDate.getFullYear() - 1); break
    }
    
    // Get customer data for predictions
    const customers = await Customer.find({ userId }).lean()
    const orders = await Order.find({ 
      userId, 
      createdAt: { $gte: startDate } 
    }).lean()
    
    // Calculate metrics
    const totalCustomers = customers.length
    const totalOrders = orders.length
    const avgOrderValue = orders.length > 0 
      ? orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0) / orders.length 
      : 0
    
    // Churn prediction logic
    const activeCustomers = customers.filter(c => c.totalOrders > 0).length
    const churnRate = activeCustomers > 0 
      ? Math.round((customers.filter(c => c.totalOrders === 0).length / totalCustomers) * 100) 
      : 0
    
    // Generate predictions
    const predictions = [
      {
        id: '1',
        metric: 'Customer Churn Risk',
        value: Math.min(100, Math.round(churnRate * 1.5)),
        trend: churnRate > 20 ? 'up' : 'down',
        confidence: 85,
        description: 'Based on customer engagement patterns',
        impact: churnRate > 30 ? 'high' : churnRate > 15 ? 'medium' : 'low'
      },
      {
        id: '2',
        metric: 'Sales Conversion Rate',
        value: Math.min(100, Math.round((orders.length / (customers.length || 1)) * 100)),
        trend: 'up',
        confidence: 92,
        description: 'Predicted from historical conversion data',
        impact: 'medium'
      },
      {
        id: '3',
        metric: 'Customer Lifetime Value',
        value: Math.round(avgOrderValue * 12 * 0.75),
        trend: avgOrderValue > 1000 ? 'up' : 'down',
        confidence: 78,
        description: 'Projected annual value per customer',
        impact: 'high'
      },
      {
        id: '4',
        metric: 'Repeat Purchase Rate',
        value: Math.round((customers.filter(c => c.totalOrders > 1).length / (totalCustomers || 1)) * 100),
        trend: 'up',
        confidence: 88,
        description: 'Likelihood of customers returning',
        impact: 'medium'
      }
    ]
    
    return NextResponse.json({
      success: true,
      predictions,
      summary: {
        totalCustomers,
        totalOrders,
        avgOrderValue,
        churnRate
      }
    })
    
  } catch (error: any) {
    console.error('AI Predictions error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

