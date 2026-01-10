// components/layout/Header.tsx - UPDATED
'use client'

import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography as MuiTypography,
  Button,
  CircularProgress,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Circle as CircleIcon,
  MarkEmailRead as MarkReadIcon,
  Dashboard,
  HelpCenter,
} from '@mui/icons-material'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/contexts/UserContext' // Add this import
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title?: string
  onMenuClick?: () => void
}

interface Notification {
  _id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

export const Header: React.FC<HeaderProps> = ({ title = 'Dashboard', onMenuClick }) => {
  const { mode, toggleTheme } = useTheme()
  const { user: authUser, logout } = useAuth()
  const { user: contextUser, isLoading } = useUser() // Get user from context
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Use context user first, then auth user as fallback
  const user = contextUser || authUser

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true)
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
          const unread = (result.data || []).filter((n: Notification) => !n.isRead).length
          setUnreadCount(unread)
        } else {
          console.error('Failed to fetch notifications:', result.message)
        }
      } else if (res.status === 401) {
        console.log('Unauthorized - user might be logged out')
      } else {
        console.error('Failed to fetch notifications:', res.status)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget)
    // Refresh notifications when opening the menu
    fetchNotifications()
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null)
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
          // Update local state
          setNotifications(prev => 
            prev.map(n => 
              n._id === notificationId ? { ...n, isRead: true } : n
            )
          )
          setUnreadCount(prev => Math.max(0, prev - 1))
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
          // Update all notifications to read
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
          setUnreadCount(0)
        }
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id)
    }
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
    
    handleNotificationMenuClose()
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      logout()
      handleProfileMenuClose()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getNotificationColor = (type: string) => {
    const colors = {
      info: '#2196f3',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
    }
    return colors[type as keyof typeof colors] || '#2196f3'
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
    return date.toLocaleDateString()
  }

  // Helper function to get user's first letter for avatar
  const getAvatarLetter = () => {
    if (!user) return 'U'
    
    if (user.name) {
      return user.name.charAt(0).toUpperCase()
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    
    return 'U'
  }

  // Helper function to get display name
  const getDisplayName = () => {
    if (!user) return 'User'
    return user.name || user.email?.split('@')[0] || 'User'
  }

  return (
    <AppBar 
      position="fixed" 
      elevation={1}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Side - Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="h1" fontWeight="600">
            {title}
          </Typography>
        </Box>

        {/* Right Side - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            {mode === 'light' ? <DarkIcon /> : <LightIcon />}
          </IconButton>

          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotificationMenuOpen}
            sx={{
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Profile */}
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                borderRadius: '8px',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem'
                }}
              >
                {getAvatarLetter()}
              </Avatar>
            </IconButton>
          )}

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 380,
                maxHeight: 400,
                borderRadius: '12px',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* Notifications Header */}
            <Box sx={{ p: 2, pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MuiTypography variant="h6" fontWeight="600">
                  Notifications
                </MuiTypography>
                {unreadCount > 0 && (
                  <Button 
                    size="small" 
                    startIcon={<MarkReadIcon />}
                    onClick={handleMarkAllAsRead}
                    disabled={loading}
                  >
                    Mark all read
                  </Button>
                )}
              </Box>
              {unreadCount > 0 && (
                <MuiTypography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </MuiTypography>
              )}
            </Box>
            
            <Divider />
            
            {/* Notifications List */}
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {loading ? (
                <MenuItem disabled>
                  <MuiTypography variant="body2" color="text.secondary">
                    Loading notifications...
                  </MuiTypography>
                </MenuItem>
              ) : notifications.length === 0 ? (
                <MenuItem disabled>
                  <MuiTypography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%', py: 2 }}>
                    No notifications
                  </MuiTypography>
                </MenuItem>
              ) : (
                <List sx={{ p: 0 }}>
                  {notifications.slice(0, 10).map((notification) => (
                    <ListItem
                      key={notification._id}
                      sx={{
                        borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
                        cursor: 'pointer',
                        backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        },
                        py: 1.5,
                        px: 2
                      }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                          {!notification.isRead && (
                            <CircleIcon 
                              sx={{ 
                                fontSize: 8, 
                                color: getNotificationColor(notification.type),
                                mt: 0.75,
                                flexShrink: 0
                              }} 
                            />
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <MuiTypography 
                              variant="subtitle2" 
                              fontWeight={notification.isRead ? 'normal' : '600'}
                              sx={{ lineHeight: 1.3 }}
                            >
                              {notification.title}
                            </MuiTypography>
                            <MuiTypography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                lineHeight: 1.4,
                                mt: 0.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {notification.message}
                            </MuiTypography>
                            <MuiTypography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ mt: 0.5, display: 'block' }}
                            >
                              {formatTime(notification.createdAt)}
                            </MuiTypography>
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            {/* View All Notifications */}
            {notifications.length > 0 && (
              <>
                <Divider />
                <MenuItem 
                  onClick={() => {
                    router.push('/notifications')
                    handleNotificationMenuClose()
                  }}
                  sx={{ justifyContent: 'center' }}
                >
                  <MuiTypography variant="body2" color="primary">
                    View all notifications
                  </MuiTypography>
                </MenuItem>
              </>
            )}
          </Menu>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: '12px',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              onClick={() => {
                router.push('/profile')
                handleProfileMenuClose()
              }}
            >
              <AccountIcon sx={{ mr: 2, fontSize: 20 }} />
              Profile
            </MenuItem>
            <MenuItem 
              onClick={() => {
                router.push('/settings')
                handleProfileMenuClose()
              }}
            >
              <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
              Settings
            </MenuItem>
            <MenuItem 
              onClick={() => {
                router.push('/dashboard')
                handleProfileMenuClose()
              }}
            >
              <Dashboard sx={{ mr: 2, fontSize: 20 }} />
              Dashboard
            </MenuItem>
            <MenuItem 
              onClick={() => {
                router.push('/help-support')
                handleProfileMenuClose()
              }}
            >
              <HelpCenter sx={{ mr: 2, fontSize: 20 }} />
              Help & Support
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={handleLogout} 
              sx={{ color: 'error.main' }}
            >
              <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}