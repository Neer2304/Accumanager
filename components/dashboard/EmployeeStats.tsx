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
  IconButton,
  Tooltip
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
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
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

  const getTodayDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

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

      const activeEmployees = employees.filter((emp: any) => emp.isActive !== false)
      const total = activeEmployees.length
      
      let present = 0
      let remote = 0
      let onLeave = 0

      activeEmployees.forEach((emp: any) => {
        if (emp.days && Array.isArray(emp.days)) {
          const todayAttendance = emp.days.find((day: any) => day.date === today)
          if (todayAttendance) {
            const status = todayAttendance.status
            const isPresent = status === 'Present' || status === 'present'
            
            if (isPresent) {
              present++
              if (emp.role?.toLowerCase().includes('remote') || 
                  emp.department?.toLowerCase().includes('remote') ||
                  todayAttendance.notes?.toLowerCase().includes('remote')) {
                remote++
              }
            } else if (status === 'Absent' || status === 'absent') {
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
    fetchFromFullAPI()
  }, [])

  const getAttendanceStatus = (rate: number) => {
    if (rate >= 90) return { color: '#34a853', label: 'Excellent' }
    if (rate >= 80) return { color: '#4285f4', label: 'Good' }
    if (rate >= 70) return { color: '#fbbc04', label: 'Average' }
    return { color: '#ea4335', label: 'Poor' }
  }

  const status = getAttendanceStatus(stats.attendanceRate)

  if (loading && !refreshing) {
    return (
      <Card sx={{ 
        width: '100%', 
        height: '100%',
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        minHeight: isMobile ? 320 : 400
      }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Skeleton 
              variant="text" 
              width={isMobile ? 120 : 150} 
              height={isMobile ? 24 : 30} 
              sx={{ bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }}
            />
            <Skeleton 
              variant="circular" 
              width={isMobile ? 32 : 40} 
              height={isMobile ? 32 : 40} 
              sx={{ bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }}
            />
          </Box>
          <Skeleton 
            variant="rectangular" 
            height={isMobile ? 100 : 120} 
            sx={{ mb: 2, borderRadius: 1, bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }} 
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
                sx={{ borderRadius: 1, bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }} 
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
      borderRadius: 3,
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      display: 'flex',
      flexDirection: 'column',
      minHeight: isMobile ? 320 : 400,
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: darkMode ? '#5f6368' : '#bdc1c6',
        boxShadow: darkMode 
          ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px rgba(0, 0, 0, 0.08)'
      }
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
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUp 
              sx={{ 
                fontSize: { xs: 20, sm: 24 },
                color: '#4285f4'
              }}
            />
            <Typography 
              variant="h6" 
              component="div" 
              fontWeight={600}
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                color: darkMode ? '#e8eaed' : '#202124'
              }}
            >
              Employee Attendance
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Avatar sx={{ 
              bgcolor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
              color: '#4285f4',
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 }
            }}>
              {refreshing ? (
                <CircularProgress size={isMobile ? 14 : 16} color="inherit" />
              ) : (
                <PeopleIcon fontSize={isMobile ? "small" : "medium"} />
              )}
            </Avatar>
            <Tooltip title="Refresh">
              <IconButton 
                size="small" 
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{ 
                  minWidth: 'auto', 
                  p: 0.5,
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                <Refresh fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {error ? (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 2,
              borderRadius: 1,
              backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.05),
              border: `1px solid ${darkMode ? alpha('#ea4335', 0.3) : alpha('#ea4335', 0.2)}`,
              color: darkMode ? '#f28b82' : '#ea4335',
            }}
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
                sx={{ 
                  color: '#4285f4',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                {stats.present}
                <Typography 
                  component="span" 
                  variant={isMobile ? "body1" : "h5"} 
                  sx={{ 
                    ml: 0.5,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  /{stats.total}
                </Typography>
              </Typography>
              <Typography 
                variant={isMobile ? "caption" : "body2"} 
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                Present Today
              </Typography>
            </Box>

            {/* Attendance Rate */}
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography 
                  variant={isMobile ? "caption" : "body2"} 
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  Attendance Rate
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography 
                    variant={isMobile ? "caption" : "body2"} 
                    fontWeight="bold" 
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      color: status.color
                    }}
                  >
                    {stats.attendanceRate.toFixed(1)}%
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: status.color,
                      backgroundColor: darkMode ? alpha(status.color, 0.2) : alpha(status.color, 0.1),
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
                sx={{ 
                  height: { xs: 6, sm: 8 }, 
                  borderRadius: 4,
                  bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: status.color
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
                  bgcolor: darkMode ? alpha('#34a853', 0.15) : alpha('#34a853', 0.08),
                  border: `1px solid ${darkMode ? alpha('#34a853', 0.3) : alpha('#34a853', 0.2)}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: 70, sm: 80 }
                }}
              >
                <CheckCircle sx={{ 
                  color: '#34a853', 
                  fontSize: { xs: 20, sm: 24 }, 
                  mb: 0.5 
                }} />
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  fontWeight={700} 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: '#34a853'
                  }}
                >
                  {stats.present}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  Present
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  bgcolor: darkMode ? alpha('#ea4335', 0.15) : alpha('#ea4335', 0.08),
                  border: `1px solid ${darkMode ? alpha('#ea4335', 0.3) : alpha('#ea4335', 0.2)}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: 70, sm: 80 }
                }}
              >
                <Cancel sx={{ 
                  color: '#ea4335', 
                  fontSize: { xs: 20, sm: 24 }, 
                  mb: 0.5 
                }} />
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  fontWeight={700} 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: '#ea4335'
                  }}
                >
                  {stats.absent}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  Absent
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  bgcolor: darkMode ? alpha('#fbbc04', 0.15) : alpha('#fbbc04', 0.08),
                  border: `1px solid ${darkMode ? alpha('#fbbc04', 0.3) : alpha('#fbbc04', 0.2)}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: 70, sm: 80 }
                }}
              >
                <Home sx={{ 
                  color: '#fbbc04', 
                  fontSize: { xs: 20, sm: 24 }, 
                  mb: 0.5 
                }} />
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  fontWeight={700} 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: '#fbbc04'
                  }}
                >
                  {stats.remote}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  Remote
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  bgcolor: darkMode ? alpha('#4285f4', 0.15) : alpha('#4285f4', 0.08),
                  border: `1px solid ${darkMode ? alpha('#4285f4', 0.3) : alpha('#4285f4', 0.2)}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: 70, sm: 80 }
                }}
              >
                <WorkOff sx={{ 
                  color: '#4285f4', 
                  fontSize: { xs: 20, sm: 24 }, 
                  mb: 0.5 
                }} />
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  fontWeight={700} 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: '#4285f4'
                  }}
                >
                  {stats.onLeave}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
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
                bgcolor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
                borderRadius: 0.5,
                border: `1px solid ${darkMode ? alpha('#4285f4', 0.3) : alpha('#4285f4', 0.2)}`,
                fontSize: '0.6rem',
                color: darkMode ? '#9aa0a6' : '#5f6368'
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
                backgroundColor: '#4285f4',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                '&:hover': {
                  backgroundColor: '#3367d6'
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