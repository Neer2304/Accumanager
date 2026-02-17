// app/admin/visitors/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Container,
  Box,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material'
import { format, formatDistance } from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js'
import { useTheme as useThemeContext } from '@/contexts/ThemeContext'

import {
  GoogleVisitorsSkeleton,
  GoogleVisitorsHeader,
  GoogleVisitorsStats,
  GoogleVisitorsFilters,
  GoogleVisitorsTabs,
  GoogleVisitorsOverview,
  GoogleVisitorsRealtime,
  GoogleVisitorsGeography,
  GoogleVisitorsDevices,
  GoogleVisitorsPages,
  GoogleVisitorsTable,
  GoogleVisitorsMenu,
  Visitor,
  VisitorsStats,
  Pagination,
  Filters,
  SnackbarState,
} from '@/components/googleadminvisitors'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
)

export default function AdminVisitorsPage() {
  const theme = useTheme()
  const { mode } = useThemeContext()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isDark = mode === 'dark'

  // State
  const [loading, setLoading] = useState(true)
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [stats, setStats] = useState<VisitorsStats | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  })
  const [filters, setFilters] = useState<Filters>({
    range: 'week',
    search: '',
  })
  const [selectedTab, setSelectedTab] = useState(0)
  const [selectedVisitors, setSelectedVisitors] = useState<string[]>([])
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success'
  })
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Fetch visitors data
  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        range: filters.range,
        search: filters.search,
      })

      const response = await fetch(`/api/admin/visitors?${queryParams}`)
      const result = await response.json()

      if (result.success) {
        setVisitors(result.data.visitors || [])
        setStats(result.data.stats || null)
        setPagination(result.data.pagination || {
          page: 1,
          limit: 50,
          total: 0,
          pages: 0
        })
      } else {
        showSnackbar(result.message || 'Failed to fetch visitors', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showSnackbar('Network error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, filters.range, filters.search])

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchVisitors, 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, fetchVisitors])

  // Initial fetch
  useEffect(() => {
    fetchVisitors()
  }, [fetchVisitors])

  // Show snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  // Handle delete
  const handleDeleteVisitor = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/visitors?id=${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        showSnackbar('Visitor deleted successfully', 'success')
        fetchVisitors()
        setSelectedVisitors(prev => prev.filter(v => v !== id))
      } else {
        showSnackbar(result.message || 'Failed to delete visitor', 'error')
      }
    } catch (error) {
      showSnackbar('Network error occurred', 'error')
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedVisitors.length === 0) return

    try {
      await Promise.all(
        selectedVisitors.map(id => 
          fetch(`/api/admin/visitors?id=${id}`, { method: 'DELETE' })
        )
      )
      showSnackbar(`${selectedVisitors.length} visitors deleted`, 'success')
      setSelectedVisitors([])
      fetchVisitors()
    } catch (error) {
      showSnackbar('Failed to delete visitors', 'error')
    }
  }

  // Handle export
  const handleExport = () => {
    const data = visitors.map(v => ({
      'IP Address': v.ipAddress,
      'Device': `${v.device.browser} on ${v.device.os}`,
      'Location': v.location ? `${v.location.city}, ${v.location.country}` : 'Unknown',
      'Page Views': v.visitCount,
      'First Visit': format(new Date(v.timestamp), 'yyyy-MM-dd HH:mm'),
      'Last Visit': format(new Date(v.lastVisit), 'yyyy-MM-dd HH:mm'),
      'Converted': v.converted ? 'Yes' : 'No'
    }))

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visitors-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  // Handle menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, visitor: Visitor) => {
    setMenuAnchor(event.currentTarget)
    setSelectedVisitor(visitor)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedVisitor(null)
  }

  const handleViewDetails = () => {
    if (selectedVisitor) {
      // Handle view details
      console.log('View details:', selectedVisitor)
    }
    handleMenuClose()
  }

  const handleBlockVisitor = async () => {
    if (selectedVisitor) {
      try {
        const response = await fetch(`/api/admin/visitors/block`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedVisitor._id })
        })
        const result = await response.json()
        if (result.success) {
          showSnackbar('Visitor blocked successfully', 'success')
          fetchVisitors()
        }
      } catch (error) {
        showSnackbar('Failed to block visitor', 'error')
      }
    }
    handleMenuClose()
  }

  const handleMarkAsConverted = async () => {
    if (selectedVisitor) {
      try {
        const response = await fetch(`/api/admin/visitors/convert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedVisitor._id })
        })
        const result = await response.json()
        if (result.success) {
          showSnackbar('Visitor marked as converted', 'success')
          fetchVisitors()
        }
      } catch (error) {
        showSnackbar('Failed to mark visitor', 'error')
      }
    }
    handleMenuClose()
  }

  // Chart data
  const hourlyChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Visitors',
      data: stats?.hourlyActivity || Array(24).fill(0),
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      fill: true,
      tension: 0.4,
    }]
  }

  const deviceChartData = {
    labels: ['Desktop', 'Mobile', 'Tablet', 'Bot', 'Other'],
    datasets: [{
      data: stats ? [
        stats.byDevice.desktop,
        stats.byDevice.mobile,
        stats.byDevice.tablet,
        stats.byDevice.bot,
        stats.byDevice.other
      ] : [0, 0, 0, 0, 0],
      backgroundColor: [
        '#4285F4',
        '#34A853',
        '#FBBC05',
        '#EA4335',
        '#9AA0A6'
      ],
      borderWidth: 0,
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#303134' : '#ffffff',
        titleColor: isDark ? '#e8eaed' : '#202124',
        bodyColor: isDark ? '#9aa0a6' : '#5f6368',
        borderColor: isDark ? '#3c4043' : '#dadce0',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.1) },
        ticks: { color: isDark ? '#9aa0a6' : '#5f6368' }
      },
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#9aa0a6' : '#5f6368' }
      }
    }
  }

  // Loading state
  if (loading && !visitors.length) {
    return <GoogleVisitorsSkeleton />
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <GoogleVisitorsHeader
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
        onRefresh={fetchVisitors}
        onExport={handleExport}
        onBulkDelete={handleBulkDelete}
        selectedCount={selectedVisitors.length}
        loading={loading}
        darkMode={isDark}
        isMobile={isMobile}
      />

      <GoogleVisitorsStats stats={stats} darkMode={isDark} />

      <GoogleVisitorsFilters
        filters={filters}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onRangeChange={(range) => setFilters(prev => ({ ...prev, range }))}
        onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
        darkMode={isDark}
      />

      <GoogleVisitorsTabs
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        darkMode={isDark}
      />

      <Box sx={{ mt: 3 }}>
        {selectedTab === 0 && (
          <GoogleVisitorsOverview
            stats={stats}
            hourlyChartData={hourlyChartData}
            deviceChartData={deviceChartData}
            chartOptions={chartOptions}
            darkMode={isDark}
          />
        )}

        {selectedTab === 1 && (
          <GoogleVisitorsRealtime
            visitors={visitors}
            darkMode={isDark}
          />
        )}

        {selectedTab === 2 && (
          <GoogleVisitorsGeography
            stats={stats}
            darkMode={isDark}
          />
        )}

        {selectedTab === 3 && (
          <GoogleVisitorsDevices
            stats={stats}
            darkMode={isDark}
          />
        )}

        {selectedTab === 4 && (
          <GoogleVisitorsPages
            visitors={visitors}
            darkMode={isDark}
          />
        )}

        {selectedTab === 5 && (
          <GoogleVisitorsTable
            visitors={visitors}
            selectedVisitors={selectedVisitors}
            onSelectAll={(checked) => {
              if (checked) {
                setSelectedVisitors(visitors.map(v => v._id))
              } else {
                setSelectedVisitors([])
              }
            }}
            onSelectOne={(id, checked) => {
              if (checked) {
                setSelectedVisitors(prev => [...prev, id])
              } else {
                setSelectedVisitors(prev => prev.filter(v => v !== id))
              }
            }}
            onMenuOpen={handleMenuOpen}
            onDelete={handleDeleteVisitor}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            onLimitChange={(limit) => setPagination(prev => ({ ...prev, limit, page: 1 }))}
            darkMode={isDark}
          />
        )}
      </Box>

      <GoogleVisitorsMenu
        anchorEl={menuAnchor}
        onClose={handleMenuClose}
        visitor={selectedVisitor}
        onViewDetails={handleViewDetails}
        onBlock={handleBlockVisitor}
        onMarkConverted={handleMarkAsConverted}
        onDelete={handleDeleteVisitor}
        darkMode={isDark}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}