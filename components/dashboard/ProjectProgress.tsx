import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  LinearProgress,
  Chip,
  alpha,
  Skeleton,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material'
import { 
  Assignment as ProjectIcon, 
  ArrowForward,
  Refresh,
  TrendingUp,
  CheckCircle,
  AccessTime,
  Pause,
  Error as ErrorIcon,
  Dashboard
} from '@mui/icons-material'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface Project {
  _id: string
  name: string
  description: string
  startDate: string
  deadline: string
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled' | 'delayed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  category?: string
  clientName?: string
}

interface ProjectProgressProps {
  activeProjects?: number
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({ activeProjects }) => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { user, isLoading: authLoading } = useAuth()

  const fetchProjects = async () => {
    if (authLoading) {
      console.log('⏳ Auth still loading, waiting...')
      return
    }

    if (!user) {
      console.log('👤 No user logged in, skipping project fetch')
      setProjects([])
      setError('Please login to view projects')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/projects', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })

      console.log('📡 Response status:', response.status)
      
      if (response.status === 401) {
        setError('Session expired. Please login again.')
        setProjects([])
        return
      }
      
      if (response.status === 402) {
        const data = await response.json()
        console.log('💰 Subscription required:', data)
        setError(data.error || 'Upgrade your plan to manage projects')
        setProjects([])
        return
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response not OK:', response.status, errorText)
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log('📦 API response data:', data)
      
      let projectsArray = []
      
      if (Array.isArray(data)) {
        projectsArray = data
      } else if (data.projects && Array.isArray(data.projects)) {
        projectsArray = data.projects
      } else if (data.data && Array.isArray(data.data)) {
        projectsArray = data.data
      } else if (data.success && Array.isArray(data.data)) {
        projectsArray = data.data
      }
      
      console.log('📊 Extracted projects:', projectsArray)
      setProjects(projectsArray)
      
    } catch (err: any) {
      console.error('❌ Error fetching projects:', err)
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError('Network error. Please check your connection.')
      } else {
        setError(err.message || 'Failed to load projects')
      }
      
      setProjects([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchProjects()
  }

  useEffect(() => {
    if (!authLoading) {
      fetchProjects()
    }
  }, [authLoading, user])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#34a853'
      case 'active': return '#4285f4'
      case 'planning': return '#fbbc04'
      case 'paused': return '#fbbc04'
      case 'delayed': return '#ea4335'
      case 'cancelled': return '#ea4335'
      default: return darkMode ? '#5f6368' : '#9aa0a6'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle fontSize="small" />
      case 'active': return <TrendingUp fontSize="small" />
      case 'planning': return <AccessTime fontSize="small" />
      case 'paused': return <Pause fontSize="small" />
      case 'delayed': return <ErrorIcon fontSize="small" />
      case 'cancelled': return <ErrorIcon fontSize="small" />
      default: return <AccessTime fontSize="small" />
    }
  }

  const actualActiveProjects = projects.filter(p => 
    p.status === 'active' || p.status === 'planning'
  ).length

  const displayActiveProjects = activeProjects !== undefined ? activeProjects : actualActiveProjects
  const activeProjectsList = projects
    .filter(p => p.status === 'active' || p.status === 'planning')
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 2)

  const calculateAverageProgress = () => {
    if (activeProjectsList.length === 0) return 0
    const total = activeProjectsList.reduce((sum, project) => sum + project.progress, 0)
    return Math.round(total / activeProjectsList.length)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch {
      return 'Invalid date'
    }
  }

  if (authLoading) {
    return (
      <Card sx={{ 
        width: '100%', 
        height: '100%', 
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (loading && !refreshing) {
    return (
      <Card sx={{ 
        width: '100%', 
        height: '100%', 
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Skeleton 
              variant="text" 
              width={120} 
              height={30} 
              sx={{ bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }}
            />
            <Skeleton 
              variant="circular" 
              width={40} 
              height={40} 
              sx={{ bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }}
            />
          </Box>
          <Box textAlign="center" mb={2}>
            <Skeleton 
              variant="text" 
              width={60} 
              height={50} 
              sx={{ mx: 'auto', bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }} 
            />
            <Skeleton 
              variant="text" 
              width={100} 
              height={24} 
              sx={{ mx: 'auto', bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }}
            />
          </Box>
          <Skeleton 
            variant="rectangular" 
            height={80} 
            sx={{ mb: 1, borderRadius: 1, bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }} 
          />
          <Skeleton 
            variant="rectangular" 
            height={32} 
            sx={{ borderRadius: 1, bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }}
          />
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
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: darkMode ? '#5f6368' : '#bdc1c6',
        boxShadow: darkMode 
          ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px rgba(0, 0, 0, 0.08)'
      }
    }}>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
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
              Active Projects
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ 
              bgcolor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
              color: '#4285f4',
              width: 36,
              height: 36
            }}>
              {refreshing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Dashboard fontSize="small" />
              )}
            </Avatar>
            <Tooltip title="Refresh">
              <IconButton 
                onClick={handleRefresh}
                disabled={refreshing}
                size="small"
                sx={{ 
                  minWidth: 'auto',
                  padding: '4px',
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {error ? (
          <Alert 
            severity={error.includes('login') ? 'info' : 'warning'}
            sx={{ 
              mb: 2,
              borderRadius: 1,
              backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.05),
              border: `1px solid ${darkMode ? alpha('#ea4335', 0.3) : alpha('#ea4335', 0.2)}`,
              color: darkMode ? '#f28b82' : '#ea4335',
            }}
            action={
              error.includes('login') ? (
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => window.location.href = '/login'}
                >
                  Login
                </Button>
              ) : error.includes('Upgrade') ? (
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => window.location.href = '/pricing'}
                >
                  Upgrade
                </Button>
              ) : null
            }
          >
            {error}
          </Alert>
        ) : (
          <>
            <Box textAlign="center" mb={3}>
              <Typography 
                variant="h2" 
                fontWeight="bold" 
                sx={{ 
                  color: '#4285f4',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                {displayActiveProjects}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                Active Projects
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  color: darkMode ? '#80868b' : '#9aa0a6'
                }}
              >
                ({projects.length} total projects)
              </Typography>
            </Box>

            {activeProjectsList.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                <ProjectIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                <Typography 
                  variant="body2" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                  }}
                >
                  {projects.length === 0 ? 'No projects found' : 'No active projects'}
                </Typography>
                <Typography 
                  variant="caption"
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  {projects.length === 0 ? 'Create your first project' : 'All projects are completed or paused'}
                </Typography>
              </Box>
            ) : (
              <>
                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        color: darkMode ? '#9aa0a6' : '#5f6368'
                      }}
                    >
                      Average Progress
                    </Typography>
                    <Typography 
                      variant="body2" 
                      fontWeight={600} 
                      sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        color: '#4285f4'
                      }}
                    >
                      {calculateAverageProgress()}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateAverageProgress()}
                    sx={{ 
                      height: 10,
                      borderRadius: 5,
                      bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4285f4'
                      }
                    }}
                  />
                </Box>

                <Box display="flex" flexDirection="column" gap={2} mb={3}>
                  {activeProjectsList.map((project) => (
                    <Box 
                      key={project._id}
                      sx={{ 
                        p: 2,
                        borderRadius: 2,
                        bgcolor: darkMode ? '#3c4043' : '#f8f9fa',
                        border: '1px solid',
                        borderColor: darkMode ? '#5f6368' : '#dadce0',
                        '&:hover': {
                          bgcolor: darkMode ? '#5f6368' : '#e8eaed',
                          borderColor: darkMode ? '#80868b' : '#bdc1c6',
                        }
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box flex={1} mr={1}>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight={600} 
                            noWrap
                            sx={{ 
                              fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              color: darkMode ? '#e8eaed' : '#202124'
                            }}
                          >
                            {project.name}
                          </Typography>
                          {project.clientName && (
                            <Typography 
                              variant="caption" 
                              noWrap
                              sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                color: darkMode ? '#9aa0a6' : '#5f6368'
                              }}
                            >
                              Client: {project.clientName}
                            </Typography>
                          )}
                        </Box>
                        <Chip 
                          icon={getStatusIcon(project.status)}
                          label={project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          size="small"
                          sx={{ 
                            height: 24, 
                            fontSize: '0.7rem',
                            backgroundColor: alpha(getStatusColor(project.status), darkMode ? 0.2 : 0.1),
                            color: getStatusColor(project.status),
                            border: `1px solid ${alpha(getStatusColor(project.status), 0.3)}`
                          }}
                        />
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            color: darkMode ? '#9aa0a6' : '#5f6368'
                          }}
                        >
                          {project.progress}% complete
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            color: darkMode ? '#9aa0a6' : '#5f6368'
                          }}
                        >
                          Due: {formatDate(project.deadline)}
                        </Typography>
                      </Box>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={project.progress}
                        sx={{ 
                          height: 6,
                          borderRadius: 3,
                          mt: 0.5,
                          bgcolor: darkMode ? '#5f6368' : '#f1f3f4',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStatusColor(project.status)
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </>
            )}

            <Button 
              variant="contained" 
              fullWidth 
              component={Link}
              href="/projects"
              size="medium"
              startIcon={<ArrowForward />}
              sx={{ 
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#4285f4',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                '&:hover': {
                  backgroundColor: '#3367d6'
                }
              }}
            >
              Manage All Projects
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ProjectProgress