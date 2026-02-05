// app/(pages)/advance/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  TrendingUp,
  People,
  ShoppingCart,
  Inventory,
  AccessTime,
  EmojiEvents,
  ShowChart,
  BarChart,
  PieChart,
  Refresh,
  Download,
  Settings,
  Notifications,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  CheckCircle,
  Warning,
  Error,
  Info,
  Timeline,
  AccountBalance,
  Analytics,
  Dashboard as DashboardIcon,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import DashboardChart from '@/components/advance/DashboardChart'
import MetricCard from '@/components/advance/MetricCard'
import ActivityFeed from '@/components/advance/ActivityFeed'
import QuickActions from '@/components/advance/QuickActions'
import PerformanceWidget from '@/components/advance/PerformanceWidget'

export default function AdvanceDashboardPage() {
  const { currentScheme } = useAdvanceThemeContext()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [timeRange, setTimeRange] = useState('monthly')

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/advance/dashboard?timeRange=${timeRange}`)
      const data = await response.json()
      if (data.success) {
        setDashboardData(data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!dashboardData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No dashboard data available
        </Typography>
        <Button onClick={fetchDashboardData} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    )
  }

  const {
    businessMetrics,
    engagementMetrics,
    recentActivity,
    monthlyTrends,
    goals,
    insights,
    summary
  } = dashboardData

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
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
              <DashboardIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                🚀 Advance Dashboard
              </Typography>
              <Typography variant="body1" color={currentScheme.colors.text.secondary}>
                Real-time insights & performance analytics
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{
                borderColor: currentScheme.colors.components.border,
                color: currentScheme.colors.text.primary,
              }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{
                borderColor: currentScheme.colors.components.border,
                color: currentScheme.colors.text.primary,
              }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<Settings />}
              sx={{
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              }}
            >
              Settings
            </Button>
          </Box>
        </Box>

        {/* Time Range Selector */}
        <Box sx={{ mt: 3 }}>
          <Tabs 
            value={timeRange} 
            onChange={(_, newValue) => setTimeRange(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: currentScheme.colors.text.secondary,
                minHeight: 36,
              },
              '& .Mui-selected': {
                color: currentScheme.colors.primary,
                fontWeight: 'bold',
              },
            }}
          >
            <Tab label="Today" value="today" />
            <Tab label="Weekly" value="weekly" />
            <Tab label="Monthly" value="monthly" />
            <Tab label="Quarterly" value="quarterly" />
            <Tab label="Yearly" value="yearly" />
          </Tabs>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summary?.quickStats?.map((stat: any, index: number) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={
                index === 0 ? 'primary' :
                index === 1 ? 'secondary' :
                index === 2 ? 'warning' : 'success'
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Charts & Metrics */}
        <Grid item xs={12} lg={8}>
          {/* Revenue & Growth Chart */}
          <Card sx={{ mb: 3, background: currentScheme.colors.components.card }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Performance Overview
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip label="Revenue" size="small" color="primary" />
                  <Chip label="Customers" size="small" color="secondary" />
                  <Chip label="Engagement" size="small" color="warning" />
                </Box>
              </Box>
              
              <Box sx={{ height: 300 }}>
                <DashboardChart data={monthlyTrends} />
              </Box>
            </CardContent>
          </Card>

          {/* Goals & Progress */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', background: currentScheme.colors.components.card }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Daily Goals
                  </Typography>
                  
                  {/* Screen Time Goal */}
                  <Box sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Screen Time</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {goals.currentDailyProgress.toFixed(1)}h / {goals.dailyScreenTimeGoal}h
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(goals.currentDailyProgress / goals.dailyScreenTimeGoal) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(90deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                        },
                      }}
                    />
                  </Box>
                  
                  {/* Revenue Goal */}
                  <Box sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Monthly Revenue</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{goals.revenueGoal.current?.toLocaleString()} / ₹{goals.revenueGoal.target?.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={goals.revenueGoal.progress || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          background: currentScheme.colors.buttons.success,
                        },
                      }}
                    />
                  </Box>
                  
                  {/* Customer Goal */}
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">New Customers</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {goals.customerGoal.current} / {goals.customerGoal.target}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={goals.customerGoal.progress || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          background: currentScheme.colors.buttons.info,
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', background: currentScheme.colors.components.card }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Productivity Metrics
                  </Typography>
                  
                  <PerformanceWidget
                    productivityScore={engagementMetrics.productivityScore}
                    avgSessionLength={engagementMetrics.avgSessionLength}
                    streakDays={engagementMetrics.streakDays}
                    mostUsedFeature={engagementMetrics.mostUsedFeature}
                  />
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                    Time Distribution
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {Object.entries(engagementMetrics.timeDistribution).map(([key, value]: [string, any]) => (
                      <Box key={key} display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption" textTransform="capitalize">
                          {key}
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                          {value.toFixed(1)}h
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Insights & Recommendations */}
          {insights?.length > 0 && (
            <Card sx={{ background: currentScheme.colors.components.card }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Insights & Recommendations
                </Typography>
                
                <Grid container spacing={2}>
                  {insights.map((insight: any, index: number) => (
                    <Grid item xs={12} key={index}>
                      <Alert
                        severity={insight.type}
                        sx={{
                          background: getAlertBackground(insight.type, currentScheme),
                          border: `1px solid ${getAlertBorder(insight.type, currentScheme)}`,
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {insight.title}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {insight.message}
                          </Typography>
                          {insight.suggestion && (
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}>
                              💡 {insight.suggestion}
                            </Typography>
                          )}
                        </Box>
                      </Alert>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Activity & Details */}
        <Grid item xs={12} lg={4}>
          {/* Recent Activity */}
          <Card sx={{ mb: 3, background: currentScheme.colors.components.card }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Activity
                </Typography>
                <Button
                  size="small"
                  sx={{ color: currentScheme.colors.primary }}
                >
                  View All
                </Button>
              </Box>
              
              <ActivityFeed activities={recentActivity} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ mb: 3, background: currentScheme.colors.components.card }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Quick Actions
              </Typography>
              
              <QuickActions />
            </CardContent>
          </Card>

          {/* System Status */}
          <Card sx={{ background: currentScheme.colors.components.card }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                System Status
              </Typography>
              
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="API Server" 
                    secondary="Operational" 
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Database" 
                    secondary="Healthy" 
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Service" 
                    secondary="Degraded" 
                    secondaryTypographyProps={{ color: 'warning.main' }}
                  />
                </ListItem>
                
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Payment Gateway" 
                    secondary="Operational" 
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Last updated
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  Just now
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

// Helper functions
function getAlertBackground(type: string, scheme: any) {
  switch (type) {
    case 'success':
      return `${scheme.colors.buttons.success}15`
    case 'warning':
      return `${scheme.colors.buttons.warning}15`
    case 'error':
      return `${scheme.colors.buttons.error}15`
    default:
      return `${scheme.colors.buttons.info}15`
  }
}

function getAlertBorder(type: string, scheme: any) {
  switch (type) {
    case 'success':
      return `${scheme.colors.buttons.success}30`
    case 'warning':
      return `${scheme.colors.buttons.warning}30`
    case 'error':
      return `${scheme.colors.buttons.error}30`
    default:
      return `${scheme.colors.buttons.info}30`
  }
}