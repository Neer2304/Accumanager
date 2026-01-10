// app/api/business/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Business from '@/models/Bussiness' // Fixed typo: Bussiness -> Business
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('🏢 GET /api/business - Starting...')
    
    // FIX: Use request.cookies instead of getAuthCookie()
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('❌ No auth token in business request')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(authToken)
      const userId = decoded.userId
      console.log('👤 Business for user:', userId)
      
      await connectToDatabase()
      console.log('✅ Database connected for business')

      const business = await Business.findOne({ userId: userId })

      if (!business) {
        console.log('❌ Business not found for user:', userId)
        return NextResponse.json(
          { message: 'Business not found' },
          { status: 404 }
        )
      }

      console.log('✅ Business found:', business.businessName)
      
      return NextResponse.json({
        success: true,
        business: {
          id: business._id,
          businessName: business.businessName,
          address: business.address,
          city: business.city,
          state: business.state,
          pincode: business.pincode,
          country: business.country,
          gstNumber: business.gstNumber,
          phone: business.phone,
          email: business.email,
          logo: business.logo
        }
      })
    } catch (authError) {
      console.error('❌ Auth error in business:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Get business error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🏢 POST /api/business - Starting...')
    
    // FIX: Use request.cookies instead of getAuthCookie()
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('❌ No auth token in business save request')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(authToken)
      const userId = decoded.userId
      
      await connectToDatabase()
      console.log('✅ Database connected for business save')

      const businessData = await request.json()
      console.log('📦 Received business data:', businessData)

      // Check if business already exists
      let business = await Business.findOne({ userId: userId })

      if (business) {
        console.log('🔄 Updating existing business')
        // Update existing business
        business = await Business.findOneAndUpdate(
          { userId: userId },
          businessData,
          { new: true }
        )
      } else {
        console.log('🆕 Creating new business')
        // Create new business
        business = new Business({
          ...businessData,
          userId: userId
        })
        await business.save()
      }

      console.log('✅ Business saved successfully:', business._id)
      
      return NextResponse.json({
        success: true,
        business: {
          id: business._id,
          businessName: business.businessName,
          address: business.address,
          city: business.city,
          state: business.state,
          pincode: business.pincode,
          country: business.country,
          gstNumber: business.gstNumber,
          phone: business.phone,
          email: business.email,
          logo: business.logo
        }
      }, { status: business.isNew ? 201 : 200 })
    } catch (authError) {
      console.error('❌ Auth error in business save:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Save business error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}