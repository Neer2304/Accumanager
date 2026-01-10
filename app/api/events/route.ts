// app/api/events/route.ts - UPDATED WITH PAYMENT SERVICE
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Event from '@/models/Event'
import { verifyToken } from '@/lib/jwt'
import { PaymentService } from '@/services/paymentService'

export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/events - Starting...')
    
    // Get token from request cookies
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('⚠️ No auth token found in request cookies')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(authToken)
      console.log('👤 Decoded user:', decoded.userId)
      
      await connectToDatabase()
      console.log('✅ Database connected')

      // Check subscription status
      const subscription = await PaymentService.checkSubscription(decoded.userId)
      console.log('📊 Subscription status:', subscription)

      if (!subscription.isActive) {
        return NextResponse.json(
          { message: 'Please upgrade your subscription to access event management' },
          { status: 402 }
        )
      }

      const events = await Event.find({ userId: decoded.userId })
        .sort({ createdAt: -1 })
        .select('name description type startDate endDate totalBudget totalSpent status')

      console.log(`📊 Found ${events.length} events`)
      
      return NextResponse.json(events)
    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Get events error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🆕 POST /api/events - Starting...')
    
    // Get token from request cookies
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('❌ No auth token in request')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(authToken)
      console.log('👤 Decoded user:', decoded.userId)
      
      await connectToDatabase()
      console.log('✅ Database connected')

      // Check subscription status and limits
      const subscription = await PaymentService.checkSubscription(decoded.userId)
      
      if (!subscription.isActive) {
        return NextResponse.json(
          { message: 'Please upgrade your subscription to create events' },
          { status: 402 }
        )
      }

      // Check event limit
      const eventCount = await Event.countDocuments({ userId: decoded.userId })
      if (eventCount >= subscription.limits.events) {
        return NextResponse.json(
          { message: `Event limit reached (${subscription.limits.events}). Please upgrade your plan to create more events.` },
          { status: 402 }
        )
      }

      const eventData = await request.json()
      console.log('📦 Received event data:', eventData)

      const event = new Event({
        ...eventData,
        userId: decoded.userId,
      })

      console.log('💾 Saving event to database...')
      await event.save()
      console.log('✅ Event saved successfully:', event._id)

      return NextResponse.json(event, { status: 201 })
    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Create event error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}