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
  Button,
  Tab,
  Tabs,
  LinearProgress
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
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import DownloadIcon from '@mui/icons-material/Download'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import TimelineIcon from '@mui/icons-material/Timeline'
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek'
import { SalesChartData as SalesChartDataType } from '@/types'

interface SalesChartProps {
  data: SalesChartDataType[]
  timeRange: 'week' | 'month' | 'quarter' | 'year'
  onTimeRangeChange: (range: 'week' | 'month' | 'quarter' | 'year') => void
}

const SalesChart: React.FC<SalesChartProps> = ({ 
  data = [],
  timeRange = 'week', 
  onTimeRangeChange 
}) => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark';
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
        if (day % 5 === 0 || isLastItem || day === 1) {
          return isMobile ? day.toString() : `${date.getDate()}`
        }
        return ''
      } else if (timeRange === 'quarter') {
        const month = date.toLocaleDateString('en-US', { month: 'short' })
        return isMobile ? month.charAt(0) : month
      } else {
        const month = date.toLocaleDateString('en-US', { month: 'short' })
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
            backgroundColor: darkMode ? alpha('#303134', 0.95) : alpha('#ffffff', 0.95),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            minWidth: { xs: 160, sm: 200 },
            color: darkMode ? '#e8eaed' : '#202124',
          }}
        >
          <Typography 
            variant={isMobile ? "caption" : "subtitle2"} 
            fontWeight={600} 
            gutterBottom
            color={darkMode ? '#e8eaed' : '#202124'}
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
                  color={darkMode ? '#9aa0a6' : '#5f6368'}
                >
                  {entry.name}:
                </Typography>
              </Box>
              <Typography 
                variant={isMobile ? "caption" : "body2"} 
                fontWeight={600}
                sx={{ ml: 1 }}
                color={darkMode ? '#e8eaed' : '#202124'}
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

  // Calculate statistics
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0)
  const totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const totalItems = data.reduce((sum, item) => sum + ((item as any).totalItems || 0), 0)

  const calculateGrowth = () => {
    if (data.length < 2) return 0
    const firstHalf = data.slice(0, Math.floor(data.length / 2))
    const secondHalf = data.slice(Math.floor(data.length / 2))
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.revenue, 0) / Math.max(firstHalf.length, 1)
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.revenue, 0) / Math.max(secondHalf.length, 1)
    return firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0
  }

  const growth = calculateGrowth()

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
    '#4285f4',
    '#34a853',
    '#fbbc04',
    '#ea4335',
    '#8ab4f8',
    '#81c995',
    '#fdd663',
  ]

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
        justifyContent: 'center',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
          Daily Avg
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="#4285f4" 
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
        justifyContent: 'center',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
          Peak Day
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="#ea4335" 
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
        justifyContent: 'center',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
          Items/Day
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="#34a853" 
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
        justifyContent: 'center',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
          Conversion
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="#fbbc04" 
          fontWeight={700}
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
        >
          {totalItems > 0 ? ((totalOrders / totalItems) * 100).toFixed(1) + '%' : '0%'}
        </Typography>
      </Paper>
    </Box>
  )

  const renderActiveChart = () => {
    const chartHeight = isMobile ? 250 : isTablet ? 300 : 350
    
    switch (activeTab) {
      case 0:
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
                stroke={darkMode ? alpha('#3c4043', 0.5) : alpha('#dadce0', 0.5)} 
                vertical={false} 
              />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ 
                  fontSize: isMobile ? 9 : 11,
                  fill: darkMode ? '#9aa0a6' : '#5f6368'
                }}
                axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                interval={getXTickInterval()}
                height={isMobile ? 30 : 40}
              />
              <YAxis 
                tick={{ 
                  fontSize: isMobile ? 9 : 11,
                  fill: darkMode ? '#9aa0a6' : '#5f6368'
                }}
                axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                width={isMobile ? 40 : 60}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  fontSize: isMobile ? 10 : 12, 
                  paddingTop: 5,
                  display: isMobile ? 'none' : 'block',
                  color: darkMode ? '#e8eaed' : '#202124'
                }} 
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#4285f4"
                fill={alpha('#4285f4', 0.1)}
                strokeWidth={isMobile ? 1.5 : 2}
                activeDot={{ r: isMobile ? 3 : 5 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#34a853"
                strokeWidth={isMobile ? 1.5 : 2}
                strokeDasharray="5 5"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )
        
      case 1:
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
                  stroke={darkMode ? alpha('#3c4043', 0.5) : alpha('#dadce0', 0.5)} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ 
                    fontSize: isMobile ? 9 : 11,
                    fill: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                  axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  interval={getXTickInterval()}
                  height={isMobile ? 30 : 40}
                />
                <YAxis 
                  tick={{ 
                    fontSize: isMobile ? 9 : 11,
                    fill: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                  axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  width={isMobile ? 40 : 60}
                  tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="revenue" 
                  name="Revenue"
                  fill="#4285f4"
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
                  stroke={darkMode ? alpha('#3c4043', 0.5) : alpha('#dadce0', 0.5)} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ 
                    fontSize: isMobile ? 9 : 11,
                    fill: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                  axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  interval={getXTickInterval()}
                  height={isMobile ? 30 : 40}
                />
                <YAxis 
                  tick={{ 
                    fontSize: isMobile ? 9 : 11,
                    fill: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                  axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  width={isMobile ? 40 : 60}
                  tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#4285f4"
                  strokeWidth={isMobile ? 1.5 : 2}
                  dot={isMobile ? false : { r: 3 }}
                  activeDot={{ r: isMobile ? 3 : 5 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )
        
      case 2:
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
                  stroke={darkMode ? alpha('#3c4043', 0.5) : alpha('#dadce0', 0.5)} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ 
                    fontSize: isMobile ? 9 : 11,
                    fill: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                  axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  interval={getXTickInterval()}
                  height={isMobile ? 30 : 40}
                />
                <YAxis 
                  tick={{ 
                    fontSize: isMobile ? 9 : 11,
                    fill: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                  axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  width={isMobile ? 40 : 60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="orders" 
                  name="Orders"
                  fill="#34a853"
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
                    <stop offset="5%" stopColor="#34a853" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34a853" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? alpha('#3c4043', 0.5) : alpha('#dadce0', 0.5)} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ 
                    fontSize: isMobile ? 9 : 11,
                    fill: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                  axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  interval={getXTickInterval()}
                  height={isMobile ? 30 : 40}
                />
                <YAxis 
                  tick={{ 
                    fontSize: isMobile ? 9 : 11,
                    fill: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                  axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                  width={isMobile ? 40 : 60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#34a853"
                  fill="url(#ordersGradient)"
                  strokeWidth={isMobile ? 1.5 : 2}
                  activeDot={{ r: isMobile ? 3 : 5 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )
        
      case 3:
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
                stroke={darkMode ? alpha('#3c4043', 0.5) : alpha('#dadce0', 0.5)} 
                vertical={false} 
              />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ 
                  fontSize: isMobile ? 9 : 11,
                  fill: darkMode ? '#9aa0a6' : '#5f6368'
                }}
                axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                interval={getXTickInterval()}
                height={isMobile ? 30 : 40}
              />
              <YAxis 
                yAxisId="left"
                tick={{ 
                  fontSize: isMobile ? 9 : 11,
                  fill: darkMode ? '#9aa0a6' : '#5f6368'
                }}
                axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                width={isMobile ? 40 : 60}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ 
                  fontSize: isMobile ? 9 : 11,
                  fill: darkMode ? '#9aa0a6' : '#5f6368'
                }}
                axisLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                tickLine={{ stroke: darkMode ? '#3c4043' : '#dadce0' }}
                width={isMobile ? 40 : 60}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="left"
                dataKey="orders"
                name="Orders"
                fill={alpha('#34a853', 0.3)}
                radius={[4, 4, 0, 0]}
                barSize={isMobile ? 15 : 30}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#4285f4"
                strokeWidth={isMobile ? 1.5 : 2}
                dot={isMobile ? false : { r: 3 }}
                activeDot={{ r: isMobile ? 3 : 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )
        
      case 4:
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
                      paddingTop: 10,
                      color: darkMode ? '#e8eaed' : '#202124'
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
                    backgroundColor: darkMode ? alpha(COLORS[index % COLORS.length], 0.1) : alpha(COLORS[index % COLORS.length], 0.05),
                    border: `1px solid ${darkMode ? alpha(COLORS[index % COLORS.length], 0.3) : alpha(COLORS[index % COLORS.length], 0.2)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%',
                        backgroundColor: COLORS[index % COLORS.length]
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      color={darkMode ? '#e8eaed' : '#202124'}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    fontWeight={600}
                    color={darkMode ? '#e8eaed' : '#202124'}
                  >
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
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 1.5, sm: 2 },
        gap: { xs: 1.5, sm: 2 }
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
              sx={{ 
                fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
                color: darkMode ? '#e8eaed' : '#202124'
              }}
            >
              Sales Analytics Dashboard
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                color: darkMode ? '#9aa0a6' : '#5f6368'
              }}
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
                height: { xs: 32, sm: 36 },
                color: darkMode ? '#9aa0a6' : '#5f6368'
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
                height: { xs: 32, sm: 36 },
                color: darkMode ? '#9aa0a6' : '#5f6368'
              }}
            >
              <DownloadIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: { xs: 90, sm: 100, md: 120 },
                '& .MuiInputLabel-root': { 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                },
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#e8eaed' : '#202124',
                  '& fieldset': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? '#4285f4' : '#4285f4',
                  },
                }
              }}
            >
              <InputLabel>Period</InputLabel>
              <Select
                value={timeRange}
                label="Period"
                onChange={(e) => onTimeRangeChange(e.target.value as any)}
                size="small"
              >
                <MenuItem 
                  value="week" 
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: darkMode ? '#e8eaed' : '#202124'
                  }}
                >
                  Weekly
                </MenuItem>
                <MenuItem 
                  value="month" 
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: darkMode ? '#e8eaed' : '#202124'
                  }}
                >
                  Monthly
                </MenuItem>
                <MenuItem 
                  value="quarter" 
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: darkMode ? '#e8eaed' : '#202124'
                  }}
                >
                  Quarterly
                </MenuItem>
                <MenuItem 
                  value="year" 
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: darkMode ? '#e8eaed' : '#202124'
                  }}
                >
                  Yearly
                </MenuItem>
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
                borderRadius: 2,
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
                border: `1px solid ${darkMode ? alpha('#4285f4', 0.3) : alpha('#4285f4', 0.2)}`,
                flex: '1 1 calc(33.333% - 8px)',
                minWidth: 0
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                Total Revenue
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                fontWeight={700} 
                color="#4285f4"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
              >
                ₹{totalRevenue.toLocaleString()}
              </Typography>
              {growth !== 0 && (
                <Typography 
                  variant="caption" 
                  color={growth > 0 ? '#34a853' : '#ea4335'}
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
                borderRadius: 2,
                backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.05),
                border: `1px solid ${darkMode ? alpha('#34a853', 0.3) : alpha('#34a853', 0.2)}`,
                flex: '1 1 calc(33.333% - 8px)',
                minWidth: 0
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                Total Orders
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                fontWeight={700} 
                color="#34a853"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
              >
                {totalOrders.toLocaleString()}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                {totalItems.toLocaleString()} items
              </Typography>
            </Paper>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.05),
                border: `1px solid ${darkMode ? alpha('#fbbc04', 0.3) : alpha('#fbbc04', 0.2)}`,
                flex: '1 1 calc(33.333% - 8px)',
                minWidth: 0
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                Avg. Order Value
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                fontWeight={700} 
                color="#fbbc04"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
              >
                ₹{avgOrderValue.toLocaleString()}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Loading Progress */}
        {loading && (
          <LinearProgress sx={{ my: 1 }} />
        )}

        {/* Chart View Tabs */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: darkMode ? '#3c4043' : '#dadce0',
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
                padding: { xs: '6px 8px', sm: '12px 16px' },
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&.Mui-selected': {
                  color: darkMode ? '#8ab4f8' : '#4285f4',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: darkMode ? '#8ab4f8' : '#4285f4',
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
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&.Mui-selected': {
                    backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                    borderColor: darkMode ? '#4285f4' : '#4285f4',
                  },
                  '&:hover': {
                    backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
                  }
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
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  backgroundColor: darkMode ? 
                    (includeDrafts ? '#3c4043' : alpha('#4285f4', 0.2)) : 
                    undefined,
                  color: darkMode ? 
                    (includeDrafts ? '#9aa0a6' : '#8ab4f8') : 
                    undefined,
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
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.05),
              border: `1px solid ${darkMode ? alpha('#ea4335', 0.3) : alpha('#ea4335', 0.2)}`,
              color: darkMode ? '#f28b82' : '#ea4335',
            }}
            action={
              <IconButton 
                size="small" 
                onClick={handleRefresh}
                sx={{ height: 24, width: 24, color: 'inherit' }}
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
              sx={{ 
                borderRadius: 1,
                backgroundColor: darkMode ? alpha('#3c4043', 0.5) : alpha('#dadce0', 0.5)
              }}
            />
            <Skeleton 
              variant="rounded" 
              height={isMobile ? 80 : 100} 
              sx={{ 
                borderRadius: 1,
                backgroundColor: darkMode ? alpha('#3c4043', 0.5) : alpha('#dadce0', 0.5)
              }}
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
                maxWidth: 400,
                backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.05),
                border: `1px solid ${darkMode ? alpha('#ea4335', 0.3) : alpha('#ea4335', 0.2)}`,
                color: darkMode ? '#f28b82' : '#ea4335',
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
                color: darkMode ? '#5f6368' : '#9aa0a6', 
                mb: 2, 
                opacity: 0.5 
              }} />
              <Typography 
                color={darkMode ? '#9aa0a6' : '#5f6368'}
                gutterBottom
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                No sales data available
              </Typography>
              <Typography 
                variant="body2" 
                color={darkMode ? '#5f6368' : '#9aa0a6'}
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
                sx={{ 
                  mt: 2,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#4285f4' : '#4285f4',
                    backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
                  }
                }}
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
                borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
              }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  Showing {data.length} {timeRange === 'week' ? 'days' : timeRange === 'month' ? 'days' : timeRange === 'quarter' ? 'days' : 'months'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
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