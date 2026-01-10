// app/api/notifications/route.ts - COMPLETE PRODUCTION READY
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Notification from '@/models/Notification'
import { verifyToken } from '@/lib/jwt'

// Types
interface NotificationData {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead?: boolean
  actionUrl?: string
  metadata?: Record<string, any>
}

// Get all notifications for the user
export async function GET(request: NextRequest) {
  try {
    console.log('🔔 GET /api/notifications - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(authToken)
    await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const type = searchParams.get('type')
    const skip = (page - 1) * limit

    // Build query
    const query: any = { userId: decoded.userId }
    
    if (unreadOnly) {
      query.isRead = false
    }
    
    if (type && ['info', 'success', 'warning', 'error'].includes(type)) {
      query.type = type
    }

    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({ 
      userId: decoded.userId, 
      isRead: false 
    })

    console.log(`📨 Found ${notifications.length} notifications for user ${decoded.userId}`)
    
    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        unreadCount
      }
    })

  } catch (error: any) {
    console.error('❌ Get notifications error:', error)
    
    if (error.message?.includes('jwt')) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
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

// Create a new notification
export async function POST(request: NextRequest) {
  try {
    console.log('📢 POST /api/notifications - Creating notification...')
    
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(authToken)
    const notificationData: NotificationData = await request.json()
    
    // Validate required fields
    if (!notificationData.title || !notificationData.message) {
      return NextResponse.json(
        { success: false, message: 'Title and message are required' },
        { status: 400 }
      )
    }

    // Validate notification type
    if (!notificationData.type || !['info', 'success', 'warning', 'error'].includes(notificationData.type)) {
      notificationData.type = 'info'
    }

    await connectToDatabase()

    const notification = new Notification({
      ...notificationData,
      userId: decoded.userId,
      isRead: notificationData.isRead || false,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await notification.save()
    
    console.log('✅ Notification created:', notification._id)

    // Real-time notification (if using WebSocket)
    // This could trigger a WebSocket event or push notification

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Create notification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}

// Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    console.log('📝 PUT /api/notifications - Marking as read...')
    
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(authToken)
    const { notificationId, markAll, markMultiple } = await request.json()
    
    await connectToDatabase()

    if (markAll) {
      // Mark all notifications as read for this user
      const result = await Notification.updateMany(
        { userId: decoded.userId, isRead: false },
        { 
          $set: { 
            isRead: true,
            readAt: new Date(),
            updatedAt: new Date()
          }
        }
      )
      
      console.log(`✅ Marked ${result.modifiedCount} notifications as read`)
      
      return NextResponse.json({
        success: true,
        message: `Marked ${result.modifiedCount} notifications as read`,
        data: { marked: result.modifiedCount }
      })
      
    } else if (markMultiple && Array.isArray(markMultiple)) {
      // Mark multiple specific notifications as read
      const result = await Notification.updateMany(
        { 
          _id: { $in: markMultiple },
          userId: decoded.userId 
        },
        { 
          $set: { 
            isRead: true,
            readAt: new Date(),
            updatedAt: new Date()
          }
        }
      )
      
      console.log(`✅ Marked ${result.modifiedCount} notifications as read`)
      
      return NextResponse.json({
        success: true,
        message: `Marked ${result.modifiedCount} notifications as read`,
        data: { marked: result.modifiedCount }
      })
      
    } else if (notificationId) {
      // Mark specific notification as read
      const notification = await Notification.findOneAndUpdate(
        { 
          _id: notificationId, 
          userId: decoded.userId 
        },
        { 
          $set: { 
            isRead: true,
            readAt: new Date(),
            updatedAt: new Date()
          }
        },
        { new: true }
      )

      if (!notification) {
        return NextResponse.json(
          { success: false, message: 'Notification not found' },
          { status: 404 }
        )
      }

      console.log('✅ Notification marked as read:', notificationId)
      
      return NextResponse.json({
        success: true,
        data: notification,
        message: 'Notification marked as read'
      })
      
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Either notificationId, markAll, or markMultiple is required' 
        },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('❌ Mark as read error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}

// Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ DELETE /api/notifications - Deleting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(authToken)
    const { notificationId, deleteAll, deleteRead } = await request.json()
    
    await connectToDatabase()

    if (deleteAll) {
      // Delete all notifications for this user
      const result = await Notification.deleteMany({ userId: decoded.userId })
      
      console.log(`✅ Deleted ${result.deletedCount} notifications`)
      
      return NextResponse.json({
        success: true,
        message: `Deleted ${result.deletedCount} notifications`,
        data: { deleted: result.deletedCount }
      })
      
    } else if (deleteRead) {
      // Delete all read notifications
      const result = await Notification.deleteMany({ 
        userId: decoded.userId,
        isRead: true 
      })
      
      console.log(`✅ Deleted ${result.deletedCount} read notifications`)
      
      return NextResponse.json({
        success: true,
        message: `Deleted ${result.deletedCount} read notifications`,
        data: { deleted: result.deletedCount }
      })
      
    } else if (notificationId) {
      // Delete specific notification
      const result = await Notification.deleteOne({
        _id: notificationId,
        userId: decoded.userId
      })

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { success: false, message: 'Notification not found' },
          { status: 404 }
        )
      }

      console.log('✅ Notification deleted:', notificationId)
      
      return NextResponse.json({
        success: true,
        message: 'Notification deleted successfully'
      })
      
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Either notificationId, deleteAll, or deleteRead is required' 
        },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('❌ Delete notifications error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}