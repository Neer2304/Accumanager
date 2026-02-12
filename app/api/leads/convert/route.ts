import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'
import { PaymentService } from '@/services/paymentService'

// POST /api/leads/convert - Convert lead to customer
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authToken = request.cookies.get('auth_token')?.value
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || authToken
    
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    const decoded = verifyToken(token)
    await connectToDatabase()

    const db = mongoose.connection.db
    const leadsCollection = db.collection('leads')
    const customersCollection = db.collection('customers')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Lead ID is required' 
        },
        { status: 400 }
      )
    }

    // Get the lead
    const lead = await leadsCollection.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: decoded.userId
    })

    if (!lead) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Lead not found' 
        },
        { status: 404 }
      )
    }

    if (lead.status === 'won') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Lead already converted to customer' 
        },
        { status: 400 }
      )
    }

    if (lead.status === 'lost') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Cannot convert lost lead' 
        },
        { status: 400 }
      )
    }

    // Check customer limit
    const usageCheck = await PaymentService.checkUsageLimit(decoded.userId, 'customers', 1)
    if (!usageCheck.canProceed) {
      return NextResponse.json(
        { 
          success: false,
          message: `Customer limit reached! You have ${usageCheck.currentUsage} out of ${usageCheck.limit} customers. Please upgrade your plan to add more customers.` 
        },
        { status: 403 }
      )
    }

    // Create customer from lead data
    const customer = {
      _id: new mongoose.Types.ObjectId(),
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      company: lead.company || '',
      address: lead.address || '',
      state: lead.state || '',
      city: lead.city || '',
      pincode: lead.pincode || '',
      gstin: lead.gstin || '',
      isInterState: lead.isInterState || false,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: null,
      userId: decoded.userId,
      notes: `Converted from lead. Original source: ${lead.source}\n${lead.notes || ''}`,
      tags: [...(lead.tags || []), 'converted_lead'],
      convertedFromLead: lead._id,
      convertedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Start transaction
    const session = mongoose.startSession()
    try {
      (await session).startTransaction()

      // Insert customer
      await customersCollection.insertOne(customer)

      // Update lead
      await leadsCollection.updateOne(
        { _id: lead._id },
        {
          $set: {
            status: 'won',
            convertedToCustomer: customer._id,
            convertedAt: new Date().toISOString(),
            convertedBy: decoded.userId,
            updatedAt: new Date().toISOString()
          }
        }
      )

      // Update customer usage
      await PaymentService.updateUsage(decoded.userId, 'customers', 1)

      await (await session).commitTransaction()
    } catch (error) {
      await (await session).abortTransaction()
      throw error
    } finally {
      await (await session).endSession()
    }

    return NextResponse.json({
      success: true,
      message: 'Lead converted to customer successfully',
      customerId: customer._id,
      leadId: lead._id
    })

  } catch (error: any) {
    console.error('❌ Convert lead error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}