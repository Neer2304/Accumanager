// app/api/advance/customer-360/test/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Customer from '@/models/Customer'
import AdvancedCustomer from '@/models/AdvancedCustomer'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    // Get token
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }
    
    const decoded = verifyToken(token)
    const userId = decoded.userId
    
    console.log('👤 Test User ID:', userId)
    
    await connectToDatabase()
    
    // Test 1: Find regular customers for this user
    const regularCustomers = await Customer.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    }).lean()
    
    console.log('📊 Regular customers found:', regularCustomers.length)
    console.log('📋 Regular customers:', regularCustomers.map(c => ({
      _id: c._id,
      name: c.name,
      userId: c.userId
    })))
    
    // Test 2: Find advanced profiles for this user
    const advancedProfiles = await AdvancedCustomer.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    }).lean()
    
    console.log('📈 Advanced profiles found:', advancedProfiles.length)
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userId,
          email: decoded.email
        },
        regularCustomers: {
          count: regularCustomers.length,
          customers: regularCustomers.map(c => ({
            _id: c._id,
            name: c.name,
            phone: c.phone,
            email: c.email,
            userId: c.userId
          }))
        },
        advancedProfiles: {
          count: advancedProfiles.length,
          profiles: advancedProfiles.map(ap => ({
            _id: ap._id,
            customerId: ap.customerId,
            userId: ap.userId
          }))
        }
      }
    })
    
  } catch (error: any) {
    console.error('❌ Test error:', error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}