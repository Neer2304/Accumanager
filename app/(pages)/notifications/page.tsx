// app/(pages)/community/notifications/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  useTheme,
  useMediaQuery,
  Tooltip,
  Collapse,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
  CheckCircle as ReadIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  MarkEmailRead as MarkReadIcon,
  Email as MessageIcon,
  Event as EventIcon,
  Assignment as TaskIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  People as PeopleIcon,
  NotificationsActive as UrgentIcon,
  AccessTime as TimeIcon,
  ClearAll as ClearAllIcon,
  Archive as ArchiveIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material'
import { MainLayout } from '@/components/Layout/MainLayout'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Notification {
  _id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'event' | 'system'
  isRead: boolean
  createdAt: string
  actionUrl?: string
  metadata?: {
    senderName?: string
    senderAvatar?: string
    eventDate?: string
    priority?: 'low' | 'medium' | 'high'
  }
}

type FilterType = 'all' | 'unread' | 'read'
type CategoryType = 'all' | 'message' | 'event' | 'system' | 'alert'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [category, setCategory] = useState<CategoryType>('all')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [bulkActionMode, setBulkActionMode] = useState(false)
  const router = useRouter()
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/notifications', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (res.ok) {
        const result = await res.json()
        if (result.success) {
          setNotifications(result.data || [])
          setSelectedNotifications([]) // Clear selections on refresh
        } else {
          setError(result.message || 'Failed to fetch notifications')
        }
      } else if (res.status === 401) {
        setError('Please login to view notifications')
        router.push('/login')
      } else {
        setError('Failed to load notifications')
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  // Handle back navigation
  const handleBack = () => {
    router.back()
  }

  // Mark as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      })
      
      if (res.ok) {
        const result = await res.json()
        if (result.success) {
          setNotifications(prev => 
            prev.map(n => 
              n._id === notificationId ? { ...n, isRead: true } : n
            )
          )
          // Remove from selected if in bulk mode
          setSelectedNotifications(prev => prev.filter(id => id !== notificationId))
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAll: true }),
      })
      
      if (res.ok) {
        const result = await res.json()
        if (result.success) {
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
          setSelectedNotifications([])
        }
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Delete notification
  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (res.ok) {
        const result = await res.json()
        if (result.success) {
          setNotifications(prev => prev.filter(n => n._id !== notificationId))
          setSelectedNotifications(prev => prev.filter(id => id !== notificationId))
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Delete all read
  const handleDeleteAllRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteAllRead: true }),
      })
      
      if (res.ok) {
        const result = await res.json()
        if (result.success) {
          setNotifications(prev => prev.filter(n => !n.isRead))
        }
      }
    } catch (error) {
      console.error('Error deleting read notifications:', error)
    }
    setAnchorEl(null)
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (bulkActionMode) {
      // Toggle selection in bulk mode
      if (selectedNotifications.includes(notification._id)) {
        setSelectedNotifications(prev => prev.filter(id => id !== notification._id))
      } else {
        setSelectedNotifications(prev => [...prev, notification._id])
      }
    } else {
      // Normal click behavior
      if (!notification.isRead) {
        handleMarkAsRead(notification._id)
      }
      
      if (notification.actionUrl) {
        router.push(notification.actionUrl)
      }
    }
  }

  // Handle bulk mark as read
  const handleBulkMarkAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/bulk', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          notificationIds: selectedNotifications,
          markAsRead: true 
        }),
      })
      
      if (res.ok) {
        const result = await res.json()
        if (result.success) {
          setNotifications(prev => 
            prev.map(n => 
              selectedNotifications.includes(n._id) ? { ...n, isRead: true } : n
            )
          )
          setSelectedNotifications([])
          setBulkActionMode(false)
        }
      }
    } catch (error) {
      console.error('Error bulk marking as read:', error)
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      const res = await fetch('/api/notifications/bulk', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          notificationIds: selectedNotifications
        }),
      })
      
      if (res.ok) {
        const result = await res.json()
        if (result.success) {
          setNotifications(prev => 
            prev.filter(n => !selectedNotifications.includes(n._id))
          )
          setSelectedNotifications([])
          setBulkActionMode(false)
        }
      }
    } catch (error) {
      console.error('Error bulk deleting:', error)
    }
  }

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Apply read/unread filter
    if (showOnlyUnread && notification.isRead) return false
    
    // Apply type filter
    if (filter === 'unread' && notification.isRead) return false
    if (filter === 'read' && !notification.isRead) return false
    
    // Apply category filter
    if (category !== 'all' && notification.type !== category) {
      // Map categories to types
      const categoryMap: Record<CategoryType, string[]> = {
        all: [],
        message: ['message'],
        event: ['event'],
        system: ['system', 'info'],
        alert: ['warning', 'error', 'success']
      }
      if (!categoryMap[category].includes(notification.type)) return false
    }
    
    return true
  })

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageIcon fontSize={isMobile ? 'small' : 'medium'} />
      case 'event':
        return <EventIcon fontSize={isMobile ? 'small' : 'medium'} />
      case 'task':
        return <TaskIcon fontSize={isMobile ? 'small' : 'medium'} />
      case 'warning':
        return <WarningIcon fontSize={isMobile ? 'small' : 'medium'} />
      case 'error':
        return <WarningIcon color="error" fontSize={isMobile ? 'small' : 'medium'} />
      case 'success':
        return <SuccessIcon color="success" fontSize={isMobile ? 'small' : 'medium'} />
      case 'urgent':
        return <UrgentIcon color="error" fontSize={isMobile ? 'small' : 'medium'} />
      case 'people':
        return <PeopleIcon fontSize={isMobile ? 'small' : 'medium'} />
      default:
        return <InfoIcon fontSize={isMobile ? 'small' : 'medium'} />
    }
  }

  // Get notification color
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#4caf50'
      case 'warning':
        return '#ff9800'
      case 'error':
        return '#f44336'
      case 'message':
        return '#2196f3'
      case 'event':
        return '#9c27b0'
      case 'system':
        return '#607d8b'
      default:
        return '#2196f3'
    }
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length
  const readCount = notifications.filter(n => n.isRead).length

  // Empty state component
  const EmptyState = () => (
    <Box sx={{ 
      textAlign: 'center', 
      p: { xs: 4, md: 6 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 400
    }}>
      <NotificationsIcon sx={{ 
        fontSize: { xs: 48, md: 64 }, 
        color: 'text.disabled', 
        mb: 2 
      }} />
      <Typography variant={isMobile ? "h6" : "h5"} color="text.secondary" gutterBottom>
        No notifications found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
        {filter !== 'all' || category !== 'all' || showOnlyUnread
          ? 'Try changing your filters to see more notifications'
          : 'You\'re all caught up! All notifications are read.'}
      </Typography>
      {(filter !== 'all' || category !== 'all' || showOnlyUnread) && (
        <Button
          variant="outlined"
          onClick={() => {
            setFilter('all')
            setCategory('all')
            setShowOnlyUnread(false)
          }}
          sx={{ mt: 2 }}
        >
          Clear all filters
        </Button>
      )}
    </Box>
  )

  // Custom Notification Item Component to avoid nesting issues
  const NotificationItem = ({ notification, isSelected, bulkActionMode }: { 
    notification: Notification, 
    isSelected: boolean,
    bulkActionMode: boolean 
  }) => {
    const notificationColor = getNotificationColor(notification.type)
    
    return (
      <ListItem
        sx={{
          py: { xs: 1.5, sm: 2 },
          px: { xs: 1.5, sm: 2, md: 3 },
          backgroundColor: isSelected 
            ? 'primary.50' 
            : notification.isRead 
              ? 'transparent' 
              : 'action.hover',
          borderLeft: `4px solid ${notificationColor}`,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: isSelected 
              ? 'primary.100' 
              : 'action.hover'
          },
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          ...(bulkActionMode && {
            cursor: 'default',
            '&:hover': {
              backgroundColor: isSelected 
                ? 'primary.100' 
                : 'grey.50'
            }
          })
        }}
        onClick={() => handleNotificationClick(notification)}
      >
        {/* Selection checkbox for bulk mode */}
        {bulkActionMode && (
          <Box
            sx={{
              position: 'absolute',
              left: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `2px solid ${isSelected ? 'primary.main' : 'grey.400'}`,
                backgroundColor: isSelected ? 'primary.main' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:after': isSelected ? {
                  content: '"✓"',
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold'
                } : {}
              }}
            />
          </Box>
        )}
        
        {/* Unread indicator */}
        {!notification.isRead && !bulkActionMode && (
          <Tooltip title="Unread" placement="left">
            <CircleIcon
              sx={{
                position: 'absolute',
                left: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 8,
                color: notificationColor,
              }}
            />
          </Tooltip>
        )}
        
        {/* Icon */}
        <ListItemAvatar>
          <Avatar sx={{ 
            bgcolor: `${notificationColor}20`, 
            color: notificationColor,
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 }
          }}>
            {getNotificationIcon(notification.type)}
          </Avatar>
        </ListItemAvatar>
        
        {/* Content - Using custom structure instead of ListItemText to avoid nesting */}
        <Box sx={{ 
          flex: 1,
          ml: bulkActionMode ? 3 : 0,
        }}>
          {/* Title and Type Chip */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1,
            mb: 1 
          }}>
            <Typography 
              variant={isMobile ? "body1" : "subtitle1"} 
              fontWeight={notification.isRead ? 'normal' : '600'}
              sx={{ flex: 1 }}
            >
              {notification.title}
            </Typography>
            <Chip
              label={notification.type}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                bgcolor: `${notificationColor}20`,
                color: notificationColor,
                border: 'none',
                alignSelf: { xs: 'flex-start', sm: 'center' }
              }}
            />
          </Box>
          
          {/* Message */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {notification.message}
          </Typography>
          
          {/* Time and actions */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon fontSize="small" sx={{ fontSize: 14, opacity: 0.7 }} />
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {formatTime(notification.createdAt)}
              </Typography>
            </Box>
            
            {!bulkActionMode && (
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5,
                flexWrap: 'wrap'
              }}>
                {!notification.isRead && (
                  <Tooltip title="Mark as read">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notification._id)
                      }}
                      sx={{ 
                        p: 0.5,
                        '&:hover': { bgcolor: `${notificationColor}10` }
                      }}
                    >
                      <ReadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNotification(notification._id)
                    }}
                    sx={{ 
                      p: 0.5,
                      '&:hover': { bgcolor: 'error.10' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
      </ListItem>
    )
  }

  return (
    <MainLayout title="Notifications">
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header - Same style as Events page */}
        <Box sx={{ mb: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            size="small"
          >
            Back to Dashboard
          </Button>

          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </MuiLink>
            <Typography color="text.primary">Notifications</Typography>
          </Breadcrumbs>

          {/* Main Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Notification Center
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Stay updated with all your alerts and messages in one place
              </Typography>
            </Box>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {unreadCount > 0 && (
                <Chip 
                  label={`${unreadCount} Unread`} 
                  size="small" 
                  color="error" 
                  variant="filled"
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                />
              )}
              <Chip 
                label={`${notifications.length} Total`} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              />
            </Stack>
          </Box>
        </Box>

        {/* Bulk Actions Bar */}
        <Collapse in={bulkActionMode && selectedNotifications.length > 0}>
          <Paper
            elevation={3}
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Typography variant="subtitle1" fontWeight="600">
                {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<ReadIcon />}
                  onClick={handleBulkMarkAsRead}
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                >
                  Mark as read
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={handleBulkDelete}
                  sx={{ bgcolor: 'error.main', color: 'white' }}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setBulkActionMode(false)
                    setSelectedNotifications([])
                  }}
                  sx={{ borderColor: 'white', color: 'white' }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        </Collapse>

        {/* Stats Cards */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 3,
          '& > *': {
            flex: { xs: '1 0 calc(50% - 8px)', sm: '1 0 calc(25% - 8px)' }
          }
        }}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'primary.contrastText'
          }}>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700">
              {notifications.length}
            </Typography>
            <Typography variant="caption">Total</Typography>
          </Paper>
          
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'error.light',
            color: 'error.contrastText'
          }}>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700">
              {unreadCount}
            </Typography>
            <Typography variant="caption">Unread</Typography>
          </Paper>
          
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'success.light',
            color: 'success.contrastText'
          }}>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700">
              {readCount}
            </Typography>
            <Typography variant="caption">Read</Typography>
          </Paper>
          
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'warning.light',
            color: 'warning.contrastText'
          }}>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700">
              {filteredNotifications.length}
            </Typography>
            <Typography variant="caption">Filtered</Typography>
          </Paper>
        </Box>

        {/* Filters Section */}
        <Paper sx={{ 
          p: { xs: 1.5, sm: 2, md: 3 }, 
          mb: 3,
          borderRadius: 2,
          bgcolor: 'background.default'
        }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems="center"
            justifyContent="space-between"
          >
            <Box sx={{ flex: 1, width: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Filter by status
              </Typography>
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(e, newFilter) => newFilter && setFilter(newFilter)}
                size="small"
                fullWidth={isMobile}
              >
                <ToggleButton value="all">
                  {/* <Badge badgeContent={notifications.length} color="primary" max={999} size="small">
                    All
                  </Badge>
                </ToggleButton>s
                <ToggleButton value="unread">
                  <Badge badgeContent={unreadCount} color="error" max={999} size="small">
                    Unread
                  </Badge>
                </ToggleButton>
                <ToggleButton value="read">
                  <Badge badgeContent={readCount} color="success" max={999} size="small">
                    Read
                  </Badge> */}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            <Box sx={{ flex: 1, width: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Filter by type
              </Typography>
              <ToggleButtonGroup
                value={category}
                exclusive
                onChange={(e, newCategory) => newCategory && setCategory(newCategory)}
                size="small"
                fullWidth={isMobile}
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="message">Messages</ToggleButton>
                <ToggleButton value="event">Events</ToggleButton>
                <ToggleButton value="system">System</ToggleButton>
                <ToggleButton value="alert">Alerts</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyUnread}
                    onChange={(e) => setShowOnlyUnread(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Show unread only
                  </Typography>
                }
              />
            </Box>
          </Stack>
        </Paper>

        {/* Notifications List */}
        <Paper sx={{ 
          overflow: 'hidden', 
          borderRadius: 2,
          minHeight: 400
        }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: 8,
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress size={isMobile ? 40 : 60} />
              <Typography variant="body1" color="text.secondary">
                Loading notifications...
              </Typography>
            </Box>
          ) : error ? (
            <Alert 
              severity="error" 
              sx={{ m: 2 }}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={fetchNotifications}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          ) : filteredNotifications.length === 0 ? (
            <EmptyState />
          ) : (
            <List disablePadding>
              {filteredNotifications.map((notification, index) => {
                const isSelected = selectedNotifications.includes(notification._id)
                
                return (
                  <React.Fragment key={notification._id}>
                    <NotificationItem 
                      notification={notification}
                      isSelected={isSelected}
                      bulkActionMode={bulkActionMode}
                    />
                    
                    {index < filteredNotifications.length - 1 && (
                      <Divider sx={{ mx: { xs: 1.5, sm: 2, md: 3 } }} />
                    )}
                  </React.Fragment>
                )
              })}
            </List>
          )}
        </Paper>
        
        {/* Stats Footer */}
        {!loading && !error && notifications.length > 0 && (
          <Box sx={{ 
            mt: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 1,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1
          }}>
            <Typography variant="body2" color="grey.900">
              Showing <strong>{filteredNotifications.length}</strong> of <strong>{notifications.length}</strong> notifications
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CircleIcon sx={{ fontSize: 8, color: 'error.main' }} />
                <Typography variant="caption" color="text.secondary">
                  <strong>{unreadCount}</strong> unread
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CircleIcon sx={{ fontSize: 8, color: 'success.main' }} />
                <Typography variant="caption" color="text.secondary">
                  <strong>{readCount}</strong> read
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </MainLayout>
  )
}