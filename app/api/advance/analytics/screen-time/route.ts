// app/api/advance/analytics/screen-time/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('⏱️ GET /api/advance/analytics/screen-time - Starting...')
    
    // Check authentication
    const authToken = request.cookies.get('auth_token')?.value
    const authHeader = request.headers.get('authorization')
    
    const token = authHeader?.replace('Bearer ', '') || authToken
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    await connectToDatabase()
    console.log('✅ Database connected for screen time analytics')

    // Get user with screen time data
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'weekly'
    const detailed = searchParams.get('detailed') === 'true'

    // Calculate metrics from user's screen time data
    const screenTime = user.screenTime || {}
    const activityLogs = user.activityLogs || []
    
    // Filter activity logs by time range
    let filteredLogs = activityLogs
    if (timeRange !== 'all') {
      const cutoffDate = new Date()
      switch (timeRange) {
        case 'daily':
          cutoffDate.setDate(cutoffDate.getDate() - 1)
          break
        case 'weekly':
          cutoffDate.setDate(cutoffDate.getDate() - 7)
          break
        case 'monthly':
          cutoffDate.setMonth(cutoffDate.getMonth() - 1)
          break
      }
      filteredLogs = activityLogs.filter((log: any) => 
        new Date(log.timestamp) >= cutoffDate
      )
    }

    // Calculate usage statistics
    const totalHours = screenTime.totalHours || 0
    const weeklyAverage = screenTime.weeklyAverage || 0
    const avgSessionLength = screenTime.avgSessionLength || 0
    const peakHour = screenTime.peakHour || 0
    
    // Calculate daily usage for the last 7 days
    const dailyUsage = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dailyStat = screenTime.dailyStats?.find((stat: any) => stat.date === dateStr)
      
      dailyUsage.push({
        date: dateStr,
        hours: dailyStat?.hours || 0,
        sessions: dailyStat?.sessions || 0,
        avgSessionLength: dailyStat?.sessions > 0 
          ? (dailyStat.hours / dailyStat.sessions).toFixed(2) 
          : '0.00'
      })
    }

    // Calculate hourly distribution
    const hourlyDistribution = screenTime.hourlyDistribution || []
    const sortedHourlyDistribution = [...hourlyDistribution]
      .sort((a: any, b: any) => a.hour - b.hour)
      .map((hour: any) => ({
        hour: `${hour.hour}:00`,
        hours: hour.hours || 0
      }))

    // Calculate page/feature usage
    const pageUsage = filteredLogs.reduce((acc: any, log: any) => {
      const page = log.page || 'Unknown'
      if (!acc[page]) {
        acc[page] = { time: 0, sessions: 0, lastVisit: log.timestamp }
      }
      acc[page].time += log.duration || 0
      acc[page].sessions += 1
      if (new Date(log.timestamp) > new Date(acc[page].lastVisit)) {
        acc[page].lastVisit = log.timestamp
      }
      return acc
    }, {})

    const topPages = Object.entries(pageUsage)
      .map(([page, data]: [string, any]) => ({
        page: page.split('/').pop() || page,
        time: (data.time / 60).toFixed(1), // Convert to hours
        sessions: data.sessions,
        lastVisit: data.lastVisit
      }))
      .sort((a: any, b: any) => b.time - a.time)
      .slice(0, 10)

    // Calculate productivity metrics
    const productiveActions = filteredLogs.filter((log: any) => 
      log.action === 'form_submit' || 
      log.action === 'export' || 
      log.action === 'report_view'
    ).length

    const productivityScore = Math.min(
      (productiveActions / Math.max(filteredLogs.length, 1)) * 100,
      100
    )

    // Calculate usage patterns
    const usagePatterns = {
      mostActiveDay: calculateMostActiveDay(screenTime.dailyStats),
      mostActiveHour: peakHour,
      avgDailyUsage: weeklyAverage,
      longestSession: screenTime.dailyStats?.reduce((max: any, stat: any) => 
        stat.hours > max.hours ? stat : { hours: 0 }
      , { hours: 0 }).hours || 0,
      consistencyScore: calculateConsistencyScore(screenTime.dailyStats)
    }

    // Generate insights
    const insights = []
    
    if (productivityScore > 80) {
      insights.push({
        type: 'success',
        title: 'High Productivity',
        message: 'Your productivity score is excellent!',
        suggestion: 'Keep maintaining this level of focus.'
      })
    }
    
    if (usagePatterns.avgDailyUsage > 4) {
      insights.push({
        type: 'warning',
        title: 'High Usage',
        message: `You're averaging ${usagePatterns.avgDailyUsage.toFixed(1)} hours per day.`,
        suggestion: 'Consider taking regular breaks.'
      })
    }
    
    if (usagePatterns.consistencyScore > 80) {
      insights.push({
        type: 'info',
        title: 'Consistent Usage',
        message: 'You show excellent consistency in platform usage.',
        suggestion: 'This helps in developing good habits.'
      })
    }

    // Prepare response
    const stats = {
      totalHours: totalHours.toFixed(1),
      weeklyAverage: weeklyAverage.toFixed(1),
      avgSessionLength: avgSessionLength.toFixed(1),
      peakHour: `${peakHour}:00`,
      totalSessions: screenTime.dailyStats?.reduce((sum: number, stat: any) => sum + (stat.sessions || 0), 0) || 0,
      productiveActions,
      productivityScore: productivityScore.toFixed(1) + '%',
      lastActive: screenTime.lastActive || new Date(),
      streakDays: calculateStreakDays(screenTime.dailyStats)
    }

    const responseData: any = {
      stats,
      dailyUsage,
      hourlyDistribution: sortedHourlyDistribution,
      topPages,
      usagePatterns,
      insights,
      timeRange
    }

    // Add detailed logs if requested
    if (detailed) {
      responseData.recentActivity = filteredLogs
        .slice(0, 50)
        .map((log: any) => ({
          timestamp: log.timestamp,
          page: log.page,
          duration: log.duration,
          action: log.action
        }))
    }

    console.log('✅ Screen Time Analytics data prepared successfully')

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Screen time analytics data fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Screen Time Analytics API error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
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

// Helper functions
function calculateMostActiveDay(dailyStats: any[]): string {
  if (!dailyStats || dailyStats.length === 0) return 'Unknown'
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayStats: Record<string, number> = {}
  
  dailyStats.forEach((stat: any) => {
    const date = new Date(stat.date)
    const dayName = days[date.getDay()]
    dayStats[dayName] = (dayStats[dayName] || 0) + stat.hours
  })
  
  return Object.entries(dayStats)
    .reduce((max, [day, hours]) => hours > max.hours ? { day, hours } : max, { day: 'Unknown', hours: 0 })
    .day
}

function calculateConsistencyScore(dailyStats: any[]): number {
  if (!dailyStats || dailyStats.length < 7) return 0
  
  const last7Days = dailyStats.slice(-7)
  const hasUsageDays = last7Days.filter((stat: any) => stat.hours > 0).length
  return Math.round((hasUsageDays / 7) * 100)
}

function calculateStreakDays(dailyStats: any[]): number {
  if (!dailyStats) return 0
  
  const today = new Date().toISOString().split('T')[0]
  const sortedStats = [...dailyStats].sort((a, b) => b.date.localeCompare(a.date))
  
  let streak = 0
  let currentDate = new Date(today)
  
  for (let i = 0; i < sortedStats.length; i++) {
    const statDate = new Date(sortedStats[i].date)
    const diffDays = Math.floor((currentDate.getTime() - statDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === i && sortedStats[i].hours > 0) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}