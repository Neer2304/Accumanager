// app/api/advance/analytics/marketing/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'

// Mock data for marketing campaigns (replace with actual model)
const mockCampaigns = [
  {
    id: '1',
    name: 'Welcome Series',
    type: 'email',
    status: 'active',
    sent: 1250,
    opens: 850,
    clicks: 320,
    conversions: 45,
    revenue: 4500,
    cost: 500,
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  },
  {
    id: '2',
    name: 'Cart Abandonment',
    type: 'sms',
    status: 'paused',
    sent: 845,
    opens: 620,
    clicks: 270,
    conversions: 32,
    revenue: 3200,
    cost: 300,
    startDate: '2024-01-15',
    endDate: '2024-02-15'
  },
  // Add more mock campaigns...
]

export async function GET(request: NextRequest) {
  try {
    console.log('📧 GET /api/advance/analytics/marketing - Starting...')
    
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
    console.log('✅ Database connected for marketing analytics')

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

    // Filter campaigns by date
    const filteredCampaigns = mockCampaigns.filter(campaign => {
      const campaignDate = new Date(campaign.startDate)
      return campaignDate >= startDate && campaignDate <= endDate
    })

    // Calculate metrics
    const totalCampaigns = filteredCampaigns.length
    const activeCampaigns = filteredCampaigns.filter(c => c.status === 'active').length
    const totalSent = filteredCampaigns.reduce((sum, c) => sum + c.sent, 0)
    const totalOpens = filteredCampaigns.reduce((sum, c) => sum + c.opens, 0)
    const totalClicks = filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0)
    const totalConversions = filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0)
    const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0)
    const totalCost = filteredCampaigns.reduce((sum, c) => sum + c.cost, 0)

    // Calculate rates
    const openRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0
    const clickRate = totalOpens > 0 ? (totalClicks / totalOpens) * 100 : 0
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
    const roas = totalCost > 0 ? (totalRevenue / totalCost) : 0
    const cpa = totalConversions > 0 ? (totalCost / totalConversions) : 0

    // Monthly trend data
    const monthlyTrend = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date()
      month.setMonth(month.getMonth() - i)
      const monthName = monthNames[month.getMonth()]
      
      const monthCampaigns = filteredCampaigns.filter(campaign => {
        const campaignDate = new Date(campaign.startDate)
        return campaignDate.getMonth() === month.getMonth() && 
               campaignDate.getFullYear() === month.getFullYear()
      })
      
      const monthRevenue = monthCampaigns.reduce((sum, c) => sum + c.revenue, 0)
      const monthConversions = monthCampaigns.reduce((sum, c) => sum + c.conversions, 0)
      const monthCost = monthCampaigns.reduce((sum, c) => sum + c.cost, 0)
      
      monthlyTrend.push({
        month: monthName,
        revenue: monthRevenue,
        conversions: monthConversions,
        cost: monthCost,
        roas: monthCost > 0 ? (monthRevenue / monthCost) : 0,
        campaigns: monthCampaigns.length
      })
    }

    // Campaign type breakdown
    const campaignTypes = filteredCampaigns.reduce((acc, campaign) => {
      if (!acc[campaign.type]) {
        acc[campaign.type] = { campaigns: 0, revenue: 0, conversions: 0 }
      }
      acc[campaign.type].campaigns += 1
      acc[campaign.type].revenue += campaign.revenue
      acc[campaign.type].conversions += campaign.conversions
      return acc
    }, {} as Record<string, any>)

    const typeBreakdown = Object.entries(campaignTypes).map(([type, data]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      campaigns: data.campaigns,
      revenue: data.revenue,
      conversions: data.conversions
    }))

    // Top performing campaigns
    const topCampaigns = [...filteredCampaigns]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(campaign => ({
        ...campaign,
        roas: campaign.cost > 0 ? (campaign.revenue / campaign.cost).toFixed(2) : '0',
        openRate: ((campaign.opens / campaign.sent) * 100).toFixed(1) + '%',
        conversionRate: ((campaign.conversions / campaign.clicks) * 100).toFixed(1) + '%'
      }))

    // Prepare response
    const stats = {
      totalCampaigns,
      activeCampaigns,
      totalSent,
      totalOpens,
      totalClicks,
      totalConversions,
      totalRevenue,
      totalCost,
      openRate: openRate.toFixed(1) + '%',
      clickRate: clickRate.toFixed(1) + '%',
      conversionRate: conversionRate.toFixed(1) + '%',
      roas: roas.toFixed(2),
      cpa: cpa.toFixed(2),
      revenuePerCampaign: totalCampaigns > 0 ? Math.round(totalRevenue / totalCampaigns) : 0
    }

    console.log('✅ Marketing Analytics data prepared successfully')

    return NextResponse.json({
      success: true,
      data: {
        stats,
        monthlyTrend,
        typeBreakdown,
        topCampaigns,
        allCampaigns: filteredCampaigns,
        timeRange,
        period: {
          startDate,
          endDate
        }
      },
      message: 'Marketing analytics data fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Marketing Analytics API error:', error)
    
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