// app/api/events/[id]/route.ts - UPDATED WITH PAYMENT SERVICE
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Event from '@/models/Event'
import { verifyToken } from '@/lib/jwt'
import { PaymentService } from '@/services/paymentService'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('🔍 GET /api/events/[id] - Starting...')
    
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
          { message: 'Please upgrade your subscription to view event details' },
          { status: 402 }
        )
      }

      const { id } = await params
      console.log('🎯 Event ID:', id)

      const event = await Event.findOne({ 
        _id: id, 
        userId: decoded.userId 
      })

      if (!event) {
        console.log('❌ Event not found')
        return NextResponse.json({ message: 'Event not found' }, { status: 404 })
      }

      console.log(`📦 Found event: ${event.name}`)
      
      return NextResponse.json(event)
    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Get event error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}