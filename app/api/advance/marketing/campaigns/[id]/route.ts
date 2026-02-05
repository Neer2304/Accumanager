import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import MarketingCampaign from '@/models/MarketingCampaign'
import { verifyToken } from '@/lib/jwt'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📧 PUT /api/advance/marketing/campaigns/${params.id} - Updating campaign...`)
    
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    const data = await request.json()
    
    await connectToDatabase()

    // Find campaign
    const campaign = await MarketingCampaign.findOne({ 
      _id: params.id,
      userId: userId 
    })

    if (!campaign) {
      return NextResponse.json({ 
        success: false,
        message: 'Campaign not found' 
      }, { status: 404 })
    }

    // Update allowed fields
    if (data.status && ['draft', 'active', 'paused', 'completed', 'cancelled'].includes(data.status)) {
      campaign.status = data.status
      
      // Update timestamps based on status changes
      if (data.status === 'active' && campaign.status !== 'active') {
        campaign.sentAt = new Date()
      }
      if (data.status === 'completed' && campaign.status !== 'completed') {
        campaign.completedAt = new Date()
      }
    }
    
    if (data.name !== undefined) {
      campaign.name = data.name
    }
    
    if (data.scheduledFor !== undefined) {
      campaign.scheduledFor = data.scheduledFor ? new Date(data.scheduledFor) : null
    }
    
    if (data.content !== undefined) {
      campaign.content = data.content
    }
    
    if (data.subject !== undefined) {
      campaign.subject = data.subject
    }

    await campaign.save()

    console.log(`✅ Campaign updated: ${campaign.name} (${campaign.status})`)

    return NextResponse.json({
      success: true,
      data: campaign,
      message: 'Campaign updated successfully'
    })

  } catch (error: any) {
    console.error('❌ Campaign PUT error:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📧 DELETE /api/advance/marketing/campaigns/${params.id} - Deleting campaign...`)
    
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

    // Find and delete campaign
    const result = await MarketingCampaign.findOneAndDelete({ 
      _id: params.id,
      userId: userId 
    })

    if (!result) {
      return NextResponse.json({ 
        success: false,
        message: 'Campaign not found' 
      }, { status: 404 })
    }

    console.log(`✅ Campaign deleted: ${result.name}`)

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully',
      data: null
    })

  } catch (error: any) {
    console.error('❌ Campaign DELETE error:', error)
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