// components/dashboard/ProjectProgress.tsx - UPDATED
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
  Alert
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
import { useAuth } from '@/hooks/useAuth' // Import auth hook

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
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { user, isLoading: authLoading } = useAuth() // Get auth state

  const fetchProjects = async () => {
    // Don't fetch if auth is still loading
    if (authLoading) {
      console.log('⏳ Auth still loading, waiting...')
      return
    }

    // Don't fetch if no user is logged in
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
      
      // console.log('🔍 Fetching projects for user:', user.id || user._id)
      
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
      
      // Check different possible response structures
      let projectsArray = []
      
      if (Array.isArray(data)) {
        // If response is directly an array
        projectsArray = data
      } else if (data.projects && Array.isArray(data.projects)) {
        // If response has projects property
        projectsArray = data.projects
      } else if (data.data && Array.isArray(data.data)) {
        // If response has data property
        projectsArray = data.data
      } else if (data.success && Array.isArray(data.data)) {
        // If response has success and data
        projectsArray = data.data
      }
      
      console.log('📊 Extracted projects:', projectsArray)
      console.log('🔢 Projects count:', projectsArray.length)
      
      setProjects(projectsArray)
      
    } catch (err: any) {
      console.error('❌ Error fetching projects:', err)
      console.error('❌ Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      })
      
      // Check if it's a network error
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
    // Fetch projects when auth is ready
    if (!authLoading) {
      fetchProjects()
    }
  }, [authLoading, user]) // Add dependencies

  // Rest of your component remains the same...
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'success'
      case 'active': return 'info'
      case 'planning': return 'primary'
      case 'paused': return 'warning'
      case 'delayed': return 'error'
      case 'cancelled': return 'error'
      default: return 'default'
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

  // Calculate actual active projects
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

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch {
      return 'Invalid date'
    }
  }

  // Show loading during auth check
  if (authLoading) {
    return (
      <Card sx={{ width: '100%', height: '100%', borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  // Rest of your component...
  if (loading && !refreshing) {
    return (
      <Card sx={{ width: '100%', height: '100%', borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Skeleton variant="text" width={120} height={30} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
          <Box textAlign="center" mb={2}>
            <Skeleton variant="text" width={60} height={50} sx={{ mx: 'auto' }} />
            <Skeleton variant="text" width={100} height={24} sx={{ mx: 'auto' }} />
          </Box>
          <Skeleton variant="rectangular" height={80} sx={{ mb: 1, borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ 
      width: '100%', 
      height: '100%', 
      borderRadius: 2, 
      boxShadow: 3,
      '&:hover': {
        boxShadow: 6,
        transition: 'box-shadow 0.3s ease-in-out'
      }
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="div" fontWeight={600}>
            Active Projects
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              width: 36,
              height: 36
            }}>
              {refreshing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Dashboard fontSize="small" />
              )}
            </Avatar>
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              size="small"
              sx={{ 
                minWidth: 'auto',
                padding: '4px',
                borderRadius: '50%'
              }}
            >
              <Refresh 
                fontSize="small" 
                sx={{ 
                  fontSize: '18px',
                  color: refreshing ? 'text.disabled' : 'text.secondary'
                }} 
              />
            </Button>
          </Box>
        </Box>
        
        {error ? (
          <Alert 
            severity={error.includes('login') ? 'info' : 'warning'}
            sx={{ 
              mb: 2,
              borderRadius: 1
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
              <Typography variant="h2" fontWeight="bold" color="primary.main">
                {displayActiveProjects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Projects
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({projects.length} total projects)
              </Typography>
            </Box>

            {activeProjectsList.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}
              >
                <ProjectIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                <Typography variant="body2" gutterBottom>
                  {projects.length === 0 ? 'No projects found' : 'No active projects'}
                </Typography>
                <Typography variant="caption">
                  {projects.length === 0 ? 'Create your first project' : 'All projects are completed or paused'}
                </Typography>
              </Box>
            ) : (
              <>
                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Average Progress
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {calculateAverageProgress()}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateAverageProgress()}
                    sx={{ 
                      height: 10,
                      borderRadius: 5,
                      bgcolor: alpha('#2196F3', 0.1)
                    }}
                    color="primary"
                  />
                </Box>

                <Box display="flex" flexDirection="column" gap={2} mb={3}>
                  {activeProjectsList.map((project) => (
                    <Box 
                      key={project._id}
                      sx={{ 
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha('#2196F3', 0.03),
                        border: '1px solid',
                        borderColor: alpha('#2196F3', 0.1),
                        '&:hover': {
                          bgcolor: alpha('#2196F3', 0.05),
                          borderColor: alpha('#2196F3', 0.2),
                        }
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box flex={1} mr={1}>
                          <Typography variant="subtitle2" fontWeight={600} noWrap>
                            {project.name}
                          </Typography>
                          {project.clientName && (
                            <Typography variant="caption" color="text.secondary" noWrap>
                              Client: {project.clientName}
                            </Typography>
                          )}
                        </Box>
                        <Chip 
                          icon={getStatusIcon(project.status)}
                          label={project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          size="small"
                          color={getStatusColor(project.status) as any}
                          sx={{ height: 24, fontSize: '0.7rem' }}
                        />
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" color="text.secondary">
                          {project.progress}% complete
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Due: {formatDate(project.deadline)}
                        </Typography>
                      </Box>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={project.progress}
                        sx={{ 
                          height: 6,
                          borderRadius: 3,
                          mt: 0.5
                        }}
                        color={getStatusColor(project.status) as any}
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
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
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