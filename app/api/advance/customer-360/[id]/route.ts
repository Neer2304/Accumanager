// app/api/advance/customer-360/[id]/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Customer from '@/models/Customer'
import AdvancedCustomer from '@/models/AdvancedCustomer'
import Order from '@/models/Order'
import mongoose from 'mongoose'

// Use the SAME auth method as your customer API
async function verifyAuthAndSubscription(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    const authHeader = request.headers.get('authorization')
    
    console.log('🔐 Customer 360° Auth check - Cookie exists:', !!authToken)
    console.log('🔐 Customer 360° Auth check - Header exists:', !!authHeader)
    
    const token = authHeader?.replace('Bearer ', '') || authToken
    
    if (!token) {
      throw new Error('Authentication required')
    }
    
    // IMPORTANT: Use the same JWT verify function as your customer API
    const { verifyToken } = await import('@/lib/jwt')
    const decoded = verifyToken(token)
    
    console.log('✅ Customer 360° Token verified for user:', decoded.userId)
    
    await connectToDatabase()
    
    return { 
      userId: decoded.userId, // This is a STRING
      userEmail: decoded.email 
    }
  } catch (error: any) {
    console.error('❌ Customer 360° Token verification failed:', error)
    throw new Error('Authentication required')
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🎯 GET /api/advance/customer-360/${params.id} - Starting...`)
    
    const { userId } = await verifyAuthAndSubscription(request)
    
    console.log('👤 User ID:', userId)
    console.log('🔍 Customer ID:', params.id)
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid customer ID format' },
        { status: 400 }
      )
    }
    
    const customerId = new mongoose.Types.ObjectId(params.id)
    
    // FIRST: Get the customer (using same query as your customer API)
    // Try both formats since we're not sure if userId is stored as ObjectId or String
    let customer = await Customer.findOne({
      _id: customerId,
      userId: userId // Try as String first (matches your customer API)
    })
    
    // If not found, try as ObjectId
    if (!customer) {
      console.log('⚠️ Customer not found with userId as string, trying ObjectId...')
      customer = await Customer.findOne({
        _id: customerId,
        userId: new mongoose.Types.ObjectId(userId)
      })
    }
    
    if (!customer) {
      console.log(`❌ Customer ${params.id} not found for user ${userId}`)
      return NextResponse.json(
        { success: false, message: 'Customer not found or unauthorized' },
        { status: 404 }
      )
    }
    
    console.log(`✅ Found customer: ${customer.name}`)
    
    // SECOND: Get or create advanced profile
    let advancedProfile = await AdvancedCustomer.findOne({
      customerId: customer._id,
      userId: userId // Try as String
    })
    
    if (!advancedProfile) {
      advancedProfile = await AdvancedCustomer.findOne({
        customerId: customer._id,
        userId: new mongoose.Types.ObjectId(userId) // Try as ObjectId
      })
    }
    
    // If no advanced profile exists, create a basic one
    if (!advancedProfile) {
      console.log('📝 Creating basic advanced profile...')
      
      advancedProfile = new AdvancedCustomer({
        customerId: customer._id,
        userId: customer.userId, // Use the same format as customer
        createdBy: customer.userId,
        customerScore: 50,
        loyaltyLevel: 'bronze',
        lifecycleStage: customer.totalOrders > 0 ? 'customer' : 'lead',
        familyMembers: [],
        preferences: [],
        interests: [],
        tags: [],
        communications: [],
        notes: [],
        documents: [],
        relationships: [],
        customFields: [],
        socialMedia: {},
        privacyPreferences: {
          allowMarketingEmails: true,
          allowSMS: true,
          allowWhatsApp: true,
          allowCalls: true,
        }
      })
      
      await advancedProfile.save()
      console.log('✅ Advanced profile created')
    }
    
    // THIRD: Get orders (using same format as your customer API)
    const orders = await Order.find({
      userId: userId, // Try as String first
      'customer.customerId': customerId
    })
    
    // If no orders found, try with ObjectId
    if (orders.length === 0) {
      const ordersByObjectId = await Order.find({
        userId: new mongoose.Types.ObjectId(userId),
        'customer.customerId': customerId
      })
      orders.push(...ordersByObjectId)
    }
    
    console.log(`📦 Found ${orders.length} orders`)
    
    // Calculate statistics
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0)
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
    
    // Return combined data
    return NextResponse.json({
      success: true,
      data: {
        // Customer basic info (same format as your customer API)
        customer: {
          _id: customer._id.toString(),
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          company: customer.company,
          address: customer.address,
          state: customer.state,
          city: customer.city,
          pincode: customer.pincode,
          gstin: customer.gstin,
          totalOrders: customer.totalOrders || 0,
          totalSpent: customer.totalSpent || 0,
          lastOrderDate: customer.lastOrderDate,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt
        },
        
        // Advanced profile
        advancedProfile: {
          _id: advancedProfile._id.toString(),
          gender: advancedProfile.gender,
          birthday: advancedProfile.birthday,
          occupation: advancedProfile.occupation,
          designation: advancedProfile.designation,
          companyName: advancedProfile.companyName,
          customerScore: advancedProfile.customerScore || 50,
          loyaltyLevel: advancedProfile.loyaltyLevel || 'bronze',
          lifecycleStage: advancedProfile.lifecycleStage || 'customer',
          nextFollowUp: advancedProfile.nextFollowUp,
          privacyPreferences: advancedProfile.privacyPreferences,
          socialMedia: advancedProfile.socialMedia,
          customFields: advancedProfile.customFields
        },
        
        // Enhanced data
        familyMembers: advancedProfile.familyMembers || [],
        tags: advancedProfile.tags || [],
        preferences: advancedProfile.preferences || [],
        interests: advancedProfile.interests || [],
        communications: advancedProfile.communications || [],
        notes: advancedProfile.notes || [],
        documents: advancedProfile.documents || [],
        relationships: advancedProfile.relationships || [],
        
        // Orders
        orders: orders.map(order => ({
          _id: order._id.toString(),
          invoiceNumber: order.invoiceNumber,
          createdAt: order.createdAt,
          subtotal: order.subtotal || 0,
          grandTotal: order.grandTotal || 0,
          status: order.status || 'pending',
          paymentStatus: order.paymentStatus || 'pending',
          items: order.items?.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total
          })) || []
        })),
        
        // Statistics
        statistics: {
          totalOrders,
          totalSpent,
          avgOrderValue,
          lastOrderDate: orders[0]?.createdAt,
          daysSinceLastOrder: orders[0]?.createdAt ? 
            Math.floor((Date.now() - new Date(orders[0].createdAt).getTime()) / (1000 * 60 * 60 * 24)) : null
        },
        
        summary: {
          familyCount: advancedProfile.familyMembers?.length || 0,
          communicationCount: advancedProfile.communications?.length || 0,
          tagCount: advancedProfile.tags?.length || 0,
          noteCount: advancedProfile.notes?.length || 0,
          documentCount: advancedProfile.documents?.length || 0,
          relationshipCount: advancedProfile.relationships?.length || 0
        }
      }
    })
    
  } catch (error: any) {
    console.error(`❌ Customer 360° GET error:`, error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}