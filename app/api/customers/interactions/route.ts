import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

// GET /api/customers/interactions?customerId=xxx - Get interactions for a customer
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
    const collection = db.collection('customer_interactions')

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type')
    const sort = searchParams.get('sort') || '-createdAt'

    if (!customerId) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Customer ID is required' 
        },
        { status: 400 }
      )
    }

    let query: any = { 
      customerId,
      userId: decoded.userId 
    }

    if (type && type !== 'all') {
      query.type = type
    }

    let sortOptions: any = { createdAt: -1 }
    if (sort.startsWith('-')) {
      const field = sort.substring(1)
      sortOptions = { [field]: -1 }
    } else {
      sortOptions = { [sort]: 1 }
    }

    const interactions = await collection
      .find(query)
      .sort(sortOptions)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      interactions,
      count: interactions.length
    })

  } catch (error: any) {
    console.error('❌ Get interactions error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// POST /api/customers/interactions - Create new interaction
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
    const interactionsCollection = db.collection('customer_interactions')
    const tasksCollection = db.collection('follow_up_tasks')

    const body = await request.json()

    // Validate required fields
    if (!body.customerId || !body.type || !body.subject || !body.content) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Customer ID, type, subject, and content are required' 
        },
        { status: 400 }
      )
    }

    // Create interaction
    const interaction = {
      _id: new mongoose.Types.ObjectId(),
      customerId: body.customerId,
      customerName: body.customerName || '',
      type: body.type,
      direction: body.direction || 'outbound',
      subject: body.subject,
      content: body.content,
      duration: body.duration || 0,
      outcome: body.outcome || 'successful',
      sentiment: body.sentiment || 'neutral',
      followUpDate: body.followUpDate || null,
      followUpCompleted: false,
      assignedTo: body.assignedTo || decoded.userId,
      assignedToName: body.assignedToName || decoded.name || '',
      attachments: body.attachments || [],
      userId: decoded.userId,
      userName: decoded.name || decoded.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await interactionsCollection.insertOne(interaction)

    // If follow-up date is set, create a task
    if (body.followUpDate) {
      const task = {
        _id: new mongoose.Types.ObjectId(),
        customerId: body.customerId,
        customerName: body.customerName || '',
        taskType: body.type,
        priority: body.priority || 'medium',
        status: 'pending',
        title: `Follow-up: ${body.subject}`,
        description: body.content,
        dueDate: body.followUpDate,
        assignedTo: body.assignedTo || decoded.userId,
        assignedToName: body.assignedToName || decoded.name || '',
        reminderSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: decoded.userId
      }
      await tasksCollection.insertOne(task)
    }

    return NextResponse.json({
      success: true,
      message: 'Interaction logged successfully',
      interaction
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Create interaction error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// PUT /api/customers/interactions - Update interaction
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
    const collection = db.collection('customer_interactions')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Interaction ID is required' 
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
    delete updateData.customerId
    delete updateData.userId

    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id), userId: decoded.userId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Interaction not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Interaction updated successfully'
    })

  } catch (error: any) {
    console.error('❌ Update interaction error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/customers/interactions - Delete interaction
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
    const collection = db.collection('customer_interactions')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Interaction ID is required' 
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
          message: 'Interaction not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Interaction deleted successfully'
    })

  } catch (error: any) {
    console.error('❌ Delete interaction error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}