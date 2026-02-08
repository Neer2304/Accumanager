// app/(pages)/advance/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  alpha,
} from '@mui/material'
import {
  TrendingUp,
  People,
  ShoppingCart,
  Inventory,
  AccessTime,
  EmojiEvents,
  Refresh,
  Download,
  Settings,
  ArrowUpward,
  ArrowDownward,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
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

// Google colors
const googleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
  
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    border: '#DADCE0',
    card: '#FFFFFF',
    chipBackground: '#F1F3F4',
    header: '#FFFFFF',
    sidebar: '#FFFFFF',
    hover: '#F8F9FA',
    active: '#E8F0FE',
  },
  
  dark: {
    background: '#202124',
    surface: '#303134',
    textPrimary: '#E8EAED',
    textSecondary: '#9AA0A6',
    border: '#3C4043',
    card: '#303134',
    chipBackground: '#3C4043',
    header: '#303134',
    sidebar: '#202124',
    hover: '#3C4043',
    active: '#5F6368',
  }
}

export default function AdvanceDashboardPage() {
  const { currentScheme, mode } = useAdvanceThemeContext()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [timeRange, setTimeRange] = useState('monthly')

  const currentColors = mode === 'dark' ? googleColors.dark : googleColors.light

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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        backgroundColor: currentColors.background,
        transition: 'background-color 0.3s ease'
      }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!dashboardData) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        backgroundColor: currentColors.background,
        minHeight: '100vh',
        color: currentColors.textPrimary,
        transition: 'background-color 0.3s ease'
      }}>
        <Typography variant="h6" color={currentColors.textSecondary}>
          No dashboard data available
        </Typography>
        <Button 
          onClick={fetchDashboardData} 
          sx={{ 
            mt: 2,
            backgroundColor: googleColors.blue,
            color: 'white',
            '&:hover': {
              backgroundColor: '#3367D6',
            }
          }}
        >
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
    <Box sx={{ 
      p: { xs: 2, md: 3 },
      backgroundColor: currentColors.background,
      minHeight: '100vh',
      color: currentColors.textPrimary,
      transition: 'background-color 0.3s ease'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: 2,
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${googleColors.blue} 0%, ${googleColors.green} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(66,133,244,0.4)',
              }}
            >
              <DashboardIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                🚀 Advance Dashboard
              </Typography>
              <Typography variant="body1" color={currentColors.textSecondary}>
                Real-time insights & performance analytics
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{
                border: `1px solid ${currentColors.border}`,
                color: currentColors.textPrimary,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: googleColors.blue,
                  backgroundColor: alpha(googleColors.blue, 0.04),
                }
              }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{
                border: `1px solid ${currentColors.border}`,
                color: currentColors.textPrimary,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: googleColors.green,
                  backgroundColor: alpha(googleColors.green, 0.04),
                }
              }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<Settings />}
              sx={{
                background: `linear-gradient(135deg, ${googleColors.blue} 0%, ${googleColors.green} 100%)`,
                color: 'white',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: mode === 'dark' 
                  ? '0 2px 4px rgba(0,0,0,0.4)' 
                  : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
                '&:hover': {
                  background: `linear-gradient(135deg, ${googleColors.blue}CC 0%, ${googleColors.green}CC 100%)`,
                  boxShadow: '0 4px 12px rgba(66,133,244,0.3)',
                },
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
              borderBottom: `1px solid ${currentColors.border}`,
              '& .MuiTab-root': {
                color: currentColors.textSecondary,
                minHeight: 36,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              },
              '& .Mui-selected': {
                color: googleColors.blue,
                fontWeight: 600,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: googleColors.blue,
                height: 3,
                borderRadius: '3px 3px 0 0',
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

      {/* Quick Stats - Using Flexbox instead of Grid */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4 
      }}>
        {summary?.quickStats?.map((stat: any, index: number) => (
          <Box
            key={index}
            sx={{
              flex: '1 1 calc(25% - 36px)',
              minWidth: '220px',
            }}
          >
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
          </Box>
        ))}
      </Box>

      {/* Main Content - Using Flexbox */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' }, 
        gap: 3 
      }}>
        {/* Left Column - Charts & Metrics */}
        <Box sx={{ 
          flex: { lg: '2 1 0%' },
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          {/* Performance Overview Chart */}
          <Card
            sx={{
              background: currentColors.card,
              border: `1px solid ${currentColors.border}`,
              borderRadius: '16px',
              transition: 'all 0.3s ease',
              boxShadow: mode === 'dark' 
                ? '0 2px 4px rgba(0,0,0,0.4)' 
                : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            }}
          >
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: 3 
              }}>
                <Typography variant="h6" fontWeight="bold">
                  Performance Overview
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label="Revenue" 
                    size="small" 
                    sx={{
                      backgroundColor: alpha(googleColors.blue, 0.1),
                      color: googleColors.blue,
                      border: `1px solid ${alpha(googleColors.blue, 0.3)}`,
                      fontWeight: 500,
                    }}
                  />
                  <Chip 
                    label="Customers" 
                    size="small"
                    sx={{
                      backgroundColor: alpha(googleColors.green, 0.1),
                      color: googleColors.green,
                      border: `1px solid ${alpha(googleColors.green, 0.3)}`,
                      fontWeight: 500,
                    }}
                  />
                  <Chip 
                    label="Engagement" 
                    size="small"
                    sx={{
                      backgroundColor: alpha(googleColors.yellow, 0.1),
                      color: googleColors.yellow,
                      border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>
              
              <Box sx={{ height: 300 }}>
                <DashboardChart data={monthlyTrends} />
              </Box>
            </CardContent>
          </Card>

          {/* Goals & Progress - Using Flexbox */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3 
          }}>
            {/* Daily Goals Card */}
            <Card
              sx={{
                flex: '1 1 50%',
                background: currentColors.card,
                border: `1px solid ${currentColors.border}`,
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                boxShadow: mode === 'dark' 
                  ? '0 2px 4px rgba(0,0,0,0.4)' 
                  : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Daily Goals
                </Typography>
                
                {/* Screen Time Goal */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 1 
                  }}>
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
                      backgroundColor: currentColors.chipBackground,
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${googleColors.blue} 0%, ${googleColors.green} 100%)`,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
                
                {/* Revenue Goal */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 1 
                  }}>
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
                      backgroundColor: currentColors.chipBackground,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: googleColors.green,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
                
                {/* Customer Goal */}
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 1 
                  }}>
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
                      backgroundColor: currentColors.chipBackground,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: googleColors.blue,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Productivity Metrics Card */}
            <Card
              sx={{
                flex: '1 1 50%',
                background: currentColors.card,
                border: `1px solid ${currentColors.border}`,
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                boxShadow: mode === 'dark' 
                  ? '0 2px 4px rgba(0,0,0,0.4)' 
                  : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
              }}
            >
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
                
                <Divider sx={{ 
                  my: 2, 
                  borderColor: currentColors.border 
                }} />
                
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  Time Distribution
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Object.entries(engagementMetrics.timeDistribution).map(([key, value]: [string, any]) => (
                    <Box key={key} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <Typography variant="caption" textTransform="capitalize" color={currentColors.textSecondary}>
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
          </Box>

          {/* Insights & Recommendations */}
          {insights?.length > 0 && (
            <Card
              sx={{
                background: currentColors.card,
                border: `1px solid ${currentColors.border}`,
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                boxShadow: mode === 'dark' 
                  ? '0 2px 4px rgba(0,0,0,0.4)' 
                  : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Insights & Recommendations
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {insights.map((insight: any, index: number) => (
                    <Box key={index}>
                      <Alert
                        severity={insight.type}
                        sx={{
                          background: getAlertBackground(insight.type, mode),
                          border: `1px solid ${getAlertBorder(insight.type, mode)}`,
                          borderRadius: '12px',
                          alignItems: 'flex-start',
                          '& .MuiAlert-icon': {
                            alignItems: 'center',
                          }
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {insight.title}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5, color: currentColors.textSecondary }}>
                            {insight.message}
                          </Typography>
                          {insight.suggestion && (
                            <Typography variant="caption" sx={{ 
                              mt: 1, 
                              display: 'block', 
                              fontStyle: 'italic',
                              color: currentColors.textSecondary 
                            }}>
                              💡 {insight.suggestion}
                            </Typography>
                          )}
                        </Box>
                      </Alert>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Right Column - Activity & Details */}
        <Box sx={{ 
          flex: { lg: '1 1 0%' },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          minWidth: { lg: '300px' }
        }}>
          {/* Recent Activity */}
          <Card
            sx={{
              background: currentColors.card,
              border: `1px solid ${currentColors.border}`,
              borderRadius: '16px',
              transition: 'all 0.3s ease',
              boxShadow: mode === 'dark' 
                ? '0 2px 4px rgba(0,0,0,0.4)' 
                : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            }}
          >
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: 3 
              }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Activity
                </Typography>
                <Button
                  size="small"
                  sx={{ 
                    color: googleColors.blue,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: alpha(googleColors.blue, 0.04),
                    }
                  }}
                >
                  View All
                </Button>
              </Box>
              
              <ActivityFeed activities={recentActivity} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card
            sx={{
              background: currentColors.card,
              border: `1px solid ${currentColors.border}`,
              borderRadius: '16px',
              transition: 'all 0.3s ease',
              boxShadow: mode === 'dark' 
                ? '0 2px 4px rgba(0,0,0,0.4)' 
                : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Quick Actions
              </Typography>
              
              <QuickActions />
            </CardContent>
          </Card>

          {/* System Status */}
          <Card
            sx={{
              background: currentColors.card,
              border: `1px solid ${currentColors.border}`,
              borderRadius: '16px',
              transition: 'all 0.3s ease',
              boxShadow: mode === 'dark' 
                ? '0 2px 4px rgba(0,0,0,0.4)' 
                : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                System Status
              </Typography>
              
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircle sx={{ color: googleColors.green }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="API Server" 
                    secondary="Operational" 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      color: currentColors.textPrimary
                    }}
                    secondaryTypographyProps={{ 
                      fontSize: '0.8rem',
                      color: googleColors.green,
                      fontWeight: 500
                    }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircle sx={{ color: googleColors.green }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Database" 
                    secondary="Healthy" 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      color: currentColors.textPrimary
                    }}
                    secondaryTypographyProps={{ 
                      fontSize: '0.8rem',
                      color: googleColors.green,
                      fontWeight: 500
                    }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Warning sx={{ color: googleColors.yellow }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Service" 
                    secondary="Degraded" 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      color: currentColors.textPrimary
                    }}
                    secondaryTypographyProps={{ 
                      fontSize: '0.8rem',
                      color: googleColors.yellow,
                      fontWeight: 500
                    }}
                  />
                </ListItem>
                
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircle sx={{ color: googleColors.green }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Payment Gateway" 
                    secondary="Operational" 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      color: currentColors.textPrimary
                    }}
                    secondaryTypographyProps={{ 
                      fontSize: '0.8rem',
                      color: googleColors.green,
                      fontWeight: 500
                    }}
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ 
                my: 2, 
                borderColor: currentColors.border 
              }} />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Last updated
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  Just now
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

// Helper functions for Google-themed alerts
function getAlertBackground(type: string, mode: string) {
  const lightMode = mode === 'light'
  switch (type) {
    case 'success':
      return lightMode ? alpha(googleColors.green, 0.08) : alpha(googleColors.green, 0.15)
    case 'warning':
      return lightMode ? alpha(googleColors.yellow, 0.08) : alpha(googleColors.yellow, 0.15)
    case 'error':
      return lightMode ? alpha(googleColors.red, 0.08) : alpha(googleColors.red, 0.15)
    default:
      return lightMode ? alpha(googleColors.blue, 0.08) : alpha(googleColors.blue, 0.15)
  }
}

function getAlertBorder(type: string, mode: string) {
  const lightMode = mode === 'light'
  switch (type) {
    case 'success':
      return lightMode ? alpha(googleColors.green, 0.2) : alpha(googleColors.green, 0.3)
    case 'warning':
      return lightMode ? alpha(googleColors.yellow, 0.2) : alpha(googleColors.yellow, 0.3)
    case 'error':
      return lightMode ? alpha(googleColors.red, 0.2) : alpha(googleColors.red, 0.3)
    default:
      return lightMode ? alpha(googleColors.blue, 0.2) : alpha(googleColors.blue, 0.3)
  }
}