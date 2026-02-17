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
  alpha,
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
  Construction,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format, parseISO } from 'date-fns'
import { useFieldService } from '@/hooks/useFieldService'

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
};

export default function FieldServicePage() {
  const { currentScheme } = useAdvanceThemeContext()
  const { mode } = useAdvanceThemeContext()
  const [viewMode, setViewMode] = useState('map')
  const [success, setSuccess] = useState<string | null>(null)
  const [technicianSelect, setTechnicianSelect] = useState('')
  const [jobSelect, setJobSelect] = useState('')

  const currentColors = mode === 'dark' ? googleColors.dark : googleColors.light;
  const primaryColor = googleColors.blue;
  const buttonColor = mode === 'dark' ? googleColors.red : googleColors.blue;

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
        return googleColors.green
      case 'in-progress':
        return googleColors.yellow
      case 'scheduled':
        return googleColors.blue
      case 'pending':
        return currentColors.textSecondary
      case 'cancelled':
        return googleColors.red
      default:
        return currentColors.textSecondary
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
        return googleColors.red
      case 'medium':
        return googleColors.yellow
      case 'low':
        return googleColors.green
      default:
        return currentColors.textSecondary
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
      value: stats?.activeTechnicians?.toString() || '0', 
      icon: <Person />, 
      status: `${availableTechnicians.length} available`,
      color: googleColors.blue
    },
    { 
      label: 'Jobs Today', 
      value: stats?.todaysJobs?.toString() || '0', 
      icon: <Assignment />, 
      status: `${statusCounts?.completed || 0} completed`,
      color: googleColors.green
    },
    { 
      label: 'Avg Response Time', 
      value: stats?.avgResponseTime || '0m', 
      icon: <Timer />, 
      status: `${stats?.completionRate?.toFixed(1) || 0}% completion rate`,
      color: googleColors.yellow
    },
    { 
      label: 'Customer Rating', 
      value: `${stats?.customerRating?.toFixed(1) || 0}/5`, 
      icon: <Star />, 
      status: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : 'No revenue',
      color: googleColors.red
    },
  ]

  if (loading && !refreshing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: primaryColor }} />
      </Box>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Under Development Banner */}
        <Card
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, ${alpha(googleColors.yellow, 0.15)} 0%, ${alpha(googleColors.yellow, 0.05)} 100%)`,
            border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
            borderRadius: '16px',
            backgroundColor: currentColors.card,
            transition: 'all 0.3s ease',
            boxShadow: mode === 'dark' 
              ? '0 2px 4px rgba(0,0,0,0.4)' 
              : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${alpha(googleColors.yellow, 0.2)} 0%, ${alpha(googleColors.yellow, 0.1)} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
                }}
              >
                <Construction sx={{ fontSize: 28, color: googleColors.yellow }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={600} color={googleColors.yellow} gutterBottom>
                  🚧 Under Development
                </Typography>
                <Typography variant="body1" color={currentColors.textSecondary}>
                  This page and all its features are currently under development. 
                  Some features may not be available yet. We're working hard to bring you an amazing experience!
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${googleColors.blue} 0%, ${googleColors.green} 100%)`,
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
                <Typography variant="body1" color={currentColors.textSecondary}>
                  Technician dispatch, GPS tracking & job management
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refreshData}
                disabled={true}
                sx={{
                  border: `1px solid ${currentColors.border}`,
                  color: buttonColor,
                  '&:hover': {
                    borderColor: buttonColor,
                    backgroundColor: alpha(buttonColor, 0.04),
                  }
                }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                disabled={true}
                sx={{
                  background: buttonColor,
                  color: 'white',
                  '&:hover': {
                    background: buttonColor,
                    opacity: 0.8,
                  },
                  '&.Mui-disabled': {
                    background: buttonColor,
                    color: 'white',
                    opacity: 0.5,
                  }
                }}
                onClick={() => {}}
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
                    background: currentColors.card,
                    border: `1px solid ${currentColors.border}`,
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color={currentColors.textSecondary}>
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
        <Card sx={{ mb: 3, background: currentColors.card }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                <Select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  size="small"
                  disabled
                  sx={{
                    background: currentColors.chipBackground,
                    borderColor: currentColors.border,
                    color: currentColors.textPrimary,
                    minWidth: 120,
                    opacity: 0.7,
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
                  disabled
                  sx={{
                    background: currentColors.chipBackground,
                    borderColor: currentColors.border,
                    color: currentColors.textPrimary,
                    minWidth: 120,
                    opacity: 0.7,
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
                  disabled
                  sx={{
                    background: currentColors.chipBackground,
                    borderColor: currentColors.border,
                    color: currentColors.textPrimary,
                    minWidth: 120,
                    opacity: 0.7,
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
                  disabled
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        background: currentColors.chipBackground,
                        '& .MuiOutlinedInput-root': {
                          color: currentColors.textPrimary,
                          '& fieldset': {
                            borderColor: currentColors.border,
                          },
                        },
                        minWidth: 150,
                        opacity: 0.7,
                      }
                    }
                  }}
                />
                
                <TextField
                  size="small"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled
                  sx={{
                    background: currentColors.chipBackground,
                    '& .MuiOutlinedInput-root': {
                      color: currentColors.textPrimary,
                      '& fieldset': {
                        borderColor: currentColors.border,
                      },
                    },
                    minWidth: 150,
                    opacity: 0.7,
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
                  disabled
                  sx={{
                    borderColor: currentColors.border,
                    color: buttonColor,
                    '&:hover': {
                      borderColor: buttonColor,
                      backgroundColor: alpha(buttonColor, 0.04),
                    }
                  }}
                >
                  Live Map
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  disabled
                  sx={{
                    borderColor: currentColors.border,
                    color: buttonColor,
                    '&:hover': {
                      borderColor: buttonColor,
                      backgroundColor: alpha(buttonColor, 0.04),
                    }
                  }}
                >
                  Filters
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content using flexbox */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', opacity: 0.8 }}>
          {/* Left Column - Technicians */}
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Card
              sx={{
                background: currentColors.card,
                border: `1px solid ${currentColors.border}`,
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
                      background: `${googleColors.blue}20`,
                      color: googleColors.blue,
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
                          background: currentColors.background,
                          border: `1px solid ${currentColors.border}`,
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
                              <Avatar sx={{ bgcolor: googleColors.blue }}>
                                {tech.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                              </Avatar>
                            </Badge>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {tech.name || 'Unknown Technician'}
                              </Typography>
                              <Typography variant="caption" color={currentColors.textSecondary}>
                                {tech.specialization?.slice(0, 2).join(', ') || tech.department || 'General'}
                              </Typography>
                            </Box>
                          </Box>

                          <Box display="flex" alignItems="center" gap={2}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight="bold">
                                {tech.totalJobsCompleted || 0}
                              </Typography>
                              <Typography variant="caption" color={currentColors.textSecondary}>
                                Jobs
                              </Typography>
                            </Box>
                            
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight="bold">
                                {tech.rating?.toFixed(1) || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color={currentColors.textSecondary}>
                                Rating
                              </Typography>
                            </Box>
                            
                            <IconButton size="small" disabled>
                              <MoreVert />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        {/* Status Bar */}
                        <Box sx={{ mt: 2 }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" color={currentColors.textSecondary}>
                              Status
                            </Typography>
                            <Chip
                              label={tech.status}
                              size="small"
                              sx={{
                                background: tech.status === 'available'
                                  ? `${googleColors.green}20`
                                  : tech.status === 'busy'
                                  ? `${googleColors.yellow}20`
                                  : tech.status === 'on-break'
                                  ? `${currentColors.textSecondary}20`
                                  : `${googleColors.red}20`,
                                color: tech.status === 'available'
                                  ? googleColors.green
                                  : tech.status === 'busy'
                                  ? googleColors.yellow
                                  : tech.status === 'on-break'
                                  ? currentColors.textSecondary
                                  : googleColors.red,
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
                              background: currentColors.border,
                              '& .MuiLinearProgress-bar': {
                                background: tech.status === 'available'
                                  ? googleColors.green
                                  : tech.status === 'busy'
                                  ? googleColors.yellow
                                  : tech.status === 'on-break'
                                  ? currentColors.textSecondary
                                  : googleColors.red,
                              },
                            }}
                          />
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <Typography color={currentColors.textSecondary} textAlign="center" py={4}>
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
                background: currentColors.card,
                border: `1px solid ${currentColors.border}`,
                mb: 3,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Job Queue
                  </Typography>
                  <Typography variant="body2" color={currentColors.textSecondary}>
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
                          background: currentColors.background,
                          border: `1px solid ${currentColors.border}`,
                          borderRadius: 2,
                          cursor: 'default',
                          '&:hover': {
                            borderColor: googleColors.blue,
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {job.title}
                            </Typography>
                            <Typography variant="caption" color={currentColors.textSecondary}>
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
                            <Typography variant="caption" color={currentColors.textSecondary}>
                              {format(parseISO(job.scheduledDate), 'MMM d, h:mm a')}
                            </Typography>
                          </Box>
                          
                          <IconButton size="small" disabled>
                            <NavigateNext />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <Typography color={currentColors.textSecondary} textAlign="center" py={4}>
                      No jobs found
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Quick Dispatch */}
            <Card sx={{ background: currentColors.card }}>
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
                      disabled
                      sx={{
                        background: currentColors.chipBackground,
                        color: currentColors.textPrimary,
                        opacity: 0.7,
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
                      disabled
                      sx={{
                        background: currentColors.chipBackground,
                        color: currentColors.textPrimary,
                        opacity: 0.7,
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
                    disabled={true}
                    sx={{
                      background: buttonColor,
                      color: 'white',
                      '&:hover': {
                        background: buttonColor,
                        opacity: 0.8,
                      },
                      '&.Mui-disabled': {
                        background: buttonColor,
                        color: 'white',
                        opacity: 0.5,
                      }
                    }}
                    onClick={handleDispatch}
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
                background: currentColors.card,
                border: `1px solid ${currentColors.border}`,
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
                          background: `${googleColors.blue}10`,
                          border: `1px solid ${googleColors.blue}30`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold" color={googleColors.blue}>
                          {analytics.summary.completionRate}%
                        </Typography>
                        <Typography variant="caption" color={currentColors.textSecondary}>
                          Completion Rate
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: `${googleColors.green}10`,
                          border: `1px solid ${googleColors.green}30`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold" color={googleColors.green}>
                          {analytics.summary.averageDuration.toFixed(1)}h
                        </Typography>
                        <Typography variant="caption" color={currentColors.textSecondary}>
                          Avg Duration
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: `${googleColors.yellow}10`,
                          border: `1px solid ${googleColors.yellow}30`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold" color={googleColors.yellow}>
                          {analytics.summary.revenue ? `₹${analytics.summary.revenue.toLocaleString()}` : '₹0'}
                        </Typography>
                        <Typography variant="caption" color={currentColors.textSecondary}>
                          Revenue
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: `${googleColors.red}10`,
                          border: `1px solid ${googleColors.red}30`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold" color={googleColors.red}>
                          {analytics.summary.averageRating.toFixed(1)}
                        </Typography>
                        <Typography variant="caption" color={currentColors.textSecondary}>
                          Avg Rating
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                ) : (
                  <Typography color={currentColors.textSecondary} textAlign="center" py={4}>
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
                          background: currentColors.background,
                          border: `1px solid ${currentColors.border}`,
                          borderRadius: 2,
                          mb: 3,
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {job.title}
                            </Typography>
                            <Typography variant="caption" color={currentColors.textSecondary}>
                              {job.customerName}
                            </Typography>
                          </Box>
                          <Chip
                            label="In Progress"
                            size="small"
                            sx={{
                              background: `${googleColors.yellow}20`,
                              color: googleColors.yellow,
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color={currentColors.textSecondary} display="block">
                            Technician
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: googleColors.blue }}>
                              {job.employeeName?.split(' ').map(n => n[0]).join('') || 'NA'}
                            </Avatar>
                            <Typography variant="body2">{job.employeeName || 'Not assigned'}</Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color={currentColors.textSecondary} display="block">
                            Location
                          </Typography>
                          <Typography variant="body2">
                            {job.location?.address || job.customerAddress || 'No address'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color={currentColors.textSecondary} display="block">
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
                            background: currentColors.border,
                            '& .MuiLinearProgress-bar': {
                              background: googleColors.blue,
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