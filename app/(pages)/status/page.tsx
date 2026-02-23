// app/status/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  useTheme,
  alpha,
  Button,
  Stack,
} from '@mui/material'
import {
  CheckCircle,
  Error,
  Warning,
  Schedule,
  History,
  Refresh,
  Circle,
} from '@mui/icons-material'
import { MainLayout } from '@/components/Layout/MainLayout'
import { CircularProgress } from '@/components/ui/Progress'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  uptime: number
  latency: number
  lastIncident?: string
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
  resolvedAt?: string
}

export default function StatusPage() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])

  const fetchStatusData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/system/status')
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message)
      
      setServices(data.services)
      setIncidents(data.incidents)
      setLastUpdated(new Date())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatusData()
    // Refresh every 60 seconds
    const interval = setInterval(fetchStatusData, 60000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return '#34a853'
      case 'degraded': return '#fbbc04'
      case 'outage': return '#ea4335'
      case 'maintenance': return '#4285f4'
      default: return '#5f6368'
    }
  }

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return <CheckCircle sx={{ color: '#34a853' }} />
      case 'degraded': return <Warning sx={{ color: '#fbbc04' }} />
      case 'outage': return <Error sx={{ color: '#ea4335' }} />
      case 'maintenance': return <Schedule sx={{ color: '#4285f4' }} />
      default: return <Circle sx={{ color: '#5f6368' }} />
    }
  }

  const getOverallStatus = () => {
    if (services.some(s => s.status === 'outage')) return 'outage'
    if (services.some(s => s.status === 'degraded')) return 'degraded'
    if (services.some(s => s.status === 'maintenance')) return 'maintenance'
    return 'operational'
  }

  if (loading && services.length === 0) {
    return (
      <MainLayout title="System Status">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  const overallStatus = getOverallStatus()
  const operationalCount = services.filter(s => s.status === 'operational').length

  return (
    <MainLayout title="System Status">
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        py: 4
      }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              fontWeight={500} 
              gutterBottom
              sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            >
              System Status
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
            >
              Real-time status of all AccuManage services
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={fetchStatusData}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Overall Status Card */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 4,
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getStatusIcon(overallStatus)}
              <Box>
                <Typography variant="h5" fontWeight={500}>
                  All Systems {overallStatus === 'operational' ? 'Operational' : 'Experiencing Issues'}
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  {operationalCount} out of {services.length} services operational
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
              <Button 
                startIcon={<Refresh />}
                onClick={fetchStatusData}
                size="small"
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>
          </Paper>

          {/* Services Grid */}
          <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
            Services
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {service.name}
                    </Typography>
                    {getStatusIcon(service.status)}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Uptime
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {service.uptime}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Latency
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {service.latency}ms
                      </Typography>
                    </Box>
                  </Box>

                  <LinearProgress 
                    variant="determinate" 
                    value={service.uptime} 
                    sx={{ 
                      height: 4, 
                      borderRadius: 2,
                      backgroundColor: alpha(getStatusColor(service.status), 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getStatusColor(service.status),
                      }
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Recent Incidents */}
          <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
            Recent Incidents
          </Typography>
          
          {incidents.length === 0 ? (
            <Paper 
              elevation={0}
              sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: '12px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}
            >
              <CheckCircle sx={{ fontSize: 48, color: '#34a853', mb: 2 }} />
              <Typography variant="h6" fontWeight={500} gutterBottom>
                No Incidents Reported
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                All services have been operating normally over the last 90 days.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {incidents.map((incident) => (
                <Paper 
                  key={incident.id}
                  elevation={0}
                  sx={{ 
                    p: 3,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={incident.status}
                      size="small"
                      sx={{
                        backgroundColor: incident.status === 'resolved' ? alpha('#34a853', 0.1) : alpha('#fbbc04', 0.1),
                        color: incident.status === 'resolved' ? '#34a853' : '#fbbc04',
                      }}
                    />
                    <Chip 
                      label={incident.severity}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getStatusColor(incident.severity as any), 0.1),
                        color: getStatusColor(incident.severity as any),
                      }}
                    />
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    {incident.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }}>
                    Affected services: {incident.services.join(', ')}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <History sx={{ fontSize: 16 }} /> Timeline
                    </Typography>
                    <Stack spacing={1.5}>
                      {incident.updates.map((update, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="caption" sx={{ minWidth: 80, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {new Date(update.timestamp).toLocaleTimeString()}
                          </Typography>
                          <Box>
                            <Chip 
                              label={update.status}
                              size="small"
                              sx={{ 
                                mr: 1,
                                height: 20,
                                fontSize: '0.65rem',
                                backgroundColor: update.status === 'resolved' ? alpha('#34a853', 0.1) : alpha('#fbbc04', 0.1),
                                color: update.status === 'resolved' ? '#34a853' : '#fbbc04',
                              }}
                            />
                            <Typography variant="body2" component="span">
                              {update.message}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </MainLayout>
  )
}