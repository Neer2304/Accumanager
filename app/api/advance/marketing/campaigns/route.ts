import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import MarketingCampaign from '@/models/MarketingCampaign'
import Customer from '@/models/Customer'
import { verifyToken } from '@/lib/jwt'

// GET - Get all campaigns for the user
export async function GET(request: NextRequest) {
  try {
    console.log('📧 GET /api/advance/marketing/campaigns - Fetching campaigns...')
    
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
    const campaigns = await MarketingCampaign.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean()

    console.log(`✅ Found ${campaigns.length} campaigns for user ${user.email}`)

    return NextResponse.json({
      success: true,
      data: campaigns,
      message: 'Campaigns fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Campaigns GET error:', error)
    
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

// POST - Create new campaign
export async function POST(request: NextRequest) {
  try {
    console.log('📧 POST /api/advance/marketing/campaigns - Creating campaign...')
    
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

    // Parse request body
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.type || !data.segment) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: name, type, segment'
      }, { status: 400 })
    }

    await connectToDatabase()

    // Get user
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'User not found' 
      }, { status: 404 })
    }

    // Get segment customer count
    let customerCount = 0
    if (data.segment) {
      // Count customers based on segment criteria
      // This is a simplified version - you'd want to implement proper segment logic
      const totalCustomers = await Customer.countDocuments({ userId: user._id })
      
      // For now, use percentage of total customers based on segment type
      const segmentPercentages: Record<string, number> = {
        'all_customers': 1.0,
        'active_customers': 0.6,
        'new_customers': 0.3,
        'frequent_buyers': 0.2,
        'high_value': 0.1,
        'inactive_customers': 0.4,
      }
      
      customerCount = Math.floor(totalCustomers * (segmentPercentages[data.segment] || 0.5))
    }

    // Create new campaign
    const campaign = new MarketingCampaign({
      userId: user._id,
      name: data.name,
      type: data.type,
      segment: data.segment,
      status: 'draft',
      recipients: customerCount,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      template: data.template || 'default',
      content: data.content || '',
      subject: data.subject || '',
      metadata: {
        scheduleType: data.scheduleType || 'immediate',
        autoOptimize: data.autoOptimize || false,
        createdFrom: 'web',
      },
      createdAt: new Date(),
      scheduledFor: data.scheduleType === 'scheduled' && data.scheduledDate 
        ? new Date(data.scheduledDate)
        : null,
    })

    await campaign.save()

    console.log(`✅ Campaign created: ${campaign.name}`)

    return NextResponse.json({
      success: true,
      data: campaign,
      message: 'Campaign created successfully'
    })

  } catch (error: any) {
    console.error('❌ Campaigns POST error:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 })
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

// Helper function to extract token
async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Check cookies
  const authToken = request.cookies.get('auth_token')?.value
  if (authToken) {
    return authToken
  }
  
  return null
}