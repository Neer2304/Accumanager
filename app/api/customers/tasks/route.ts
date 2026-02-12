import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

// GET /api/customers/tasks - Get tasks with filters
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
    const collection = db.collection('follow_up_tasks')

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const status = searchParams.get('status')
    const assignedTo = searchParams.get('assignedTo')
    const priority = searchParams.get('priority')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query: any = { userId: decoded.userId }

    if (customerId) query.customerId = customerId
    if (status) query.status = status
    if (assignedTo) query.assignedTo = assignedTo
    if (priority) query.priority = priority

    // For 'pending' filter - show pending and overdue
    if (status === 'pending') {
      query = {
        ...query,
        status: { $in: ['pending', 'overdue'] }
      }
    }

    const tasks = await collection
      .find(query)
      .sort({ dueDate: 1 })
      .limit(limit)
      .toArray()

    // Mark overdue tasks
    const now = new Date()
    const updatedTasks = tasks.map(task => {
      if (task.status === 'pending' && new Date(task.dueDate) < now) {
        task.status = 'overdue'
      }
      return task
    })

    return NextResponse.json({
      success: true,
      tasks: updatedTasks,
      count: updatedTasks.length,
      summary: {
        pending: updatedTasks.filter(t => t.status === 'pending' || t.status === 'overdue').length,
        completed: updatedTasks.filter(t => t.status === 'completed').length,
        overdue: updatedTasks.filter(t => t.status === 'overdue').length
      }
    })

  } catch (error: any) {
    console.error('❌ Get tasks error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// POST /api/customers/tasks - Create new task
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
    const collection = db.collection('follow_up_tasks')

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.dueDate) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Title and due date are required' 
        },
        { status: 400 }
      )
    }

    const task = {
      _id: new mongoose.Types.ObjectId(),
      customerId: body.customerId || null,
      customerName: body.customerName || '',
      taskType: body.taskType || 'other',
      priority: body.priority || 'medium',
      status: 'pending',
      title: body.title,
      description: body.description || '',
      dueDate: body.dueDate,
      completedAt: null,
      completedBy: null,
      assignedTo: body.assignedTo || decoded.userId,
      assignedToName: body.assignedToName || decoded.name || '',
      reminderSent: false,
      reminderDate: body.reminderDate || null,
      relatedTo: body.relatedTo || null,
      notes: body.notes || '',
      userId: decoded.userId,
      userName: decoded.name || decoded.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: decoded.userId
    }

    await collection.insertOne(task)

    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      task
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Create task error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// PUT /api/customers/tasks - Update task
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
    const collection = db.collection('follow_up_tasks')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Task ID is required' 
        },
        { status: 400 }
      )
    }

    const updateData: any = {
      ...body,
      updatedAt: new Date().toISOString()
    }

    // If marking as completed, set completedAt and completedBy
    if (body.status === 'completed' && !body.completedAt) {
      updateData.completedAt = new Date().toISOString()
      updateData.completedBy = decoded.userId
    }

    delete updateData._id
    delete updateData.id
    delete updateData.userId
    delete updateData.createdAt

    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id), userId: decoded.userId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Task not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Task updated successfully'
    })

  } catch (error: any) {
    console.error('❌ Update task error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/customers/tasks - Delete task
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
    const collection = db.collection('follow_up_tasks')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Task ID is required' 
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
          message: 'Task not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    })

  } catch (error: any) {
    console.error('❌ Delete task error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}