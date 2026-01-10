import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import mongoose from 'mongoose'

// Correct way to type params in Next.js App Router
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // IMPORTANT: In Next.js 15, params is a Promise that needs to be awaited
    const params = await context.params
    const id = params.id
    
    console.log('🔍 Debug endpoint called')
    console.log('📋 ID from params:', id)
    console.log('📏 ID length:', id?.length || 0)
    console.log('🔠 ID characters:', id)
    
    // Check if id is undefined
    if (!id) {
      return NextResponse.json({
        error: 'No ID provided in URL',
        url: request.url,
        suggestion: 'Make sure the URL is /api/billing/debug/YOUR_ID_HERE'
      }, { status: 400 })
    }
    
    // Check ID format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id)
    console.log('✅ Is valid ObjectId?', isValidObjectId)
    
    if (!isValidObjectId) {
      return NextResponse.json({
        error: 'Invalid ID format',
        id: id,
        idLength: id.length,
        expectedFormat: '24 hex characters (0-9, a-f)',
        isValid: isValidObjectId,
        suggestion: 'Check if this is the correct invoice ID'
      }, { status: 400 })
    }
    
    console.log('📊 Connecting to database...')
    await connectToDatabase()
    console.log('✅ Database connected')
    
    // Try to find by ObjectId
    const order = await Order.findById(new mongoose.Types.ObjectId(id)).lean()
    
    if (!order) {
      // Try alternative: search by invoice number
      const orderByInvoice = await Order.findOne({ 
        invoiceNumber: id 
      }).lean()
      
      if (orderByInvoice) {
        return NextResponse.json({
          success: true,
          foundBy: 'invoiceNumber',
          order: {
            id: orderByInvoice._id,
            invoiceNumber: orderByInvoice.invoiceNumber,
            userId: orderByInvoice.userId,
            customerName: orderByInvoice.customer?.name,
            date: orderByInvoice.invoiceDate
          }
        })
      }
      
      return NextResponse.json({
        error: 'Order not found',
        id: id,
        searchedBy: ['_id', 'invoiceNumber']
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      foundBy: '_id',
      order: {
        id: order._id,
        invoiceNumber: order.invoiceNumber,
        userId: order.userId,
        userIdType: typeof order.userId,
        userIdString: order.userId?.toString(),
        customerName: order.customer?.name,
        itemsCount: order.items?.length || 0,
        grandTotal: order.grandTotal
      }
    })
    
  } catch (error: any) {
    console.error('❌ Debug endpoint error:', error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}