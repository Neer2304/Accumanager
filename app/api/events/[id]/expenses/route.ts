// app/api/events/[id]/expenses/route.ts - UPDATED WITH PAYMENT SERVICE
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Event from '@/models/Event'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'
import { PaymentService } from '@/services/paymentService'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('💰 POST /api/events/[id]/expenses - Starting...')
    
    // Get token from request cookies
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('⚠️ No auth token found in request cookies')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔐 Token found, verifying...')
    
    // Verify token first
    let decoded;
    try {
      decoded = verifyToken(authToken)
      console.log('✅ Token verified for user:', decoded.userId)
    } catch (authError: any) {
      console.error('❌ Token verification failed:', authError.message)
      return NextResponse.json({ message: 'Invalid token: ' + authError.message }, { status: 401 })
    }

    await connectToDatabase()
    console.log('✅ Database connected')

    // Check subscription status
    const subscription = await PaymentService.checkSubscription(decoded.userId)
    
    if (!subscription.isActive) {
      return NextResponse.json(
        { message: 'Please upgrade your subscription to manage event expenses' },
        { status: 402 }
      )
    }

    const { id } = await params
    console.log('🎯 Event ID:', id)

    const expenseData = await request.json()
    console.log('📦 Received expense data:', expenseData)

    // Validate required fields
    if (!expenseData.description || !expenseData.amount || !expenseData.category) {
      return NextResponse.json(
        { message: 'Missing required fields: description, amount, or category' },
        { status: 400 }
      )
    }

    // Check expense amount limit if defined in subscription
    if (subscription.limits.maxExpenseAmount && expenseData.amount > subscription.limits.maxExpenseAmount) {
      return NextResponse.json(
        { message: `Expense amount exceeds your plan limit of ₹${subscription.limits.maxExpenseAmount}. Please upgrade your plan.` },
        { status: 402 }
      )
    }

    // FIX: Handle empty subEventId - convert empty string to undefined
    const cleanExpenseData = {
      ...expenseData,
      subEventId: expenseData.subEventId || undefined
    }

    console.log('🧹 Cleaned expense data:', cleanExpenseData)

    const event = await Event.findOne({ 
      _id: id, 
      userId: decoded.userId 
    })

    if (!event) {
      console.log('❌ Event not found')
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }

    // Add expense with a new ObjectId
    const newExpense = {
      _id: new mongoose.Types.ObjectId(),
      ...cleanExpenseData,
      createdAt: new Date(),
    }

    event.expenses.push(newExpense)
    
    // Update total spent
    event.totalSpent += cleanExpenseData.amount
    
    // Update sub-event spent amount if applicable - only if subEventId exists
    if (cleanExpenseData.subEventId) {
      const subEvent = event.subEvents.id(cleanExpenseData.subEventId)
      if (subEvent) {
        subEvent.spentAmount += cleanExpenseData.amount
        console.log('📊 Updated sub-event spent amount:', subEvent.name, subEvent.spentAmount)
      } else {
        console.log('⚠️ Sub-event not found:', cleanExpenseData.subEventId)
      }
    }

    console.log('💾 Saving event with new expense...')
    await event.save()
    console.log('✅ Expense added successfully. New total spent:', event.totalSpent)

    return NextResponse.json(newExpense, { status: 201 })
  } catch (error: any) {
    console.error('❌ Add expense error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}