// app/hub/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Alert,
  useTheme,
  alpha,
  Button,
  Stack,
  Breadcrumbs,
  IconButton,
  Tooltip,
  Skeleton,
  Badge,
  Avatar,
  LinearProgress,
  Fade,
  Zoom,
  Divider,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card as MuiCard,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  // Core Icons
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  AttachMoney as RevenueIcon,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Warning,
  Error,
  CheckCircle,
  Info,
  Schedule,
  Refresh,
  NotificationsActive,
  Lightbulb,
  Analytics,
  Assessment,
  ShowChart,
  Timeline,
  Star,
  StarBorder,
  EmojiEvents,
  MilitaryTech,
  RocketLaunch,
  Speed as SpeedIcon,
  Home as HomeIcon,
  ArrowForward,
  ArrowUpward,
  ArrowDownward,
  // Customer Icons
  PersonAdd,
  PersonRemove,
  Group,
  GroupAdd,
  // Order Icons
  Receipt,
  ReceiptLong,
  PendingActions,
  DoneAll,
  // Product Icons
  Category,
  LocalOffer,
  PriceChange,
  // Chart Icons
  BarChart,
  PieChart,
  DonutLarge,
  // Action Icons
  Share,
  Download,
  Print,
  Email,
  WhatsApp,
  // Status Icons
  Whatshot,
  Bolt,
  ElectricBolt,
  LocalFireDepartment,
  // New Icons
  Storefront,
  BusinessCenter,
  AccountBalance,
  AccountBalanceWallet,
  Savings,
  Paid,
  PriceCheck,
  Inventory as InventoryIcon2,
  ShoppingBag,
  PersonSearch,
  TrendingUp as RevenueGrowth,
  TrendingDown as RevenueDecline,
} from '@mui/icons-material'
import Link from 'next/link'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { useTheme as useMuiTheme } from '@mui/material/styles'
import { useInventoryData } from '@/hooks/useInventoryData'

// ===== GOOGLE COLORS =====
const google = {
  blue: '#4285f4',
  blueLight: '#e8f0fe',
  blueDark: '#3367d6',
  green: '#34a853',
  greenLight: '#e6f4ea',
  yellow: '#fbbc04',
  yellowLight: '#fef7e0',
  red: '#ea4335',
  redLight: '#fce8e6',
  purple: '#9c27b0',
  purpleLight: '#f3e5f5',
  orange: '#ff9800',
  orangeLight: '#fff3e0',
  teal: '#009688',
  tealLight: '#e0f2f1',
  indigo: '#3f51b5',
  indigoLight: '#e8eaf6',
  pink: '#e91e63',
  pinkLight: '#fce4ec',
  grey: '#5f6368',
  greyLight: '#f8f9fa',
  greyBorder: '#dadce0',
  greyDark: '#3c4043',
  white: '#ffffff',
  black: '#202124',
}

// ===== INTERFACES =====

interface DashboardStats {
  totalProducts: number
  totalCustomers: number
  totalSales: number
  monthlyRevenue: number
  totalRevenue: number
  lowStockProducts: number
  pendingBills: number
  subscription: {
    plan: string
    isActive: boolean
    limits: {
      products: number
      customers: number
      invoices: number
    }
  }
}

interface SalesDataPoint {
  date: string
  sales: number
  revenue: number
  totalItems: number
}

interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  company: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string | null
  city: string
  state: string
}

interface CustomerResponse {
  success: boolean
  customers: Customer[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCustomers: number
  }
  summary: {
    total: number
    active: number
    interState: number
    intraState: number
  }
}

// ===== MAIN COMPONENT =====

export default function BusinessHubPage() {
  const theme = useMuiTheme()
  const darkMode = theme.palette.mode === 'dark'
  
  // State for different data sources
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerSummary, setCustomerSummary] = useState<any>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  // Use inventory hook for product data
  const {
    products,
    metrics: inventoryMetrics,
    metricCards: inventoryMetricCards,
    loading: inventoryLoading,
    error: inventoryError,
    fetchProducts,
    calculateTotalStock,
    getStockStatus,
    getMinStockLevel,
    getCategoryColor,
  } = useInventoryData()

  // Fetch all dashboard data
  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch dashboard stats
      const statsRes = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      })
      
      if (!statsRes.ok) {
        // throw new Error('Failed to fetch dashboard stats')
      }
      
      const statsData = await statsRes.json()
      setDashboardStats(statsData)

      // Fetch sales data
      const salesRes = await fetch(`/api/dashboard/sales?range=${selectedPeriod}`, {
        credentials: 'include',
      })
      
      if (salesRes.ok) {
        const salesData = await salesRes.json()
        setSalesData(salesData)
      }

      // Fetch customers
      const customersRes = await fetch('/api/customers?limit=5', {
        credentials: 'include',
      })
      
      if (customersRes.ok) {
        const customersData: CustomerResponse = await customersRes.json()
        if (customersData.success) {
          setCustomers(customersData.customers)
          setCustomerSummary(customersData.summary)
        }
      }

    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [selectedPeriod])

  // Refresh data
  const handleRefresh = () => {
    fetchAllData()
    fetchProducts()
    setSnackbar({ open: true, message: 'Data refreshed successfully' })
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format number
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value)
  }

  // Calculate growth percentage
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100
    return ((current - previous) / previous) * 100
  }

  // Get trend icon and color
  const getTrend = (value: number) => {
    if (value > 0) return { icon: <TrendingUp sx={{ fontSize: 16 }} />, color: google.green }
    if (value < 0) return { icon: <TrendingDown sx={{ fontSize: 16 }} />, color: google.red }
    return { icon: <TrendingFlat sx={{ fontSize: 16 }} />, color: google.grey }
  }

  if (loading && !dashboardStats) {
    return (
      <MainLayout title="Business Hub">
        <Box sx={{ backgroundColor: darkMode ? google.black : google.white, minHeight: '100vh' }}>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Skeleton width={300} height={48} sx={{ mb: 2 }} />
            <Skeleton width={500} height={24} sx={{ mb: 4 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
              {[1, 2, 3, 4].map(i => (
                <Box key={i} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ width: { xs: '100%', md: 'calc(60% - 12px)' } }}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
              </Box>
              <Box sx={{ width: { xs: '100%', md: 'calc(40% - 12px)' } }}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
              </Box>
            </Box>
          </Container>
        </Box>
      </MainLayout>
    )
  }

  const totalRevenue = dashboardStats?.totalRevenue || 0
  const monthlyRevenue = dashboardStats?.monthlyRevenue || 0
  const totalSales = dashboardStats?.totalSales || 0
  const totalCustomers = dashboardStats?.totalCustomers || 0
  const totalProducts = dashboardStats?.totalProducts || 0
  const lowStockCount = dashboardStats?.lowStockProducts || inventoryMetrics.lowStock || 0
  const pendingBills = dashboardStats?.pendingBills || 0

  // Calculate revenue growth (mock for now, can be calculated from sales data)
  const revenueGrowth = salesData.length > 1 
    ? calculateGrowth(salesData[salesData.length - 1]?.revenue || 0, salesData[0]?.revenue || 0)
    : 12.5

  const revenueTrend = getTrend(revenueGrowth)

  return (
    <MainLayout title="Business Hub - Your Command Center">
      <Box sx={{ 
        backgroundColor: darkMode ? google.black : google.white,
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', color: darkMode ? '#9aa0a6' : google.grey }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Dashboard
              </Box>
            </Link>
            <Typography color={darkMode ? '#e8eaed' : google.black}>
              Business Hub
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography 
                variant="h3" 
                fontWeight={700} 
                sx={{ 
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                  background: `linear-gradient(135deg, ${google.blue}, ${google.purple})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Business Hub
              </Typography>
              <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                Your complete business overview with real-time data from all modules
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="week">Last 7 Days</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>

              <Tooltip title="Refresh Data">
                <IconButton onClick={handleRefresh} sx={{ color: google.blue }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Subscription Badge */}
          {dashboardStats?.subscription && (
            <Box sx={{ mt: 2 }}>
              <Chip
                icon={dashboardStats.subscription.isActive ? <CheckCircle /> : <Warning />}
                label={`${dashboardStats.subscription.plan} Plan ${!dashboardStats.subscription.isActive ? '(Inactive)' : ''}`}
                sx={{
                  bgcolor: dashboardStats.subscription.isActive 
                    ? alpha(google.green, 0.1) 
                    : alpha(google.red, 0.1),
                  color: dashboardStats.subscription.isActive ? google.green : google.red,
                }}
              />
            </Box>
          )}
        </Box>

        {/* Main Content - Flexbox Only, No Grid */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          
          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={handleRefresh}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* SECTION 1: Key Metrics Cards - Using REAL Data from APIs */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon sx={{ color: google.blue }} />
              Key Metrics
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
            }}>
              {/* Revenue Card */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                <Card hover sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: 10, right: 10, opacity: 0.1 }}>
                    <RevenueIcon sx={{ fontSize: 60, color: google.green }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: google.green, mt: 1 }}>
                    {formatCurrency(totalRevenue)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {revenueTrend.icon}
                    <Typography variant="body2" sx={{ color: revenueTrend.color }}>
                      {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% vs last period
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey, display: 'block', mt: 1 }}>
                    Monthly: {formatCurrency(monthlyRevenue)}
                  </Typography>
                </Card>
              </Box>

              {/* Sales Card */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                <Card hover sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: 10, right: 10, opacity: 0.1 }}>
                    <OrdersIcon sx={{ fontSize: 60, color: google.blue }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                    Total Sales
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: google.blue, mt: 1 }}>
                    {formatNumber(totalSales)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <PendingActions sx={{ fontSize: 16, color: google.yellow }} />
                    <Typography variant="body2" sx={{ color: google.yellow }}>
                      {pendingBills} pending
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey, display: 'block', mt: 1 }}>
                    Avg order: {totalSales > 0 ? formatCurrency(totalRevenue / totalSales) : formatCurrency(0)}
                  </Typography>
                </Card>
              </Box>

              {/* Customers Card */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                <Card hover sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: 10, right: 10, opacity: 0.1 }}>
                    <PeopleIcon sx={{ fontSize: 60, color: google.purple }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                    Total Customers
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: google.purple, mt: 1 }}>
                    {formatNumber(totalCustomers)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonAdd sx={{ fontSize: 14, color: google.green }} />
                      <Typography variant="caption" sx={{ color: google.green }}>
                        {customerSummary?.active || 0} active
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonRemove sx={{ fontSize: 14, color: google.grey }} />
                      <Typography variant="caption" sx={{ color: google.grey }}>
                        {customerSummary?.intraState || 0} local
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>

              {/* Products Card */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                <Card hover sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: 10, right: 10, opacity: 0.1 }}>
                    <InventoryIcon sx={{ fontSize: 60, color: google.orange }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                    Total Products
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: google.orange, mt: 1 }}>
                    {formatNumber(totalProducts)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Badge badgeContent={lowStockCount} color="warning">
                      <Warning sx={{ fontSize: 18, color: google.yellow }} />
                    </Badge>
                    <Typography variant="caption" sx={{ color: google.yellow }}>
                      {lowStockCount} low stock
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey, display: 'block', mt: 1 }}>
                    Value: {formatCurrency(inventoryMetrics.totalStockValue)}
                  </Typography>
                </Card>
              </Box>
            </Box>
          </Box>

          {/* SECTION 2: Sales Chart & Top Customers - Flex Layout */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            mb: 6,
          }}>
            {/* Sales Chart */}
            <Box sx={{ width: { xs: '100%', md: 'calc(60% - 12px)' } }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShowChart sx={{ color: google.blue }} />
                    Sales Overview
                  </Typography>
                  <Button size="small" endIcon={<ArrowForward />} href="/reports/sales">
                    View Details
                  </Button>
                </Box>

                {salesData.length > 0 ? (
                  <Box sx={{ height: 250, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    {salesData.map((item, index) => {
                      const maxRevenue = Math.max(...salesData.map(d => d.revenue))
                      const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
                      
                      return (
                        <Tooltip key={index} title={`${item.date}: ${formatCurrency(item.revenue)} (${item.sales} orders)`}>
                          <Box sx={{ 
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            <Box 
                              sx={{ 
                                width: '100%',
                                height: `${height}%`,
                                minHeight: 4,
                                bgcolor: google.blue,
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 0.3s',
                                '&:hover': { bgcolor: google.blueDark },
                              }} 
                            />
                            <Typography variant="caption" sx={{ transform: 'rotate(-45deg)', mt: 2 }}>
                              {new Date(item.date).getDate()}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )
                    })}
                  </Box>
                ) : (
                  <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      No sales data available for this period
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      Total Orders
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {salesData.reduce((sum, item) => sum + item.sales, 0)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      Total Revenue
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatCurrency(salesData.reduce((sum, item) => sum + item.revenue, 0))}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      Items Sold
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {salesData.reduce((sum, item) => sum + item.totalItems, 0)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>

            {/* Top Customers */}
            <Box sx={{ width: { xs: '100%', md: 'calc(40% - 12px)' } }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ color: google.purple }} />
                    Recent Customers
                  </Typography>
                  <Button size="small" endIcon={<ArrowForward />} href="/customers">
                    View All
                  </Button>
                </Box>

                {customers.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Orders</TableCell>
                          <TableCell align="right">Spent</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {customers.slice(0, 5).map((customer) => (
                          <TableRow key={customer._id} hover sx={{ cursor: 'pointer' }}>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {customer.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                                  {customer.city || 'No city'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={customer.totalOrders}
                                size="small"
                                sx={{ bgcolor: alpha(google.blue, 0.1), color: google.blue }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(customer.totalSpent)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <PeopleIcon sx={{ fontSize: 48, color: darkMode ? '#9aa0a6' : google.grey, mb: 2 }} />
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      No customers yet
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      href="/customers/new"
                      sx={{ mt: 2 }}
                    >
                      Add Customer
                    </Button>
                  </Box>
                )}

                {customerSummary && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${darkMode ? google.greyDark : google.greyBorder}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Active Customers</Typography>
                      <Typography variant="body2" fontWeight={600}>{customerSummary.active}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption">Inter-State</Typography>
                      <Typography variant="body2" fontWeight={600}>{customerSummary.interState}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption">Intra-State</Typography>
                      <Typography variant="body2" fontWeight={600}>{customerSummary.intraState}</Typography>
                    </Box>
                  </Box>
                )}
              </Card>
            </Box>
          </Box>

          {/* SECTION 3: Inventory Status & Low Stock Alerts */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            mb: 6,
          }}>
            {/* Inventory Metrics */}
            <Box sx={{ width: { xs: '100%', md: 'calc(40% - 12px)' } }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon sx={{ color: google.orange }} />
                    Inventory Health
                  </Typography>
                  <Button size="small" endIcon={<ArrowForward />} href="/inventory">
                    Manage
                  </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Stock Status</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {inventoryMetrics.inStock} in stock · {inventoryMetrics.lowStock} low · {inventoryMetrics.outOfStock} out
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, height: 8 }}>
                    <Box sx={{ flex: inventoryMetrics.inStock, bgcolor: google.green, borderRadius: '4px 0 0 4px' }} />
                    <Box sx={{ flex: inventoryMetrics.lowStock, bgcolor: google.yellow }} />
                    <Box sx={{ flex: inventoryMetrics.outOfStock, bgcolor: google.red, borderRadius: '0 4px 4px 0' }} />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      Stock Value
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatCurrency(inventoryMetrics.totalStockValue)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      Selling Value
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatCurrency(inventoryMetrics.totalSellingValue)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Profit Margin</Typography>
                  <Chip 
                    label={`${inventoryMetrics.marginPercentage.toFixed(1)}%`}
                    size="small"
                    sx={{ 
                      bgcolor: inventoryMetrics.marginPercentage > 20 
                        ? alpha(google.green, 0.1) 
                        : alpha(google.yellow, 0.1),
                      color: inventoryMetrics.marginPercentage > 20 ? google.green : google.yellow,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                    {formatCurrency(inventoryMetrics.profitMargin)} profit
                  </Typography>
                </Box>
              </Card>
            </Box>

            {/* Low Stock Products */}
            <Box sx={{ width: { xs: '100%', md: 'calc(60% - 12px)' } }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning sx={{ color: google.yellow }} />
                    Low Stock Alerts
                  </Typography>
                  <Chip 
                    label={`${lowStockCount} products need attention`}
                    size="small"
                    sx={{ bgcolor: alpha(google.yellow, 0.1), color: google.yellow }}
                  />
                </Box>

                {products.filter(p => getStockStatus(p) === 'low_stock' || getStockStatus(p) === 'out_of_stock').length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">Stock</TableCell>
                          <TableCell align="right">Min Level</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products
                          .filter(p => getStockStatus(p) === 'low_stock' || getStockStatus(p) === 'out_of_stock')
                          .slice(0, 5)
                          .map((product) => {
                            const stock = calculateTotalStock(product)
                            const minStock = getMinStockLevel(product)
                            const status = getStockStatus(product)
                            
                            return (
                              <TableRow key={product._id} hover sx={{ cursor: 'pointer' }}>
                                <TableCell>
                                  <Typography variant="body2" fontWeight={500}>
                                    {product.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={product.category}
                                    size="small"
                                    sx={{ bgcolor: alpha(getCategoryColor(product.category, theme), 0.1) }}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <Typography 
                                    variant="body2" 
                                    fontWeight={600}
                                    sx={{ color: status === 'out_of_stock' ? google.red : google.yellow }}
                                  >
                                    {stock}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">{minStock}</TableCell>
                                <TableCell align="center">
                                  <Chip 
                                    label={status === 'out_of_stock' ? 'Out' : 'Low'}
                                    size="small"
                                    sx={{ 
                                      bgcolor: status === 'out_of_stock' 
                                        ? alpha(google.red, 0.1) 
                                        : alpha(google.yellow, 0.1),
                                      color: status === 'out_of_stock' ? google.red : google.yellow,
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 48, color: google.green, mb: 2 }} />
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      All products are well stocked!
                    </Typography>
                  </Box>
                )}

                {lowStockCount > 5 && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button size="small" href="/inventory?filter=lowStock">
                      View all {lowStockCount} low stock items
                    </Button>
                  </Box>
                )}
              </Card>
            </Box>
          </Box>

          {/* SECTION 4: Quick Actions & Usage Summary */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
          }}>
            {/* Quick Actions */}
            <Box sx={{ width: { xs: '100%', md: 'calc(40% - 12px)' } }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RocketLaunch sx={{ color: google.blue }} />
                  Quick Actions
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<PersonAdd />}
                    href="/customers/new"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Add New Customer
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<InventoryIcon2 />}
                    href="/products/new"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Add New Product
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<Receipt />}
                    href="/invoices/new"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Create Invoice
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<Assessment />}
                    href="/reports"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Generate Report
                  </Button>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<Download />}
                    href="/export"
                    sx={{ bgcolor: google.blue, mt: 1 }}
                  >
                    Export All Data
                  </Button>
                </Box>
              </Card>
            </Box>

            {/* Usage Summary & Plan Info */}
            <Box sx={{ width: { xs: '100%', md: 'calc(60% - 12px)' } }}>
              <Card sx={{ p: 3, background: alpha(google.blue, 0.02) }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWallet sx={{ color: google.blue }} />
                    Usage Summary
                  </Typography>
                  <Button size="small" href="/settings/billing" endIcon={<ArrowForward />}>
                    Manage Plan
                  </Button>
                </Box>

                {dashboardStats?.subscription && (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Products</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {totalProducts} / {dashboardStats.subscription.limits?.products || 1000}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(totalProducts / (dashboardStats.subscription.limits?.products || 1000)) * 100} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: alpha(google.blue, 0.1),
                          '& .MuiLinearProgress-bar': { bgcolor: google.blue },
                        }} 
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Customers</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {totalCustomers} / {dashboardStats.subscription.limits?.customers || 500}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(totalCustomers / (dashboardStats.subscription.limits?.customers || 500)) * 100} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: alpha(google.purple, 0.1),
                          '& .MuiLinearProgress-bar': { bgcolor: google.purple },
                        }} 
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Invoices</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {totalSales} / {dashboardStats.subscription.limits?.invoices || 1000}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(totalSales / (dashboardStats.subscription.limits?.invoices || 1000)) * 100} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: alpha(google.green, 0.1),
                          '& .MuiLinearProgress-bar': { bgcolor: google.green },
                        }} 
                      />
                    </Box>
                  </>
                )}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      Current Plan
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {dashboardStats?.subscription?.plan || 'Free'} Plan
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: dashboardStats?.subscription?.isActive ? google.green : google.red 
                      }} />
                      <Typography variant="body2">
                        {dashboardStats?.subscription?.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </Box>
                  <Button 
                    variant="contained" 
                    size="small"
                    sx={{ bgcolor: google.blue }}
                  >
                    Upgrade Plan
                  </Button>
                </Box>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  )
}