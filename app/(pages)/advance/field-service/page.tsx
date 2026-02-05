// app/(pages)/advance/field-service/page.tsx
'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Avatar,
  LinearProgress,
  Divider,
  Badge,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  DirectionsCar,
  LocationOn,
  Schedule,
  Assignment,
  GpsFixed,
  Person,
  Map,
  NavigateNext,
  MoreVert,
  Refresh,
  Add,
  FilterList,
  Search,
  Timer,
  Star,
  Build,
  Settings,
  Computer,
  LocalShipping,
  Done,
  DirectionsRun,
  Pending,
  Cancel,
  Error,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format, parseISO } from 'date-fns'
import { useFieldService } from '@/hooks/useFieldService'

export default function FieldServicePage() {
  const { currentScheme } = useAdvanceThemeContext()
  const [viewMode, setViewMode] = useState('map')
  const [success, setSuccess] = useState<string | null>(null)
  const [technicianSelect, setTechnicianSelect] = useState('')
  const [jobSelect, setJobSelect] = useState('')

  const {
    // Data
    fieldVisits,
    filteredVisits,
    technicians,
    analytics,
    todaysVisits,
    upcomingVisits,
    statusCounts,
    stats,
    
    // Filters
    dateFilter,
    setDateFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    employeeFilter,
    setEmployeeFilter,
    searchQuery,
    setSearchQuery,
    
    // Pagination
    pagination,
    setPage,
    setLimit,
    
    // Loading states
    loading,
    refreshing,
    error,
    setError,
    
    // Actions
    refreshData,
    updateVisitStatus,
    dispatchTechnician,
  } = useFieldService({
    initialPage: 1,
    initialLimit: 10,
    autoFetch: true,
  })

  // Safe array access
  const techniciansArray = Array.isArray(technicians) ? technicians : []
  const fieldVisitsArray = Array.isArray(fieldVisits) ? fieldVisits : []
  const filteredVisitsArray = Array.isArray(filteredVisits) ? filteredVisits : []
  const todaysVisitsArray = Array.isArray(todaysVisits) ? todaysVisits : []
  const upcomingVisitsArray = Array.isArray(upcomingVisits) ? upcomingVisits : []

  // Get available technicians for dispatch
  const availableTechnicians = techniciansArray.filter(t => t.status === 'available')
  const dispatchableJobs = filteredVisitsArray.filter(v => v.status === 'pending' || v.status === 'scheduled')

  // Handle dispatch
  const handleDispatch = async () => {
    if (!technicianSelect || !jobSelect) {
      setError('Please select both technician and job')
      return
    }

    try {
      await dispatchTechnician(technicianSelect, jobSelect)
      setSuccess('Technician dispatched successfully')
      setTechnicianSelect('')
      setJobSelect('')
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch technician')
    }
  }

  // Handle status change
  const handleStatusChange = async (visitId: string, newStatus: any) => {
    try {
      await updateVisitStatus(visitId, newStatus)
      setSuccess('Status updated successfully')
    } catch (err: any) {
      setError(err.message || 'Failed to update status')
    }
  }

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return currentScheme.colors.buttons.success
      case 'in-progress':
        return currentScheme.colors.buttons.warning
      case 'scheduled':
        return currentScheme.colors.primary
      case 'pending':
        return currentScheme.colors.text.secondary
      case 'cancelled':
        return currentScheme.colors.buttons.error
      default:
        return currentScheme.colors.text.secondary
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Done fontSize="small" />
      case 'in-progress':
        return <DirectionsRun fontSize="small" />
      case 'scheduled':
        return <Schedule fontSize="small" />
      case 'pending':
        return <Pending fontSize="small" />
      case 'cancelled':
        return <Cancel fontSize="small" />
      default:
        return <Error fontSize="small" />
    }
  }

  // Get priority chip color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return currentScheme.colors.buttons.error
      case 'medium':
        return currentScheme.colors.buttons.warning
      case 'low':
        return currentScheme.colors.buttons.success
      default:
        return currentScheme.colors.text.secondary
    }
  }

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'installation':
        return <Build fontSize="small" />
      case 'repair':
        return <Settings fontSize="small" />
      case 'maintenance':
        return <Computer fontSize="small" />
      case 'delivery':
        return <LocalShipping fontSize="small" />
      default:
        return <Assignment fontSize="small" />
    }
  }

  // Stats cards data
  const statsCards = [
    { 
      label: 'Active Technicians', 
      value: stats.activeTechnicians.toString(), 
      icon: <Person />, 
      status: `${availableTechnicians.length} available`,
      color: currentScheme.colors.primary
    },
    { 
      label: 'Jobs Today', 
      value: stats.todaysJobs.toString(), 
      icon: <Assignment />, 
      status: `${statusCounts.completed || 0} completed`,
      color: currentScheme.colors.secondary
    },
    { 
      label: 'Avg Response Time', 
      value: stats.avgResponseTime, 
      icon: <Timer />, 
      status: `${stats.completionRate.toFixed(1)}% completion rate`,
      color: currentScheme.colors.buttons.warning
    },
    { 
      label: 'Customer Rating', 
      value: `${stats.customerRating.toFixed(1)}/5`, 
      icon: <Star />, 
      status: stats.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : 'No revenue',
      color: currentScheme.colors.buttons.success
    },
  ]

  if (loading && !refreshing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: currentScheme.colors.primary }} />
      </Box>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
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
                <DirectionsCar sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  🚗 Field Service
                </Typography>
                <Typography variant="body1" color={currentScheme.colors.text.secondary}>
                  Technician dispatch, GPS tracking & job management
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refreshData}
                disabled={refreshing}
                sx={{
                  borderColor: currentScheme.colors.components.border,
                  color: currentScheme.colors.text.primary,
                }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                }}
                onClick={() => window.location.href = '/advance/field-service/new'}
              >
                New Job
              </Button>
            </Box>
          </Box>

          {/* Stats using flexbox */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            {statsCards.map((stat, index) => (
              <Box key={index} sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}>
                <Card
                  sx={{
                    background: currentScheme.colors.components.card,
                    border: `1px solid ${currentScheme.colors.components.border}`,
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                          {stat.label}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: `${stat.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: stat.color, mt: 1, display: 'block' }}>
                      {stat.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Controls */}
        <Card sx={{ mb: 3, background: currentScheme.colors.components.card }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                <Select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  size="small"
                  sx={{
                    background: currentScheme.colors.components.input,
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                    minWidth: 120,
                  }}
                >
                  <MenuItem value="map">Map View</MenuItem>
                  <MenuItem value="list">List View</MenuItem>
                  <MenuItem value="schedule">Schedule View</MenuItem>
                </Select>
                
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  sx={{
                    background: currentScheme.colors.components.input,
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                    minWidth: 120,
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
                
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  size="small"
                  sx={{
                    background: currentScheme.colors.components.input,
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                    minWidth: 120,
                  }}
                >
                  <MenuItem value="all">All Priority</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
                
                <DatePicker
                  label="Select Date"
                  value={dateFilter}
                  onChange={setDateFilter}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        background: currentScheme.colors.components.input,
                        '& .MuiOutlinedInput-root': {
                          color: currentScheme.colors.text.primary,
                          '& fieldset': {
                            borderColor: currentScheme.colors.components.border,
                          },
                        },
                        minWidth: 150,
                      }
                    }
                  }}
                />
                
                <TextField
                  size="small"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    background: currentScheme.colors.components.input,
                    '& .MuiOutlinedInput-root': {
                      color: currentScheme.colors.text.primary,
                      '& fieldset': {
                        borderColor: currentScheme.colors.components.border,
                      },
                    },
                    minWidth: 150,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <Box display="flex" gap={1} sx={{ mt: { xs: 2, md: 0 } }}>
                <Button
                  variant="outlined"
                  startIcon={<Map />}
                  sx={{
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                  }}
                >
                  Live Map
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  sx={{
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                  }}
                >
                  Filters
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content using flexbox */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Left Column - Technicians */}
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Card
              sx={{
                background: currentScheme.colors.components.card,
                border: `1px solid ${currentScheme.colors.components.border}`,
                mb: 3,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Active Technicians
                  </Typography>
                  <Chip
                    label="Live Tracking"
                    size="small"
                    icon={<GpsFixed />}
                    sx={{
                      background: `${currentScheme.colors.primary}20`,
                      color: currentScheme.colors.primary,
                    }}
                  />
                </Box>

                {/* Technicians List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {techniciansArray.length > 0 ? (
                    techniciansArray.map((tech) => (
                      <Paper
                        key={tech._id}
                        sx={{
                          p: 2,
                          background: currentScheme.colors.background,
                          border: `1px solid ${currentScheme.colors.components.border}`,
                          borderRadius: 2,
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={2}>
                            <Badge
                              color={
                                tech.status === 'available' ? 'success' :
                                tech.status === 'busy' ? 'warning' :
                                tech.status === 'on-break' ? 'secondary' : 'error'
                              }
                              variant="dot"
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            >
                              <Avatar sx={{ bgcolor: currentScheme.colors.primary }}>
                                {tech.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                              </Avatar>
                            </Badge>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {tech.name || 'Unknown Technician'}
                              </Typography>
                              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                                {tech.specialization?.slice(0, 2).join(', ') || tech.department || 'General'}
                              </Typography>
                            </Box>
                          </Box>

                          <Box display="flex" alignItems="center" gap={2}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight="bold">
                                {tech.totalJobsCompleted || 0}
                              </Typography>
                              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                                Jobs
                              </Typography>
                            </Box>
                            
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight="bold">
                                {tech.rating?.toFixed(1) || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                                Rating
                              </Typography>
                            </Box>
                            
                            <IconButton size="small">
                              <MoreVert />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        {/* Status Bar */}
                        <Box sx={{ mt: 2 }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                              Status
                            </Typography>
                            <Chip
                              label={tech.status}
                              size="small"
                              sx={{
                                background: tech.status === 'available'
                                  ? `${currentScheme.colors.buttons.success}20`
                                  : tech.status === 'busy'
                                  ? `${currentScheme.colors.buttons.warning}20`
                                  : tech.status === 'on-break'
                                  ? `${currentScheme.colors.text.secondary}20`
                                  : `${currentScheme.colors.buttons.error}20`,
                                color: tech.status === 'available'
                                  ? currentScheme.colors.buttons.success
                                  : tech.status === 'busy'
                                  ? currentScheme.colors.buttons.warning
                                  : tech.status === 'on-break'
                                  ? currentScheme.colors.text.secondary
                                  : currentScheme.colors.buttons.error,
                              }}
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={
                              tech.status === 'available' ? 100 :
                              tech.status === 'busy' ? 60 :
                              tech.status === 'on-break' ? 30 : 0
                            }
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              background: currentScheme.colors.components.border,
                              '& .MuiLinearProgress-bar': {
                                background: tech.status === 'available'
                                  ? currentScheme.colors.buttons.success
                                  : tech.status === 'busy'
                                  ? currentScheme.colors.buttons.warning
                                  : tech.status === 'on-break'
                                  ? currentScheme.colors.text.secondary
                                  : currentScheme.colors.buttons.error,
                              },
                            }}
                          />
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <Typography color={currentScheme.colors.text.secondary} textAlign="center" py={4}>
                      No technicians available
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Middle Column - Job Queue */}
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Card
              sx={{
                background: currentScheme.colors.components.card,
                border: `1px solid ${currentScheme.colors.components.border}`,
                mb: 3,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Job Queue
                  </Typography>
                  <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                    {filteredVisitsArray.length} jobs filtered
                  </Typography>
                </Box>

                {/* Jobs List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredVisitsArray.length > 0 ? (
                    filteredVisitsArray.slice(0, 5).map((job) => (
                      <Paper
                        key={job._id}
                        sx={{
                          p: 2,
                          background: currentScheme.colors.background,
                          border: `1px solid ${currentScheme.colors.components.border}`,
                          borderRadius: 2,
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: currentScheme.colors.primary,
                          },
                        }}
                        onClick={() => window.location.href = `/advance/field-service/${job._id}`}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {job.title}
                            </Typography>
                            <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                              {job.customerName}
                            </Typography>
                          </Box>
                          
                          <Chip
                            label={job.priority}
                            size="small"
                            sx={{
                              background: `${getPriorityColor(job.priority)}20`,
                              color: getPriorityColor(job.priority),
                            }}
                          />
                        </Box>
                        
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              icon={getStatusIcon(job.status)}
                              label={job.status.replace('-', ' ')}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: getStatusColor(job.status),
                                color: getStatusColor(job.status),
                              }}
                            />
                            <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                              {format(parseISO(job.scheduledDate), 'MMM d, h:mm a')}
                            </Typography>
                          </Box>
                          
                          <IconButton size="small">
                            <NavigateNext />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <Typography color={currentScheme.colors.text.secondary} textAlign="center" py={4}>
                      No jobs found
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Quick Dispatch */}
            <Card sx={{ background: currentScheme.colors.components.card }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Quick Dispatch
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Select Technician</InputLabel>
                    <Select
                      label="Select Technician"
                      value={technicianSelect}
                      onChange={(e) => setTechnicianSelect(e.target.value)}
                      sx={{
                        background: currentScheme.colors.components.input,
                        color: currentScheme.colors.text.primary,
                      }}
                    >
                      <MenuItem value="" disabled>Select Technician</MenuItem>
                      {availableTechnicians.map(tech => (
                        <MenuItem key={tech._id} value={tech._id}>
                          {tech.name} (Available)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth size="small">
                    <InputLabel>Select Job</InputLabel>
                    <Select
                      label="Select Job"
                      value={jobSelect}
                      onChange={(e) => setJobSelect(e.target.value)}
                      sx={{
                        background: currentScheme.colors.components.input,
                        color: currentScheme.colors.text.primary,
                      }}
                    >
                      <MenuItem value="" disabled>Select Job</MenuItem>
                      {dispatchableJobs.map(job => (
                        <MenuItem key={job._id} value={job._id}>
                          {job.title} ({job.priority})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Assignment />}
                    sx={{
                      background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                    }}
                    onClick={handleDispatch}
                    disabled={!technicianSelect || !jobSelect}
                  >
                    Dispatch Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Analytics & Details */}
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Card
              sx={{
                background: currentScheme.colors.components.card,
                border: `1px solid ${currentScheme.colors.components.border}`,
                mb: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Performance Analytics
                </Typography>
                
                {analytics ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: `${currentScheme.colors.primary}10`,
                          border: `1px solid ${currentScheme.colors.primary}30`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.primary}>
                          {analytics.summary.completionRate}%
                        </Typography>
                        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                          Completion Rate
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: `${currentScheme.colors.secondary}10`,
                          border: `1px solid ${currentScheme.colors.secondary}30`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.secondary}>
                          {analytics.summary.averageDuration.toFixed(1)}h
                        </Typography>
                        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                          Avg Duration
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: `${currentScheme.colors.buttons.success}10`,
                          border: `1px solid ${currentScheme.colors.buttons.success}30`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.buttons.success}>
                          {analytics.summary.revenue ? `₹${analytics.summary.revenue.toLocaleString()}` : '₹0'}
                        </Typography>
                        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                          Revenue
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: `${currentScheme.colors.buttons.warning}10`,
                          border: `1px solid ${currentScheme.colors.buttons.warning}30`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.buttons.warning}>
                          {analytics.summary.averageRating.toFixed(1)}
                        </Typography>
                        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                          Avg Rating
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                ) : (
                  <Typography color={currentScheme.colors.text.secondary} textAlign="center" py={4}>
                    Loading analytics...
                  </Typography>
                )}
                
                {/* Active Job Details */}
                {todaysVisitsArray.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Active Job Details
                    </Typography>
                    
                    {todaysVisitsArray
                      .filter(v => v.status === 'in-progress')
                      .slice(0, 1)
                      .map((job) => (
                      <Paper
                        key={job._id}
                        sx={{
                          p: 2,
                          background: currentScheme.colors.background,
                          border: `1px solid ${currentScheme.colors.components.border}`,
                          borderRadius: 2,
                          mb: 3,
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {job.title}
                            </Typography>
                            <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                              {job.customerName}
                            </Typography>
                          </Box>
                          <Chip
                            label="In Progress"
                            size="small"
                            sx={{
                              background: `${currentScheme.colors.buttons.warning}20`,
                              color: currentScheme.colors.buttons.warning,
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block">
                            Technician
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                              {job.employeeName?.split(' ').map(n => n[0]).join('') || 'NA'}
                            </Avatar>
                            <Typography variant="body2">{job.employeeName || 'Not assigned'}</Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block">
                            Location
                          </Typography>
                          <Typography variant="body2">
                            {job.location?.address || job.customerAddress || 'No address'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block">
                            Type
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getTypeIcon(job.type)}
                            <Typography variant="body2" textTransform="capitalize">
                              {job.type}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <LinearProgress
                          variant="determinate"
                          value={job.actualDuration && job.estimatedDuration 
                            ? (job.actualDuration / job.estimatedDuration) * 100 
                            : 50}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            background: currentScheme.colors.components.border,
                            '& .MuiLinearProgress-bar': {
                              background: currentScheme.colors.primary,
                            },
                          }}
                        />
                      </Paper>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        <Snackbar
          open={!!success}
          autoHideDuration={3000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  )
}