import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

// GET /api/leads - Get all leads with filters
export async function GET(request: NextRequest) {
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
    const collection = db.collection('leads')

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const stage = searchParams.get('stage')
    const source = searchParams.get('source')
    const assignedTo = searchParams.get('assignedTo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit
    const sort = searchParams.get('sort') || '-createdAt'

    // Build query
    let query: any = { userId: decoded.userId }

    // Search filter
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { company: { $regex: search.trim(), $options: 'i' } }
      ]
    }

    // Filters
    if (status && status !== 'all') query.status = status
    if (stage && stage !== 'all') query.stage = stage
    if (source && source !== 'all') query.source = source
    if (assignedTo) query.assignedTo = assignedTo

    // Sort options
    let sortOptions: any = { createdAt: -1 }
    if (sort.startsWith('-')) {
      const field = sort.substring(1)
      sortOptions = { [field]: -1 }
    } else {
      sortOptions = { [sort]: 1 }
    }

    // Get total count
    const total = await collection.countDocuments(query)

    // Get leads
    const leads = await collection
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray()

    // Calculate statistics
    const totalValue = leads.reduce((sum, lead) => sum + (lead.expectedValue || 0), 0)
    const wonLeads = leads.filter(l => l.status === 'won').length
    const lostLeads = leads.filter(l => l.status === 'lost').length
    const conversionRate = total > 0 ? ((wonLeads / total) * 100).toFixed(1) : '0'

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLeads: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
        limit,
        skip
      },
      summary: {
        total,
        totalValue,
        won: wonLeads,
        lost: lostLeads,
        conversionRate: parseFloat(conversionRate),
        byStage: {
          cold: leads.filter(l => l.stage === 'cold').length,
          warm: leads.filter(l => l.stage === 'warm').length,
          hot: leads.filter(l => l.stage === 'hot').length
        },
        byStatus: {
          new: leads.filter(l => l.status === 'new').length,
          contacted: leads.filter(l => l.status === 'contacted').length,
          qualified: leads.filter(l => l.status === 'qualified').length,
          proposal: leads.filter(l => l.status === 'proposal').length,
          negotiation: leads.filter(l => l.status === 'negotiation').length
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Get leads error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create new lead
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
    const collection = db.collection('leads')

    const body = await request.json()

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Lead name is required' 
        },
        { status: 400 }
      )
    }

    if (!body.phone?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Phone number is required' 
        },
        { status: 400 }
      )
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/
    const cleanPhone = body.phone.trim().replace(/\D/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Please enter a valid 10-digit Indian phone number' 
        },
        { status: 400 }
      )
    }

    // Check for duplicate phone
    const existingLead = await collection.findOne({
      phone: cleanPhone,
      userId: decoded.userId,
      status: { $nin: ['won', 'lost'] }
    })

    if (existingLead) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Lead with this phone number already exists' 
        },
        { status: 400 }
      )
    }

    // Generate lead ID
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const count = await collection.countDocuments() + 1
    
    const lead = {
      _id: new mongoose.Types.ObjectId(),
      leadId: `LEAD-${year}${month}-${count.toString().padStart(4, '0')}`,
      name: body.name.trim(),
      phone: cleanPhone,
      email: body.email?.trim() || '',
      company: body.company?.trim() || '',
      address: body.address?.trim() || '',
      source: body.source || 'other',
      sourceDetails: body.sourceDetails || '',
      status: body.status || 'new',
      stage: body.stage || 'cold',
      expectedValue: body.expectedValue || 0,
      probability: body.probability || 50,
      assignedTo: body.assignedTo || decoded.userId,
      assignedToName: body.assignedToName || decoded.name || '',
      nextFollowUp: body.nextFollowUp || null,
      lastContacted: null,
      tags: body.tags || [],
      notes: body.notes || '',
      convertedToCustomer: null,
      convertedAt: null,
      convertedBy: null,
      lostReason: null,
      lostAt: null,
      customFields: body.customFields || {},
      userId: decoded.userId,
      userName: decoded.name || decoded.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: decoded.userId
    }

    await collection.insertOne(lead)

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully',
      lead
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Create lead error:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Lead with this phone number already exists' 
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

// PUT /api/leads - Update lead
export async function PUT(request: NextRequest) {
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
    const collection = db.collection('leads')

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

    const updateData = {
      ...body,
      updatedAt: new Date().toISOString()
    }
    delete updateData._id
    delete updateData.id
    delete updateData.leadId
    delete updateData.userId
    delete updateData.createdAt
    delete updateData.convertedToCustomer
    delete updateData.convertedAt
    delete updateData.convertedBy

    // Handle phone number cleanup
    if (updateData.phone) {
      updateData.phone = updateData.phone.replace(/\D/g, '')
    }

    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id), userId: decoded.userId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Lead not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully'
    })

  } catch (error: any) {
    console.error('❌ Update lead error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/leads - Delete lead
export async function DELETE(request: NextRequest) {
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
    const collection = db.collection('leads')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Lead ID is required' 
        },
        { status: 400 }
      )
    }

    const result = await collection.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: decoded.userId
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Lead not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    })

  } catch (error: any) {
    console.error('❌ Delete lead error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}