// app/api/advance/customer-360/combined/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import AdvancedCustomer from '@/models/AdvancedCustomer'
import Customer from '@/models/Customer'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) {
    throw new Error('Authentication required')
  }
  
  const decoded = verifyToken(token)
  await connectToDatabase()
  return { userId: decoded.userId }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await verifyAuth(request)
    
    // Get regular customers
    const regularCustomers = await Customer.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    })
    .lean()
    
    // Get advanced profiles
    const advancedProfiles = await AdvancedCustomer.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    })
    .lean()
    
    // Create a map for quick lookup
    const advancedMap = new Map()
    advancedProfiles.forEach(ap => {
      if (ap.customerId) {
        advancedMap.set(ap.customerId.toString(), ap)
      }
    })
    
    // Combine data
    const combinedCustomers = regularCustomers.map(customer => {
      const advanced = advancedMap.get(customer._id.toString())
      
      if (advanced) {
        // Has advanced profile
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
          
          // Advanced fields
          gender: advanced.gender,
          customerScore: advanced.customerScore || 50,
          loyaltyLevel: advanced.loyaltyLevel || 'bronze',
          lifecycleStage: advanced.lifecycleStage || 
            ((customer.totalOrders || 0) > 0 ? 'customer' : 'lead'),
          
          // Arrays
          familyMembers: advanced.familyMembers || [],
          tags: advanced.tags || [],
          interests: advanced.interests || [],
          
          createdAt: advanced.createdAt || customer.createdAt
        }
      } else {
        // Only regular customer
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
          
          // Default advanced fields
          customerScore: 50,
          loyaltyLevel: 'bronze',
          lifecycleStage: (customer.totalOrders || 0) > 0 ? 'customer' : 'lead',
          familyMembers: [],
          tags: [],
          interests: [],
          
          createdAt: customer.createdAt,
          needsUpgrade: true
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        customers: combinedCustomers,
        summary: {
          total: combinedCustomers.length,
          withAdvancedProfiles: advancedProfiles.length,
          basicCustomers: regularCustomers.length - advancedProfiles.length
        }
      }
    })
    
  } catch (error: any) {
    console.error('❌ Combined customers error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}