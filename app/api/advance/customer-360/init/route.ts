// app/api/advance/customer-360/init/route.ts - ULTRA SIMPLE VERSION
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Customer from '@/models/Customer'
import AdvancedCustomer from '@/models/AdvancedCustomer'
import mongoose from 'mongoose'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 INIT: Starting...')
    
    // Get token from cookie
    const token = request.cookies.get('auth_token')?.value
    console.log('Token exists:', !!token)
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token' },
        { status: 401 }
      )
    }
    
    // Parse token to get user ID (adjust based on your token format)
    let userId
    try {
      const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
      userId = decoded.userId || decoded.id
    } catch {
      // If token is just the user ID
      userId = token
    }
    
    console.log('👤 User ID from token:', userId)
    
    await connectToDatabase()
    
    // Get ALL customers for this user
    const customers = await Customer.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    })
    
    console.log(`📊 Found ${customers.length} customers to upgrade`)
    
    const created = []
    const errors = []
    
    for (const customer of customers) {
      try {
        console.log(`🔄 Processing customer: ${customer.name} (${customer._id})`)
        
        // Check if advanced profile already exists
        const existing = await AdvancedCustomer.findOne({
          customerId: customer._id,
          userId: customer.userId
        })
        
        if (existing) {
          console.log(`⏭️ Skipping ${customer.name} - already has advanced profile`)
          continue
        }
        
        // Create simple advanced profile
        const advancedProfile = new AdvancedCustomer({
          customerId: customer._id,
          userId: customer.userId,
          createdBy: customer.userId,
          
          // Basic info
          companyName: customer.company || '',
          
          // Default scores
          customerScore: 50,
          loyaltyLevel: 'bronze',
          lifecycleStage: customer.totalOrders > 0 ? 'customer' : 'lead',
          
          // Empty arrays
          familyMembers: [],
          preferences: [],
          interests: [],
          tags: [],
          communications: [],
          documents: [],
          notes: [],
          relationships: [],
          customFields: [],
          
          // Social media
          socialMedia: {},
          
          // Privacy preferences
          privacyPreferences: {
            allowMarketingEmails: true,
            allowSMS: true,
            allowWhatsApp: true,
            allowCalls: true,
          }
        })
        
        await advancedProfile.save()
        created.push({
          id: advancedProfile._id,
          customerName: customer.name,
          customerId: customer._id
        })
        
        console.log(`✅ Created advanced profile for ${customer.name}`)
        
      } catch (err: any) {
        console.error(`❌ Error for ${customer.name}:`, err.message)
        errors.push({ customer: customer.name, error: err.message })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Created ${created.length} advanced profiles`,
      data: {
        created: created.length,
        total: customers.length,
        createdProfiles: created,
        errors: errors.length > 0 ? errors : undefined
      }
    })
    
  } catch (error: any) {
    console.error('❌ INIT error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to initialize',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}