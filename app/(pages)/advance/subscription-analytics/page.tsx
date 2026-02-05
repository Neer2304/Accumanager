'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Paper,
  Divider,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  TrendingUp,
  People,
  Warning as WarningIcon,
  CheckCircle,
  Refresh,
  Download,
  BarChart,
  Timeline,
  Insights,
  AccessTime,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

// Define TypeScript interfaces for better type safety
interface SubscriptionData {
  currentSubscription: {
    plan: string
    status: string
    currentPeriodEnd: string
    autoRenew: boolean
    features?: string[]
    trialEndsAt?: string
  }
  subscriptionMetrics: {
    mrr: number
    arr: number
    totalPaid: number
    monthlyAmount: number
    daysRemaining: number
    trialDaysRemaining: number
    isTrial: boolean
    totalOrders: number
    lastPaymentDate?: string
  }
  customerMetrics: {
    totalCustomers: number
    activeCustomers: number
    newCustomers: number
    totalOrders: number
    totalSpent: number
    avgCustomerValue: number
    customerSegments: Record<string, number>
  }
  revenueMetrics: {
    totalRevenue: number
    monthlyRevenue: number
    avgOrderValue: number
    revenueGrowth: number
    revenueByMethod: Array<{method: string, amount: number, percentage: number}>
    totalOrders: number
  }
  retentionMetrics: {
    retentionRate: string
    churnRisk: string
    churnProbability: number
    customerLifetime: number
    repeatPurchaseRate: string
    avgDaysBetweenOrders: number
    totalPurchases: number
  }
  healthMetrics: {
    status: string
    score: number
    issues: string[]
    recommendations: string[]
  }
  monthlyTrend: Array<{
    month: string
    revenue: number
    customers: number
    orders: number
    subscriptionActive: boolean
    avgOrderValue: number
  }>
  forecast: Array<{
    month: string
    year: number
    revenue: number
    customers: number
    growth: number
    subscriptionValue: number
  }>
  period: {
    startDate: string
    endDate: string
  }
}

export default function SubscriptionAnalyticsPage() {
  const { currentScheme } = useAdvanceThemeContext()
  const [loading, setLoading] = useState(true)
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [timeRange, setTimeRange] = useState('monthly')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptionData()
    
    // Auto refresh every 5 minutes if enabled
    let intervalId: NodeJS.Timeout
    if (autoRefresh) {
      intervalId = setInterval(fetchSubscriptionData, 5 * 60 * 1000)
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [timeRange, autoRefresh])

  const fetchSubscriptionData = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('🔄 Fetching subscription analytics...')
      
      // Using cookies - no need for Authorization header
      const response = await fetch(`/api/advance/analytics/subscription?timeRange=${timeRange}`, {
        credentials: 'include', // Important: sends cookies
      })

      console.log('📊 Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error Response:', errorText)
        
        if (response.status === 401) {
          throw new Error('Please log in again')
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.')
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
      }

      const data = await response.json()
      console.log('✅ API Response:', data)
      
      if (data.success) {
        setSubscriptionData(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch subscription data')
      }
    } catch (error: any) {
      console.error('❌ Error fetching subscription data:', error)
      setError(error.message || 'Failed to load subscription analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchSubscriptionData()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return currentScheme.colors.buttons.success
      case 'trial':
        return currentScheme.colors.buttons.warning
      case 'expired':
        return currentScheme.colors.buttons.error
      case 'cancelled':
        return currentScheme.colors.text.secondary
      default:
        return currentScheme.colors.buttons.text
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return currentScheme.colors.buttons.error
      case 'medium':
        return currentScheme.colors.buttons.warning
      case 'low':
        return currentScheme.colors.buttons.success
      default:
        return currentScheme.colors.buttons.text
    }
  }

  // Show loading state
  if (loading && !subscriptionData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading subscription analytics...
          </Typography>
        </Box>
      </Box>
    )
  }

  // Show error state
  if (error && !subscriptionData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchSubscriptionData}
          startIcon={<Refresh />}
          sx={{
            background: currentScheme.colors.primary,
            '&:hover': {
              background: currentScheme.colors.primary,
            }
          }}
        >
          Retry
        </Button>
      </Box>
    )
  }

  // Show empty state
  if (!subscriptionData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          No subscription data available. Please check your subscription status.
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchSubscriptionData}
          startIcon={<Refresh />}
          sx={{
            background: currentScheme.colors.primary,
            '&:hover': {
              background: currentScheme.colors.primary,
            }
          }}
        >
          Load Data
        </Button>
      </Box>
    )
  }

  // Destructure with safe defaults
  const {
    currentSubscription = {
      plan: 'trial',
      status: 'trial',
      currentPeriodEnd: new Date().toISOString(),
      autoRenew: false,
      features: []
    },
    subscriptionMetrics = {
      mrr: 0,
      arr: 0,
      totalPaid: 0,
      monthlyAmount: 0,
      daysRemaining: 0,
      trialDaysRemaining: 0,
      isTrial: true,
      totalOrders: 0
    },
    customerMetrics = {
      totalCustomers: 0,
      activeCustomers: 0,
      newCustomers: 0,
      totalOrders: 0,
      totalSpent: 0,
      avgCustomerValue: 0,
      customerSegments: {}
    },
    revenueMetrics = {
      totalRevenue: 0,
      monthlyRevenue: 0,
      avgOrderValue: 0,
      revenueGrowth: 0,
      revenueByMethod: [],
      totalOrders: 0
    },
    retentionMetrics = {
      retentionRate: '0%',
      churnRisk: 'low',
      churnProbability: 0,
      customerLifetime: 0,
      repeatPurchaseRate: '0%',
      avgDaysBetweenOrders: 0,
      totalPurchases: 0
    },
    healthMetrics = {
      status: 'healthy',
      score: 85,
      issues: [],
      recommendations: []
    },
    monthlyTrend = [],
    forecast = [],
    period = {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString()
    }
  } = subscriptionData

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BarChart sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                📊 Subscription Analytics
              </Typography>
              <Typography variant="body1" color={currentScheme.colors.text.secondary}>
                Advanced insights into your subscription performance
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              size="small"
              sx={{
                background: currentScheme.colors.components.input,
                border: `1px solid ${currentScheme.colors.components.border}`,
                borderRadius: 1,
                color: currentScheme.colors.text.primary,
                minWidth: 120,
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                borderColor: currentScheme.colors.components.border,
                color: currentScheme.colors.text.primary,
                '&:hover': {
                  borderColor: currentScheme.colors.primary,
                  backgroundColor: `${currentScheme.colors.primary}10`,
                }
              }}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
              disabled={!subscriptionData}
              sx={{
                borderColor: currentScheme.colors.components.border,
                color: currentScheme.colors.text.primary,
                '&:hover': {
                  borderColor: currentScheme.colors.primary,
                  backgroundColor: `${currentScheme.colors.primary}10`,
                }
              }}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Auto-refresh toggle */}
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                size="small"
                sx={{
                  color: currentScheme.colors.primary,
                  '&.Mui-checked': {
                    color: currentScheme.colors.primary,
                  }
                }}
              />
            }
            label="Auto-refresh every 5 minutes"
            sx={{
              color: currentScheme.colors.text.primary,
            }}
          />
        </Box>
      </Box>

      {/* Current Subscription Status */}
      <Card sx={{ mb: 3, background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color={currentScheme.colors.text.primary}>
              Current Subscription Status
            </Typography>
            <Chip
              label={currentSubscription.status.toUpperCase()}
              sx={{
                background: `${getStatusColor(currentSubscription.status)}20`,
                color: getStatusColor(currentSubscription.status),
                fontWeight: 'bold',
                border: `1px solid ${getStatusColor(currentSubscription.status)}40`,
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <Paper sx={{ p: 2, textAlign: 'center', background: currentScheme.colors.components.input, border: `1px solid ${currentScheme.colors.components.border}` }}>
                <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block">
                  Current Plan
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, color: currentScheme.colors.text.primary }}>
                  {currentSubscription.plan.charAt(0).toUpperCase() + currentSubscription.plan.slice(1)}
                </Typography>
              </Paper>
            </Box>
            
            <Box sx={{ flex: '1 1 200px' }}>
              <Paper sx={{ p: 2, textAlign: 'center', background: currentScheme.colors.components.input, border: `1px solid ${currentScheme.colors.components.border}` }}>
                <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block">
                  Next Billing
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, color: currentScheme.colors.text.primary }}>
                  {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                </Typography>
              </Paper>
            </Box>
            
            <Box sx={{ flex: '1 1 200px' }}>
              <Paper sx={{ p: 2, textAlign: 'center', background: currentScheme.colors.components.input, border: `1px solid ${currentScheme.colors.components.border}` }}>
                <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block">
                  Days Remaining
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, color: currentScheme.colors.text.primary }}>
                  {subscriptionMetrics.daysRemaining}
                </Typography>
              </Paper>
            </Box>
            
            <Box sx={{ flex: '1 1 200px' }}>
              <Paper sx={{ p: 2, textAlign: 'center', background: currentScheme.colors.components.input, border: `1px solid ${currentScheme.colors.components.border}` }}>
                <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block">
                  Auto Renew
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, color: currentScheme.colors.text.primary }}>
                  {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                </Typography>
              </Paper>
            </Box>
          </Box>
          
          {/* Trial Status Warning */}
          {currentSubscription.status === 'trial' && subscriptionMetrics.trialDaysRemaining > 0 && (
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 3, 
                background: `${currentScheme.colors.buttons.warning}15`,
                border: `1px solid ${currentScheme.colors.buttons.warning}30`,
                '& .MuiAlert-icon': {
                  color: currentScheme.colors.buttons.warning,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography fontWeight="bold" color={currentScheme.colors.text.primary}>
                    Trial Period Active
                  </Typography>
                  <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                    {subscriptionMetrics.trialDaysRemaining} days remaining in your trial
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    background: currentScheme.colors.buttons.warning,
                    '&:hover': {
                      background: currentScheme.colors.buttons.warning,
                    }
                  }}
                >
                  Upgrade Now
                </Button>
              </Box>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)} 
        sx={{ 
          mb: 3, 
          borderBottom: `1px solid ${currentScheme.colors.components.border}`,
          '& .MuiTab-root': {
            color: currentScheme.colors.text.secondary,
            '&.Mui-selected': {
              color: currentScheme.colors.primary,
            }
          }
        }}
      >
        <Tab icon={<BarChart />} label="Overview" />
        <Tab icon={<Timeline />} label="Revenue Analytics" />
        <Tab icon={<People />} label="Customer Insights" />
        <Tab icon={<Insights />} label="Advanced Metrics" />
      </Tabs>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Key Metrics */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* Monthly Revenue Card */}
              <Card sx={{ flex: '1 1 250px', background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `${currentScheme.colors.primary}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        border: `1px solid ${currentScheme.colors.primary}40`,
                      }}
                    >
                      💰
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.text.primary}>
                        ₹{subscriptionMetrics.mrr?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                        Monthly Revenue
                      </Typography>
                    </Box>
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: revenueMetrics.revenueGrowth > 0 ? currentScheme.colors.buttons.success : currentScheme.colors.buttons.error,
                      mt: 1,
                      display: 'block'
                    }}
                  >
                    {revenueMetrics.revenueGrowth > 0 ? '+' : ''}{Math.round(revenueMetrics.revenueGrowth)}%
                  </Typography>
                </CardContent>
              </Card>
              
              {/* Active Customers Card */}
              <Card sx={{ flex: '1 1 250px', background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `${currentScheme.colors.secondary}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        border: `1px solid ${currentScheme.colors.secondary}40`,
                      }}
                    >
                      👥
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.text.primary}>
                        {customerMetrics.activeCustomers?.toString() || '0'}
                      </Typography>
                      <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                        Active Customers
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block', color: currentScheme.colors.text.secondary }}>
                    {customerMetrics.newCustomers} new
                  </Typography>
                </CardContent>
              </Card>
              
              {/* Retention Rate Card */}
              <Card sx={{ flex: '1 1 250px', background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `${currentScheme.colors.buttons.success}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        border: `1px solid ${currentScheme.colors.buttons.success}40`,
                      }}
                    >
                      📈
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.text.primary}>
                        {retentionMetrics.retentionRate || '0%'}
                      </Typography>
                      <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                        Retention Rate
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ 
                    mt: 1, 
                    display: 'block',
                    color: getRiskColor(retentionMetrics.churnRisk)
                  }}>
                    {retentionMetrics.churnRisk === 'low' ? 'Low Churn' : 'High Risk'}
                  </Typography>
                </CardContent>
              </Card>
              
              {/* Avg Order Value Card */}
              <Card sx={{ flex: '1 1 250px', background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `${currentScheme.colors.buttons.warning}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        border: `1px solid ${currentScheme.colors.buttons.warning}40`,
                      }}
                    >
                      🛒
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.text.primary}>
                        ₹{revenueMetrics.avgOrderValue?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                        Avg Order Value
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block', color: currentScheme.colors.text.secondary }}>
                    {subscriptionMetrics.totalOrders} orders
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
            {/* Revenue Trend Card */}
            <Card sx={{ flex: 2, background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3} color={currentScheme.colors.text.primary}>
                  Revenue Trend
                </Typography>
                
                {monthlyTrend.length > 0 ? (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <BarChart sx={{ fontSize: 60, color: currentScheme.colors.primary, mb: 2 }} />
                      <Typography variant="body1" color={currentScheme.colors.text.secondary}>
                        Revenue data visualization
                      </Typography>
                      <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                        Total: ₹{revenueMetrics.totalRevenue?.toLocaleString() || '0'}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body1" color={currentScheme.colors.text.secondary}>
                      No revenue data available for the selected period
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Health & Risk Analysis Card */}
            <Card sx={{ flex: 1, background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3} color={currentScheme.colors.text.primary}>
                  Health & Risk Analysis
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color={currentScheme.colors.text.secondary}>Subscription Health</Typography>
                    <Chip 
                      label={healthMetrics.status.toUpperCase()} 
                      size="small"
                      sx={{
                        background: healthMetrics.status === 'healthy' 
                          ? `${currentScheme.colors.buttons.success}20`
                          : healthMetrics.status === 'warning'
                          ? `${currentScheme.colors.buttons.warning}20`
                          : `${currentScheme.colors.buttons.error}20`,
                        color: healthMetrics.status === 'healthy'
                          ? currentScheme.colors.buttons.success
                          : healthMetrics.status === 'warning'
                          ? currentScheme.colors.buttons.warning
                          : currentScheme.colors.buttons.error,
                        border: `1px solid ${healthMetrics.status === 'healthy'
                          ? currentScheme.colors.buttons.success
                          : healthMetrics.status === 'warning'
                          ? currentScheme.colors.buttons.warning
                          : currentScheme.colors.buttons.error}40`,
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={healthMetrics.score}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${currentScheme.colors.components.border}40`,
                      '& .MuiLinearProgress-bar': {
                        background: healthMetrics.score > 70
                          ? currentScheme.colors.buttons.success
                          : healthMetrics.score > 40
                          ? currentScheme.colors.buttons.warning
                          : currentScheme.colors.buttons.error,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" mb={1} color={currentScheme.colors.text.secondary}>Churn Risk</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 20,
                        borderRadius: 10,
                        background: currentScheme.colors.components.border,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${retentionMetrics.churnProbability || 0}%`,
                          background: getRiskColor(retentionMetrics.churnRisk),
                          borderRadius: 10,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold" color={getRiskColor(retentionMetrics.churnRisk)}>
                      {retentionMetrics.churnProbability || 0}%
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2, borderColor: currentScheme.colors.components.border }} />
                
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom color={currentScheme.colors.text.primary}>
                  Quick Insights
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {healthMetrics.issues?.length > 0 ? (
                    healthMetrics.issues.map((issue: string, index: number) => (
                      <Paper key={index} sx={{ 
                        p: 1.5, 
                        background: `${currentScheme.colors.buttons.warning}10`,
                        border: `1px solid ${currentScheme.colors.buttons.warning}20`,
                      }}>
                        <Typography variant="caption" fontWeight="medium" color={currentScheme.colors.text.primary}>
                          {issue}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                      No issues detected
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Revenue Analytics Tab */}
      {activeTab === 1 && (
        <Box>
          <Card sx={{ background: currentScheme.colors.components.card, mb: 3, border: `1px solid ${currentScheme.colors.components.border}` }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3} color={currentScheme.colors.text.primary}>
                Detailed Revenue Analysis
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Paper sx={{ 
                  flex: '1 1 300px', 
                  p: 3, 
                  textAlign: 'center',
                  background: currentScheme.colors.components.input,
                  border: `1px solid ${currentScheme.colors.components.border}`
                }}>
                  <Typography variant="h3" fontWeight="bold" color={currentScheme.colors.primary}>
                    ₹{subscriptionMetrics.arr?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color={currentScheme.colors.text.secondary} sx={{ mt: 1 }}>
                    Annual Recurring Revenue (ARR)
                  </Typography>
                </Paper>
                
                <Paper sx={{ 
                  flex: '1 1 300px', 
                  p: 3, 
                  textAlign: 'center',
                  background: currentScheme.colors.components.input,
                  border: `1px solid ${currentScheme.colors.components.border}`
                }}>
                  <Typography variant="h3" fontWeight="bold" color={currentScheme.colors.secondary}>
                    ₹{subscriptionMetrics.totalPaid?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color={currentScheme.colors.text.secondary} sx={{ mt: 1 }}>
                    Total Revenue Paid
                  </Typography>
                </Paper>
                
                <Paper sx={{ 
                  flex: '1 1 300px', 
                  p: 3, 
                  textAlign: 'center',
                  background: currentScheme.colors.components.input,
                  border: `1px solid ${currentScheme.colors.components.border}`
                }}>
                  <Typography variant="h3" fontWeight="bold" color={currentScheme.colors.buttons.success}>
                    {subscriptionMetrics.monthlyAmount?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color={currentScheme.colors.text.secondary} sx={{ mt: 1 }}>
                    Monthly Subscription Value
                  </Typography>
                </Paper>
              </Box>
              
              {/* Revenue Distribution */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom color={currentScheme.colors.text.primary}>
                  Revenue Distribution
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  <Paper sx={{ 
                    flex: 1, 
                    p: 2,
                    background: currentScheme.colors.components.input,
                    border: `1px solid ${currentScheme.colors.components.border}`
                  }}>
                    <Typography variant="body2" gutterBottom color={currentScheme.colors.text.primary}>
                      Customer Segments
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {Object.entries(customerMetrics.customerSegments || {}).map(([segment, count]: [string, any]) => (
                        <Box key={segment} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" sx={{ textTransform: 'capitalize', color: currentScheme.colors.text.secondary }}>
                            {segment}
                          </Typography>
                          <Typography variant="caption" fontWeight="medium" color={currentScheme.colors.text.primary}>
                            {count} customers
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                  
                  <Paper sx={{ 
                    flex: 1, 
                    p: 2,
                    background: currentScheme.colors.components.input,
                    border: `1px solid ${currentScheme.colors.components.border}`
                  }}>
                    <Typography variant="body2" gutterBottom color={currentScheme.colors.text.primary}>
                      Revenue Growth
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      {revenueMetrics.revenueGrowth > 0 ? (
                        <TrendingUp sx={{ color: currentScheme.colors.buttons.success }} />
                      ) : (
                        <TrendingUp sx={{ color: currentScheme.colors.buttons.error, transform: 'rotate(180deg)' }} />
                      )}
                      <Typography variant="h6" color={revenueMetrics.revenueGrowth > 0 ? currentScheme.colors.buttons.success : currentScheme.colors.buttons.error}>
                        {revenueMetrics.revenueGrowth > 0 ? '+' : ''}{Math.round(revenueMetrics.revenueGrowth)}%
                      </Typography>
                      <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                        vs previous period
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Customer Insights Tab */}
      {activeTab === 2 && (
        <Box>
          <Card sx={{ background: currentScheme.colors.components.card, mb: 3, border: `1px solid ${currentScheme.colors.components.border}` }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3} color={currentScheme.colors.text.primary}>
                Customer Analytics
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                {/* Total Customers Card */}
                <Card sx={{ flex: '1 1 300px', background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: `${currentScheme.colors.primary}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24,
                          border: `1px solid ${currentScheme.colors.primary}40`,
                        }}
                      >
                        👥
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.text.primary}>
                          {customerMetrics.totalCustomers?.toString() || '0'}
                        </Typography>
                        <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                          Total Customers
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: currentScheme.colors.text.secondary }}>
                      {customerMetrics.newCustomers} new this month
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* Avg Customer Value Card */}
                <Card sx={{ flex: '1 1 300px', background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: `${currentScheme.colors.buttons.success}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24,
                          border: `1px solid ${currentScheme.colors.buttons.success}40`,
                        }}
                      >
                        💰
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.text.primary}>
                          ₹{customerMetrics.avgCustomerValue?.toLocaleString() || '0'}
                        </Typography>
                        <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                          Avg Customer Value
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: currentScheme.colors.text.secondary }}>
                      Total spent: ₹{customerMetrics.totalSpent?.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* Repeat Purchase Rate Card */}
                <Card sx={{ flex: '1 1 300px', background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: `${currentScheme.colors.secondary}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24,
                          border: `1px solid ${currentScheme.colors.secondary}40`,
                        }}
                      >
                        🔄
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.text.primary}>
                          {retentionMetrics.repeatPurchaseRate || '0%'}
                        </Typography>
                        <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                          Repeat Purchase Rate
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: currentScheme.colors.text.secondary }}>
                      {retentionMetrics.totalPurchases} total purchases
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              {/* Customer Retention Metrics */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom color={currentScheme.colors.text.primary}>
                  Retention Metrics
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  <Paper sx={{ 
                    flex: 1, 
                    p: 2,
                    background: currentScheme.colors.components.input,
                    border: `1px solid ${currentScheme.colors.components.border}`
                  }}>
                    <Typography variant="body2" gutterBottom color={currentScheme.colors.text.primary}>
                      Customer Lifetime
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime sx={{ color: currentScheme.colors.primary }} />
                      <Typography variant="h5" fontWeight="bold" color={currentScheme.colors.text.primary}>
                        {retentionMetrics.avgDaysBetweenOrders || 0} days
                      </Typography>
                    </Box>
                    <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                      Average days between orders
                    </Typography>
                  </Paper>
                  
                  <Paper sx={{ 
                    flex: 1, 
                    p: 2,
                    background: currentScheme.colors.components.input,
                    border: `1px solid ${currentScheme.colors.components.border}`
                  }}>
                    <Typography variant="body2" gutterBottom color={currentScheme.colors.text.primary}>
                      Churn Analysis
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningIcon sx={{ color: getRiskColor(retentionMetrics.churnRisk) }} />
                      <Typography variant="h5" fontWeight="bold" color={getRiskColor(retentionMetrics.churnRisk)}>
                        {retentionMetrics.churnRisk.charAt(0).toUpperCase() + retentionMetrics.churnRisk.slice(1)} Risk
                      </Typography>
                    </Box>
                    <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                      Based on usage patterns
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Period Information */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
          Data period: {new Date(period?.startDate).toLocaleDateString()} - {new Date(period?.endDate).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  )
}