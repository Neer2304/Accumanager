// app/api/events/[id]/expenses/[expenseId]/route.ts - UPDATED WITH PAYMENT SERVICE
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Event from '@/models/Event'
import { verifyToken } from '@/lib/jwt'
import { PaymentService } from '@/services/paymentService'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; expenseId: string }> }) {
  try {
    console.log('🗑️ DELETE /api/events/[id]/expenses/[expenseId] - Starting...')
    
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
          { message: 'Please upgrade your subscription to manage event expenses' },
          { status: 402 }
        )
      }

      const { id, expenseId } = await params
      console.log('🎯 Event ID:', id, 'Expense ID:', expenseId)

      const event = await Event.findOne({ 
        _id: id, 
        userId: decoded.userId 
      })

      if (!event) {
        console.log('❌ Event not found')
        return NextResponse.json({ message: 'Event not found' }, { status: 404 })
      }

      // Find the expense to get its amount
      const expense = event.expenses.id(expenseId)
      if (!expense) {
        console.log('❌ Expense not found')
        return NextResponse.json({ message: 'Expense not found' }, { status: 404 })
      }

      console.log('🔍 Found expense to delete:', expense.description, 'Amount:', expense.amount)

      // Remove expense and update totals
      event.totalSpent -= expense.amount
      
      // Update sub-event spent amount if applicable
      if (expense.subEventId) {
        const subEvent = event.subEvents.id(expense.subEventId)
        if (subEvent) {
          subEvent.spentAmount -= expense.amount
          console.log('📊 Updated sub-event spent amount:', subEvent.spentAmount)
        }
      }

      // Remove the expense
      event.expenses.pull({ _id: expenseId })
      
      console.log('💾 Saving event after expense deletion...')
      await event.save()

      console.log('✅ Expense deleted successfully. New total spent:', event.totalSpent)
      
      return NextResponse.json({ message: 'Expense deleted successfully' })
    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Delete expense error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}