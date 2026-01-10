// app/api/attendance/today/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Employee from '@/models/Employee'
import Attendance from '@/models/Attendance'
import { verifyToken } from '@/lib/jwt'
import { PaymentService } from '@/services/paymentService'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/attendance/today - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(authToken)
      
      await connectToDatabase()

      // Check subscription
      const subscription = await PaymentService.checkSubscription(decoded.userId)
      if (!subscription.isActive) {
        return NextResponse.json(
          { error: 'Please upgrade your subscription' },
          { status: 402 }
        )
      }

      // Get today's date
      const today = new Date()
      const todayString = today.toISOString().split('T')[0]
      console.log('📅 Today:', todayString)

      // Get active employees count
      const totalEmployees = await Employee.countDocuments({ 
        userId: decoded.userId, 
        isActive: true 
      })

      // Get today's attendance records
      const todayAttendance = await Attendance.find({
        userId: decoded.userId,
        date: todayString,
        status: 'present'
      })

      const presentToday = todayAttendance.length
      const attendanceRate = totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0

      console.log('📊 Today\'s stats:', { totalEmployees, presentToday, attendanceRate })

      return NextResponse.json({
        totalEmployees,
        presentToday,
        attendanceRate,
        date: todayString
      })

    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Get today attendance error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}