// app/api/customers/route.ts - COMPLETE CUSTOMER API
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
    // Get token from cookies or authorization header
    const authToken = request.cookies.get('auth_token')?.value
    const authHeader = request.headers.get('authorization')
    
    console.log('🔐 Customer Auth check - Cookie exists:', !!authToken)
    console.log('🔐 Customer Auth check - Header exists:', !!authHeader)
    
    const token = authHeader?.replace('Bearer ', '') || authToken
    
    if (!token) {
      console.log('❌ No auth token found for customers')
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

// GET /api/customers - Get all customers with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/customers - Starting...')
    
    const { userId, subscription } = await verifyAuthAndSubscription(request)
    
    console.log('👤 Customer User ID:', userId)
    console.log('📊 Subscription plan:', subscription.plan)
    console.log('📈 Customer usage:', subscription.usage?.customers || 0, '/', subscription.limits?.customers || 0)

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const sort = searchParams.get('sort') || '-createdAt'
    const status = searchParams.get('status') // active, inactive
    const type = searchParams.get('type') // inter_state, intra_state
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const skip = (page - 1) * limit

    // Build query
    let query: any = { userId }

    // Search filter
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
        { gstin: { $regex: search.trim(), $options: 'i' } },
        { company: { $regex: search.trim(), $options: 'i' } },
        { 'address': { $regex: search.trim(), $options: 'i' } }
      ]
    }

    // Status filter (based on totalOrders)
    if (status === 'active') {
      query.totalOrders = { $gt: 0 }
    } else if (status === 'inactive') {
      query.totalOrders = 0
    }

    // Type filter (inter-state vs intra-state)
    if (type === 'inter_state') {
      query.isInterState = true
    } else if (type === 'intra_state') {
      query.isInterState = false
    }

    // Location filters
    if (city) {
      query.city = { $regex: city.trim(), $options: 'i' }
    }
    if (state) {
      query.state = { $regex: state.trim(), $options: 'i' }
    }

    // Parse sort parameter
    let sortOptions: any = { createdAt: -1 } // Default sort
    if (sort.startsWith('-')) {
      const field = sort.substring(1)
      sortOptions = { [field]: -1 }
    } else {
      sortOptions = { [sort]: 1 }
    }

    // Get total count first (for pagination)
    const total = await Customer.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Get customers with pagination and sorting
    const customers = await Customer.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()

    // Transform customers to have consistent field names
    const transformedCustomers = customers.map(customer => ({
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
      gstNumber: customer.gstin || '', // Alias for compatibility
      isInterState: customer.isInterState || false,
      totalOrders: customer.totalOrders || customer.totalPurchases || 0,
      totalPurchases: customer.totalOrders || customer.totalPurchases || 0, // Alias
      totalSpent: customer.totalSpent || 0,
      lastOrderDate: customer.lastOrderDate || null,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      userId: customer.userId,
      notes: customer.notes || ''
    }))

    console.log(`✅ Found ${transformedCustomers.length} customers for user ${userId}`)

    return NextResponse.json({
      success: true,
      customers: transformedCustomers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCustomers: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit,
        skip
      },
      usage: {
        current: subscription.usage?.customers || 0,
        limit: subscription.limits?.customers || 0,
        remaining: Math.max(0, (subscription.limits?.customers || 0) - (subscription.usage?.customers || 0))
      },
      summary: {
        total: total,
        active: await Customer.countDocuments({ userId, totalOrders: { $gt: 0 } }),
        interState: await Customer.countDocuments({ userId, isInterState: true }),
        intraState: await Customer.countDocuments({ userId, isInterState: false })
      }
    })

  } catch (error: any) {
    console.error('❌ Get customers error:', error)
    
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

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/customers - Starting...')
    
    const { userId, subscription } = await verifyAuthAndSubscription(request)
    
    // Check customer limit before creating
    const usageCheck = await PaymentService.checkUsageLimit(userId, 'customers', 1)
    if (!usageCheck.canProceed) {
      return NextResponse.json(
        { 
          success: false,
          message: `Customer limit reached! You have ${usageCheck.currentUsage} out of ${usageCheck.limit} customers. Please upgrade your plan to add more customers.` 
        },
        { status: 403 }
      )
    }

    const customerData = await request.json()
    console.log('📦 Customer data received:', customerData)

    // Validate required fields
    if (!customerData.name?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Customer name is required' 
        },
        { status: 400 }
      )
    }

    if (!customerData.phone?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Customer phone number is required' 
        },
        { status: 400 }
      )
    }

    // Validate phone number format (basic Indian format)
    const phoneRegex = /^[6-9]\d{9}$/
    const cleanPhone = customerData.phone.trim().replace(/\D/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Please enter a valid 10-digit Indian phone number' 
        },
        { status: 400 }
      )
    }

    // Validate email if provided
    if (customerData.email && customerData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(customerData.email.trim())) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Please enter a valid email address' 
          },
          { status: 400 }
        )
      }
    }

    // Check for duplicate phone number
    const existingCustomer = await Customer.findOne({ 
      phone: cleanPhone,
      userId 
    })
    
    if (existingCustomer) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Customer with this phone number already exists' 
        },
        { status: 400 }
      )
    }

    // Check for duplicate email if provided
    if (customerData.email && customerData.email.trim()) {
      const existingEmailCustomer = await Customer.findOne({ 
        email: customerData.email.trim(),
        userId 
      })
      
      if (existingEmailCustomer) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Customer with this email already exists' 
          },
          { status: 400 }
        )
      }
    }

    // Clean and prepare data with consistent field names
    const cleanCustomerData = {
      name: customerData.name.trim(),
      email: customerData.email?.trim() || '',
      phone: cleanPhone,
      company: customerData.company?.trim() || '',
      address: customerData.address?.trim() || '',
      state: customerData.state?.trim() || '',
      city: customerData.city?.trim() || '',
      pincode: customerData.pincode?.trim() || '',
      gstin: customerData.gstin?.trim().toUpperCase() || '',
      isInterState: Boolean(customerData.isInterState) || false,
      totalOrders: 0,
      totalSpent: 0,
      userId: userId,
      notes: customerData.notes?.trim() || '',
      tags: customerData.tags || []
    }

    console.log('🧹 Cleaned customer data:', cleanCustomerData)

    // Create customer
    const customer = new Customer(cleanCustomerData)
    await customer.save()

    console.log('✅ Customer created successfully:', customer._id)

    // Update customer usage
    await PaymentService.updateUsage(userId, 'customers', 1)

    // Return transformed customer data
    const transformedCustomer = {
      _id: customer._id.toString(),
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address,
      state: customer.state,
      city: customer.city,
      pincode: customer.pincode,
      gstin: customer.gstin,
      gstNumber: customer.gstin,
      isInterState: customer.isInterState,
      totalOrders: customer.totalOrders || 0,
      totalPurchases: customer.totalOrders || 0,
      totalSpent: customer.totalSpent || 0,
      lastOrderDate: customer.lastOrderDate || null,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      userId: customer.userId,
      notes: customer.notes,
      tags: customer.tags
    }

    return NextResponse.json({
      success: true,
      message: 'Customer created successfully',
      customer: transformedCustomer
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Create customer error:', error)
    
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

// Bulk operations handler
export async function PATCH(request: NextRequest) {
  try {
    console.log('🔄 PATCH /api/customers - Starting bulk operations...')
    
    const { userId } = await verifyAuthAndSubscription(request)
    
    const { operation, customerIds, data } = await request.json()
    
    if (!operation || !customerIds || !Array.isArray(customerIds)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Operation type and customer IDs are required' 
        },
        { status: 400 }
      )
    }

    let result
    const objectIds = customerIds.map(id => new mongoose.Types.ObjectId(id))

    switch (operation) {
      case 'update_status':
        // Update multiple customers' status or tags
        result = await Customer.updateMany(
          { _id: { $in: objectIds }, userId },
          { $set: data }
        )
        break
        
      case 'add_tags':
        // Add tags to multiple customers
        result = await Customer.updateMany(
          { _id: { $in: objectIds }, userId },
          { $addToSet: { tags: { $each: data.tags || [] } } }
        )
        break
        
      case 'remove_tags':
        // Remove tags from multiple customers
        result = await Customer.updateMany(
          { _id: { $in: objectIds }, userId },
          { $pull: { tags: { $in: data.tags || [] } } }
        )
        break
        
      default:
        return NextResponse.json(
          { 
            success: false,
            message: 'Invalid operation type' 
          },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} customers`,
      modifiedCount: result.modifiedCount
    })

  } catch (error: any) {
    console.error('❌ Bulk customer operation error:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
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

// Export search endpoint for autocomplete
export async function HEAD(request: NextRequest) {
  // Return API metadata
  return new NextResponse(null, {
    headers: {
      'X-API-Version': '1.0',
      'X-API-Name': 'Customers API',
      'X-API-Description': 'Customer management with subscription checks',
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Period': '1 minute'
    }
  })
}