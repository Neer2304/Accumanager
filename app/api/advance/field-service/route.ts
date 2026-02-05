import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import FieldVisit from '@/models/FieldVisit'
import Customer from '@/models/Customer'
import Employee from '@/models/Employee'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'

// GET - Get all field visits with filters
export async function GET(request: NextRequest) {
  try {
    console.log('📍 GET /api/advance/field-service - Fetching field visits...')
    
    // Authentication
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const employeeId = searchParams.get('employeeId')
    const customerId = searchParams.get('customerId')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    await connectToDatabase()

    // Get user
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'User not found' 
      }, { status: 404 })
    }

    // Build query
    const query: any = { userId: user._id }
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (date) {
      const dateObj = new Date(date)
      const nextDay = new Date(dateObj)
      nextDay.setDate(nextDay.getDate() + 1)
      query.scheduledDate = {
        $gte: dateObj,
        $lt: nextDay
      }
    }
    
    if (employeeId) {
      query.employeeId = employeeId
    }
    
    if (customerId) {
      query.customerId = customerId
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority
    }

    // Get field visits with pagination
    const [fieldVisits, total] = await Promise.all([
      FieldVisit.find(query)
        .sort({ scheduledDate: 1, priority: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FieldVisit.countDocuments(query)
    ])

    // Get counts by status
    const statusCounts = await FieldVisit.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    // Get upcoming visits (next 7 days)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const upcomingVisits = await FieldVisit.find({
      userId: user._id,
      status: { $in: ['scheduled', 'pending'] },
      scheduledDate: { $gte: new Date(), $lte: nextWeek }
    })
    .sort({ scheduledDate: 1 })
    .limit(5)
    .lean()

    // Get today's visits
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)
    
    const todaysVisits = await FieldVisit.find({
      userId: user._id,
      scheduledDate: { $gte: todayStart, $lte: todayEnd }
    })
    .sort({ priority: -1, scheduledDate: 1 })
    .lean()

    console.log(`✅ Found ${fieldVisits.length} field visits for user ${user.email}`)

    return NextResponse.json({
      success: true,
      data: {
        fieldVisits,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        statusCounts,
        upcomingVisits,
        todaysVisits,
        stats: {
          total,
          today: todaysVisits.length,
          upcoming: upcomingVisits.length,
          completed: statusCounts.find((s: any) => s._id === 'completed')?.count || 0,
          inProgress: statusCounts.find((s: any) => s._id === 'in-progress')?.count || 0
        }
      },
      message: 'Field visits fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Field Service GET error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

// POST - Create new field visit
export async function POST(request: NextRequest) {
  try {
    console.log('📍 POST /api/advance/field-service - Creating field visit...')
    
    // Authentication
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    // Parse request body
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.customerId || !data.scheduledDate) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: title, customerId, scheduledDate'
      }, { status: 400 })
    }

    await connectToDatabase()

    // Get user
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'User not found' 
      }, { status: 404 })
    }

    // Get customer details
    const customer = await Customer.findOne({ 
      _id: data.customerId,
      userId: user._id 
    })
    
    if (!customer) {
      return NextResponse.json({
        success: false,
        message: 'Customer not found'
      }, { status: 404 })
    }

    // Get employee details if assigned
    let employee = null
    if (data.employeeId) {
      employee = await Employee.findOne({
        _id: data.employeeId,
        userId: user._id
      })
    }

    // Get order details if provided
    let order = null
    if (data.orderId) {
      order = await Order.findOne({
        _id: data.orderId,
        userId: user._id
      })
    }

    // Create field visit
    const fieldVisit = new FieldVisit({
      userId: user._id,
      createdBy: user._id,
      title: data.title,
      description: data.description,
      type: data.type || 'service',
      
      // Customer details
      customerId: customer._id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAddress: customer.address,
      customerType: customer.type,
      
      // Employee details
      employeeId: employee?._id,
      employeeName: employee?.name,
      employeePhone: employee?.phone,
      
      // Order details
      orderId: order?._id,
      invoiceId: order?.invoiceNumber,
      
      // Scheduling
      scheduledDate: new Date(data.scheduledDate),
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      estimatedDuration: data.estimatedDuration,
      
      // Status
      status: data.status || 'scheduled',
      priority: data.priority || 'medium',
      
      // Location
      location: {
        address: data.location?.address || customer.address || '',
        city: data.location?.city || customer.city,
        state: data.location?.state || customer.state,
        pincode: data.location?.pincode || customer.pincode,
        landmark: data.location?.landmark,
        coordinates: data.location?.coordinates
      },
      
      // Work details
      workPerformed: data.workPerformed,
      notes: data.notes,
      
      // Payment
      isChargeable: data.isChargeable !== undefined ? data.isChargeable : true,
      chargeAmount: data.chargeAmount,
      paymentStatus: data.paymentStatus || 'pending'
    })

    await fieldVisit.save()

    console.log(`✅ Field visit created: ${fieldVisit.title}`)

    return NextResponse.json({
      success: true,
      data: fieldVisit,
      message: 'Field visit created successfully'
    })

  } catch (error: any) {
    console.error('❌ Field Service POST error:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

// Helper function to extract token
async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Check cookies
  const authToken = request.cookies.get('auth_token')?.value
  if (authToken) {
    return authToken
  }
  
  return null
}