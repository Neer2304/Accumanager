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
  ListItemIcon,
  Chip,
  IconButton,
  alpha,
  Skeleton,
  CircularProgress,
  Alert,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { 
  Event as EventIcon, 
  CalendarToday,
  MoreVert,
  ArrowForward,
  AccessTime,
  LocationOn,
  Refresh,
  TrendingUp
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
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
      case 'meeting': return '#4285f4'
      case 'conference': return '#ea4335'
      case 'workshop': return '#34a853'
      case 'training': return '#fbbc04'
      case 'social': return '#8e44ad'
      default: return darkMode ? '#5f6368' : '#9aa0a6'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'planned': return '#4285f4'
      case 'in-progress': return '#fbbc04'
      case 'completed': return '#34a853'
      case 'cancelled': return '#ea4335'
      default: return darkMode ? '#5f6368' : '#9aa0a6'
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
          {[1, 2].map((item) => (
            <Box key={item} mb={1}>
              <Skeleton 
                variant="rectangular" 
                height={60} 
                sx={{ bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }}
              />
            </Box>
          ))}
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
              Upcoming Events
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Avatar sx={{ 
              bgcolor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
              color: '#4285f4',
              width: 36,
              height: 36
            }}>
              {refreshing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <EventIcon fontSize="small" />
              )}
            </Avatar>
            <Tooltip title="Refresh">
              <IconButton 
                size="small" 
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                <Refresh fontSize="small" />
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
                sx={{ ml: 1 }}
              >
                Upgrade
              </Button>
            }
          >
            {error}
          </Alert>
        ) : (
          <>
            <Box textAlign="center" mb={2}>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                sx={{ 
                  color: '#4285f4',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                {displayUpcomingEvents}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                This Month
              </Typography>
            </Box>

            {upcomingEventsList.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 2,
                  color: darkMode ? '#9aa0a6' : '#5f6368'
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
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      '&:last-child': {
                        borderBottom: 'none'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CalendarToday sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} fontSize="small" />
                    </ListItemIcon>
                    <Box sx={{ flex: 1, ml: 2 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={500}
                        sx={{ 
                          fontSize: { xs: '0.85rem', sm: '0.9rem' },
                          color: darkMode ? '#e8eaed' : '#202124'
                        }}
                      >
                        {event.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            color: darkMode ? '#9aa0a6' : '#5f6368'
                          }}
                        >
                          {formatEventDate(event.startDate)}
                        </Typography>
                        <Chip 
                          label={event.type}
                          size="small"
                          sx={{ 
                            height: 20, 
                            fontSize: '0.65rem',
                            backgroundColor: alpha(getEventColor(event.type), darkMode ? 0.2 : 0.1),
                            color: getEventColor(event.type),
                            border: `1px solid ${alpha(getEventColor(event.type), 0.3)}`
                          }}
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
                borderRadius: 1,
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                '&:hover': {
                  borderColor: '#4285f4',
                  backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05)
                }
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