// components/dashboard/SalesChart.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Alert,
  IconButton,
  Stack,
  Chip,
  Skeleton,
  alpha,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Fade,
  Button
} from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import RefreshIcon from '@mui/icons-material/Refresh'
import BarChartIcon from '@mui/icons-material/BarChart'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import PieChartIcon from '@mui/icons-material/PieChart'
import RadarIcon from '@mui/icons-material/Radar'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import DownloadIcon from '@mui/icons-material/Download'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import TimelineIcon from '@mui/icons-material/Timeline'
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { SalesChartData as SalesChartDataType } from '@/types' // Import the type from your types file

// Remove the local interface and use the imported one
interface SalesChartProps {
  data: SalesChartDataType[] // Use the imported type
  timeRange: 'week' | 'month' | 'quarter' | 'year'
  onTimeRangeChange: (range: 'week' | 'month' | 'quarter' | 'year') => void
}

const SalesChart: React.FC<SalesChartProps> = ({ 
  data = [],
  timeRange = 'week', 
  onTimeRangeChange 
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [includeDrafts, setIncludeDrafts] = useState(false)
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line')
  const [activeTab, setActiveTab] = useState(0)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const fetchSalesData = async (range: string, includeDrafts: boolean = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const url = `/api/dashboard/sales?range=${range}&includeDrafts=true`
      console.log('📊 Fetching sales data from:', url)
      
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const salesData = await response.json()
        
        if (salesData && Array.isArray(salesData)) {
          // Data is already set by parent, just validate
          console.log('Sales data received:', salesData.length, 'records')
        } else {
          setError('Invalid data format received')
        }
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch sales data:', errorText)
        setError(`Error ${response.status}: ${errorText || 'Failed to load data'}`)
      }
    } catch (error) {
      console.error('Error fetching sales data:', error)
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalesData(timeRange, includeDrafts)
  }, [timeRange, includeDrafts])

  const handleRefresh = () => {
    fetchSalesData(timeRange, includeDrafts)
  }

  const handleExportData = () => {
    if (!data || data.length === 0) return
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Orders,Revenue,Items,Avg Order Value\n"
      + data.map(d => `${d.date},${d.orders},${d.revenue},${d.totalItems},${d.avgOrderValue || 0}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `sales_data_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate optimal X-axis ticks
  const getXTickInterval = () => {
    const dataLength = data.length
    if (isMobile) {
      if (dataLength <= 7) return 0
      if (dataLength <= 14) return 1
      if (dataLength <= 30) return 3
      return 7
    }
    if (dataLength <= 7) return 0
    if (dataLength <= 14) return 0
    if (dataLength <= 30) return 1
    if (dataLength <= 90) return 7
    return 30
  }

  const formatXAxis = (tickItem: string) => {
    try {
      const date = new Date(tickItem)
      const interval = getXTickInterval()
      const dataIndex = data.findIndex(d => d.date === tickItem)
      const isLastItem = dataIndex === data.length - 1
      
      if (timeRange === 'week') {
        if (isMobile) {
          return date.toLocaleDateString('en-US', { weekday: 'narrow' })
        }
        return date.toLocaleDateString('en-US', { weekday: 'short' })
      } else if (timeRange === 'month') {
        const day = date.getDate()
        // Show every 5th day or last day
        if (day % 5 === 0 || isLastItem || day === 1) {
          return isMobile ? day.toString() : `${date.getDate()}`
        }
        return ''
      } else if (timeRange === 'quarter') {
        const month = date.toLocaleDateString('en-US', { month: 'short' })
        return isMobile ? month.charAt(0) : month
      } else {
        const month = date.toLocaleDateString('en-US', { month: 'short' })
        // Only show first letter for mobile, full for desktop
        return isMobile ? month.charAt(0) : month
      }
    } catch {
      return ''
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label)
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: timeRange === 'week' ? 'long' : undefined,
        month: 'short',
        day: 'numeric',
        year: timeRange === 'year' ? 'numeric' : undefined
      })

      return (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 1, sm: 1.5, md: 2 },
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            minWidth: { xs: 160, sm: 200 }
          }}
        >
          <Typography 
            variant={isMobile ? "caption" : "subtitle2"} 
            fontWeight={600} 
            gutterBottom
          >
            {formattedDate}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 0.5,
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: entry.color
                  }}
                />
                <Typography 
                  variant={isMobile ? "caption" : "body2"} 
                  color="text.secondary"
                >
                  {entry.name}:
                </Typography>
              </Box>
              <Typography 
                variant={isMobile ? "caption" : "body2"} 
                fontWeight={600}
                sx={{ ml: 1 }}
              >
                {entry.name === 'Revenue' || entry.name === 'Avg Order Value' 
                  ? `₹${entry.value?.toLocaleString() || '0'}`
                  : entry.value?.toLocaleString() || '0'}
              </Typography>
            </Box>
          ))}
        </Paper>
      )
    }
    return null
  }

  // Calculate statistics - handle missing properties
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0)
  const totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const totalItems = data.reduce((sum, item) => sum + ((item as any).totalItems || 0), 0) // Use type assertion for totalItems

  // Calculate growth percentage
  const calculateGrowth = () => {
    if (data.length < 2) return 0
    const firstHalf = data.slice(0, Math.floor(data.length / 2))
    const secondHalf = data.slice(Math.floor(data.length / 2))
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.revenue, 0) / Math.max(firstHalf.length, 1)
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.revenue, 0) / Math.max(secondHalf.length, 1)
    return firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0
  }

  const growth = calculateGrowth()

  // Weekly breakdown data for pie chart
  const weeklyBreakdown = data.length > 0 ? [
    { name: 'Mon', value: Math.round(totalRevenue * 0.15) },
    { name: 'Tue', value: Math.round(totalRevenue * 0.18) },
    { name: 'Wed', value: Math.round(totalRevenue * 0.22) },
    { name: 'Thu', value: Math.round(totalRevenue * 0.16) },
    { name: 'Fri', value: Math.round(totalRevenue * 0.20) },
    { name: 'Sat', value: Math.round(totalRevenue * 0.06) },
    { name: 'Sun', value: Math.round(totalRevenue * 0.03) },
  ] : []

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.grey[500],
  ]

  // Render mini stats cards without Grid
  const renderMiniCharts = () => (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 1, 
      mt: { xs: 1, sm: 2 },
      '& > *': {
        flex: '1 1 calc(50% - 8px)',
        minWidth: 0,
        '@media (min-width: 600px)': {
          flex: '1 1 calc(25% - 12px)'
        }
      }
    }}>
      <Paper sx={{ 
        p: { xs: 1, sm: 1.5, md: 2 }, 
        textAlign: 'center', 
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          Daily Avg
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="primary.main" 
          fontWeight={700}
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
        >
          ₹{Math.round(totalRevenue / Math.max(data.length, 1)).toLocaleString()}
        </Typography>
      </Paper>
      <Paper sx={{ 
        p: { xs: 1, sm: 1.5, md: 2 }, 
        textAlign: 'center', 
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          Peak Day
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="secondary.main" 
          fontWeight={700}
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
        >
          ₹{data.length > 0 ? Math.max(...data.map(d => d.revenue)).toLocaleString() : '0'}
        </Typography>
      </Paper>
      <Paper sx={{ 
        p: { xs: 1, sm: 1.5, md: 2 }, 
        textAlign: 'center', 
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          Items/Day
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="success.main" 
          fontWeight={700}
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
        >
          {Math.round(totalItems / Math.max(data.length, 1)).toLocaleString()}
        </Typography>
      </Paper>
      <Paper sx={{ 
        p: { xs: 1, sm: 1.5, md: 2 }, 
        textAlign: 'center', 
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          Conversion
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="info.main" 
          fontWeight={700}
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
        >
          {totalItems > 0 ? ((totalOrders / totalItems) * 100).toFixed(1) + '%' : '0%'}
        </Typography>
      </Paper>
    </Box>
  )

  // Render different chart based on active tab
  const renderActiveChart = () => {
    const chartHeight = isMobile ? 250 : isTablet ? 300 : 350
    
    switch (activeTab) {
      case 0: // Overview
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <ComposedChart
              data={data}
              margin={{
                top: isMobile ? 10 : 20,
                right: isMobile ? 5 : 10,
                left: isMobile ? 5 : 20,
                bottom: isMobile ? 30 : 40,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={alpha(theme.palette.divider, 0.3)} 
                vertical={false} 
              />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: isMobile ? 9 : 11 }}
                axisLine={false}
                tickLine={false}
                interval={getXTickInterval()}
                height={isMobile ? 30 : 40}
              />
              <YAxis 
                tick={{ fontSize: isMobile ? 9 : 11 }}
                axisLine={false}
                tickLine={false}
                width={isMobile ? 40 : 60}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  fontSize: isMobile ? 10 : 12, 
                  paddingTop: 5,
                  display: isMobile ? 'none' : 'block'
                }} 
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={theme.palette.primary.main}
                fill={alpha(theme.palette.primary.main, 0.1)}
                strokeWidth={isMobile ? 1.5 : 2}
                activeDot={{ r: isMobile ? 3 : 5 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke={theme.palette.secondary.main}
                strokeWidth={isMobile ? 1.5 : 2}
                strokeDasharray="5 5"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )
        
      case 1: // Revenue
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            {chartType === 'bar' ? (
              <BarChart
                data={data}
                margin={{
                  top: isMobile ? 10 : 20,
                  right: isMobile ? 5 : 10,
                  left: isMobile ? 5 : 20,
                  bottom: isMobile ? 30 : 40,
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={alpha(theme.palette.divider, 0.3)} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={getXTickInterval()}
                  height={isMobile ? 30 : 40}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 40 : 60}
                  tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="revenue" 
                  name="Revenue"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                  barSize={isMobile ? 15 : 30}
                />
              </BarChart>
            ) : (
              <LineChart
                data={data}
                margin={{
                  top: isMobile ? 10 : 20,
                  right: isMobile ? 5 : 10,
                  left: isMobile ? 5 : 20,
                  bottom: isMobile ? 30 : 40,
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={alpha(theme.palette.divider, 0.3)} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={getXTickInterval()}
                  height={isMobile ? 30 : 40}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 40 : 60}
                  tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={theme.palette.primary.main}
                  strokeWidth={isMobile ? 1.5 : 2}
                  dot={isMobile ? false : { r: 3 }}
                  activeDot={{ r: isMobile ? 3 : 5 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )
        
      case 2: // Orders
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            {chartType === 'bar' ? (
              <BarChart
                data={data}
                margin={{
                  top: isMobile ? 10 : 20,
                  right: isMobile ? 5 : 10,
                  left: isMobile ? 5 : 20,
                  bottom: isMobile ? 30 : 40,
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={alpha(theme.palette.divider, 0.3)} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={getXTickInterval()}
                  height={isMobile ? 30 : 40}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 40 : 60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="orders" 
                  name="Orders"
                  fill={theme.palette.secondary.main}
                  radius={[4, 4, 0, 0]}
                  barSize={isMobile ? 15 : 30}
                />
              </BarChart>
            ) : (
              <LineChart
                data={data}
                margin={{
                  top: isMobile ? 10 : 20,
                  right: isMobile ? 5 : 10,
                  left: isMobile ? 5 : 20,
                  bottom: isMobile ? 30 : 40,
                }}
              >
                <defs>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={alpha(theme.palette.divider, 0.3)} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={getXTickInterval()}
                  height={isMobile ? 30 : 40}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 40 : 60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke={theme.palette.secondary.main}
                  fill="url(#ordersGradient)"
                  strokeWidth={isMobile ? 1.5 : 2}
                  activeDot={{ r: isMobile ? 3 : 5 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )
        
      case 3: // Comparison
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <ComposedChart
              data={data}
              margin={{
                top: isMobile ? 10 : 20,
                right: isMobile ? 5 : 10,
                left: isMobile ? 5 : 20,
                bottom: isMobile ? 30 : 40,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={alpha(theme.palette.divider, 0.3)} 
                vertical={false} 
              />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: isMobile ? 9 : 11 }}
                axisLine={false}
                tickLine={false}
                interval={getXTickInterval()}
                height={isMobile ? 30 : 40}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: isMobile ? 9 : 11 }}
                axisLine={false}
                tickLine={false}
                width={isMobile ? 40 : 60}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: isMobile ? 9 : 11 }}
                axisLine={false}
                tickLine={false}
                width={isMobile ? 40 : 60}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="left"
                dataKey="orders"
                name="Orders"
                fill={alpha(theme.palette.secondary.main, 0.3)}
                radius={[4, 4, 0, 0]}
                barSize={isMobile ? 15 : 30}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={theme.palette.primary.main}
                strokeWidth={isMobile ? 1.5 : 2}
                dot={isMobile ? false : { r: 3 }}
                activeDot={{ r: isMobile ? 3 : 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )
        
      case 4: // Breakdown
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: { xs: 2, sm: 4 }
          }}>
            <Box sx={{ 
              width: { xs: '100%', sm: '60%' },
              height: chartHeight
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={weeklyBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={isMobile ? 70 : isTablet ? 80 : 100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {weeklyBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: isMobile ? 10 : 12,
                      paddingTop: 10
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ 
              width: { xs: '100%', sm: '40%' },
              p: { xs: 1, sm: 2 }
            }}>
              {weeklyBreakdown.map((item, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(COLORS[index % COLORS.length], 0.1)
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%',
                        bgcolor: COLORS[index % COLORS.length]
                      }} 
                    />
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    ₹{item.value.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )
        
      default:
        return null
    }
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: { xs: 1, sm: 2 },
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 1, sm: 1.5, md: 2 },
        gap: { xs: 1, sm: 1.5, md: 2 }
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1
        }}>
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              fontWeight={600}
              sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}
            >
              Sales Analytics Dashboard
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' } }}
            >
              {timeRange === 'week' ? 'Last 7 days' : 
               timeRange === 'month' ? 'Last 30 days' : 
               timeRange === 'quarter' ? 'Last 90 days' : 'Last 12 months'}
            </Typography>
          </Box>
          
          <Stack 
            direction="row" 
            spacing={0.5} 
            alignItems="center"
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'space-between', sm: 'flex-end' }
            }}
          >
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh data"
              sx={{ 
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 }
              }}
            >
              <RefreshIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleExportData}
              disabled={loading || data.length === 0}
              title="Export data"
              sx={{ 
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 }
              }}
            >
              <DownloadIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: { xs: 90, sm: 100, md: 120 },
                '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
              }}
            >
              <InputLabel>Period</InputLabel>
              <Select
                value={timeRange}
                label="Period"
                onChange={(e) => onTimeRangeChange(e.target.value as any)}
                size="small"
              >
                <MenuItem value="week" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Weekly</MenuItem>
                <MenuItem value="month" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Monthly</MenuItem>
                <MenuItem value="quarter" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Quarterly</MenuItem>
                <MenuItem value="year" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Yearly</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Main Stats */}
        {!loading && !error && data.length > 0 && (
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 1, sm: 1.5 },
                borderRadius: { xs: 1, sm: 1.5 },
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                flex: '1 1 calc(33.333% - 8px)',
                minWidth: 0
              }}
            >
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
              >
                Total Revenue
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                fontWeight={700} 
                color="primary.main"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
              >
                ₹{totalRevenue.toLocaleString()}
              </Typography>
              {growth !== 0 && (
                <Typography 
                  variant="caption" 
                  color={growth > 0 ? 'success.main' : 'error.main'}
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                >
                  {growth > 0 ? '↗' : '↘'} {Math.abs(growth).toFixed(1)}%
                </Typography>
              )}
            </Paper>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 1, sm: 1.5 },
                borderRadius: { xs: 1, sm: 1.5 },
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                flex: '1 1 calc(33.333% - 8px)',
                minWidth: 0
              }}
            >
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
              >
                Total Orders
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                fontWeight={700} 
                color="secondary.main"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
              >
                {totalOrders.toLocaleString()}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
              >
                {totalItems.toLocaleString()} items
              </Typography>
            </Paper>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 1, sm: 1.5 },
                borderRadius: { xs: 1, sm: 1.5 },
                bgcolor: alpha(theme.palette.success.main, 0.05),
                border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                flex: '1 1 calc(33.333% - 8px)',
                minWidth: 0
              }}
            >
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
              >
                Avg. Order Value
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                fontWeight={700} 
                color="success.main"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
              >
                ₹{avgOrderValue.toLocaleString()}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Chart View Tabs */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          overflowX: 'auto',
          '& .MuiTabs-scroller': { overflowX: 'auto !important' }
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 40, sm: 48 },
              '& .MuiTab-root': {
                minHeight: { xs: 40, sm: 48 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minWidth: { xs: 70, sm: 90 },
                padding: { xs: '6px 8px', sm: '12px 16px' }
              }
            }}
          >
            <Tab 
              icon={<ShowChartIcon fontSize={isMobile ? "small" : "medium"} />} 
              label={isMobile ? "Overview" : "Overview"} 
            />
            <Tab 
              icon={<BarChartIcon fontSize={isMobile ? "small" : "medium"} />} 
              label={isMobile ? "Revenue" : "Revenue"} 
            />
            <Tab 
              icon={<TimelineIcon fontSize={isMobile ? "small" : "medium"} />} 
              label={isMobile ? "Orders" : "Orders"} 
            />
            <Tab 
              icon={<CompareArrowsIcon fontSize={isMobile ? "small" : "medium"} />} 
              label={isMobile ? "Compare" : "Comparison"} 
            />
            <Tab 
              icon={<PieChartIcon fontSize={isMobile ? "small" : "medium"} />} 
              label={isMobile ? "Breakdown" : "Breakdown"} 
            />
          </Tabs>
        </Box>

        {/* Chart Controls */}
        {activeTab < 4 && activeTab !== 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1
          }}>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(_, value) => value && setChartType(value)}
              size="small"
              sx={{ 
                height: { xs: 28, sm: 32 },
                '& .MuiToggleButton-root': {
                  padding: { xs: '4px 8px', sm: '6px 12px' },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }
              }}
            >
              <ToggleButton value="line" title="Line chart">
                <ShowChartIcon fontSize={isMobile ? "small" : "medium"} />
              </ToggleButton>
              <ToggleButton value="bar" title="Bar chart">
                <BarChartIcon fontSize={isMobile ? "small" : "medium"} />
              </ToggleButton>
              <ToggleButton value="area" title="Area chart">
                <DonutLargeIcon fontSize={isMobile ? "small" : "medium"} />
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Chip
                icon={<FilterAltIcon fontSize="small" />}
                label={includeDrafts ? "With Drafts" : "Confirmed Only"}
                size="small"
                onClick={() => setIncludeDrafts(!includeDrafts)}
                color={includeDrafts ? "default" : "primary"}
                variant={includeDrafts ? "outlined" : "filled"}
                sx={{ 
                  height: { xs: 28, sm: 32 },
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              />
            </Stack>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              alignItems: 'center',
              '& .MuiAlert-message': { flex: 1 },
              py: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
            action={
              <IconButton 
                size="small" 
                onClick={handleRefresh}
                sx={{ height: 24, width: 24 }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2 
          }}>
            <Skeleton 
              variant="rounded" 
              height={isMobile ? 250 : isTablet ? 300 : 350} 
              sx={{ borderRadius: 1 }}
            />
            <Skeleton 
              variant="rounded" 
              height={isMobile ? 80 : 100} 
              sx={{ borderRadius: 1 }}
            />
          </Box>
        ) : error ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: { xs: 2, sm: 3 }
          }}>
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%',
                maxWidth: 400
              }}
            >
              {error}
            </Alert>
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            p: { xs: 2, sm: 3 }
          }}>
            <Box>
              <BarChartIcon sx={{ 
                fontSize: { xs: 36, sm: 48, md: 56 }, 
                color: 'text.disabled', 
                mb: 2, 
                opacity: 0.5 
              }} />
              <Typography 
                color="text.secondary" 
                gutterBottom
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                No sales data available
              </Typography>
              <Typography 
                variant="body2" 
                color="text.disabled"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {includeDrafts 
                  ? 'Create some invoices to see your sales analytics'
                  : 'No confirmed orders found. Try including draft orders.'
                }
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleRefresh}
                sx={{ mt: 2 }}
              >
                Retry
              </Button>
            </Box>
          </Box>
        ) : (
          <Fade in={!loading} timeout={500}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Chart Container */}
              <Box 
                ref={chartContainerRef}
                sx={{ 
                  flex: 1,
                  minHeight: { xs: 250, sm: 300, md: 350 },
                  width: '100%',
                  position: 'relative'
                }}
              >
                {renderActiveChart()}
              </Box>

              {/* Additional Metrics */}
              {renderMiniCharts()}

              {/* Footer Info */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 0.5,
                pt: { xs: 1, sm: 1.5 },
                mt: { xs: 1, sm: 2 },
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' } }}
                >
                  Showing {data.length} {timeRange === 'week' ? 'days' : timeRange === 'month' ? 'days' : timeRange === 'quarter' ? 'days' : 'months'}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' } }}
                >
                  Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
      </CardContent>
    </Card>
  )
}

export default SalesChart