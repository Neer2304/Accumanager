// app/admin/visitors/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Button,
  Snackbar,
  Paper,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Stack,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Skeleton,
  Switch,
  FormControlLabel,
  Checkbox,
  Container,
  LinearProgress,
  useMediaQuery,
} from '@mui/material'
import {
  Refresh,
  Download,
  Delete,
  Search,
  MoreVert,
  Visibility,
  Devices,
  LocationOn,
  Schedule,
  TrendingUp,
  Timeline,
  BarChart,
  PieChart as PieChartIcon,
  Map,
  Tablet,
  PhoneAndroid,
  DesktopWindows,
  Router,
  Person,
  ArrowUpward,
  ArrowDownward,
  Today,
  Assessment,
  Settings,
  Apps,
  Dashboard,
  Computer,
  Language,
  Public,
  Storage,
} from '@mui/icons-material'
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
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { format, formatDistance } from 'date-fns'

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

// Types
interface Visitor {
  _id: string
  ipAddress: string
  userAgent: string
  pageUrl: string
  referrer: string
  timestamp: string
  lastVisit: string
  visitCount: number
  pageViews: Array<{ url: string; timestamp: string; referrer: string }>
  device: {
    type: string
    brand: string
    model: string
    os: string
    osVersion: string
    browser: string
    browserVersion: string
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isBot: boolean
    screenResolution?: string
    language?: string
    timezone?: string
  }
  location?: {
    country: string
    countryCode: string
    region: string
    city: string
    zipCode: string
    latitude: number
    longitude: number
    timezone: string
    isp: string
    organization: string
  }
  sessionId: string
  userId?: string
  converted: boolean
}

interface VisitorsStats {
  totalVisitors: number
  uniqueIPs: number
  todayVisitors: number
  activeNow: number
  bounceRate: number
  totalPageViews: number
  byDevice: {
    desktop: number
    mobile: number
    tablet: number
    bot: number
    other: number
  }
  byBrowser: Array<{ name: string; value: number }>
  byOS: Array<{ name: string; value: number }>
  byCountry: Array<{ country: string; visitors: number }>
  hourlyActivity: number[]
  topPages: Array<{ url: string; visits: number }>
  topReferrers: Array<{ referrer: string; visits: number }>
}

export default function AdminVisitorsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isDark = theme.palette.mode === 'dark'

  // State
  const [loading, setLoading] = useState(true)
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [stats, setStats] = useState<VisitorsStats | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  })
  const [filters, setFilters] = useState({
    range: 'week',
    search: '',
  })
  const [selectedTab, setSelectedTab] = useState(0)
  const [selectedVisitors, setSelectedVisitors] = useState<string[]>([])
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  })
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Tabs
  const tabs = [
    { label: 'Overview', icon: <Dashboard /> },
    { label: 'Real-time', icon: <Timeline /> },
    { label: 'Geography', icon: <Map /> },
    { label: 'Devices', icon: <Devices /> },
    { label: 'Pages', icon: <Apps /> },
  ]

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
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {[1, 2, 3, 4].map(i => (
            <Box key={i} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(25% - 24px)' } }}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        mb: 4,
        gap: 2
      }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold"
            gutterBottom
          >
            👥 Visitor Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and analyze your website visitors
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                size="small"
              />
            }
            label="Auto-refresh"
          />
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchVisitors}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            disabled={!visitors.length}
            size="small"
          >
            Export
          </Button>
          
          {selectedVisitors.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={handleBulkDelete}
              size="small"
            >
              Delete ({selectedVisitors.length})
            </Button>
          )}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(25% - 24px)' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: isDark ? '#303134' : '#ffffff',
              border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#4285F4', 0.1), color: '#4285F4' }}>
                <Visibility />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats?.totalVisitors?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Visitors
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Chip
                size="small"
                label={`${stats?.uniqueIPs || 0} unique IPs`}
                sx={{ bgcolor: alpha('#34A853', 0.1), color: '#34A853' }}
              />
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(25% - 24px)' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: isDark ? '#303134' : '#ffffff',
              border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#34A853', 0.1), color: '#34A853' }}>
                <Today />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats?.todayVisitors?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's Visitors
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Chip
                size="small"
                icon={<Schedule sx={{ fontSize: 14 }} />}
                label={`${stats?.activeNow || 0} active now`}
                sx={{ bgcolor: alpha('#EA4335', 0.1), color: '#EA4335' }}
              />
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(25% - 24px)' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: isDark ? '#303134' : '#ffffff',
              border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#FBBC05', 0.1), color: '#FBBC05' }}>
                <Assessment />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats?.totalPageViews?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Page Views
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Chip
                size="small"
                label={`${stats?.bounceRate?.toFixed(1) || 0}% bounce rate`}
                sx={{ bgcolor: alpha('#4285F4', 0.1), color: '#4285F4' }}
              />
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(25% - 24px)' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: isDark ? '#303134' : '#ffffff',
              border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#EA4335', 0.1), color: '#EA4335' }}>
                <Devices />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats?.byDevice?.desktop || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Desktop Users
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Chip
                size="small"
                label={`${stats?.byDevice?.mobile || 0} mobile`}
                sx={{ bgcolor: alpha('#34A853', 0.1), color: '#34A853' }}
              />
              <Chip
                size="small"
                label={`${stats?.byDevice?.tablet || 0} tablet`}
                sx={{ bgcolor: alpha('#FBBC05', 0.1), color: '#FBBC05' }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          bgcolor: isDark ? '#303134' : '#ffffff',
          border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search by IP, location, or page..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 20, color: isDark ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={filters.range}
              label="Time Range"
              onChange={(e) => setFilters(prev => ({ ...prev, range: e.target.value }))}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
              <MenuItem value="quarter">Last 90 Days</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
          overflow: 'hidden',
          mb: 4
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(_, v) => setSelectedTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
            bgcolor: isDark ? alpha('#303134', 0.5) : alpha('#f8f9fa', 0.8)
          }}
        >
          {tabs.map((tab, i) => (
            <Tab key={i} label={tab.label} icon={tab.icon} iconPosition="start" />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Overview Tab */}
          {selectedTab === 0 && stats && (
            <Fade in>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.666% - 24px)' } }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
                        height: 400
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Hourly Activity
                      </Typography>
                      <Box sx={{ height: 320 }}>
                        <Line data={hourlyChartData} options={chartOptions} />
                      </Box>
                    </Paper>
                  </Box>

                  <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 24px)' } }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
                        height: 400
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Device Distribution
                      </Typography>
                      <Box sx={{ height: 280 }}>
                        <Doughnut 
                          data={deviceChartData} 
                          options={{
                            cutout: '70%',
                            plugins: {
                              legend: {
                                display: true,
                                position: 'bottom',
                                labels: { color: isDark ? '#e8eaed' : '#202124' }
                              }
                            }
                          }} 
                        />
                      </Box>
                    </Paper>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Top Countries
                      </Typography>
                      <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {stats.byCountry.slice(0, 5).map((country, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              py: 1.5,
                              borderBottom: i < 4 ? `1px solid ${isDark ? '#3c4043' : '#dadce0'}` : 'none'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Public sx={{ fontSize: 20, color: isDark ? '#9aa0a6' : '#5f6368' }} />
                              <Typography>{country.country}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography fontWeight="bold">{country.visitors}</Typography>
                              <Chip
                                size="small"
                                label={`${((country.visitors / stats.totalVisitors) * 100).toFixed(1)}%`}
                                sx={{ bgcolor: alpha('#4285F4', 0.1), color: '#4285F4' }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Box>

                  <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Top Pages
                      </Typography>
                      <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {stats.topPages.slice(0, 5).map((page, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              py: 1.5,
                              borderBottom: i < 4 ? `1px solid ${isDark ? '#3c4043' : '#dadce0'}` : 'none'
                            }}
                          >
                            <Typography noWrap sx={{ maxWidth: 250 }}>
                              {page.url}
                            </Typography>
                            <Chip
                              size="small"
                              label={page.visits}
                              sx={{ bgcolor: alpha('#4285F4', 0.1), color: '#4285F4' }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              </Box>
            </Fade>
          )}

          {/* Real-time Tab */}
          {selectedTab === 1 && (
            <Fade in>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
                  bgcolor: isDark ? alpha('#EA4335', 0.05) : alpha('#EA4335', 0.02)
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Badge color="error" variant="dot">
                    <Avatar sx={{ bgcolor: '#EA4335' }}>
                      <Timeline />
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Live Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats?.activeNow || 0} visitors active in last 5 minutes
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {visitors
                    .filter(v => new Date(v.lastVisit) > new Date(Date.now() - 5 * 60000))
                    .map((visitor) => (
                      <Paper
                        key={visitor._id}
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 1,
                          borderRadius: 2,
                          border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
                          bgcolor: isDark ? '#202124' : '#ffffff',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: alpha('#EA4335', 0.1) }}>
                            {visitor.device.isMobile ? <PhoneAndroid /> : <DesktopWindows />}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2">
                                {visitor.location?.city || 'Unknown'}, {visitor.location?.country || 'Unknown'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDistance(new Date(visitor.lastVisit), new Date(), { addSuffix: true })}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {visitor.device.browser} on {visitor.device.os} • {visitor.pageUrl}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                </Box>
              </Paper>
            </Fade>
          )}

          {/* Geography Tab */}
          {selectedTab === 2 && stats && (
            <Fade in>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Visitors by Country
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Country</TableCell>
                        <TableCell align="right">Visitors</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                        <TableCell align="right">Trend</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.byCountry.map((country, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Public sx={{ fontSize: 20, color: isDark ? '#9aa0a6' : '#5f6368' }} />
                              {country.country}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{country.visitors}</TableCell>
                          <TableCell align="right">
                            {((country.visitors / stats.totalVisitors) * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell align="right">
                            {i % 2 === 0 ? (
                              <ArrowUpward sx={{ color: '#34A853', fontSize: 20 }} />
                            ) : (
                              <ArrowDownward sx={{ color: '#EA4335', fontSize: 20 }} />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Fade>
          )}

          {/* Devices Tab */}
          {selectedTab === 3 && stats && (
            <Fade in>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Browser Distribution
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Bar
                        data={{
                          labels: stats.byBrowser.map(b => b.name),
                          datasets: [{
                            label: 'Visitors',
                            data: stats.byBrowser.map(b => b.value),
                            backgroundColor: '#4285F4',
                            borderRadius: 8,
                          }]
                        }}
                        options={chartOptions}
                      />
                    </Box>
                  </Paper>
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Operating Systems
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Bar
                        data={{
                          labels: stats.byOS.map(o => o.name),
                          datasets: [{
                            label: 'Visitors',
                            data: stats.byOS.map(o => o.value),
                            backgroundColor: '#34A853',
                            borderRadius: 8,
                          }]
                        }}
                        options={chartOptions}
                      />
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Fade>
          )}

          {/* Pages Tab */}
          {selectedTab === 4 && stats && (
            <Fade in>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Top Pages
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Page URL</TableCell>
                        <TableCell align="right">Visits</TableCell>
                        <TableCell align="right">Unique Visitors</TableCell>
                        <TableCell align="right">Bounce Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.topPages.map((page, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {page.url}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{page.visits}</TableCell>
                          <TableCell align="right">
                            {Math.round(page.visits * 0.7)}
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              size="small"
                              label={`${Math.round(Math.random() * 40 + 30)}%`}
                              sx={{ bgcolor: alpha('#FBBC05', 0.1), color: '#FBBC05' }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Fade>
          )}
        </Box>
      </Paper>

      {/* Visitors Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, borderBottom: `1px solid ${isDark ? '#3c4043' : '#dadce0'}` }}>
          <Typography variant="h6" fontWeight="bold">
            Recent Visitors
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedVisitors.length > 0 && selectedVisitors.length < visitors.length}
                    checked={selectedVisitors.length === visitors.length && visitors.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVisitors(visitors.map(v => v._id))
                      } else {
                        setSelectedVisitors([])
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Visitor</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Page</TableCell>
                <TableCell align="center">Visits</TableCell>
                <TableCell>Last Seen</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visitors.map((visitor) => (
                <TableRow key={visitor._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedVisitors.includes(visitor._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVisitors([...selectedVisitors, visitor._id])
                        } else {
                          setSelectedVisitors(selectedVisitors.filter(id => id !== visitor._id))
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: visitor.device.isBot
                            ? alpha('#EA4335', 0.1)
                            : alpha('#4285F4', 0.1),
                          color: visitor.device.isBot ? '#EA4335' : '#4285F4'
                        }}
                      >
                        {visitor.device.isBot ? <Router /> : <Person />}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {visitor.ipAddress}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {visitor.userId ? 'Registered' : 'Guest'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {visitor.location ? (
                      <>
                        <Typography variant="body2">
                          {visitor.location.city}, {visitor.location.country}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {visitor.location.isp}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unknown
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {visitor.device.isMobile ? (
                        <PhoneAndroid sx={{ fontSize: 16, color: '#34A853' }} />
                      ) : visitor.device.isTablet ? (
                        <Tablet sx={{ fontSize: 16, color: '#FBBC05' }} />
                      ) : (
                        <DesktopWindows sx={{ fontSize: 16, color: '#4285F4' }} />
                      )}
                      <Box>
                        <Typography variant="body2">
                          {visitor.device.browser}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {visitor.device.os}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={visitor.pageUrl}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {visitor.pageUrl}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={visitor.visitCount}
                      size="small"
                      sx={{ bgcolor: alpha('#4285F4', 0.1), color: '#4285F4' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={new Date(visitor.lastVisit).toLocaleString()}>
                      <Typography variant="body2">
                        {formatDistance(new Date(visitor.lastVisit), new Date(), { addSuffix: true })}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setSelectedVisitor(visitor)
                        setMenuAnchor(e.currentTarget)
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          rowsPerPage={pagination.limit}
          onPageChange={(_, page) => setPagination(prev => ({ ...prev, page: page + 1 }))}
          onRowsPerPageChange={(e) => setPagination(prev => ({ 
            ...prev, 
            limit: parseInt(e.target.value, 10),
            page: 1 
          }))}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null)
          setSelectedVisitor(null)
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: `1px solid ${isDark ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        <MenuItem onClick={() => {
          if (selectedVisitor) {
            window.open(`/admin/visitors/${selectedVisitor._id}`, '_blank')
          }
          setMenuAnchor(null)
        }}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => {
            if (selectedVisitor) {
              handleDeleteVisitor(selectedVisitor._id)
            }
            setMenuAnchor(null)
          }}
          sx={{ color: '#EA4335' }}
        >
          <ListItemIcon><Delete fontSize="small" sx={{ color: '#EA4335' }} /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: 2,
            border: `1px solid ${
              snackbar.severity === 'success' ? alpha('#34A853', 0.3) : alpha('#EA4335', 0.3)
            }`
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}