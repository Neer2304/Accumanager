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
  Switch,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Avatar,
  LinearProgress,
  Divider,
  Badge,
} from '@mui/material'
import {
  DirectionsCar,
  LocationOn,
  Schedule,
  Assignment,
  CheckCircle,
  Warning,
  GpsFixed,
  Person,
  Phone,
  Email,
  Map,
  NavigateNext,
  MoreVert,
  Refresh,
  Add,
  FilterList,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

const mockTechnicians = [
  { id: 1, name: 'John Smith', status: 'available', location: 'Downtown', jobs: 3, rating: 4.8 },
  { id: 2, name: 'Sarah Johnson', status: 'on-job', location: 'Northside', jobs: 1, rating: 4.9 },
  { id: 3, name: 'Mike Wilson', status: 'offline', location: 'East End', jobs: 0, rating: 4.7 },
  { id: 4, name: 'Emma Davis', status: 'available', location: 'Westside', jobs: 2, rating: 4.6 },
]

const mockJobs = [
  { id: 101, customer: 'Acme Corp', type: 'Installation', priority: 'high', status: 'assigned', eta: '10:30 AM' },
  { id: 102, customer: 'Tech Solutions', type: 'Repair', priority: 'medium', status: 'in-progress', eta: '1:15 PM' },
  { id: 103, customer: 'Global Inc', type: 'Maintenance', priority: 'low', status: 'scheduled', eta: 'Tomorrow' },
  { id: 104, customer: 'Startup Labs', type: 'Emergency', priority: 'high', status: 'pending', eta: 'ASAP' },
]

export default function FieldServicePage() {
  const { currentScheme } = useAdvanceThemeContext()
  const [autoDispatch, setAutoDispatch] = useState(true)
  const [viewMode, setViewMode] = useState('map')

  return (
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
              sx={{
                borderColor: currentScheme.colors.components.border,
                color: currentScheme.colors.text.primary,
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              }}
            >
              New Job
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
          {[
            { label: 'Active Technicians', value: '8', icon: <Person />, status: '4 available' },
            { label: 'Jobs Today', value: '24', icon: <Assignment />, status: '18 completed' },
            { label: 'Avg Response Time', value: '42min', icon: <Schedule />, status: '-5min vs target' },
            { label: 'Customer Rating', value: '4.8/5', icon: <CheckCircle />, status: '+0.2 this month' },
          ].map((stat, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                minWidth: '200px',
                background: currentScheme.colors.components.card,
                border: `1px solid ${currentScheme.colors.components.border}`,
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
                      background: `${currentScheme.colors.primary}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentScheme.colors.primary,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: currentScheme.colors.buttons.success, mt: 1 }}>
                  {stat.status}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Controls */}
      <Card sx={{ mb: 3, background: currentScheme.colors.components.card }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={3}>
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
              
              <Box display="flex" alignItems="center" gap={1}>
                <Switch
                  checked={autoDispatch}
                  onChange={(e) => setAutoDispatch(e.target.checked)}
                  color="primary"
                />
                <Typography variant="body2">Auto-dispatch</Typography>
              </Box>
            </Box>

            <Box display="flex" gap={1}>
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

      {/* Main Content */}
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
                {mockTechnicians.map((tech) => (
                  <Paper
                    key={tech.id}
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
                            tech.status === 'on-job' ? 'warning' : 'error'
                          }
                          variant="dot"
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                          <Avatar sx={{ bgcolor: currentScheme.colors.primary }}>
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </Badge>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {tech.name}
                          </Typography>
                          <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                            <LocationOn sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                            {tech.location}
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" gap={2}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold">
                            {tech.jobs}
                          </Typography>
                          <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                            Jobs
                          </Typography>
                        </Box>
                        
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold">
                            {tech.rating}
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
                              : tech.status === 'on-job'
                              ? `${currentScheme.colors.buttons.warning}20`
                              : `${currentScheme.colors.text.secondary}20`,
                            color: tech.status === 'available'
                              ? currentScheme.colors.buttons.success
                              : tech.status === 'on-job'
                              ? currentScheme.colors.buttons.warning
                              : currentScheme.colors.text.secondary,
                          }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={
                          tech.status === 'available' ? 100 :
                          tech.status === 'on-job' ? 60 : 0
                        }
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          background: currentScheme.colors.components.border,
                          '& .MuiLinearProgress-bar': {
                            background: tech.status === 'available'
                              ? currentScheme.colors.buttons.success
                              : tech.status === 'on-job'
                              ? currentScheme.colors.buttons.warning
                              : currentScheme.colors.text.secondary,
                          },
                        }}
                      />
                    </Box>
                  </Paper>
                ))}
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
                  4 jobs today
                </Typography>
              </Box>

              {/* Jobs List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockJobs.map((job) => (
                  <Paper
                    key={job.id}
                    sx={{
                      p: 2,
                      background: currentScheme.colors.background,
                      border: `1px solid ${currentScheme.colors.components.border}`,
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          #{job.id} - {job.customer}
                        </Typography>
                        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                          {job.type}
                        </Typography>
                      </Box>
                      
                      <Chip
                        label={job.priority}
                        size="small"
                        sx={{
                          background: job.priority === 'high'
                            ? `${currentScheme.colors.buttons.error}20`
                            : job.priority === 'medium'
                            ? `${currentScheme.colors.buttons.warning}20`
                            : `${currentScheme.colors.buttons.success}20`,
                          color: job.priority === 'high'
                            ? currentScheme.colors.buttons.error
                            : job.priority === 'medium'
                            ? currentScheme.colors.buttons.warning
                            : currentScheme.colors.buttons.success,
                        }}
                      />
                    </Box>
                    
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={job.status}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: currentScheme.colors.components.border,
                          }}
                        />
                        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                          ETA: {job.eta}
                        </Typography>
                      </Box>
                      
                      <IconButton size="small">
                        <NavigateNext />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
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
                <Select
                  fullWidth
                  size="small"
                  defaultValue=""
                  displayEmpty
                  sx={{
                    background: currentScheme.colors.components.input,
                    color: currentScheme.colors.text.primary,
                  }}
                >
                  <MenuItem value="" disabled>Select Technician</MenuItem>
                  <MenuItem value="john">John Smith (Available)</MenuItem>
                  <MenuItem value="sarah">Sarah Johnson (On Job)</MenuItem>
                  <MenuItem value="mike">Mike Wilson (Offline)</MenuItem>
                  <MenuItem value="emma">Emma Davis (Available)</MenuItem>
                </Select>
                
                <Select
                  fullWidth
                  size="small"
                  defaultValue=""
                  displayEmpty
                  sx={{
                    background: currentScheme.colors.components.input,
                    color: currentScheme.colors.text.primary,
                  }}
                >
                  <MenuItem value="" disabled>Select Job</MenuItem>
                  <MenuItem value="101">#101 - Acme Corp (High)</MenuItem>
                  <MenuItem value="102">#102 - Tech Solutions (Medium)</MenuItem>
                  <MenuItem value="103">#103 - Global Inc (Low)</MenuItem>
                  <MenuItem value="104">#104 - Startup Labs (High)</MenuItem>
                </Select>
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Assignment />}
                  sx={{
                    background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                  }}
                >
                  Dispatch Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Map & Details */}
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              height: '100%',
            }}
          >
            <CardContent>
              {/* Map Placeholder */}
              <Box
                sx={{
                  height: 200,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${currentScheme.colors.background} 0%, ${currentScheme.colors.components.border} 100%)`,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    background: 'rgba(255,255,255,0.9)',
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption" fontWeight="medium">
                    Live GPS Coverage
                  </Typography>
                </Box>
                <LocationOn sx={{ fontSize: 48, color: currentScheme.colors.primary }} />
              </Box>

              {/* Active Job Details */}
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Active Job Details
              </Typography>
              
              <Paper
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
                      #102 - Server Repair
                    </Typography>
                    <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                      Tech Solutions Inc.
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
                      SJ
                    </Avatar>
                    <Typography variant="body2">Sarah Johnson</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block">
                    Location
                  </Typography>
                  <Typography variant="body2">
                    123 Tech Street, Suite 500
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block">
                    Estimated Completion
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    1:15 PM (45 minutes remaining)
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={65}
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

              {/* Customer Contact */}
              <Box sx={{ p: 2, borderRadius: 2, background: `${currentScheme.colors.primary}10` }}>
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  Customer Contact
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <IconButton size="small">
                    <Phone />
                  </IconButton>
                  <IconButton size="small">
                    <Email />
                  </IconButton>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      ml: 'auto',
                      borderColor: currentScheme.colors.components.border,
                      color: currentScheme.colors.text.primary,
                    }}
                  >
                    Send Update
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}