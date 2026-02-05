// app/api/advance/customer-360/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Customer from '@/models/Customer'
import AdvancedCustomer from '@/models/AdvancedCustomer'
import mongoose from 'mongoose'

// Use the SAME auth method
async function verifyAuthAndSubscription(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      throw new Error('Authentication required')
    }
    
    const { verifyToken } = await import('@/lib/jwt')
    const decoded = verifyToken(token)
    
    await connectToDatabase()
    
    return { 
      userId: decoded.userId, // String
      userEmail: decoded.email 
    }
  } catch (error: any) {
    console.error('❌ Auth verification failed:', error)
    throw new Error('Authentication required')
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🎯 GET /api/advance/customer-360')
    
    const { userId } = await verifyAuthAndSubscription(request)
    
    console.log('👤 User:', userId)
    
    // Get query params
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    
    // Get customers - try both formats
    let query: any = { userId: userId } // String first
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    let regularCustomers = await Customer.find(query)
      .select('_id name email phone company totalOrders totalSpent lastOrderDate createdAt')
      .lean()
    
    // If no results with string userId, try ObjectId
    if (regularCustomers.length === 0 && mongoose.Types.ObjectId.isValid(userId)) {
      console.log('⚠️ No customers with string userId, trying ObjectId...')
      query.userId = new mongoose.Types.ObjectId(userId)
      regularCustomers = await Customer.find(query)
        .select('_id name email phone company totalOrders totalSpent lastOrderDate createdAt')
        .lean()
    }
    
    console.log(`📊 Found ${regularCustomers.length} regular customers`)
    
    if (regularCustomers.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          customers: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        }
      })
    }
    
    // Get customer IDs
    const customerIds = regularCustomers.map(c => c._id)
    
    // Get advanced profiles - try both formats
    let advancedProfiles = await AdvancedCustomer.find({
      userId: userId, // String
      customerId: { $in: customerIds }
    }).lean()
    
    if (advancedProfiles.length === 0 && mongoose.Types.ObjectId.isValid(userId)) {
      console.log('⚠️ No advanced profiles with string userId, trying ObjectId...')
      advancedProfiles = await AdvancedCustomer.find({
        userId: new mongoose.Types.ObjectId(userId), // ObjectId
        customerId: { $in: customerIds }
      }).lean()
    }
    
    console.log(`📈 Found ${advancedProfiles.length} advanced profiles`)
    
    // Process customers
    const customers = regularCustomers.map(customer => {
      const advanced = advancedProfiles.find(ap => 
        ap.customerId.toString() === customer._id.toString()
      )
      
      if (advanced) {
        return {
          _id: advanced._id.toString(),
          customerId: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          totalOrders: customer.totalOrders || 0,
          totalSpent: customer.totalSpent || 0,
          lastOrderDate: customer.lastOrderDate,
          customerScore: advanced.customerScore || 50,
          loyaltyLevel: advanced.loyaltyLevel || 'bronze',
          lifecycleStage: advanced.lifecycleStage || 'customer',
          tags: advanced.tags || [],
          createdAt: customer.createdAt
        }
      } else {
        return {
          _id: customer._id.toString(),
          customerId: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          totalOrders: customer.totalOrders || 0,
          totalSpent: customer.totalSpent || 0,
          lastOrderDate: customer.lastOrderDate,
          customerScore: 50,
          loyaltyLevel: 'bronze',
          lifecycleStage: 'customer',
          tags: [],
          createdAt: customer.createdAt,
          needsUpgrade: true
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        customers,
        pagination: {
          page: 1,
          limit: customers.length,
          total: customers.length,
          pages: 1
        }
      }
    })
    
  } catch (error: any) {
    console.error('❌ Customer 360° error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}