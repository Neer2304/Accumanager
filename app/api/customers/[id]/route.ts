// app/api/customers/[id]/route.ts - COMPLETE FIXED VERSION FOR NEXT.JS 15+
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Customer from '@/models/Customer'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'
import { PaymentService } from '@/services/paymentService'
import mongoose from 'mongoose'

// Helper function to verify auth and subscription
async function verifyAuthAndSubscription(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    const authHeader = request.headers.get('authorization')
    
    const token = authHeader?.replace('Bearer ', '') || authToken
    
    if (!token) {
      throw new Error('Authentication required')
    }
    
    const decoded = verifyToken(token)
    await connectToDatabase()
    
    const subscription = await PaymentService.checkSubscription(decoded.userId)
    if (!subscription.isActive) {
      throw new Error('Your subscription has expired. Please upgrade to continue managing customers.')
    }
    
    return { 
      userId: decoded.userId, 
      subscription,
      userEmail: decoded.email 
    }
  } catch (error: any) {
    console.error('❌ Customer Token verification failed:', error)
    throw new Error('Authentication required')
  }
}

// ===========================================
// GET /api/customers/[id] - Get single customer with orders
// ===========================================
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // ✅ IMPORTANT: Await the params (Next.js 15+ fix)
    const params = await context.params
    const customerIdParam = params.id
    
    console.log(`🔍 GET /api/customers/${customerIdParam} - Starting...`)
    
    if (!customerIdParam) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Customer ID is required' 
        },
        { status: 400 }
      )
    }
    
    const { userId } = await verifyAuthAndSubscription(request)
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(customerIdParam)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid customer ID format' 
        },
        { status: 400 }
      )
    }

    const customerObjectId = new mongoose.Types.ObjectId(customerIdParam)

    // Get customer with all details
    const customer = await Customer.findOne({ 
      _id: customerObjectId,
      userId: userId 
    }).lean()

    if (!customer) {
      return NextResponse.json({ 
        success: false,
        message: 'Customer not found' 
      }, { status: 404 })
    }

    console.log('✅ Customer found:', customer.name, 'Phone:', customer.phone)

    // Get orders with MULTIPLE query strategies for backward compatibility
    const orders = await Order.find({
      userId: userId,
      $or: [
        // Strategy 1: By customerId as string (recommended)
        { 'customer.customerId': customerIdParam },
        // Strategy 2: By customerId as ObjectId
        { 'customer.customerId': customerObjectId },
        // Strategy 3: By customerId as ObjectId string
        { 'customer.customerId': customerObjectId.toString() },
        // Strategy 4: By phone number (works for old orders)
        { 'customer.phone': customer.phone },
        // Strategy 5: By name (last resort)
        { 'customer.name': customer.name }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()

    console.log(`📦 Found ${orders.length} orders for customer ${customer.name}`)

    // Calculate statistics
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0)
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    const pendingPayments = orders
      .filter(order => order.paymentStatus === 'pending')
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0)
    
    const totalCgst = orders.reduce((sum, order) => sum + (order.totalCgst || 0), 0)
    const totalSgst = orders.reduce((sum, order) => sum + (order.totalSgst || 0), 0)
    const totalIgst = orders.reduce((sum, order) => sum + (order.totalIgst || 0), 0)

    // Calculate days since last order
    const daysSinceLastOrder = customer.lastOrderDate 
      ? Math.floor((new Date().getTime() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
      : null

    // Payment summary
    const paymentSummary = {
      pending: orders.filter(o => o.paymentStatus === 'pending').length,
      completed: orders.filter(o => o.paymentStatus === 'completed').length,
      failed: orders.filter(o => o.paymentStatus === 'failed').length
    }

    // Order status summary
    const orderStatusSummary = {
      completed: orders.filter(o => o.status === 'completed').length,
      pending: orders.filter(o => o.status === 'pending').length,
      draft: orders.filter(o => o.status === 'draft').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    }

    // Transform customer data to match frontend expectations
    const transformedCustomer = {
      _id: customer._id.toString(),
      id: customer._id.toString(),
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      company: customer.company || '',
      address: customer.address || '',
      state: customer.state || '',
      city: customer.city || '',
      pincode: customer.pincode || '',
      gstin: customer.gstin || '',
      gstNumber: customer.gstin || '',
      isInterState: customer.isInterState || false,
      totalOrders: customer.totalOrders || 0,
      totalPurchases: customer.totalOrders || 0,
      totalSpent: customer.totalSpent || 0,
      lastOrderDate: customer.lastOrderDate || null,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      userId: customer.userId,
      notes: customer.notes || '',
      tags: customer.tags || []
    }

    // Transform recent orders (last 10)
    const recentOrders = orders.slice(0, 10).map(order => ({
      _id: order._id.toString(),
      id: order._id.toString(),
      invoiceNumber: order.invoiceNumber,
      invoiceDate: order.invoiceDate,
      amount: order.grandTotal,
      subtotal: order.subtotal,
      discount: order.totalDiscount,
      tax: (order.totalCgst || 0) + (order.totalSgst || 0) + (order.totalIgst || 0),
      paymentStatus: order.paymentStatus,
      status: order.status,
      itemsCount: order.items?.length || 0,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }))

    // Transform all orders
    const allOrders = orders.map(order => ({
      _id: order._id.toString(),
      id: order._id.toString(),
      invoiceNumber: order.invoiceNumber,
      invoiceDate: order.invoiceDate,
      amount: order.grandTotal,
      subtotal: order.subtotal,
      discount: order.totalDiscount,
      tax: (order.totalCgst || 0) + (order.totalSgst || 0) + (order.totalIgst || 0),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      items: order.items?.map((item: any) => ({
        productId: item.productId?.toString(),
        name: item.name,
        hsnCode: item.hsnCode,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
        taxableAmount: item.taxableAmount,
        cgstRate: item.cgstRate,
        sgstRate: item.sgstRate,
        igstRate: item.igstRate,
        cgstAmount: item.cgstAmount,
        sgstAmount: item.sgstAmount,
        igstAmount: item.igstAmount,
        total: item.total,
        stockDeducted: item.stockDeducted
      })) || [],
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }))

    return NextResponse.json({
      success: true,
      customer: transformedCustomer,
      statistics: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        pendingPayments,
        totalCgst,
        totalSgst,
        totalIgst,
        daysSinceLastOrder,
        paymentSummary,
        orderStatusSummary
      },
      recentOrders,
      allOrders
    })

  } catch (error: any) {
    console.error('❌ GET Customer error:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    if (error.message.includes('subscription')) {
      return NextResponse.json({ 
        success: false,
        message: error.message 
      }, { status: 403 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// ===========================================
// PUT /api/customers/[id] - Update customer
// ===========================================
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // ✅ IMPORTANT: Await the params (Next.js 15+ fix)
    const params = await context.params
    const customerIdParam = params.id
    
    console.log(`🔄 PUT /api/customers/${customerIdParam} - Starting...`)
    
    const { userId } = await verifyAuthAndSubscription(request)

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(customerIdParam)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid customer ID format' 
        },
        { status: 400 }
      )
    }

    const customerId = new mongoose.Types.ObjectId(customerIdParam)
    const updateData = await request.json()
    
    console.log('📦 Update data received:', updateData)

    // Check if customer exists
    const existingCustomer = await Customer.findOne({ 
      _id: customerId,
      userId: userId 
    })

    if (!existingCustomer) {
      return NextResponse.json({ 
        success: false,
        message: 'Customer not found' 
      }, { status: 404 })
    }

    // Validate required fields
    if (updateData.name !== undefined && !updateData.name?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Customer name is required' 
        },
        { status: 400 }
      )
    }

    if (updateData.phone !== undefined && !updateData.phone?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Customer phone number is required' 
        },
        { status: 400 }
      )
    }

    // Validate phone number format
    if (updateData.phone) {
      const phoneRegex = /^[6-9]\d{9}$/
      const cleanPhone = updateData.phone.trim().replace(/\D/g, '')
      
      if (!phoneRegex.test(cleanPhone)) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Please enter a valid 10-digit Indian phone number' 
          },
          { status: 400 }
        )
      }

      // Check for duplicate phone number
      if (cleanPhone !== existingCustomer.phone) {
        const phoneConflict = await Customer.findOne({
          phone: cleanPhone,
          userId,
          _id: { $ne: customerId }
        })
        
        if (phoneConflict) {
          return NextResponse.json(
            { 
              success: false,
              message: 'Another customer already uses this phone number' 
            },
            { status: 400 }
          )
        }
      }
      
      updateData.phone = cleanPhone
    }

    // Validate email if provided
    if (updateData.email && updateData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      if (!emailRegex.test(updateData.email.trim())) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Please enter a valid email address' 
          },
          { status: 400 }
        )
      }

      // Check for duplicate email
      if (updateData.email.trim() !== existingCustomer.email) {
        const emailConflict = await Customer.findOne({
          email: updateData.email.trim(),
          userId,
          _id: { $ne: customerId }
        })
        
        if (emailConflict) {
          return NextResponse.json(
            { 
              success: false,
              message: 'Another customer already uses this email' 
            },
            { status: 400 }
          )
        }
      }
      
      updateData.email = updateData.email.trim()
    }

    // Clean and prepare update data
    const cleanUpdateData: any = {}
    
    if (updateData.name !== undefined) {
      cleanUpdateData.name = updateData.name.trim() || ''
    }
    
    if (updateData.email !== undefined) {
      cleanUpdateData.email = updateData.email?.trim() || ''
    }
    
    if (updateData.phone !== undefined) {
      cleanUpdateData.phone = updateData.phone.trim()
    }
    
    if (updateData.company !== undefined) {
      cleanUpdateData.company = updateData.company?.trim() || ''
    }
    
    if (updateData.address !== undefined) {
      cleanUpdateData.address = updateData.address?.trim() || ''
    }
    
    if (updateData.state !== undefined) {
      cleanUpdateData.state = updateData.state?.trim() || ''
    }
    
    if (updateData.city !== undefined) {
      cleanUpdateData.city = updateData.city?.trim() || ''
    }
    
    if (updateData.pincode !== undefined) {
      cleanUpdateData.pincode = updateData.pincode?.trim() || ''
    }
    
    if (updateData.gstin !== undefined) {
      cleanUpdateData.gstin = updateData.gstin?.trim().toUpperCase() || ''
    }
    
    if (updateData.isInterState !== undefined) {
      cleanUpdateData.isInterState = Boolean(updateData.isInterState)
    }
    
    if (updateData.notes !== undefined) {
      cleanUpdateData.notes = updateData.notes?.trim() || ''
    }
    
    if (updateData.tags !== undefined) {
      cleanUpdateData.tags = Array.isArray(updateData.tags) ? updateData.tags : []
    }

    console.log('🧹 Cleaned update data:', cleanUpdateData)

    // Update customer
    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: customerId, userId: userId },
      { $set: cleanUpdateData },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedCustomer) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Customer update failed' 
        },
        { status: 500 }
      )
    }

    // 🔥 IMPORTANT: Also update customer details in all associated orders
    try {
      const orderUpdateData: any = {}
      if (cleanUpdateData.name) orderUpdateData['customer.name'] = cleanUpdateData.name
      if (cleanUpdateData.phone) orderUpdateData['customer.phone'] = cleanUpdateData.phone
      if (cleanUpdateData.email) orderUpdateData['customer.email'] = cleanUpdateData.email
      if (cleanUpdateData.gstin) orderUpdateData['customer.gstin'] = cleanUpdateData.gstin
      if (cleanUpdateData.state) orderUpdateData['customer.state'] = cleanUpdateData.state
      if (cleanUpdateData.address) orderUpdateData['customer.address'] = cleanUpdateData.address
      if (cleanUpdateData.isInterState !== undefined) {
        orderUpdateData['customer.isInterState'] = cleanUpdateData.isInterState
      }

      if (Object.keys(orderUpdateData).length > 0) {
        const orderUpdateResult = await Order.updateMany(
          { 
            userId: userId,
            $or: [
              { 'customer.customerId': customerIdParam },
              { 'customer.customerId': customerId },
              { 'customer.customerId': customerId.toString() },
              { 'customer.phone': existingCustomer.phone }
            ]
          },
          { $set: orderUpdateData }
        )
        console.log(`📦 Updated ${orderUpdateResult.modifiedCount} orders with new customer details`)
      }
    } catch (orderError) {
      console.warn('⚠️ Failed to update orders:', orderError)
      // Don't fail the request if order update fails
    }

    // Transform response
    const transformedCustomer = {
      _id: updatedCustomer._id.toString(),
      id: updatedCustomer._id.toString(),
      name: updatedCustomer.name || '',
      phone: updatedCustomer.phone || '',
      email: updatedCustomer.email || '',
      company: updatedCustomer.company || '',
      address: updatedCustomer.address || '',
      state: updatedCustomer.state || '',
      city: updatedCustomer.city || '',
      pincode: updatedCustomer.pincode || '',
      gstin: updatedCustomer.gstin || '',
      gstNumber: updatedCustomer.gstin || '',
      isInterState: updatedCustomer.isInterState || false,
      totalOrders: updatedCustomer.totalOrders || 0,
      totalPurchases: updatedCustomer.totalOrders || 0,
      totalSpent: updatedCustomer.totalSpent || 0,
      lastOrderDate: updatedCustomer.lastOrderDate || null,
      createdAt: updatedCustomer.createdAt,
      updatedAt: updatedCustomer.updatedAt,
      userId: updatedCustomer.userId,
      notes: updatedCustomer.notes || '',
      tags: updatedCustomer.tags || []
    }

    console.log('✅ Customer updated successfully:', updatedCustomer.name)

    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully',
      customer: transformedCustomer
    })

  } catch (error: any) {
    console.error('❌ PUT Customer error:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    if (error.message.includes('subscription')) {
      return NextResponse.json({ 
        success: false,
        message: error.message 
      }, { status: 403 })
    }
    
    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json(
        { 
          success: false,
          message: `Customer with this ${field} already exists` 
        },
        { status: 400 }
      )
    }
    
    // MongoDB validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation failed',
          errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// ===========================================
// DELETE /api/customers/[id] - Delete customer
// ===========================================
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // ✅ IMPORTANT: Await the params (Next.js 15+ fix)
    const params = await context.params
    const customerIdParam = params.id
    
    console.log(`🗑️ DELETE /api/customers/${customerIdParam} - Starting...`)
    
    const { userId } = await verifyAuthAndSubscription(request)

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(customerIdParam)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid customer ID format' 
        },
        { status: 400 }
      )
    }

    const customerId = new mongoose.Types.ObjectId(customerIdParam)

    // First, get customer details for phone fallback
    const customer = await Customer.findOne({ 
      _id: customerId, 
      userId: userId 
    }).lean()

    if (!customer) {
      return NextResponse.json({ 
        success: false,
        message: 'Customer not found' 
      }, { status: 404 })
    }

    // Check if customer has any orders
    const customerOrders = await Order.countDocuments({
      userId: userId,
      $or: [
        { 'customer.customerId': customerIdParam },
        { 'customer.customerId': customerId },
        { 'customer.customerId': customerId.toString() },
        { 'customer.phone': customer.phone }
      ]
    })

    if (customerOrders > 0) {
      console.log(`⚠️ Customer has ${customerOrders} orders, cannot delete`)
      return NextResponse.json(
        { 
          success: false,
          message: `Cannot delete customer with ${customerOrders} existing orders. Please delete orders first or mark customer as inactive.`,
          orderCount: customerOrders
        },
        { status: 400 }
      )
    }

    // Delete customer
    const deletedCustomer = await Customer.findOneAndDelete({ 
      _id: customerId, 
      userId: userId 
    })

    if (!deletedCustomer) {
      return NextResponse.json({ 
        success: false,
        message: 'Customer not found' 
      }, { status: 404 })
    }

    // Update customer usage (decrement by 1)
    try {
      await PaymentService.updateUsage(userId, 'customers', -1)
      console.log('📊 Customer usage updated (decremented)')
    } catch (usageError) {
      console.warn('⚠️ Failed to update customer usage:', usageError)
      // Don't fail the request if usage update fails
    }

    console.log('✅ Customer deleted successfully:', deletedCustomer.name)

    return NextResponse.json({ 
      success: true,
      message: 'Customer deleted successfully',
      deletedCustomer: {
        id: deletedCustomer._id.toString(),
        name: deletedCustomer.name,
        email: deletedCustomer.email,
        phone: deletedCustomer.phone
      }
    })

  } catch (error: any) {
    console.error('❌ DELETE Customer error:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    if (error.message.includes('subscription')) {
      return NextResponse.json({ 
        success: false,
        message: error.message 
      }, { status: 403 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// ===========================================
// PATCH /api/customers/[id] - Partial update
// ===========================================
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // ✅ IMPORTANT: Await the params (Next.js 15+ fix)
    const params = await context.params
    const customerIdParam = params.id
    
    console.log(`🔧 PATCH /api/customers/${customerIdParam} - Starting...`)
    
    const { userId } = await verifyAuthAndSubscription(request)

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(customerIdParam)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid customer ID format' 
        },
        { status: 400 }
      )
    }

    const customerId = new mongoose.Types.ObjectId(customerIdParam)
    const patchData = await request.json()

    // Only allow specific fields for PATCH (partial updates)
    const allowedFields = ['notes', 'tags', 'address', 'email', 'company', 'isInterState']
    const updateData: any = {}

    for (const key in patchData) {
      if (allowedFields.includes(key)) {
        if (key === 'email' && patchData[key]) {
          // Validate email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(patchData[key].trim())) {
            return NextResponse.json(
              { 
                success: false,
                message: 'Please enter a valid email address' 
              },
              { status: 400 }
            )
          }
          
          // Check for duplicate email
          const existingEmail = await Customer.findOne({
            email: patchData[key].trim(),
            userId,
            _id: { $ne: customerId }
          })
          
          if (existingEmail) {
            return NextResponse.json(
              { 
                success: false,
                message: 'Another customer already uses this email' 
              },
              { status: 400 }
            )
          }
          
          updateData[key] = patchData[key].trim()
        } else if (key === 'tags') {
          updateData[key] = Array.isArray(patchData[key]) ? patchData[key] : []
        } else if (key === 'isInterState') {
          updateData[key] = Boolean(patchData[key])
        } else {
          updateData[key] = patchData[key]?.toString().trim() || ''
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'No valid fields to update' 
        },
        { status: 400 }
      )
    }

    // Update customer
    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: customerId, userId: userId },
      { $set: updateData },
      { new: true }
    ).lean()

    if (!updatedCustomer) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Customer not found' 
        },
        { status: 404 }
      )
    }

    // Transform response
    const transformedCustomer = {
      _id: updatedCustomer._id.toString(),
      id: updatedCustomer._id.toString(),
      name: updatedCustomer.name || '',
      phone: updatedCustomer.phone || '',
      email: updatedCustomer.email || '',
      company: updatedCustomer.company || '',
      address: updatedCustomer.address || '',
      state: updatedCustomer.state || '',
      city: updatedCustomer.city || '',
      pincode: updatedCustomer.pincode || '',
      gstin: updatedCustomer.gstin || '',
      gstNumber: updatedCustomer.gstin || '',
      isInterState: updatedCustomer.isInterState || false,
      totalOrders: updatedCustomer.totalOrders || 0,
      totalPurchases: updatedCustomer.totalOrders || 0,
      totalSpent: updatedCustomer.totalSpent || 0,
      lastOrderDate: updatedCustomer.lastOrderDate || null,
      createdAt: updatedCustomer.createdAt,
      updatedAt: updatedCustomer.updatedAt,
      userId: updatedCustomer.userId,
      notes: updatedCustomer.notes || '',
      tags: updatedCustomer.tags || []
    }

    console.log('✅ Customer partially updated:', updatedCustomer.name)
    console.log('📝 Updated fields:', Object.keys(updateData))

    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully',
      customer: transformedCustomer,
      updatedFields: Object.keys(updateData)
    })

  } catch (error: any) {
    console.error('❌ PATCH Customer error:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    if (error.message.includes('subscription')) {
      return NextResponse.json({ 
        success: false,
        message: error.message 
      }, { status: 403 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}