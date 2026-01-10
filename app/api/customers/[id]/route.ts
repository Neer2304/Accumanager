// app/api/customers/[id]/route.ts - UPDATED COMPLETE VERSION
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
    
    console.log('🔐 Customer Auth check - Cookie exists:', !!authToken)
    console.log('🔐 Customer Auth check - Header exists:', !!authHeader)
    
    const token = authHeader?.replace('Bearer ', '') || authToken
    
    if (!token) {
      throw new Error('Authentication required')
    }
    
    const decoded = verifyToken(token)
    console.log('✅ Customer Token verified for user:', decoded.userId)
    
    await connectToDatabase()
    
    // Check subscription status
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

// GET /api/customers/[id] - Get single customer with detailed stats and orders
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔍 GET /api/customers/${params.id} - Starting...`)
    
    const { userId } = await verifyAuthAndSubscription(request)
    
    console.log('👤 GET Customer - User ID:', userId)
    console.log('🎯 GET Customer - Customer ID:', params.id)

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid customer ID format' 
        },
        { status: 400 }
      )
    }

    const customerId = new mongoose.Types.ObjectId(params.id)

    // Get customer with all details
    const customer = await Customer.findOne({ 
      _id: customerId,
      userId: userId 
    }).lean()

    if (!customer) {
      console.log('❌ GET Customer - Customer not found')
      return NextResponse.json({ 
        success: false,
        message: 'Customer not found' 
      }, { status: 404 })
    }

    // Get customer's orders
    const orders = await Order.find({
      userId: userId,
      'customer.customerId': customerId
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .select('invoiceNumber invoiceDate grandTotal subtotal totalDiscount totalCgst totalSgst totalIgst paymentStatus status items notes createdAt updatedAt')
    .lean()

    // Calculate statistics
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0)
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    const pendingPayments = orders
      .filter(order => order.paymentStatus === 'pending')
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0)
    
    // Calculate tax totals
    const totalCgst = orders.reduce((sum, order) => sum + (order.totalCgst || 0), 0)
    const totalSgst = orders.reduce((sum, order) => sum + (order.totalSgst || 0), 0)
    const totalIgst = orders.reduce((sum, order) => sum + (order.totalIgst || 0), 0)

    // Get recent orders (last 10)
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

    // Calculate days since last order
    const lastOrderDate = orders[0]?.createdAt
    const daysSinceLastOrder = lastOrderDate 
      ? Math.floor((new Date().getTime() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
      : null

    // Get payment summary
    const paymentSummary = {
      pending: orders.filter(o => o.paymentStatus === 'pending').length,
      completed: orders.filter(o => o.paymentStatus === 'completed').length,
      failed: orders.filter(o => o.paymentStatus === 'failed').length
    }

    // Get order status summary
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
      gstin: customer.gstin || customer.gstNumber || '',
      gstNumber: customer.gstin || customer.gstNumber || '',
      isInterState: customer.isInterState || false,
      totalOrders: customer.totalOrders || customer.totalPurchases || 0,
      totalPurchases: customer.totalOrders || customer.totalPurchases || 0,
      totalSpent: customer.totalSpent || 0,
      lastOrderDate: customer.lastOrderDate || null,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      userId: customer.userId,
      notes: customer.notes || '',
      tags: customer.tags || []
    }

    console.log('✅ GET Customer - Customer found:', customer.name)
    console.log(`📊 Customer statistics: ${totalOrders} orders, ₹${totalRevenue.toLocaleString()} revenue`)

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
      allOrders: orders.map(order => ({
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
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          hsnCode: item.hsnCode
        })) || [],
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }))
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

// PUT /api/customers/[id] - Update customer with comprehensive validation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 PUT /api/customers/[id] - Starting...')
    
    const { userId } = await verifyAuthAndSubscription(request)
    
    console.log('👤 PUT Customer - User ID:', userId)
    console.log('🎯 PUT Customer - Customer ID:', params.id)

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid customer ID format' 
        },
        { status: 400 }
      )
    }

    const customerId = new mongoose.Types.ObjectId(params.id)
    const updateData = await request.json()
    
    console.log('📦 PUT Customer - Update data:', updateData)

    // Check if customer exists
    const existingCustomer = await Customer.findOne({ 
      _id: customerId,
      userId: userId 
    })

    if (!existingCustomer) {
      console.log('❌ PUT Customer - Customer not found')
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
      cleanUpdateData.gstNumber = updateData.gstin?.trim().toUpperCase() || ''
    } else if (updateData.gstNumber !== undefined) {
      cleanUpdateData.gstin = updateData.gstNumber?.trim().toUpperCase() || ''
      cleanUpdateData.gstNumber = updateData.gstNumber?.trim().toUpperCase() || ''
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
      gstin: updatedCustomer.gstin || updatedCustomer.gstNumber || '',
      gstNumber: updatedCustomer.gstin || updatedCustomer.gstNumber || '',
      isInterState: updatedCustomer.isInterState || false,
      totalOrders: updatedCustomer.totalOrders || updatedCustomer.totalPurchases || 0,
      totalPurchases: updatedCustomer.totalOrders || updatedCustomer.totalPurchases || 0,
      totalSpent: updatedCustomer.totalSpent || 0,
      lastOrderDate: updatedCustomer.lastOrderDate || null,
      createdAt: updatedCustomer.createdAt,
      updatedAt: updatedCustomer.updatedAt,
      userId: updatedCustomer.userId,
      notes: updatedCustomer.notes || '',
      tags: updatedCustomer.tags || []
    }

    console.log('✅ PUT Customer - Customer updated:', updatedCustomer.name)

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

// DELETE /api/customers/[id] - Delete customer with cleanup
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🗑️ DELETE /api/customers/[id] - Starting...')
    
    const { userId } = await verifyAuthAndSubscription(request)
    
    console.log('👤 DELETE Customer - User ID:', userId)
    console.log('🎯 DELETE Customer - Customer ID:', params.id)

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid customer ID format' 
        },
        { status: 400 }
      )
    }

    const customerId = new mongoose.Types.ObjectId(params.id)

    // First, check if customer has any orders
    const customerOrders = await Order.countDocuments({
      userId: userId,
      'customer.customerId': customerId
    })

    if (customerOrders > 0) {
      console.log(`⚠️ DELETE Customer - Customer has ${customerOrders} orders, cannot delete`)
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
    const customer = await Customer.findOneAndDelete({ 
      _id: customerId, 
      userId: userId 
    })

    if (!customer) {
      console.log('❌ DELETE Customer - Customer not found')
      return NextResponse.json({ 
        success: false,
        message: 'Customer not found' 
      }, { status: 404 })
    }

    // Update customer usage (decrement by 1)
    try {
      await PaymentService.updateUsage(userId, 'customers', -1)
      console.log('📊 DELETE Customer - Customer usage updated (decremented)')
    } catch (usageError) {
      console.warn('⚠️ DELETE Customer - Failed to update customer usage:', usageError)
      // Don't fail the request if usage update fails
    }

    console.log('✅ DELETE Customer - Customer deleted:', customer.name)

    return NextResponse.json({ 
      success: true,
      message: 'Customer deleted successfully',
      deletedCustomer: {
        id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      },
      statistics: {
        orderCount: customerOrders,
        totalSpent: customer.totalSpent || 0
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

// PATCH /api/customers/[id] - Partial updates (for specific fields)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔧 PATCH /api/customers/[id] - Starting...')
    
    const { userId } = await verifyAuthAndSubscription(request)
    
    console.log('👤 PATCH Customer - User ID:', userId)
    console.log('🎯 PATCH Customer - Customer ID:', params.id)

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid customer ID format' 
        },
        { status: 400 }
      )
    }

    const customerId = new mongoose.Types.ObjectId(params.id)
    const patchData = await request.json()

    // Only allow specific fields for PATCH
    const allowedFields = ['notes', 'tags', 'isActive', 'address', 'email']
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
        } else if (key === 'isActive') {
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
      gstin: updatedCustomer.gstin || updatedCustomer.gstNumber || '',
      gstNumber: updatedCustomer.gstin || updatedCustomer.gstNumber || '',
      isInterState: updatedCustomer.isInterState || false,
      totalOrders: updatedCustomer.totalOrders || updatedCustomer.totalPurchases || 0,
      totalPurchases: updatedCustomer.totalOrders || updatedCustomer.totalPurchases || 0,
      totalSpent: updatedCustomer.totalSpent || 0,
      lastOrderDate: updatedCustomer.lastOrderDate || null,
      createdAt: updatedCustomer.createdAt,
      updatedAt: updatedCustomer.updatedAt,
      userId: updatedCustomer.userId,
      notes: updatedCustomer.notes || '',
      tags: updatedCustomer.tags || []
    }

    console.log('✅ PATCH Customer - Customer partially updated:', updatedCustomer.name)

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