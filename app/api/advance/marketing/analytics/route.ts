import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import MarketingCampaign from '@/models/MarketingCampaign'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/advance/marketing/analytics - Fetching analytics...')
    
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

    // Get all campaigns for this user
    const campaigns = await MarketingCampaign.find({ userId: user._id }).lean()

    // Calculate analytics
    const totalCampaigns = campaigns.length
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length
    const draftCampaigns = campaigns.filter(c => c.status === 'draft').length
    const completedCampaigns = campaigns.filter(c => c.status === 'completed').length

    // Calculate totals
    const totalRecipients = campaigns.reduce((sum, c) => sum + (c.recipients || 0), 0)
    const totalSent = campaigns.reduce((sum, c) => sum + (c.sent || 0), 0)
    const totalDelivered = campaigns.reduce((sum, c) => sum + (c.delivered || 0), 0)
    const totalOpened = campaigns.reduce((sum, c) => sum + (c.opened || 0), 0)
    const totalClicked = campaigns.reduce((sum, c) => sum + (c.clicked || 0), 0)
    const totalConverted = campaigns.reduce((sum, c) => sum + (c.converted || 0), 0)
    const totalRevenue = campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0)

    // Calculate average rates
    const averageOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
    const averageClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0
    const averageConversionRate = totalSent > 0 ? (totalConverted / totalSent) * 100 : 0

    // Get top performing campaigns (completed campaigns sorted by revenue)
    const topPerforming = campaigns
      .filter(c => c.status === 'completed' && c.revenue > 0)
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 5)

    // Get recent campaigns
    const recentCampaigns = campaigns
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    const analytics = {
      totalCampaigns,
      activeCampaigns,
      draftCampaigns,
      completedCampaigns,
      averageOpenRate: parseFloat(averageOpenRate.toFixed(1)),
      averageClickRate: parseFloat(averageClickRate.toFixed(1)),
      averageConversionRate: parseFloat(averageConversionRate.toFixed(1)),
      totalRevenue,
      totalRecipients,
      totalSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalConverted,
      topPerforming,
      recentCampaigns,
    }

    console.log(`✅ Analytics calculated for ${totalCampaigns} campaigns`)

    return NextResponse.json({
      success: true,
      data: analytics,
      message: 'Analytics fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Analytics GET error:', error)
    
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
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  const authToken = request.cookies.get('auth_token')?.value
  if (authToken) {
    return authToken
  }
  
  return null
}