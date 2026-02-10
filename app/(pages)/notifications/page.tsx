// app/(pages)/notifications/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Pagination,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Search,
  FilterList,
  Refresh,
  Delete,
  MarkEmailRead,
  ClearAll,
  CheckCircle,
  Warning,
  Info,
  Error,
  Event,
  Message,
  People,
  NotificationsActive,
  AccessTime,
  Star,
} from '@mui/icons-material'
import { MainLayout } from '@/components/Layout/MainLayout'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Import our Google-themed components
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Chip } from '@/components/ui/Chip'
import { Avatar } from '@/components/ui/Avatar'
import { Select } from '@/components/ui/Select'
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup'
import { ToggleButton } from '@/components/ui/ToggleButton'
import { Switch } from '@/components/ui/Switch'
import { Badge } from '@/components/ui/Badge'
import { Divider } from '@/components/ui/Divider'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import { Collapse } from '@/components/ui/Collapse'

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

// Safe Fade component for SSR
const SafeFade = ({ children, ...props }: any) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <>{children}</>;
  }
  
  return (
    <div style={{ opacity: 1, transition: 'opacity 300ms' }}>
      {children}
    </div>
  );
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [category, setCategory] = useState<CategoryType>('all')
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [bulkActionMode, setBulkActionMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const router = useRouter()
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const darkMode = theme.palette.mode === 'dark'

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
          setSelectedNotifications([])
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

  const handleBack = () => {
    router.back()
  }

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
          setSelectedNotifications(prev => prev.filter(id => id !== notificationId))
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

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
  }

  const handleNotificationClick = (notification: Notification) => {
    if (bulkActionMode) {
      if (selectedNotifications.includes(notification._id)) {
        setSelectedNotifications(prev => prev.filter(id => id !== notification._id))
      } else {
        setSelectedNotifications(prev => [...prev, notification._id])
      }
    } else {
      if (!notification.isRead) {
        handleMarkAsRead(notification._id)
      }
      
      if (notification.actionUrl) {
        router.push(notification.actionUrl)
      }
    }
  }

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
      const categoryMap: Record<CategoryType, string[]> = {
        all: [],
        message: ['message'],
        event: ['event'],
        system: ['system', 'info'],
        alert: ['warning', 'error', 'success']
      }
      if (!categoryMap[category].includes(notification.type)) return false
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower) ||
        notification.type.toLowerCase().includes(searchLower)
      )
    }
    
    return true
  })

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <Message fontSize={isMobile ? 'small' : 'medium'} />
      case 'event':
        return <Event fontSize={isMobile ? 'small' : 'medium'} />
      case 'warning':
        return <Warning fontSize={isMobile ? 'small' : 'medium'} />
      case 'error':
        return <Error fontSize={isMobile ? 'small' : 'medium'} />
      case 'success':
        return <CheckCircle fontSize={isMobile ? 'small' : 'medium'} />
      case 'info':
        return <Info fontSize={isMobile ? 'small' : 'medium'} />
      default:
        return <NotificationsIcon fontSize={isMobile ? 'small' : 'medium'} />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#0d652d'
      case 'warning':
        return '#e37400'
      case 'error':
        return '#d93025'
      case 'message':
        return '#1a73e8'
      case 'event':
        return '#9334e6'
      case 'system':
        return '#5f6368'
      default:
        return '#1a73e8'
    }
  }

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
      minHeight: 300
    }}>
      <NotificationsIcon sx={{ 
        fontSize: { xs: 48, md: 64 }, 
        color: darkMode ? '#5f6368' : '#9aa0a6', 
        mb: 2 
      }} />
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        color={darkMode ? "#e8eaed" : "#202124"}
        gutterBottom
        fontWeight={500}
      >
        No notifications found
      </Typography>
      <Typography 
        variant="body2" 
        color={darkMode ? "#9aa0a6" : "#5f6368"}
        sx={{ maxWidth: 400, mx: 'auto' }}
      >
        {filter !== 'all' || category !== 'all' || showOnlyUnread || searchTerm
          ? 'Try changing your filters to see more notifications'
          : 'You\'re all caught up! All notifications are read.'}
      </Typography>
      {(filter !== 'all' || category !== 'all' || showOnlyUnread || searchTerm) && (
        <Button
          variant="outlined"
          onClick={() => {
            setFilter('all')
            setCategory('all')
            setShowOnlyUnread(false)
            setSearchTerm('')
          }}
          sx={{ mt: 2 }}
        >
          Clear all filters
        </Button>
      )}
    </Box>
  )

  // Custom Notification Item Component
  const NotificationItem = ({ notification, isSelected, bulkActionMode }: { 
    notification: Notification, 
    isSelected: boolean,
    bulkActionMode: boolean 
  }) => {
    const notificationColor = getNotificationColor(notification.type)
    
    return (
      <Card
        hover
        sx={{
          p: 2.5,
          mb: 2,
          borderLeft: `4px solid ${notificationColor}`,
          backgroundColor: isSelected 
            ? alpha(notificationColor, 0.08)
            : notification.isRead 
              ? 'transparent' 
              : alpha(notificationColor, 0.05),
          cursor: bulkActionMode ? 'default' : 'pointer',
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          '&:hover': {
            backgroundColor: isSelected 
              ? alpha(notificationColor, 0.12)
              : alpha(notificationColor, 0.08),
            transform: bulkActionMode ? 'none' : 'translateY(-2px)',
            boxShadow: bulkActionMode ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
          }
        }}
        onClick={() => handleNotificationClick(notification)}
      >
        {/* Selection checkbox for bulk mode */}
        {bulkActionMode && (
          <Box
            sx={{
              position: 'absolute',
              left: 8,
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
                border: `2px solid ${isSelected ? '#1a73e8' : '#dadce0'}`,
                backgroundColor: isSelected ? '#1a73e8' : 'transparent',
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
          <Tooltip title="Unread" placement="top">
            <Box
              sx={{
                position: 'absolute',
                left: 8,
                top: 8,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: notificationColor,
              }}
            />
          </Tooltip>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          ml: bulkActionMode ? 3 : 0,
        }}>
          {/* Icon */}
          <Avatar
            sx={{ 
              bgcolor: alpha(notificationColor, 0.1), 
              color: notificationColor,
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 }
            }}
          >
            {getNotificationIcon(notification.type)}
          </Avatar>
          
          {/* Content */}
          <Box sx={{ flex: 1 }}>
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
                fontWeight={notification.isRead ? 400 : 600}
                color={darkMode ? "#e8eaed" : "#202124"}
                sx={{ flex: 1 }}
              >
                {notification.title}
              </Typography>
              <Chip
                label={notification.type.toUpperCase()}
                size="small"
                sx={{
                  bgcolor: alpha(notificationColor, 0.1),
                  color: notificationColor,
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: 20,
                  px: 1,
                }}
              />
            </Box>
            
            {/* Message */}
            <Typography
              variant="body2"
              color={darkMode ? "#9aa0a6" : "#5f6368"}
              sx={{
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              {notification.message}
            </Typography>
            
            {/* Time and actions */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ fontSize: 14, opacity: 0.7 }} />
                <Typography 
                  variant="caption" 
                  color={darkMode ? "#9aa0a6" : "#5f6368"}
                  sx={{ fontSize: '0.75rem' }}
                >
                  {formatTime(notification.createdAt)}
                </Typography>
              </Box>
              
              {!bulkActionMode && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {!notification.isRead && (
                    <Tooltip title="Mark as read">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification._id)
                        }}
                        sx={{ 
                          color: notificationColor,
                          '&:hover': { bgcolor: alpha(notificationColor, 0.1) }
                        }}
                      >
                        <CheckCircle fontSize="small" />
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
                        color: '#d93025',
                        '&:hover': { bgcolor: alpha('#d93025', 0.1) }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Card>
    )
  }

  return (
    <MainLayout title="Notifications">
      <Box
        sx={{
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          color: darkMode ? "#e8eaed" : "#202124",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderBottom: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
            background: darkMode
              ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
              : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
          }}
        >
          <SafeFade>
            <Breadcrumbs
              sx={{
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
              }}
            >
              <MuiLink
                component={Link}
                href="/dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontWeight: 400,
                  "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
                }}
              >
                <HomeIcon
                  sx={{
                    mr: 0.5,
                    fontSize: { xs: "16px", sm: "18px" },
                  }}
                />
                Dashboard
              </MuiLink>
              <Typography
                color={darkMode ? "#e8eaed" : "#202124"}
                fontWeight={500}
              >
                Notifications
              </Typography>
            </Breadcrumbs>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                fontWeight={500}
                gutterBottom
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Notification Center
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontWeight: 400,
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                  lineHeight: 1.5,
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Stay updated with all your alerts and messages
              </Typography>
            </Box>
          </SafeFade>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
          {/* Error Alert */}
          <SafeFade>
            {error && (
              <Alert
                severity="error"
                title="Error"
                message={error}
                dismissible
                onDismiss={() => setError('')}
                sx={{ mb: 3 }}
              />
            )}
          </SafeFade>

          {/* Bulk Actions Bar */}
          <Collapse in={bulkActionMode && selectedNotifications.length > 0}>
            <Card
              sx={{
                mb: 3,
                p: 2.5,
                bgcolor: darkMode ? '#0d3064' : '#1a73e8',
                color: 'white',
                border: 'none',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={handleBulkMarkAsRead}
                    sx={{ bgcolor: 'white', color: '#1a73e8', '&:hover': { bgcolor: '#f8f9fa' } }}
                  >
                    Mark as read
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Delete />}
                    onClick={handleBulkDelete}
                    sx={{ bgcolor: '#d93025', color: 'white', '&:hover': { bgcolor: '#c5221f' } }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setBulkActionMode(false)
                      setSelectedNotifications([])
                    }}
                    sx={{ 
                      borderColor: 'rgba(255,255,255,0.5)', 
                      color: 'white',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Card>
          </Collapse>

          {/* Stats Cards */}
          <SafeFade>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
              gap: 2, 
              mb: 4,
            }}>
              <Card sx={{ 
                p: 2.5, 
                textAlign: 'center',
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }}>
                <Typography variant="h4" fontWeight={700} color="#1a73e8">
                  {notifications.length}
                </Typography>
                <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                  Total
                </Typography>
              </Card>
              
              <Card sx={{ 
                p: 2.5, 
                textAlign: 'center',
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }}>
                <Typography variant="h4" fontWeight={700} color="#d93025">
                  {unreadCount}
                </Typography>
                <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                  Unread
                </Typography>
              </Card>
              
              <Card sx={{ 
                p: 2.5, 
                textAlign: 'center',
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }}>
                <Typography variant="h4" fontWeight={700} color="#0d652d">
                  {readCount}
                </Typography>
                <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                  Read
                </Typography>
              </Card>
              
              <Card sx={{ 
                p: 2.5, 
                textAlign: 'center',
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }}>
                <Typography variant="h4" fontWeight={700} color="#e37400">
                  {filteredNotifications.length}
                </Typography>
                <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                  Filtered
                </Typography>
              </Card>
            </Box>
          </SafeFade>

          {/* Filters Section */}
          <SafeFade>
            <Card
              title="Filter Notifications"
              subtitle="Find specific notifications by type or search term"
              hover
              sx={{ mb: 4 }}
            >
              <Box sx={{ mb: 3 }}>
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startIcon={<Search />}
                  size="medium"
                  sx={{ flex: 1 }}
                />
              </Box>

              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                alignItems: { xs: 'stretch', sm: 'center' },
              }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color={darkMode ? "#e8eaed" : "#202124"} gutterBottom>
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
                      <Badge badgeContent={notifications.length} color="primary" max={999}>
                        All
                      </Badge>
                    </ToggleButton>
                    <ToggleButton value="unread">
                      <Badge badgeContent={unreadCount} color="error" max={999}>
                        Unread
                      </Badge>
                    </ToggleButton>
                    <ToggleButton value="read">
                      <Badge badgeContent={readCount} color="success" max={999}>
                        Read
                      </Badge>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color={darkMode ? "#e8eaed" : "#202124"} gutterBottom>
                    Filter by type
                  </Typography>
                  <Select
                    size="small"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    options={[
                      { value: 'all', label: 'All Types' },
                      { value: 'message', label: 'Messages' },
                      { value: 'event', label: 'Events' },
                      { value: 'system', label: 'System' },
                      { value: 'alert', label: 'Alerts' },
                    ]}
                    sx={{ minWidth: 140 }}
                  />
                </Box>
                
                <Box>
                  <Switch
                    checked={showOnlyUnread}
                    onChange={(e) => setShowOnlyUnread(e.target.checked)}
                    label="Show unread only"
                  />
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mt: 3,
                flexWrap: 'wrap'
              }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={fetchNotifications}
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<MarkEmailRead />}
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearAll />}
                  onClick={handleDeleteAllRead}
                  disabled={readCount === 0}
                  color="error"
                >
                  Delete all read
                </Button>
                <Button
                  variant={bulkActionMode ? "contained" : "outlined"}
                  onClick={() => {
                    setBulkActionMode(!bulkActionMode)
                    if (bulkActionMode) setSelectedNotifications([])
                  }}
                  color="secondary"
                >
                  {bulkActionMode ? 'Cancel Bulk' : 'Bulk Actions'}
                </Button>
              </Box>
            </Card>
          </SafeFade>

          {/* Notifications List */}
          <SafeFade>
            <Card
              title="Your Notifications"
              subtitle={`Showing ${filteredNotifications.length} notifications`}
              hover={false}
              sx={{ mb: 3 }}
            >
              {loading ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  p: 6,
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <CircularProgress size={isMobile ? 40 : 60} sx={{ color: '#1a73e8' }} />
                  <Typography variant="body1" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                    Loading notifications...
                  </Typography>
                </Box>
              ) : filteredNotifications.length === 0 ? (
                <EmptyState />
              ) : (
                <Box>
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
                          <Divider sx={{ my: 2 }} />
                        )}
                      </React.Fragment>
                    )
                  })}
                </Box>
              )}
            </Card>
          </SafeFade>

          {/* Stats Footer */}
          <SafeFade>
            {!loading && !error && notifications.length > 0 && (
              <Card sx={{ 
                p: 2.5,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Typography variant="body2" color={darkMode ? "#e8eaed" : "#202124"}>
                    Showing <strong>{filteredNotifications.length}</strong> of <strong>{notifications.length}</strong> notifications
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#d93025' }} />
                      <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                        <strong>{unreadCount}</strong> unread
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0d652d' }} />
                      <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                        <strong>{readCount}</strong> read
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            )}
          </SafeFade>
        </Container>
      </Box>
    </MainLayout>
  )
}