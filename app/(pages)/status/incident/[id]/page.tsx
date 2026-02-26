// app/status/incident/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Alert,
  useTheme,
  alpha,
  Button,
  Stack,
  Breadcrumbs,
  Divider,
  Skeleton,
  Avatar,
  AvatarGroup,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
} from '@mui/material'
import {
  Home as HomeIcon,
  History,
  Schedule,
  CheckCircle,
  Error,
  Warning,
  AccessTime,
  Person,
  NotificationsActive,
  Edit,
  Delete,
  Add,
  Close,
} from '@mui/icons-material'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { formatDistanceToNow, format } from 'date-fns'

interface IncidentData {
  id: string
  title: string
  description: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'critical' | 'high' | 'medium' | 'low'
  services: Array<{
    name: string
    currentStatus: string
    group: string
  }>
  updates: Array<{
    id: string
    message: string
    timestamp: string
    status: string
    author?: string
  }>
  createdAt: string
  resolvedAt: string | null
  autoCreated: boolean
  createdBy?: string | null
  user?: {
    id: string
    isAdmin: boolean
    notified: boolean
    read: boolean
    readAt: string | null
  } | null
  stats: {
    updateCount: number
    timeOpen: number
    affectedServicesCount: number
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

export default function IncidentPage() {
  const theme = useTheme()
  const router = useRouter()
  const params = useParams()
  const incidentId = params.id as string
  const darkMode = theme.palette.mode === 'dark'

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [incident, setIncident] = useState<IncidentData | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [updateMessage, setUpdateMessage] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  const fetchIncident = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/system/status/incident/${incidentId}`)
      const result = await response.json()
      
      if (!response.ok) {
        setError(result.message || 'Failed to fetch incident')
        return
      }
      
      setIncident(result.data)
      setUpdateStatus(result.data.status)
    } catch (err: any) {
      setError(err?.message || 'Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncident()
  }, [incidentId])

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return google.red
      case 'high': return google.yellow
      case 'medium': return google.blue
      case 'low': return google.grey
      default: return google.grey
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return google.green
      case 'monitoring': return google.blue
      case 'identified': return google.yellow
      case 'investigating': return google.red
      default: return google.grey
    }
  }

  const handleAddUpdate = async () => {
    if (!updateMessage.trim()) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/system/status/incident/${incidentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: updateMessage,
          status: updateStatus,
          notifyUsers: true
        })
      })

      const result = await response.json()
      if (!response.ok) {
        setSnackbar({ open: true, message: result.message || 'Failed to add update' })
        return
      }

      await fetchIncident()
      setUpdateDialogOpen(false)
      setUpdateMessage('')
      setSnackbar({ open: true, message: 'Update added successfully' })
    } catch (err: any) {
      setSnackbar({ open: true, message: err?.message || 'Network error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      setSubmitting(true)
      const response = await fetch(`/api/system/status/incident/${incidentId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (!response.ok) {
        setSnackbar({ open: true, message: result.message || 'Failed to delete incident' })
        return
      }

      router.push('/status')
    } catch (err: any) {
      setSnackbar({ open: true, message: err?.message || 'Network error' })
    } finally {
      setSubmitting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <MainLayout title="Incident Details">
        <Box sx={{ backgroundColor: darkMode ? google.black : google.white, minHeight: '100vh' }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Skeleton width={200} height={30} />
            <Skeleton width="60%" height={50} sx={{ mt: 2 }} />
            <Skeleton width="40%" height={30} sx={{ mt: 1 }} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 3, borderRadius: 2 }} />
          </Container>
        </Box>
      </MainLayout>
    )
  }

  if (error || !incident) {
    return (
      <MainLayout title="Incident Details">
        <Box sx={{ backgroundColor: darkMode ? google.black : google.white, minHeight: '100vh' }}>
          <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || 'Incident not found'}
            </Alert>
            <Button 
              component={Link} 
              href="/status" 
              variant="contained"
              sx={{ bgcolor: google.blue }}
            >
              Back to Status
            </Button>
          </Container>
        </Box>
      </MainLayout>
    )
  }

  const isAdmin = incident.user?.isAdmin || false

  return (
    <MainLayout title={`Incident: ${incident.title}`}>
      <Box sx={{ 
        backgroundColor: darkMode ? google.black : google.white,
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', color: darkMode ? '#9aa0a6' : google.grey }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Dashboard
              </Box>
            </Link>
            <Link href="/status" style={{ textDecoration: 'none', color: darkMode ? '#9aa0a6' : google.grey }}>
              System Status
            </Link>
            <Typography color={darkMode ? '#e8eaed' : google.black}>
              Incident
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h4" fontWeight={600}>
              {incident.title}
            </Typography>
            
            {isAdmin && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setUpdateDialogOpen(true)}
                  sx={{
                    borderColor: darkMode ? google.greyDark : google.greyBorder,
                    color: darkMode ? '#e8eaed' : google.black,
                  }}
                >
                  Add Update
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Chip
              label={incident.status}
              sx={{
                backgroundColor: alpha(getStatusColor(incident.status), 0.1),
                color: getStatusColor(incident.status),
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />
            <Chip
              label={incident.severity}
              sx={{
                backgroundColor: alpha(getSeverityColor(incident.severity), 0.1),
                color: getSeverityColor(incident.severity),
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />
            {incident.autoCreated && (
              <Chip
                label="Auto-detected"
                sx={{
                  backgroundColor: alpha(google.yellow, 0.1),
                  color: google.yellow,
                }}
              />
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* User Notification Status */}
          {incident.user && (
            <Card sx={{ mb: 3, p: 2, backgroundColor: alpha(google.blue, 0.05) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <NotificationsActive sx={{ color: google.blue }} />
                <Typography variant="body2">
                  {incident.user.notified ? (
                    <>You were notified about this incident. {incident.user.read ? 'Read' : 'Marked as read'}.</>
                  ) : (
                    'You have not been notified about this incident.'
                  )}
                </Typography>
              </Box>
            </Card>
          )}

          {/* Overview Cards */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
          }}>
            <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 11px)' } }}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <AccessTime sx={{ color: google.blue, fontSize: 32, mb: 1 }} />
                <Typography variant="h5" fontWeight={600}>
                  {incident.stats.timeOpen} min
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                  Time Open
                </Typography>
              </Card>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 11px)' } }}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <History sx={{ color: google.green, fontSize: 32, mb: 1 }} />
                <Typography variant="h5" fontWeight={600}>
                  {incident.stats.updateCount}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                  Updates
                </Typography>
              </Card>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 11px)' } }}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Person sx={{ color: google.yellow, fontSize: 32, mb: 1 }} />
                <Typography variant="h5" fontWeight={600}>
                  {incident.stats.affectedServicesCount}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                  Affected Services
                </Typography>
              </Card>
            </Box>
          </Box>

          {/* Affected Services */}
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 24, bgcolor: google.blue, borderRadius: 1 }} />
            Affected Services
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
          }}>
            {incident.services.map((service) => (
              <Box key={service.name} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' } }}>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography fontWeight={600}>{service.name}</Typography>
                    <Chip
                      label={service.currentStatus}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getStatusColor(service.currentStatus), 0.1),
                        color: getStatusColor(service.currentStatus),
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                    Group: {service.group}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>

          {/* Timeline */}
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 24, bgcolor: google.yellow, borderRadius: 1 }} />
            Timeline
          </Typography>

          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* Created */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: google.blue,
                      mt: 0.5,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 20,
                      left: 5,
                      width: 2,
                      height: 'calc(100% - 20px)',
                      bgcolor: darkMode ? google.greyDark : google.greyBorder,
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, pb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Incident Created
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey, display: 'block', mb: 1 }}>
                    {format(new Date(incident.createdAt), 'MMM dd, yyyy HH:mm')} ({formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })})
                  </Typography>
                  <Typography variant="body2">
                    {incident.description || 'Incident reported'}
                  </Typography>
                </Box>
              </Box>

              {/* Updates */}
              {incident.updates?.map((update, index) => (
                <Box key={update.id} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: getStatusColor(update.status),
                        mt: 0.5,
                      }}
                    />
                    {index < incident.updates.length - 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 20,
                          left: 5,
                          width: 2,
                          height: 'calc(100% - 20px)',
                          bgcolor: darkMode ? google.greyDark : google.greyBorder,
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, pb: index < incident.updates.length - 1 ? 2 : 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Chip
                        label={update.status}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getStatusColor(update.status), 0.1),
                          color: getStatusColor(update.status),
                          height: 20,
                          fontSize: '0.65rem',
                        }}
                      />
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                        {format(new Date(update.timestamp), 'MMM dd, HH:mm')} ({formatDistanceToNow(new Date(update.timestamp), { addSuffix: true })})
                      </Typography>
                      {update.author && (
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                          by {update.author}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2">
                      {update.message}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Resolved */}
              {incident.resolvedAt && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: google.green,
                        mt: 0.5,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ color: google.green }}>
                      Resolved
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey, display: 'block' }}>
                      {format(new Date(incident.resolvedAt), 'MMM dd, yyyy HH:mm')} ({formatDistanceToNow(new Date(incident.resolvedAt), { addSuffix: true })})
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Card>
        </Container>
      </Box>

      {/* Add Update Dialog */}
      <Dialog 
        open={updateDialogOpen} 
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: darkMode ? google.greyDark : google.white,
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Add Incident Update</Typography>
            <IconButton onClick={() => setUpdateDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Update Message"
              multiline
              rows={4}
              fullWidth
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
              placeholder="Describe the current situation..."
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={updateStatus}
                label="Status"
                onChange={(e) => setUpdateStatus(e.target.value)}
              >
                <MenuItem value="investigating">Investigating</MenuItem>
                <MenuItem value="identified">Identified</MenuItem>
                <MenuItem value="monitoring">Monitoring</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddUpdate}
            disabled={!updateMessage.trim() || submitting}
            sx={{ bgcolor: google.blue }}
          >
            {submitting ? 'Posting...' : 'Post Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: darkMode ? google.greyDark : google.white,
          }
        }}
      >
        <DialogTitle>Delete Incident</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this incident? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </MainLayout>
  )
}