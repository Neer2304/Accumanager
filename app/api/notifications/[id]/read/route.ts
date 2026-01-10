// app/api/notifications/[id]/read/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Notification from '@/models/Notification'
import { verifyToken } from '@/lib/jwt'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('📖 PUT /api/notifications/[id]/read - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('⚠️ No auth token found in request cookies')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(authToken)
      const { id } = await params
      
      console.log('👤 Marking notification as read for user:', decoded.userId, 'Notification ID:', id)
      
      await connectToDatabase()
      console.log('✅ Database connected for mark as read')

      const notification = await Notification.findOneAndUpdate(
        { 
          _id: id, 
          userId: decoded.userId 
        },
        { 
          isRead: true,
          readAt: new Date()
        },
        { new: true }
      )

      if (!notification) {
        console.log('❌ Notification not found')
        return NextResponse.json({ message: 'Notification not found' }, { status: 404 })
      }

      console.log('✅ Notification marked as read:', notification._id)
      
      return NextResponse.json(notification)
    } catch (authError) {
      console.error('❌ Auth error in mark as read:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Mark as read error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}