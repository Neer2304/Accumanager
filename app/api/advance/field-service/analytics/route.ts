import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import FieldVisit from '@/models/FieldVisit'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/advance/field-service/analytics - Fetching analytics...')
    
    // Authentication
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    await connectToDatabase()

    // Get user
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'User not found' 
      }, { status: 404 })
    }

    // Date range
    const dateFilter: any = { userId: user._id }
    if (startDate && endDate) {
      dateFilter.scheduledDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    } else {
      // Default: last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      dateFilter.scheduledDate = { $gte: thirtyDaysAgo }
    }

    // Get all field visits for analytics
    const fieldVisits = await FieldVisit.find(dateFilter).lean()

    // Calculate analytics
    const totalVisits = fieldVisits.length
    const completedVisits = fieldVisits.filter(v => v.status === 'completed').length
    const inProgressVisits = fieldVisits.filter(v => v.status === 'in-progress').length
    const pendingVisits = fieldVisits.filter(v => v.status === 'scheduled' || v.status === 'pending').length
    const cancelledVisits = fieldVisits.filter(v => v.status === 'cancelled').length

    // Calculate average duration
    const completedWithDuration = fieldVisits.filter(v => 
      v.status === 'completed' && v.actualDuration
    )
    const averageDuration = completedWithDuration.length > 0
      ? completedWithDuration.reduce((sum, v) => sum + (v.actualDuration || 0), 0) / completedWithDuration.length
      : 0

    // Calculate completion rate
    const completionRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0

    // Priority distribution
    const priorityDistribution = {
      high: fieldVisits.filter(v => v.priority === 'high' || v.priority === 'urgent').length,
      medium: fieldVisits.filter(v => v.priority === 'medium').length,
      low: fieldVisits.filter(v => v.priority === 'low').length
    }

    // Type distribution
    const typeDistribution = fieldVisits.reduce((acc: any, visit) => {
      acc[visit.type] = (acc[visit.type] || 0) + 1
      return acc
    }, {})

    // Monthly trend (last 6 months)
    const monthlyTrend = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthVisits = fieldVisits.filter(v => {
        const visitDate = new Date(v.scheduledDate)
        return visitDate >= month && visitDate <= monthEnd
      })
      
      const monthCompleted = monthVisits.filter(v => v.status === 'completed').length
      
      monthlyTrend.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        total: monthVisits.length,
        completed: monthCompleted,
        completionRate: monthVisits.length > 0 ? (monthCompleted / monthVisits.length) * 100 : 0
      })
    }

    // Top employees (by completed visits)
    const employeeStats: Record<string, { name: string, completed: number, total: number, rating: number }> = {}
    
    fieldVisits.forEach(visit => {
      if (visit.employeeId && visit.employeeName) {
        if (!employeeStats[visit.employeeId.toString()]) {
          employeeStats[visit.employeeId.toString()] = {
            name: visit.employeeName,
            completed: 0,
            total: 0,
            rating: 0
          }
        }
        
        employeeStats[visit.employeeId.toString()].total++
        if (visit.status === 'completed') {
          employeeStats[visit.employeeId.toString()].completed++
        }
        
        if (visit.customerFeedback?.rating) {
          const current = employeeStats[visit.employeeId.toString()].rating
          employeeStats[visit.employeeId.toString()].rating = 
            (current + visit.customerFeedback.rating) / 2
        }
      }
    })

    const topEmployees = Object.entries(employeeStats)
      .map(([id, stats]) => ({
        id,
        ...stats,
        completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
      }))
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 5)

    // Revenue from chargeable visits
    const revenue = fieldVisits
      .filter(v => v.isChargeable && v.chargeAmount)
      .reduce((sum, v) => sum + (v.chargeAmount || 0), 0)

    // Customer satisfaction
    const feedbackVisits = fieldVisits.filter(v => v.customerFeedback?.rating)
    const averageRating = feedbackVisits.length > 0
      ? feedbackVisits.reduce((sum, v) => sum + (v.customerFeedback!.rating), 0) / feedbackVisits.length
      : 0

    const analytics = {
      summary: {
        totalVisits,
        completedVisits,
        inProgressVisits,
        pendingVisits,
        cancelledVisits,
        completionRate: parseFloat(completionRate.toFixed(1)),
        averageDuration: parseFloat(averageDuration.toFixed(1)),
        revenue,
        averageRating: parseFloat(averageRating.toFixed(1))
      },
      distribution: {
        priority: priorityDistribution,
        type: typeDistribution
      },
      monthlyTrend,
      topEmployees,
      recentVisits: fieldVisits
        .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
        .slice(0, 10)
    }

    console.log(`✅ Analytics calculated for ${totalVisits} field visits`)

    return NextResponse.json({
      success: true,
      data: analytics,
      message: 'Field service analytics fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Field Service Analytics GET error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  const authToken = request.cookies.get('auth_token')?.value
  if (authToken) {
    return authToken
  }
  
  return null
}