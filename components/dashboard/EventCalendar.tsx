import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  alpha,
  Skeleton,
  CircularProgress,
  Alert
} from '@mui/material'
import { 
  Event as EventIcon, 
  CalendarToday,
  MoreVert,
  ArrowForward,
  AccessTime,
  LocationOn,
  Refresh
} from '@mui/icons-material'
import Link from 'next/link'

interface Event {
  _id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  type: string
  totalBudget?: number
  totalSpent?: number
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled'
  location?: string
  attendees?: number
}

interface EventCalendarProps {
  upcomingEvents?: number
}

const EventCalendar: React.FC<EventCalendarProps> = ({ upcomingEvents }) => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events', {
        credentials: 'include'
      })

      if (response.status === 402) {
        const data = await response.json()
        setError(data.message || 'Subscription required')
        setEvents([])
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }

      const data = await response.json()
      setEvents(data || [])
      setError(null)
    } catch (err: any) {
      console.error('Error fetching events:', err)
      setError(err.message || 'Failed to load events')
      setEvents([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchEvents()
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const getEventColor = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'meeting': return 'info'
      case 'conference': return 'primary'
      case 'workshop': return 'success'
      case 'training': return 'warning'
      case 'social': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'planned': return 'info'
      case 'in-progress': return 'warning'
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  // Calculate actual upcoming events count
  const actualUpcomingEvents = events.filter(event => {
    const eventDate = new Date(event.startDate)
    const today = new Date()
    return eventDate >= today && event.status !== 'cancelled'
  }).length

  const displayUpcomingEvents = upcomingEvents !== undefined ? upcomingEvents : actualUpcomingEvents
  const upcomingEventsList = events
    .filter(event => {
      const eventDate = new Date(event.startDate)
      const today = new Date()
      return eventDate >= today && event.status !== 'cancelled'
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3)

  if (loading && !refreshing) {
    return (
      <Card sx={{ width: '100%', height: '100%' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Skeleton variant="text" width={120} height={30} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
          <Box textAlign="center" mb={2}>
            <Skeleton variant="text" width={60} height={50} sx={{ mx: 'auto' }} />
            <Skeleton variant="text" width={100} height={24} sx={{ mx: 'auto' }} />
          </Box>
          {[1, 2].map((item) => (
            <Box key={item} mb={1}>
              <Skeleton variant="rectangular" height={60} />
            </Box>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="div" fontWeight={600}>
            Upcoming Events
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Avatar sx={{ 
              bgcolor: 'info.main',
              color: 'white',
              width: 36,
              height: 36
            }}>
              {refreshing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <EventIcon fontSize="small" />
              )}
            </Avatar>
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {error ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
            <Button 
              color="inherit" 
              size="small"
              onClick={() => window.location.href = '/pricing'}
              sx={{ ml: 1 }}
            >
              Upgrade
            </Button>
          </Alert>
        ) : (
          <>
            <Box textAlign="center" mb={2}>
              <Typography variant="h3" fontWeight="bold" color="info.main">
                {displayUpcomingEvents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Month
              </Typography>
            </Box>

            {upcomingEventsList.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 2,
                  color: 'text.secondary'
                }}
              >
                <CalendarToday sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                <Typography variant="body2">
                  No upcoming events
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {upcomingEventsList.map((event) => (
                  <ListItem 
                    key={event._id}
                    sx={{ 
                      px: 0,
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CalendarToday color="action" fontSize="small" />
                    </ListItemIcon>
                    {/* FIXED: Using custom Box instead of ListItemText to avoid p > div nesting */}
                    <Box sx={{ flex: 1, ml: 2 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {event.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatEventDate(event.startDate)}
                        </Typography>
                        <Chip 
                          label={event.type}
                          size="small"
                          color={getEventColor(event.type)}
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}

            <Button 
              variant="outlined" 
              fullWidth 
              component={Link}
              href="/events"
              size="small"
              startIcon={<ArrowForward />}
              sx={{ 
                mt: 2,
                py: 0.8,
                borderRadius: 1
              }}
            >
              View Calendar
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default EventCalendar