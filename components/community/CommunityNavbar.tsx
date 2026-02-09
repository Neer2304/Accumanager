// components/community/CommunityNavbar.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  ListItemButton,
  InputBase,
  Paper,
  useMediaQuery,
  useTheme,
  CircularProgress,
  ListItemAvatar,
  Chip,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Forum as ForumIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Close as CloseIcon,
  TrendingUp as TrendingIcon,
  BookmarkBorder as BookmarkIcon,
  Favorite as FavoriteIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Comment as CommentIcon,
  People as PeopleIcon2,
  Explore,
  AccountCircle,
  Groups,
  ChatBubbleOutline,
  BookmarkBorder,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface CommunityUser {
  _id: string;
  communityUserId: string;
  name: string;
  email?: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role?: string;
  businessName?: string;
  shopName?: string;
  followerCount: number;
  followingCount: number;
  isVerified: boolean;
  createdAt: string;
}

interface CommunityNotification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'follow' | 'like' | 'comment';
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    postId?: string;
    commentId?: string;
    userId?: string;
    communityUserId?: string;
    likeCount?: number;
    commentCount?: number;
  };
  createdAt: string;
  readAt?: string;
}

export default function CommunityNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const darkMode = theme.palette.mode === 'dark';
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [user, setUser] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CommunityUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch user data and notifications
  useEffect(() => {
    fetchUserData();
    fetchNotifications();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/community/notifications', {
        credentials: 'include',
      });
      
      console.log('Notifications response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Notifications data:', data);
        
        if (data.success) {
          const notificationsData = data.data || [];
          setNotifications(notificationsData);
          const unreadCount = notificationsData.filter((n: CommunityNotification) => !n.isRead).length;
          setNotificationCount(unreadCount);
        } else {
          // No notifications yet
          setNotifications([]);
          setNotificationCount(0);
        }
      } else {
        // No notifications or error
        setNotifications([]);
        setNotificationCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
      setNotificationCount(0);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      console.log('Searching for users:', query);
      
      const response = await fetch(`/api/community/users/search?q=${encodeURIComponent(query)}&limit=5`, {
        credentials: 'include',
      });

      console.log('Search response status:', response.status);
      
      const data = await response.json();
      console.log('Search response data:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Search failed');
      }

      setSearchResults(data.data || []);
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error instanceof Error ? error.message : 'Failed to search users');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search handler
  const handleSearchChange = (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(query);
    }, 300);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleSearchOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNotificationClick = async (notification: CommunityNotification) => {
    try {
      // Mark as read
      const response = await fetch(`/api/community/notifications/${notification._id}/read`, {
        method: 'PUT',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Navigate if there's an action URL
        if (notification.actionUrl) {
          router.push(notification.actionUrl);
        } else if (notification.metadata?.postId) {
          router.push(`/community/post/${notification.metadata.postId}`);
        } else if (notification.metadata?.communityUserId) {
          router.push(`/community/profile/${notification.metadata.communityUserId}`);
        }
        
        // Refresh notifications
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to handle notification:', error);
    }
    
    setNotificationAnchorEl(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/community/explore?search=${encodeURIComponent(searchQuery)}`);
      handleSearchClose();
      setSearchOpen(false);
    }
  };

  const handleUserClick = (communityUserId: string) => {
    router.push(`/community/profile/${communityUserId}`);
    handleSearchClose();
    if (isMobile) setSearchOpen(false);
  };

  const getNotificationIcon = (type: CommunityNotification['type']) => {
    switch (type) {
      case 'success':
      case 'like':
        return <FavoriteIcon color="success" fontSize="small" />;
      case 'warning':
        return <NotificationsIcon color="warning" fontSize="small" />;
      case 'error':
        return <PersonRemoveIcon color="error" fontSize="small" />;
      case 'follow':
        return <PersonAddIcon color="info" fontSize="small" />;
      case 'comment':
        return <CommentIcon color="info" fontSize="small" />;
      default:
        return <NotificationsIcon color="info" fontSize="small" />;
    }
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Google-style navigation items
  const navItems = [
    { label: 'Home', href: '/community', icon: <HomeIcon /> },
    { label: 'Explore', href: '/community/explore', icon: <Explore /> },
    { label: 'Discussions', href: '/community/discussions', icon: <ForumIcon /> },
    { label: 'Members', href: '/community/members', icon: <Groups /> },
    { label: 'Bookmarks', href: '/community/bookmarks', icon: <BookmarkBorder /> },
  ];

  // Responsive drawer content with Google theme
  const drawer = (
    <Box sx={{ 
      width: 280, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
    }}>
      {/* Drawer Header - Google style */}
      <Box sx={{ 
        p: 3, 
        bgcolor: darkMode ? '#303134' : '#f8f9fa',
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={user?.avatar}
            sx={{ 
              width: 48, 
              height: 48, 
              border: `2px solid ${darkMode ? '#5f6368' : '#ffffff'}`,
              bgcolor: darkMode ? '#5f6368' : '#4285f4',
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {user?.email || 'member@community.com'}
            </Typography>
          </Box>
        </Box>
        
        {/* Mobile Search - Google style */}
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            bgcolor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#5f6368' : '#dadce0'}`,
            borderRadius: 2,
            '&:hover': {
              borderColor: darkMode ? '#8ab4f8' : '#4285f4',
              boxShadow: darkMode 
                ? '0 1px 3px rgba(138, 180, 248, 0.2)' 
                : '0 1px 3px rgba(66, 133, 244, 0.2)',
            },
          }}
        >
          <IconButton sx={{ p: '10px', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearchChange(e.target.value);
            }}
            sx={{
              ml: 1,
              flex: 1,
              color: darkMode ? '#e8eaed' : '#202124',
              '&::placeholder': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          />
        </Paper>
      </Box>

      {/* Navigation Items - Google style */}
      <List sx={{ flex: 1, p: 2 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              sx={{
                mb: 1,
                borderRadius: 2,
                color: isActive 
                  ? '#4285f4' 
                  : darkMode ? '#e8eaed' : '#202124',
                bgcolor: isActive 
                  ? alpha('#4285f4', darkMode ? 0.2 : 0.1)
                  : 'transparent',
                '&:hover': {
                  bgcolor: alpha('#4285f4', darkMode ? 0.15 : 0.08),
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive ? '#4285f4' : darkMode ? '#9aa0a6' : '#5f6368',
                minWidth: 40,
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.875rem',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Drawer Footer - Google style */}
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        bgcolor: darkMode ? '#202124' : '#ffffff',
      }}>
        <ListItemButton 
          onClick={() => {
            if (user?._id) {
              router.push(`/community/profile/${user._id}`);
            } else {
              router.push('/settings');
            }
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: 2,
            mb: 1,
            '&:hover': {
              bgcolor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
            },
          }}
        >
          <ListItemIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText 
            primary="My Profile" 
            primaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </ListItemButton>
        
        <ListItemButton 
          onClick={() => {
            router.push('/settings');
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: 2,
            mb: 1,
            '&:hover': {
              bgcolor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
            },
          }}
        >
          <ListItemIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Settings" 
            primaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </ListItemButton>
        
        <ListItemButton 
          onClick={handleLogout} 
          sx={{ 
            borderRadius: 2,
            color: '#ea4335',
            '&:hover': {
              bgcolor: alpha('#ea4335', darkMode ? 0.1 : 0.05),
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ea4335' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  // Mobile Search Bar (when search is open) - Google style
  const mobileSearchBar = (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      p: 1,
      bgcolor: darkMode ? '#202124' : '#ffffff',
      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      <IconButton 
        onClick={() => {
          setSearchOpen(false);
          setSearchQuery('');
          setSearchResults([]);
        }}
        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
      >
        <CloseIcon />
      </IconButton>
      <Paper
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          borderRadius: 2,
          bgcolor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#5f6368' : '#dadce0'}`,
          '&:hover': {
            borderColor: darkMode ? '#8ab4f8' : '#4285f4',
          },
        }}
      >
        <InputBase
          autoFocus
          placeholder="Search users by name or business..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearchChange(e.target.value);
          }}
          sx={{ 
            ml: 1, 
            flex: 1,
            color: darkMode ? '#e8eaed' : '#202124',
            '&::placeholder': {
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
        />
        <IconButton 
          type="submit" 
          sx={{ 
            p: '10px',
            color: darkMode ? '#9aa0a6' : '#5f6368',
          }}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0}
        sx={{
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          bgcolor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        {searchOpen && isMobile ? (
          mobileSearchBar
        ) : (
          <Toolbar sx={{ 
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMobileDrawerToggle}
              sx={{ 
                mr: { xs: 1, sm: 2 },
                display: { md: 'none' },
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo - Google style */}
            <Typography
              variant="h6"
              component={Link}
              href="/community"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                textDecoration: 'none',
                color: '#4285f4',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: 500,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              <ForumIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              Community
            </Typography>

            {/* Desktop Navigation - Google style */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 1, 
              mx: 3,
              flex: 1,
            }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.label}
                    component={Link}
                    href={item.href}
                    startIcon={item.icon}
                    sx={{
                      color: isActive 
                        ? '#4285f4' 
                        : darkMode ? '#e8eaed' : '#202124',
                      bgcolor: isActive 
                        ? alpha('#4285f4', darkMode ? 0.2 : 0.1)
                        : 'transparent',
                      '&:hover': {
                        bgcolor: alpha('#4285f4', darkMode ? 0.15 : 0.08),
                      },
                      minWidth: 'auto',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            {/* Desktop Search - Google style */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              flex: 1,
              maxWidth: 400,
              mr: 2,
            }}>
              <Paper
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  borderRadius: 3,
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#5f6368' : '#dadce0'}`,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#4285f4',
                    boxShadow: darkMode 
                      ? '0 1px 3px rgba(138, 180, 248, 0.2)' 
                      : '0 1px 3px rgba(66, 133, 244, 0.2)',
                  },
                  '&:focus-within': {
                    borderColor: darkMode ? '#8ab4f8' : '#4285f4',
                    boxShadow: darkMode 
                      ? '0 1px 6px rgba(138, 180, 248, 0.3)' 
                      : '0 1px 6px rgba(66, 133, 244, 0.3)',
                  },
                }}
              >
                <IconButton 
                  sx={{ 
                    p: '10px',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  <SearchIcon />
                </IconButton>
                <InputBase
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearchChange(e.target.value);
                  }}
                  sx={{ 
                    ml: 1, 
                    flex: 1, 
                    fontSize: '0.875rem',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&::placeholder': {
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    },
                  }}
                />
                {searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    sx={{ 
                      mr: 0.5,
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1 },
            }}>
              {/* Mobile Search Button */}
              <IconButton
                sx={{ 
                  display: { md: 'none' },
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon />
              </IconButton>

              {/* Create Post Button - Google style */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/community/create')}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  borderRadius: 3,
                  px: { sm: 2, md: 3 },
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  minWidth: 'auto',
                  backgroundColor: '#4285f4',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#3367d6',
                    boxShadow: '0 4px 12px rgba(66, 133, 244, 0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                  Create Post
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                  Post
                </Box>
              </Button>
              
              {/* Mobile Create Post Button */}
              <IconButton
                sx={{ 
                  display: { xs: 'flex', sm: 'none' },
                  bgcolor: '#4285f4',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: '#3367d6',
                  },
                }}
                onClick={() => router.push('/community/create')}
              >
                <AddIcon />
              </IconButton>

              {/* Notifications */}
              <IconButton
                onClick={handleNotificationsOpen}
                sx={{ 
                  position: 'relative',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    bgcolor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                  },
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    minWidth: 16,
                    height: 16,
                    p: 0,
                  }
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon fontSize={isMobile ? 'medium' : 'small'} />
                </Badge>
              </IconButton>

              {/* User Profile */}
              <IconButton 
                onClick={handleProfileMenuOpen}
                sx={{ 
                  p: 0.5,
                  ml: { xs: 0, sm: 0.5 },
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                <Avatar 
                  src={user?.avatar}
                  sx={{ 
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    border: '2px solid',
                    borderColor: darkMode ? '#3c4043' : '#ffffff',
                    bgcolor: darkMode ? '#5f6368' : '#4285f4',
                    boxShadow: darkMode 
                      ? '0 2px 4px rgba(0,0,0,0.3)' 
                      : '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Box>

            {/* Profile Menu - Google style */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  bgcolor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: darkMode 
                    ? '0 4px 20px rgba(0,0,0,0.3)' 
                    : '0 4px 20px rgba(0,0,0,0.1)',
                }
              }}
            >
              <MenuItem 
                onClick={() => {
                  if (user?._id) {
                    router.push(`/community/profile/${user._id}`);
                  } else {
                    router.push('/settings');
                  }
                  handleMenuClose();
                }}
                sx={{
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    bgcolor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                  },
                }}
              >
                <PersonIcon sx={{ mr: 2, fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} /> 
                <Typography variant="body2">My Profile</Typography>
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  router.push('/settings');
                  handleMenuClose();
                }}
                sx={{
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    bgcolor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                  },
                }}
              >
                <SettingsIcon sx={{ mr: 2, fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} /> 
                <Typography variant="body2">Settings</Typography>
              </MenuItem>
              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
              <MenuItem 
                onClick={() => {
                  handleLogout();
                  handleMenuClose();
                }} 
                sx={{ 
                  color: '#ea4335',
                  '&:hover': {
                    bgcolor: alpha('#ea4335', darkMode ? 0.1 : 0.05),
                  },
                }}
              >
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} /> 
                <Typography variant="body2">Logout</Typography>
              </MenuItem>
            </Menu>

            {/* Search Results Menu - Google style */}
            <Menu
              anchorEl={searchAnchorEl}
              open={Boolean(searchAnchorEl)}
              onClose={handleSearchClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  width: 320,
                  maxWidth: '90vw',
                  borderRadius: 2,
                  bgcolor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: darkMode 
                    ? '0 4px 20px rgba(0,0,0,0.3)' 
                    : '0 4px 20px rgba(0,0,0,0.1)',
                  maxHeight: 400,
                }
              }}
            >
              <Box sx={{ 
                p: 2, 
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
              }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Search Users
                </Typography>
                {searchQuery && (
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Results for "{searchQuery}"
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ maxHeight: 300, overflow: 'auto', p: 1 }}>
                {searchLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={24} sx={{ color: '#4285f4' }} />
                  </Box>
                ) : searchError ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Alert severity="error" sx={{ mb: 1 }}>
                      {searchError}
                    </Alert>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Please try again
                    </Typography>
                  </Box>
                ) : searchResults.length === 0 && searchQuery ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <PeopleIcon2 sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      No users found
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Try different keywords
                    </Typography>
                  </Box>
                ) : (
                  searchResults.map((user) => (
                    <MenuItem 
                      key={user.communityUserId || user._id}
                      onClick={() => handleUserClick(user.communityUserId || user._id)}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 1,
                        mb: 0.5,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          bgcolor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={user.avatar}
                          sx={{ 
                            width: 40, 
                            height: 40,
                            bgcolor: darkMode ? '#5f6368' : '#4285f4',
                          }}
                        >
                          {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {user.name || user.username}
                          </Typography>
                          {user.isVerified && (
                            <Chip
                              label="Verified"
                              size="small"
                              color="success"
                              sx={{ 
                                height: 18, 
                                fontSize: '0.6rem',
                                bgcolor: '#34a853',
                                color: '#ffffff',
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} display="block">
                          @{user.username}
                        </Typography>
                        {user.bio && (
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} display="block" noWrap>
                            {user.bio.substring(0, 40)}...
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {user.followerCount || 0} followers
                          </Typography>
                          {user.location && (
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              • {user.location}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Box>
              
              {searchResults.length > 0 && (
                <Box sx={{ 
                  p: 1, 
                  borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                }}>
                  <Button 
                    fullWidth
                    size="small" 
                    onClick={() => {
                      router.push(`/community/explore?search=${encodeURIComponent(searchQuery)}`);
                      handleSearchClose();
                    }}
                    sx={{
                      color: '#4285f4',
                      '&:hover': {
                        bgcolor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                      },
                    }}
                  >
                    View All Results ({searchResults.length})
                  </Button>
                </Box>
              )}
            </Menu>

            {/* Community Notifications Menu - Google style */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationsClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  width: 380,
                  maxWidth: '90vw',
                  borderRadius: 2,
                  bgcolor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: darkMode 
                    ? '0 4px 20px rgba(0,0,0,0.3)' 
                    : '0 4px 20px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ 
                p: 2, 
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
              }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Notifications
                  {notificationCount > 0 && (
                    <Badge 
                      badgeContent={notificationCount} 
                      color="error" 
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
              </Box>
              
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {notifications.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <NotificationsIcon sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      No notifications yet
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Your community activity will appear here
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {notifications.map((notification) => (
                      <MenuItem 
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        sx={{ 
                          py: 2,
                          px: 2,
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          bgcolor: notification.isRead ? 'inherit' : alpha('#4285f4', darkMode ? 0.1 : 0.04),
                          '&:last-child': { borderBottom: 0 },
                          '&:hover': {
                            bgcolor: alpha('#4285f4', darkMode ? 0.15 : 0.08),
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: alpha('#4285f4', 0.1),
                          }}>
                            {getNotificationIcon(notification.type)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {notification.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}>
                              {notification.message}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {formatNotificationDate(notification.createdAt)}
                              </Typography>
                              {!notification.isRead && (
                                <Box sx={{ 
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: '#4285f4',
                                }} />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                    <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                    <MenuItem sx={{ justifyContent: 'center', py: 1.5 }}>
                      <Button 
                        size="small" 
                        onClick={() => {
                          router.push('/community/notifications');
                          handleNotificationsClose();
                        }}
                        sx={{
                          color: '#4285f4',
                          '&:hover': {
                            bgcolor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                          },
                        }}
                      >
                        View All Notifications
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Menu>
          </Toolbar>
        )}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}