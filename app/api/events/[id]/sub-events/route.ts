// app/api/events/[id]/sub-events/route.ts - UPDATED WITH PAYMENT SERVICE
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Event from '@/models/Event'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'
import { PaymentService } from '@/services/paymentService'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('🎯 POST /api/events/[id]/sub-events - Starting...')
    
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
      
      if (!subscription.isActive) {
        return NextResponse.json(
          { message: 'Please upgrade your subscription to manage sub-events' },
          { status: 402 }
        )
      }

      const { id } = await params
      console.log('🎯 Event ID:', id)

      const subEventData = await request.json()
      console.log('📦 Received sub-event data:', subEventData)

      const event = await Event.findOne({ 
        _id: id, 
        userId: decoded.userId 
      })

      if (!event) {
        console.log('❌ Event not found')
        return NextResponse.json({ message: 'Event not found' }, { status: 404 })
      }

      // Check sub-event limit if defined
      if (subscription.limits.maxSubEvents && event.subEvents.length >= subscription.limits.maxSubEvents) {
        return NextResponse.json(
          { message: `Sub-event limit reached (${subscription.limits.maxSubEvents}). Please upgrade your plan.` },
          { status: 402 }
        )
      }

      // Add sub-event with a new ObjectId
      const newSubEvent = {
        _id: new mongoose.Types.ObjectId(),
        ...subEventData,
        spentAmount: 0,
        status: 'planned',
        createdAt: new Date(),
      }

      event.subEvents.push(newSubEvent)
      
      console.log('💾 Saving event with new sub-event...')
      await event.save()
      console.log('✅ Sub-event added successfully')

      return NextResponse.json(newSubEvent, { status: 201 })
    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Add sub-event error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}