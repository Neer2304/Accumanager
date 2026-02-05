// app/api/advance/analytics/field-service/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'

// Mock data for field service (replace with actual model)
const mockJobs = [
  {
    id: '1',
    jobNumber: 'FS-001',
    customer: 'Acme Corp',
    technician: 'John Smith',
    type: 'Installation',
    priority: 'high',
    status: 'completed',
    scheduledDate: '2024-01-15',
    completedDate: '2024-01-15',
    duration: 180, // minutes
    revenue: 5000,
    cost: 2000,
    rating: 4.8,
    location: 'Downtown'
  },
  // Add more mock jobs...
]

const mockTechnicians = [
  {
    id: '1',
    name: 'John Smith',
    status: 'active',
    jobsCompleted: 45,
    avgRating: 4.8,
    totalRevenue: 225000,
    efficiency: 95,
    specialties: ['Installation', 'Repair']
  },
  // Add more mock technicians...
]

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 GET /api/advance/analytics/field-service - Starting...')
    
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
    console.log('✅ Database connected for field service analytics')

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'monthly'

    // Calculate date range
    let startDate: Date, endDate: Date = new Date()
    
    switch (timeRange) {
      case 'weekly':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'monthly':
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'quarterly':
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 3)
        break
      default:
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
    }

    // Filter jobs by date
    const filteredJobs = mockJobs.filter(job => {
      const jobDate = new Date(job.scheduledDate)
      return jobDate >= startDate && jobDate <= endDate
    })

    // Calculate metrics
    const totalJobs = filteredJobs.length
    const completedJobs = filteredJobs.filter(j => j.status === 'completed').length
    const inProgressJobs = filteredJobs.filter(j => j.status === 'in-progress').length
    const pendingJobs = filteredJobs.filter(j => j.status === 'pending').length
    const totalRevenue = filteredJobs.reduce((sum, j) => sum + j.revenue, 0)
    const totalCost = filteredJobs.reduce((sum, j) => sum + j.cost, 0)
    const totalProfit = totalRevenue - totalCost
    const avgJobDuration = totalJobs > 0 
      ? Math.round(filteredJobs.reduce((sum, j) => sum + j.duration, 0) / totalJobs)
      : 0
    const avgRating = totalJobs > 0
      ? (filteredJobs.reduce((sum, j) => sum + j.rating, 0) / totalJobs).toFixed(1)
      : '0.0'

    // Technician performance
    const technicianPerformance = mockTechnicians.map(tech => {
      const techJobs = filteredJobs.filter(j => j.technician === tech.name)
      const techRevenue = techJobs.reduce((sum, j) => sum + j.revenue, 0)
      const techCompleted = techJobs.filter(j => j.status === 'completed').length
      
      return {
        ...tech,
        recentJobs: techJobs.length,
        recentRevenue: techRevenue,
        completionRate: techJobs.length > 0 ? (techCompleted / techJobs.length) * 100 : 0,
        efficiency: tech.efficiency || 95
      }
    })

    // Job type breakdown
    const jobTypeBreakdown = filteredJobs.reduce((acc, job) => {
      if (!acc[job.type]) {
        acc[job.type] = { count: 0, revenue: 0, avgDuration: 0, durations: [] }
      }
      acc[job.type].count += 1
      acc[job.type].revenue += job.revenue
      acc[job.type].durations.push(job.duration)
      return acc
    }, {} as Record<string, any>)

    Object.keys(jobTypeBreakdown).forEach(type => {
      const durations = jobTypeBreakdown[type].durations
      jobTypeBreakdown[type].avgDuration = durations.length > 0 
        ? Math.round(durations.reduce((a: number, b: number) => a + b, 0) / durations.length)
        : 0
      delete jobTypeBreakdown[type].durations
    })

    const typeBreakdown = Object.entries(jobTypeBreakdown).map(([type, data]) => ({
      type,
      count: data.count,
      revenue: data.revenue,
      avgDuration: data.avgDuration
    }))

    // Priority distribution
    const priorityDistribution = filteredJobs.reduce((acc, job) => {
      acc[job.priority] = (acc[job.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Monthly trend
    const monthlyTrend = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date()
      month.setMonth(month.getMonth() - i)
      const monthName = monthNames[month.getMonth()]
      
      const monthJobs = filteredJobs.filter(job => {
        const jobDate = new Date(job.scheduledDate)
        return jobDate.getMonth() === month.getMonth() && 
               jobDate.getFullYear() === month.getFullYear()
      })
      
      const monthRevenue = monthJobs.reduce((sum, j) => sum + j.revenue, 0)
      const monthCompleted = monthJobs.filter(j => j.status === 'completed').length
      const monthProfit = monthRevenue - monthJobs.reduce((sum, j) => sum + j.cost, 0)
      
      monthlyTrend.push({
        month: monthName,
        jobs: monthJobs.length,
        completed: monthCompleted,
        revenue: monthRevenue,
        profit: monthProfit,
        completionRate: monthJobs.length > 0 ? (monthCompleted / monthJobs.length) * 100 : 0
      })
    }

    // Top customers
    const customerJobs = filteredJobs.reduce((acc, job) => {
      if (!acc[job.customer]) {
        acc[job.customer] = { jobs: 0, revenue: 0, lastJob: job.scheduledDate }
      }
      acc[job.customer].jobs += 1
      acc[job.customer].revenue += job.revenue
      if (new Date(job.scheduledDate) > new Date(acc[job.customer].lastJob)) {
        acc[job.customer].lastJob = job.scheduledDate
      }
      return acc
    }, {} as Record<string, any>)

    const topCustomers = Object.entries(customerJobs)
      .map(([customer, data]) => ({ customer, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Prepare response
    const stats = {
      totalJobs,
      completedJobs,
      inProgressJobs,
      pendingJobs,
      totalRevenue,
      totalCost,
      totalProfit,
      avgJobDuration,
      avgRating,
      completionRate: totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      revenuePerJob: totalJobs > 0 ? Math.round(totalRevenue / totalJobs) : 0,
      activeTechnicians: mockTechnicians.filter(t => t.status === 'active').length
    }

    console.log('✅ Field Service Analytics data prepared successfully')

    return NextResponse.json({
      success: true,
      data: {
        stats,
        technicianPerformance,
        typeBreakdown,
        priorityDistribution,
        monthlyTrend,
        topCustomers,
        recentJobs: filteredJobs.slice(0, 10),
        timeRange,
        period: {
          startDate,
          endDate
        }
      },
      message: 'Field service analytics data fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Field Service Analytics API error:', error)
    
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