"use client";

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Avatar,
  alpha,
  Skeleton,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material'
import { 
  People as PeopleIcon, 
  CheckCircle,
  Cancel,
  ArrowForward,
  Refresh,
  WorkOff,
  Home,
  TrendingUp
} from '@mui/icons-material'
import Link from 'next/link'

interface EmployeeStatsProps {
  totalEmployees?: number
  presentEmployees?: number
}

const EmployeeStats: React.FC<EmployeeStatsProps> = ({ 
  totalEmployees: propTotalEmployees,
  presentEmployees: propPresentEmployees
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    remote: 0,
    onLeave: 0,
    attendanceRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Direct API call to get today's attendance
  const fetchTodayAttendance = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/attendance/today', {
        credentials: 'include'
      })

      if (response.status === 402) {
        const data = await response.json()
        setError(data.error || 'Subscription required')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch attendance data')
      }

      const data = await response.json()
      console.log('📊 Today\'s attendance data:', data)
      
      // Use the data from API
      setStats({
        total: data.totalEmployees || 0,
        present: data.presentToday || 0,
        absent: (data.totalEmployees || 0) - (data.presentToday || 0),
        remote: data.remoteToday || 0,
        onLeave: data.onLeaveToday || 0,
        attendanceRate: data.attendanceRate || 0
      })
      
    } catch (err: any) {
      console.error('Error fetching today\'s attendance:', err)
      setError(err.message || 'Failed to load attendance data')
      // Fallback to props if API fails
      setStats({
        total: propTotalEmployees || 0,
        present: propPresentEmployees || 0,
        absent: (propTotalEmployees || 0) - (propPresentEmployees || 0),
        remote: 0,
        onLeave: 0,
        attendanceRate: propTotalEmployees ? ((propPresentEmployees || 0) / propTotalEmployees) * 100 : 0
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // If today's endpoint doesn't exist, fallback to full attendance API
  const fetchFromFullAPI = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/attendance', {
        credentials: 'include'
      })

      if (response.status === 402) {
        const data = await response.json()
        setError(data.error || 'Subscription required')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch employees')
      }

      const employees = await response.json()
      console.log('📊 Full employee data:', employees)

      const today = getTodayDate()
      console.log('📅 Today is:', today)

      // Calculate stats from full data
      const activeEmployees = employees.filter((emp: any) => emp.isActive !== false)
      const total = activeEmployees.length
      
      let present = 0
      let remote = 0
      let onLeave = 0

      activeEmployees.forEach((emp: any) => {
        if (emp.days && Array.isArray(emp.days)) {
          const todayAttendance = emp.days.find((day: any) => day.date === today)
          if (todayAttendance) {
            // Check status (handling both 'Present' and 'present')
            const status = todayAttendance.status
            const isPresent = status === 'Present' || status === 'present'
            
            if (isPresent) {
              present++
              // Check if remote
              if (emp.role?.toLowerCase().includes('remote') || 
                  emp.department?.toLowerCase().includes('remote') ||
                  todayAttendance.notes?.toLowerCase().includes('remote')) {
                remote++
              }
            } else if (status === 'Absent' || status === 'absent') {
              // Check if on leave
              if (todayAttendance.notes?.toLowerCase().includes('leave') ||
                  todayAttendance.lateReason?.toLowerCase().includes('leave')) {
                onLeave++
              }
            }
          }
        }
      })

      const attendanceRate = total > 0 ? (present / total) * 100 : 0

      setStats({
        total,
        present,
        absent: total - present,
        remote,
        onLeave,
        attendanceRate
      })

      console.log('✅ Calculated stats:', { total, present, absent: total - present, remote, onLeave, attendanceRate })

    } catch (err: any) {
      console.error('Error fetching employees:', err)
      setError(err.message || 'Failed to load employees')
      // Fallback to props
      setStats({
        total: propTotalEmployees || 0,
        present: propPresentEmployees || 0,
        absent: (propTotalEmployees || 0) - (propPresentEmployees || 0),
        remote: 0,
        onLeave: 0,
        attendanceRate: propTotalEmployees ? ((propPresentEmployees || 0) / propTotalEmployees) * 100 : 0
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchFromFullAPI()
  }

  useEffect(() => {
    // Try today's endpoint first, fallback to full API
    fetchFromFullAPI()
  }, [])

  const getAttendanceStatus = (rate: number) => {
    if (rate >= 90) return { color: 'success', label: 'Excellent' }
    if (rate >= 80) return { color: 'info', label: 'Good' }
    if (rate >= 70) return { color: 'warning', label: 'Average' }
    return { color: 'error', label: 'Poor' }
  }

  const status = getAttendanceStatus(stats.attendanceRate)

  if (loading && !refreshing) {
    return (
      <Card sx={{ 
        width: '100%', 
        height: '100%',
        borderRadius: { xs: 1, sm: 2 },
        boxShadow: theme.shadows[1],
        minHeight: isMobile ? 320 : 400
      }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Skeleton 
              variant="text" 
              width={isMobile ? 120 : 150} 
              height={isMobile ? 24 : 30} 
            />
            <Skeleton 
              variant="circular" 
              width={isMobile ? 32 : 40} 
              height={isMobile ? 32 : 40} 
            />
          </Box>
          <Skeleton 
            variant="rectangular" 
            height={isMobile ? 100 : 120} 
            sx={{ mb: 2, borderRadius: 1 }} 
          />
          <Box 
            display="grid" 
            gridTemplateColumns="repeat(2, 1fr)" 
            gap={1}
          >
            {[1, 2, 3, 4].map((item) => (
              <Skeleton 
                key={item} 
                variant="rectangular" 
                height={isMobile ? 60 : 70} 
                sx={{ borderRadius: 1 }} 
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ 
      width: '100%', 
      height: '100%',
      borderRadius: { xs: 1, sm: 2 },
      boxShadow: theme.shadows[1],
      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
      display: 'flex',
      flexDirection: 'column',
      minHeight: isMobile ? 320 : 400
    }}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 1.5, sm: 2 },
        '&:last-child': { pb: { xs: 1.5, sm: 2 } }
      }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            component="div" 
            fontWeight={600}
            sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
          >
            Employee Attendance
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Avatar sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 }
            }}>
              {refreshing ? (
                <CircularProgress size={isMobile ? 14 : 16} color="inherit" />
              ) : (
                <PeopleIcon fontSize={isMobile ? "small" : "medium"} />
              )}
            </Avatar>
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ 
                minWidth: 'auto', 
                p: 0.5,
                color: theme.palette.text.secondary
              }}
            >
              <Refresh fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Box>
        </Box>
        
        {error ? (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => window.location.href = '/pricing'}
              >
                Upgrade
              </Button>
            }
          >
            {error}
          </Alert>
        ) : (
          <>
            {/* Main Stats */}
            <Box textAlign="center" mb={3}>
              <Typography 
                variant={isMobile ? "h3" : "h2"} 
                fontWeight="bold" 
                color="primary.main"
                sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
              >
                {stats.present}
                <Typography 
                  component="span" 
                  variant={isMobile ? "body1" : "h5"} 
                  color="text.secondary" 
                  sx={{ 
                    ml: 0.5,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  /{stats.total}
                </Typography>
              </Typography>
              <Typography 
                variant={isMobile ? "caption" : "body2"} 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Present Today
              </Typography>
            </Box>

            {/* Attendance Rate */}
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography 
                  variant={isMobile ? "caption" : "body2"} 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Attendance Rate
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography 
                    variant={isMobile ? "caption" : "body2"} 
                    fontWeight="bold" 
                    color={`${status.color}.main`}
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {stats.attendanceRate.toFixed(1)}%
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: `${status.color}.main`,
                      bgcolor: alpha(theme.palette[status.color].main, 0.1),
                      px: 0.5,
                      py: 0.25,
                      borderRadius: 0.5,
                      fontSize: { xs: '0.6rem', sm: '0.7rem' }
                    }}
                  >
                    {status.label}
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.attendanceRate}
                color={status.color as any}
                sx={{ 
                  height: { xs: 6, sm: 8 }, 
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.grey[500], 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4
                  }
                }}
              />
            </Box>

            {/* Stats Grid */}
            <Box 
              display="grid" 
              gridTemplateColumns="repeat(2, 1fr)" 
              gap={1} 
              mb={3}
            >
              <Box 
                sx={{ 
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: 70, sm: 80 }
                }}
              >
                <CheckCircle sx={{ 
                  color: 'success.main', 
                  fontSize: { xs: 20, sm: 24 }, 
                  mb: 0.5 
                }} />
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  fontWeight={700} 
                  color="success.main"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  {stats.present}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  Present
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: 70, sm: 80 }
                }}
              >
                <Cancel sx={{ 
                  color: 'error.main', 
                  fontSize: { xs: 20, sm: 24 }, 
                  mb: 0.5 
                }} />
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  fontWeight={700} 
                  color="error.main"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  {stats.absent}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  Absent
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: 70, sm: 80 }
                }}
              >
                <Home sx={{ 
                  color: 'warning.main', 
                  fontSize: { xs: 20, sm: 24 }, 
                  mb: 0.5 
                }} />
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  fontWeight={700} 
                  color="warning.main"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  {stats.remote}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  Remote
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: 70, sm: 80 }
                }}
              >
                <WorkOff sx={{ 
                  color: 'info.main', 
                  fontSize: { xs: 20, sm: 24 }, 
                  mb: 0.5 
                }} />
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  fontWeight={700} 
                  color="info.main"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  {stats.onLeave}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  On Leave
                </Typography>
              </Box>
            </Box>

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ 
                mt: 1, 
                p: 0.5, 
                bgcolor: alpha(theme.palette.info.main, 0.05),
                borderRadius: 0.5,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                fontSize: '0.6rem',
                color: theme.palette.text.secondary
              }}>
                Debug: {stats.total} total, {stats.present} present ({getTodayDate()})
              </Box>
            )}

            {/* View Details Button */}
            <Button 
              variant="contained" 
              fullWidth 
              component={Link}
              href="/attendance"
              size={isMobile ? "small" : "medium"}
              startIcon={<ArrowForward />}
              sx={{ 
                mt: 'auto',
                py: isMobile ? 0.75 : 1,
                borderRadius: { xs: 1, sm: 2 },
                bgcolor: theme.palette.primary.main,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                '&:hover': {
                  bgcolor: theme.palette.primary.dark
                }
              }}
            >
              View Details
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default EmployeeStats