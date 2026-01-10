// hooks/useDashboardStats.ts
import { useQuery } from '@tanstack/react-query'
import { DashboardStats, SalesChartData } from '@/types'
import { useAuth } from './useAuth'

export const useDashboardStats = (timeRange: 'week' | 'month' | 'year' = 'month') => {
  const { isAuthenticated } = useAuth()

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      console.log('🔄 Fetching dashboard stats...')
      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include' // Important: include cookies
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required')
        }
        throw new Error(`Failed to fetch stats: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Dashboard stats received:', data)
      return data
    },
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const { data: salesData, isLoading: salesLoading, error: salesError } = useQuery({
    queryKey: ['sales-chart', timeRange],
    queryFn: async (): Promise<SalesChartData[]> => {
      console.log('🔄 Fetching sales chart data...')
      const response = await fetch(`/api/dashboard/sales?range=${timeRange}`, {
        credentials: 'include' // Important: include cookies
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required')
        }
        throw new Error(`Failed to fetch sales data: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Sales data received:', data.length, 'points')
      return data
    },
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes for more frequent updates
  })

  return {
    stats: stats || {
      totalProducts: 0,
      totalCustomers: 0,
      totalSales: 0,
      monthlyRevenue: 0,
      lowStockProducts: 0,
      pendingBills: 0
    },
    salesData: salesData || [],
    topProducts: [], // You can implement this later
    isLoading: statsLoading || salesLoading,
    error: statsError || salesError
  }
}