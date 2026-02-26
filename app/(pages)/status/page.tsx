// app/status/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  useTheme,
  alpha,
  Button,
  Stack,
  Breadcrumbs,
  IconButton,
  Divider,
  Tooltip,
  Skeleton,
  Snackbar,
} from '@mui/material'
import {
  CheckCircle,
  Error,
  Warning,
  Schedule,
  History,
  Refresh,
  Circle,
  Home as HomeIcon,
  Timeline,
  Speed,
  CloudDone,
  CloudOff,
  Construction,
  NotificationsActive,
  TrendingUp,
} from '@mui/icons-material'
import Link from 'next/link'
import { MainLayout } from '@/components/Layout/MainLayout'
import { CircularProgress } from '@/components/ui/Progress'
import { Card } from '@/components/ui/Card'

interface ServiceStatus {
  id: string
  name: string
  description?: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  uptime: number
  latency: number
  responseTime?: number
  lastCheckTime?: string | null
  group?: string
  lastIncident?: string | null
  totalChecks?: number
  successfulChecks?: number
  failureCount?: number
  lastChecked?: string | null
}

interface Incident {
  id: string
  title: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'critical' | 'high' | 'medium' | 'low'
  services: string[]
  updates: Array<{
    message: string
    timestamp: string
    status: string
  }>
  createdAt: string
  resolvedAt?: string | null
  autoCreated?: boolean
}

interface StatusData {
  overall: {
    status: string
    operationalCount: number
    totalCount: number
    message: string
    uptime: number
    successRate?: number
    totalChecks?: number
    lastUpdated: string
  }
  services: ServiceStatus[]
  incidents: Incident[]
  user?: {
    id: string
    role?: string
    isAdmin: boolean
    notifications: Array<{
      id: string
      incidentId: string
      title: string
      severity: string
      createdAt: string
      read: boolean
    }>
    unreadCount?: number
  } | null
  meta?: {
    period: string
    timestamp: string
    authenticated: boolean
  }
}

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
  grey: '#5f6368',
  greyLight: '#f8f9fa',
  greyBorder: '#dadce0',
  greyDark: '#3c4043',
  white: '#ffffff',
  black: '#202124',
}

export default function StatusPage() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [statusData, setStatusData] = useState<StatusData | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  const fetchStatusData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/system/status')
      const result = await response.json()
      
      if (!response.ok) {
        setError(result.message || 'Failed to fetch status')
        return
      }
      
      setStatusData(result.data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err: any) {
      setError(err?.message || 'Network error occurred')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStatusData()
    // Refresh every 60 seconds
    const interval = setInterval(fetchStatusData, 60000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational': return google.green
      case 'degraded': return google.yellow
      case 'outage': return google.red
      case 'maintenance': return google.blue
      case 'critical': return google.red
      case 'high': return google.yellow
      case 'medium': return google.blue
      case 'low': return google.grey
      default: return google.grey
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational': return <CheckCircle sx={{ color: google.green }} />
      case 'degraded': return <Warning sx={{ color: google.yellow }} />
      case 'outage': return <Error sx={{ color: google.red }} />
      case 'maintenance': return <Construction sx={{ color: google.blue }} />
      default: return <Circle sx={{ color: google.grey }} />
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational': return alpha(google.green, 0.1)
      case 'degraded': return alpha(google.yellow, 0.1)
      case 'outage': return alpha(google.red, 0.1)
      case 'maintenance': return alpha(google.blue, 0.1)
      default: return alpha(google.grey, 0.1)
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/user/notifications/${notificationId}/read`, {
        method: 'POST',
      })
      if (response.ok) {
        fetchStatusData()
        setSnackbar({ open: true, message: 'Notification marked as read' })
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  if (loading) {
    return (
      <MainLayout title="System Status">
        <Box sx={{ 
          backgroundColor: darkMode ? google.black : google.white,
          minHeight: '100vh',
        }}>
          {/* Header Skeleton */}
          <Box sx={{ 
            p: { xs: 1.5, sm: 2, md: 3 },
            borderBottom: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
          }}>
            <Skeleton width={200} height={24} sx={{ mb: 2 }} />
            <Skeleton width={300} height={40} sx={{ mb: 1 }} />
            <Skeleton width={400} height={24} />
          </Box>

          {/* Content Skeletons */}
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 4 }} />
            <Skeleton width={200} height={32} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {[1, 2, 3].map(i => (
                <Box key={i} sx={{ width: { xs: '100%', md: 'calc(33.333% - 8px)' } }}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </MainLayout>
    )
  }

  const overallStatus = statusData?.overall?.status || 'operational'
  const services = statusData?.services || []
  const incidents = statusData?.incidents || []
  const operationalCount = statusData?.overall?.operationalCount || 0
  const averageUptime = statusData?.overall?.uptime || 99.9
  const userNotifications = statusData?.user?.notifications || []
  const isAdmin = statusData?.user?.isAdmin || false

  return (
    <MainLayout title="System Status">
      <Box sx={{ 
        backgroundColor: darkMode ? google.black : google.white,
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1.5, sm: 2, md: 3 },
          borderBottom: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : google.grey, 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : google.black} fontWeight={400}>
              System Status
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant="h4"
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: darkMode ? '#e8eaed' : google.black,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Speed sx={{ color: google.blue, fontSize: { xs: 28, sm: 32, md: 40 } }} />
              System Status
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : google.grey, 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
              }}
            >
              {statusData?.overall?.message || 'Real-time status of all AccuManage services'}
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mt: 3,
              alignItems: 'center',
            }}>
              <Chip
                icon={overallStatus === 'operational' ? <CloudDone /> : <CloudOff />}
                label={`Overall: ${overallStatus === 'operational' ? 'All Systems Operational' : 'Issues Detected'}`}
                sx={{
                  backgroundColor: overallStatus === 'operational' 
                    ? alpha(google.green, 0.1)
                    : alpha(google.red, 0.1),
                  color: overallStatus === 'operational' ? google.green : google.red,
                  fontWeight: 500,
                  '& .MuiChip-icon': { 
                    color: overallStatus === 'operational' ? google.green : google.red 
                  },
                }}
              />
              <Chip
                label={`${operationalCount}/${services.length} Operational`}
                sx={{
                  backgroundColor: alpha(google.blue, 0.1),
                  color: google.blue,
                  fontWeight: 500,
                }}
              />
              <Chip
                icon={<TrendingUp />}
                label={`30-day uptime: ${averageUptime}%`}
                sx={{
                  backgroundColor: alpha(google.green, 0.1),
                  color: google.green,
                  fontWeight: 500,
                }}
              />
            </Box>

            {/* User Notifications */}
            {userNotifications.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: darkMode ? '#e8eaed' : google.black }}>
                  Notifications ({userNotifications.length})
                </Typography>
                <Stack spacing={1}>
                  {userNotifications.map((notification) => (
                    <Paper
                      key={notification.id}
                      sx={{
                        p: 1.5,
                        backgroundColor: alpha(google.blue, 0.05),
                        border: `1px solid ${alpha(google.blue, 0.2)}`,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationsActive sx={{ fontSize: 16, color: google.blue }} />
                        <Typography variant="body2">
                          {notification.title}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => markNotificationAsRead(notification.id)}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Mark Read
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                backgroundColor: darkMode ? alpha(google.red, 0.1) : alpha(google.red, 0.05),
                border: `1px solid ${darkMode ? alpha(google.red, 0.3) : alpha(google.red, 0.2)}`,
                color: darkMode ? '#f28b82' : google.red,
              }}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={fetchStatusData}
                  startIcon={<Refresh />}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Overall Status Card */}
          <Card
            hover
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              backgroundColor: darkMode ? google.greyDark : google.white,
              border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: overallStatus === 'operational'
                    ? alpha(google.green, 0.1)
                    : alpha(google.red, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {overallStatus === 'operational' 
                  ? <CheckCircle sx={{ color: google.green, fontSize: 28 }} />
                  : <Error sx={{ color: google.red, fontSize: 28 }} />
                }
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {overallStatus === 'operational' 
                    ? 'All Systems Operational' 
                    : 'System Issues Detected'}
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                  {operationalCount} out of {services.length} services operational
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
              <Tooltip title="Refresh">
                <IconButton 
                  onClick={fetchStatusData}
                  disabled={refreshing}
                  sx={{
                    color: darkMode ? '#e8eaed' : google.black,
                    '&:hover': {
                      backgroundColor: darkMode ? alpha(google.white, 0.05) : alpha(google.black, 0.05),
                    },
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>

          {/* Services Section */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              sx={{ 
                mb: 2,
                color: darkMode ? '#e8eaed' : google.black,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Timeline sx={{ color: google.blue }} />
              Services
            </Typography>

            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}>
              {services.map((service) => (
                <Box 
                  key={service.id}
                  sx={{ 
                    width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' },
                  }}
                >
                  <Card
                    hover
                    sx={{ 
                      p: 2.5,
                      backgroundColor: darkMode ? google.greyDark : google.white,
                      border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: getStatusColor(service.status),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {service.name}
                        </Typography>
                        {service.description && (
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                            {service.description}
                          </Typography>
                        )}
                      </Box>
                      <Tooltip title={service.status}>
                        <Box sx={{ 
                          p: 0.5, 
                          borderRadius: '50%',
                          bgcolor: getStatusBgColor(service.status),
                          display: 'flex',
                        }}>
                          {getStatusIcon(service.status)}
                        </Box>
                      </Tooltip>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey, display: 'block' }}>
                          Uptime (30d)
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ color: getStatusColor(service.status) }}>
                          {service.uptime}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey, display: 'block' }}>
                          Latency
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {service.latency}ms
                        </Typography>
                      </Box>
                      {service.lastCheckTime && (
                        <Box>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey, display: 'block' }}>
                            Last Check
                          </Typography>
                          <Typography variant="caption" fontWeight={500}>
                            {new Date(service.lastCheckTime).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                          Reliability
                        </Typography>
                        <Typography variant="caption" fontWeight={600} sx={{ color: getStatusColor(service.status) }}>
                          {service.uptime}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={service.uptime} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          backgroundColor: alpha(getStatusColor(service.status), 0.1),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStatusColor(service.status),
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Box>

                    {service.lastIncident && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
                        <History sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : google.grey }} />
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                          Last incident: {new Date(service.lastIncident).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Recent Incidents Section */}
          <Box>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              sx={{ 
                mb: 2,
                color: darkMode ? '#e8eaed' : google.black,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <History sx={{ color: google.yellow }} />
              Recent Incidents
            </Typography>
            
            {incidents.length === 0 ? (
              <Card
                sx={{ 
                  p: { xs: 4, sm: 6 }, 
                  textAlign: 'center',
                  backgroundColor: darkMode ? google.greyDark : google.white,
                  border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: alpha(google.green, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 32, color: google.green }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  No Incidents Reported
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                  All services have been operating normally over the last 30 days.
                </Typography>
              </Card>
            ) : (
              <Stack spacing={2}>
                {incidents.map((incident) => (
                  <Card
                    key={incident.id}
                    hover
                    sx={{ 
                      p: { xs: 2, sm: 3 },
                      backgroundColor: darkMode ? google.greyDark : google.white,
                      border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                      cursor: 'pointer',
                      position: 'relative',
                      ...(incident.autoCreated && {
                        borderLeft: `4px solid ${google.yellow}`,
                      }),
                    }}
                    onClick={() => window.location.href = `/status/incident/${incident.id}`}
                  >
                    {incident.autoCreated && (
                      <Tooltip title="Automatically detected">
                        <Chip
                          label="Auto-detected"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: alpha(google.yellow, 0.1),
                            color: google.yellow,
                            fontSize: '0.65rem',
                            height: 20,
                          }}
                        />
                      </Tooltip>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        label={incident.status}
                        size="small"
                        sx={{
                          backgroundColor: incident.status === 'resolved' 
                            ? alpha(google.green, 0.1) 
                            : alpha(google.yellow, 0.1),
                          color: incident.status === 'resolved' ? google.green : google.yellow,
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}
                      />
                      <Chip 
                        label={incident.severity}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getStatusColor(incident.severity), 0.1),
                          color: getStatusColor(incident.severity),
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}
                      />
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {incident.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey, mb: 2 }}>
                      Affected services: {incident.services.join(', ')}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NotificationsActive sx={{ fontSize: 16, color: google.blue }} />
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                        {incident.updates?.length || 0} update{incident.updates?.length !== 1 ? 's' : ''} · Last update:{' '}
                        {incident.updates?.length > 0 
                          ? new Date(incident.updates[incident.updates.length - 1].timestamp).toLocaleTimeString()
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>

          {/* Uptime SLA Card */}
          <Card
            sx={{ 
              mt: 4,
              p: { xs: 2, sm: 3 },
              backgroundColor: alpha(google.blue, 0.05),
              border: `1px solid ${alpha(google.blue, 0.2)}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: google.blue }}>
              Service Level Agreement
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey, mb: 2 }}>
              We guarantee 99.9% uptime for all paid plans. Current 30-day average: {averageUptime}%
            </Typography>
            <Button
              variant="outlined"
              size="small"
              href="/sla"
              sx={{
                borderColor: google.blue,
                color: google.blue,
                '&:hover': {
                  borderColor: google.blueDark,
                  backgroundColor: alpha(google.blue, 0.04),
                },
              }}
            >
              View SLA Details
            </Button>
          </Card>

          {/* Admin Actions */}
          {isAdmin && (
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<History />}
                href="/admin/status/history"
                sx={{
                  borderColor: darkMode ? google.greyDark : google.greyBorder,
                  color: darkMode ? '#e8eaed' : google.black,
                }}
              >
                View History
              </Button>
              <Button
                variant="contained"
                startIcon={<NotificationsActive />}
                href="/admin/status"
                sx={{
                  bgcolor: google.blue,
                  '&:hover': {
                    bgcolor: google.blueDark,
                  },
                }}
              >
                Manage Status
              </Button>
            </Box>
          )}
        </Container>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          ContentProps={{
            sx: {
              backgroundColor: darkMode ? google.greyDark : google.white,
              color: darkMode ? '#e8eaed' : google.black,
              border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
              borderRadius: 2,
            }
          }}
        />
      </Box>
    </MainLayout>
  )
}