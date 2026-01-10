// app/api/billing/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params promise
    const params = await context.params
    const id = params.id
    
    console.log('📄 GET /api/billing/[id] - ID:', id)
    
    if (!id) {
      return NextResponse.json(
        { message: 'Invoice ID is required' }, 
        { status: 400 }
      )
    }
    
    // Check ID format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id)
    
    if (!isValidObjectId) {
      console.log('❌ Invalid ID format:', id)
      return NextResponse.json(
        { 
          message: 'Invalid invoice ID format',
          suggestion: 'Please check the invoice number or ID'
        }, 
        { status: 400 }
      )
    }
    
    // Get token from multiple sources
    const authToken = request.cookies.get('auth_token')?.value
    const authHeader = request.headers.get('authorization')
    
    console.log('🔑 Token check:', {
      cookie: authToken ? 'Present' : 'Missing',
      header: authHeader ? 'Present' : 'Missing'
    })
    
    const token = authHeader?.replace('Bearer ', '') || authToken
    
    if (!token) {
      console.log('❌ No authentication token found')
      return NextResponse.json(
        { message: 'Authentication required. Please login again.' }, 
        { status: 401 }
      )
    }

    try {
      console.log('🔐 Verifying token...')
      const decoded = verifyToken(token)
      
      if (!decoded.userId) {
        console.log('❌ No userId in decoded token')
        return NextResponse.json(
          { message: 'Invalid token structure' }, 
          { status: 401 }
        )
      }
      
      console.log('👤 Decoded token info:', {
        userId: decoded.userId,
        email: decoded.email,
        userIdType: typeof decoded.userId
      })
      
      console.log('📊 Connecting to database...')
      await connectToDatabase()
      console.log('✅ Database connected')
      
      const orderId = new mongoose.Types.ObjectId(id)
      
      // Find order
      const order = await Order.findOne({
        _id: orderId,
        userId: decoded.userId
      }).lean()
      
      if (!order) {
        console.log('❌ Order not found for this user')
        
        // Debug: Check if order exists at all
        const anyOrder = await Order.findById(orderId).lean()
        if (anyOrder) {
          console.log('📋 Order exists but userId mismatch:', {
            orderUserId: anyOrder.userId?.toString(),
            currentUserId: decoded.userId?.toString()
          })
        }
        
        return NextResponse.json(
          { message: 'Invoice not found or you do not have permission to view it.' }, 
          { status: 404 }
        )
      }

      console.log('✅ Order found for user:', order.invoiceNumber)
      return NextResponse.json(order)
      
    } catch (authError: any) {
      console.error('❌ Authentication error:', authError.message)
      
      if (authError.message.includes('Token expired')) {
        return NextResponse.json(
          { message: 'Your session has expired. Please login again.' }, 
          { status: 401 }
        )
      } else if (authError.message.includes('Invalid token')) {
        return NextResponse.json(
          { message: 'Invalid authentication. Please login again.' }, 
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { message: 'Authentication failed: ' + authError.message }, 
        { status: 401 }
      )
    }
  } catch (error: any) {
    console.error('❌ Get order error:', error.message)
    
    return NextResponse.json(
      { message: 'Internal server error: ' + error.message }, 
      { status: 500 }
    )
  }
}