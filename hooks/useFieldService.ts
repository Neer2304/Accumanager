// hooks/useFieldService.ts
import { useState, useCallback, useEffect } from 'react'
import { format, parseISO, addDays } from 'date-fns'

export interface Technician {
  _id: string
  name: string
  phone?: string
  email?: string
  status: 'available' | 'busy' | 'offline' | 'on-break'
  currentLocation?: {
    address: string
    coordinates?: [number, number]
  }
  rating?: number
  totalJobsCompleted?: number
  specialization?: string[]
  role?: string
  type?: string
  department?: string
  isActive?: boolean
}

export interface FieldVisit {
  _id: string
  title: string
  description?: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'pending'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  scheduledDate: string
  startTime?: string
  endTime?: string
  estimatedDuration?: number
  actualDuration?: number
  customerId: string
  customerName: string
  customerPhone?: string
  customerEmail?: string
  customerAddress?: string
  employeeId?: string
  employeeName?: string
  employeePhone?: string
  type: 'installation' | 'repair' | 'maintenance' | 'inspection' | 'emergency' | 'delivery'
  location?: {
    address: string
    city?: string
    state?: string
    pincode?: string
    coordinates?: [number, number]
  }
  workPerformed?: string
  issuesFound?: string
  recommendations?: string
  notes?: string
  isChargeable?: boolean
  chargeAmount?: number
  paymentStatus?: 'pending' | 'paid' | 'partial'
  customerFeedback?: {
    rating: number
    comment?: string
    date?: string
  }
  photos?: string[]
  documents?: string[]
  createdAt: string
  updatedAt: string
}

export interface AnalyticsData {
  summary: {
    totalVisits: number
    completedVisits: number
    inProgressVisits: number
    pendingVisits: number
    cancelledVisits: number
    completionRate: number
    averageDuration: number
    revenue: number
    averageRating: number
  }
  distribution: {
    priority: {
      high: number
      medium: number
      low: number
    }
    type: Record<string, number>
  }
  monthlyTrend: Array<{
    month: string
    total: number
    completed: number
    completionRate: number
  }>
  topEmployees: Array<{
    id: string
    name: string
    completed: number
    total: number
    rating: number
    completionRate: number
  }>
  recentVisits: FieldVisit[]
}

export interface FieldServiceStats {
  activeTechnicians: number
  todaysJobs: number
  avgResponseTime: string
  customerRating: number
  completionRate: number
  totalRevenue: number
}

interface UseFieldServiceProps {
  initialPage?: number
  initialLimit?: number
  initialDate?: Date
  initialStatus?: string
  initialPriority?: string
  initialEmployee?: string
  autoFetch?: boolean
}

interface FieldVisitsResponse {
  success: boolean;
  data?: {
    fieldVisits?: FieldVisit[]
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    statusCounts?: any
    upcomingVisits?: FieldVisit[]
    todaysVisits?: FieldVisit[]
    stats?: {
      total: number
      today: number
      upcoming: number
      completed: number
      inProgress: number
    }
  }
  message: string
}

interface EmployeesResponse {
  success: boolean;
  data?: {
    employees?: any[]
    pagination?: any
  }
  employees?: any[]
  message: string
}

export const useFieldService = (props: UseFieldServiceProps = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialDate = new Date(),
    initialStatus = 'all',
    initialPriority = 'all',
    initialEmployee = 'all',
    autoFetch = true,
  } = props

  // State
  const [fieldVisits, setFieldVisits] = useState<FieldVisit[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [todaysVisits, setTodaysVisits] = useState<FieldVisit[]>([])
  const [upcomingVisits, setUpcomingVisits] = useState<FieldVisit[]>([])
  const [statusCounts, setStatusCounts] = useState<any>({})
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
  })
  
  // Filters
  const [dateFilter, setDateFilter] = useState<Date | null>(initialDate)
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus)
  const [priorityFilter, setPriorityFilter] = useState<string>(initialPriority)
  const [employeeFilter, setEmployeeFilter] = useState<string>(initialEmployee)
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<FieldServiceStats>({
    activeTechnicians: 0,
    todaysJobs: 0,
    avgResponseTime: '0min',
    customerRating: 0,
    completionRate: 0,
    totalRevenue: 0,
  })

  // Helper function to safely extract array from response
  const extractArrayFromResponse = <T,>(response: any, paths: string[]): T[] => {
    for (const path of paths) {
      const parts = path.split('.')
      let value: any = response
      
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part]
        } else {
          value = null
          break
        }
      }
      
      if (Array.isArray(value)) {
        return value
      }
    }
    
    return []
  }

  // Fetch field visits
  const fetchFieldVisits = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.append('page', pagination.page.toString())
      params.append('limit', pagination.limit.toString())
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (dateFilter) params.append('date', format(dateFilter, 'yyyy-MM-dd'))
      if (employeeFilter !== 'all') params.append('employeeId', employeeFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)

      const response = await fetch(`/api/advance/field-service?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch field visits: ${response.status}`)
      }

      const data: FieldVisitsResponse = await response.json()
      
      if (data.success) {
        const fieldVisitsArray = extractArrayFromResponse<FieldVisit>(data, ['data.fieldVisits', 'fieldVisits'])
        const todaysVisitsArray = extractArrayFromResponse<FieldVisit>(data, ['data.todaysVisits', 'todaysVisits'])
        const upcomingVisitsArray = extractArrayFromResponse<FieldVisit>(data, ['data.upcomingVisits', 'upcomingVisits'])
        
        setFieldVisits(fieldVisitsArray)
        setTodaysVisits(todaysVisitsArray)
        setUpcomingVisits(upcomingVisitsArray)
        
        // Set status counts
        if (data.data?.statusCounts) {
          setStatusCounts(data.data.statusCounts)
        }
        
        // Set pagination
        if (data.data?.pagination) {
          setPagination(data.data.pagination)
        }
        
        // Update stats
        setStats(prev => ({
          ...prev,
          todaysJobs: todaysVisitsArray.length,
          completionRate: data.data?.stats?.completed 
            ? (data.data.stats.completed / Math.max(1, data.data.stats.total)) * 100 
            : 0,
        }))
        
        return data.data
      } else {
        throw new Error(data.message || 'Failed to fetch field visits')
      }
    } catch (err: any) {
      console.error('Error fetching field visits:', err)
      setError(err.message)
      setFieldVisits([])
      setTodaysVisits([])
      setUpcomingVisits([])
      throw err
    }
  }, [pagination.page, pagination.limit, statusFilter, dateFilter, employeeFilter, priorityFilter])

  // Fetch analytics
  const fetchAnalytics = useCallback(async (startDate?: Date, endDate?: Date) => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', format(startDate, 'yyyy-MM-dd'))
      if (endDate) params.append('endDate', format(endDate, 'yyyy-MM-dd'))

      const response = await fetch(`/api/advance/field-service/analytics?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`)
      }

      const data: { success: boolean; data: AnalyticsData; message: string } = await response.json()
      
      if (data.success) {
        setAnalytics(data.data)
        
        // Update stats from analytics
        setStats(prev => ({
          ...prev,
          customerRating: data.data.summary?.averageRating || 0,
          totalRevenue: data.data.summary?.revenue || 0,
        }))
        
        // Calculate average response time
        if (data.data.recentVisits) {
          const completedVisits = data.data.recentVisits.filter(v => 
            v.status === 'completed' && v.startTime && v.scheduledDate
          )
          if (completedVisits.length > 0) {
            const totalDelay = completedVisits.reduce((sum, visit) => {
              const scheduled = new Date(visit.scheduledDate).getTime()
              const actualStart = new Date(visit.startTime!).getTime()
              return sum + Math.max(0, actualStart - scheduled)
            }, 0)
            const avgDelay = totalDelay / completedVisits.length
            setStats(prev => ({
              ...prev,
              avgResponseTime: `${Math.round(avgDelay / (1000 * 60))}min`
            }))
          }
        }
        
        return data.data
      } else {
        throw new Error(data.message || 'Failed to fetch analytics')
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err)
      setError(err.message)
      throw err
    }
  }, [])

  // Fetch technicians with robust error handling
  const fetchTechnicians = useCallback(async () => {
    try {
      const response = await fetch('/api/employees?type=technician&status=active')
      
      if (!response.ok) {
        // If we get a 402 (Payment Required), it's okay - just return empty array
        if (response.status === 402) {
          console.warn('Subscription required for employee access')
          setTechnicians([])
          setStats(prev => ({ ...prev, activeTechnicians: 0 }))
          return []
        }
        
        throw new Error(`Failed to fetch technicians: ${response.status}`)
      }

      const data: EmployeesResponse = await response.json()
      
      if (!data.success) {
        // If not successful but not an error (e.g., subscription limit)
        console.warn('Technicians API returned success: false', data.message)
        setTechnicians([])
        setStats(prev => ({ ...prev, activeTechnicians: 0 }))
        return []
      }

      // Extract employees array from response
      const employeesArray = extractArrayFromResponse<any>(data, [
        'data.employees',
        'employees',
        'data'
      ])

      // Filter for active technicians and map to Technician type
      const techniciansList: Technician[] = employeesArray
        .filter((emp: any) => 
          emp.isActive !== false && 
          (!emp.status || emp.status !== 'inactive') &&
          (emp.type === 'technician' || emp.role === 'technician' || !emp.type)
        )
        .map((emp: any) => ({
          _id: emp._id || emp.id,
          name: emp.name || 'Unknown',
          phone: emp.phone,
          email: emp.email,
          status: (emp.status as Technician['status']) || 'offline',
          currentLocation: emp.currentLocation,
          rating: emp.rating,
          totalJobsCompleted: emp.totalJobsCompleted || emp.completedJobs || 0,
          specialization: emp.specialization || 
                        (emp.department ? [emp.department] : ['General']),
          role: emp.role,
          type: emp.type,
          department: emp.department,
          isActive: emp.isActive,
        }))

      setTechnicians(techniciansList)
      setStats(prev => ({
        ...prev,
        activeTechnicians: techniciansList.length,
      }))
      
      return techniciansList
    } catch (err: any) {
      console.error('Error fetching technicians:', err)
      setError(`Failed to load technicians: ${err.message}`)
      setTechnicians([])
      setStats(prev => ({ ...prev, activeTechnicians: 0 }))
      return []
    }
  }, [])

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      await Promise.all([
        fetchFieldVisits(),
        fetchAnalytics(addDays(new Date(), -30), new Date()),
        fetchTechnicians(),
      ])
    } catch (err: any) {
      console.error('Error fetching field service data:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [fetchFieldVisits, fetchAnalytics, fetchTechnicians])

  const refreshData = useCallback(() => {
    setRefreshing(true)
    fetchAllData()
  }, [fetchAllData])

  // Individual item operations (keep the same as before)
  const updateVisitStatus = useCallback(async (visitId: string, status: FieldVisit['status']) => {
    try {
      const response = await fetch(`/api/advance/field-service/${visitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setFieldVisits(prev => prev.map(visit => 
          visit._id === visitId ? { ...visit, status } : visit
        ))
        
        // Refresh data
        await fetchAllData()
        
        return data.data
      } else {
        throw new Error(data.message || 'Failed to update status')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [fetchAllData])

  const dispatchTechnician = useCallback(async (technicianId: string, jobId: string) => {
    try {
      const response = await fetch(`/api/advance/field-service/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          employeeId: technicianId,
          status: 'scheduled'
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to dispatch technician: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Refresh data
        await fetchAllData()
        
        return data.data
      } else {
        throw new Error(data.message || 'Failed to dispatch technician')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [fetchAllData])

  const createFieldVisit = useCallback(async (visitData: Partial<FieldVisit>) => {
    try {
      const response = await fetch('/api/advance/field-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create field visit: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Refresh data
        await fetchAllData()
        
        return data.data
      } else {
        throw new Error(data.message || 'Failed to create field visit')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [fetchAllData])

  const deleteFieldVisit = useCallback(async (visitId: string) => {
    try {
      const response = await fetch(`/api/advance/field-service/${visitId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete field visit: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setFieldVisits(prev => prev.filter(visit => visit._id !== visitId))
        
        return data.data
      } else {
        throw new Error(data.message || 'Failed to delete field visit')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  // Filter field visits
  const filteredVisits = fieldVisits.filter(visit => {
    if (statusFilter !== 'all' && visit.status !== statusFilter) return false
    if (priorityFilter !== 'all' && visit.priority !== priorityFilter) return false
    if (employeeFilter !== 'all' && visit.employeeId !== employeeFilter) return false
    if (searchQuery && 
        !visit.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !visit.customerName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  // Initialize data
  useEffect(() => {
    if (autoFetch) {
      fetchAllData()
    }
  }, [autoFetch, fetchAllData])

  // Handle filter changes
  useEffect(() => {
    if (!loading) {
      fetchFieldVisits()
    }
  }, [pagination.page, statusFilter, priorityFilter, employeeFilter, dateFilter, fetchFieldVisits])

  return {
    // Data
    fieldVisits,
    filteredVisits,
    technicians,
    analytics,
    todaysVisits,
    upcomingVisits,
    statusCounts,
    stats,
    
    // Filters
    dateFilter,
    setDateFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    employeeFilter,
    setEmployeeFilter,
    searchQuery,
    setSearchQuery,
    
    // Pagination
    pagination,
    setPage: (page: number) => setPagination(prev => ({ ...prev, page })),
    setLimit: (limit: number) => setPagination(prev => ({ ...prev, limit })),
    
    // Loading states
    loading,
    refreshing,
    error,
    setError,
    
    // Actions
    refreshData,
    updateVisitStatus,
    dispatchTechnician,
    createFieldVisit,
    deleteFieldVisit,
    fetchFieldVisits,
    fetchAnalytics,
    fetchTechnicians,
    fetchAllData,
  }
}