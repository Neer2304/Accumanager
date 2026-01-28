// components/community/CommunityNavbar.tsx
"use client";

import React, { useState, useEffect } from 'react';
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
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  ListItemButton,
  InputBase,
  Paper,
  useMediaQuery,
  useTheme,
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
  ChatBubbleOutline as ChatIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function CommunityNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data || []);
          setNotificationCount(data.unreadCount || 0);
        }
      } else {
        // Mock notifications for demo
        setNotifications([
          { _id: '1', message: 'New follower: John Doe', createdAt: new Date() },
          { _id: '2', message: 'Your post got 5 likes', createdAt: new Date() },
          { _id: '3', message: 'New comment on your post', createdAt: new Date() },
        ]);
        setNotificationCount(3);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Mock data for demo
      setNotifications([
        { _id: '1', message: 'New follower: John Doe', createdAt: new Date() },
        { _id: '2', message: 'Your post got 5 likes', createdAt: new Date() },
        { _id: '3', message: 'New comment on your post', createdAt: new Date() },
      ]);
      setNotificationCount(3);
    }
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

  const handleNotificationClick = async (notificationId: string) => {
    // Mark as read
    await fetch(`/api/community/notifications/${notificationId}/read`, {
      method: 'PUT',
      credentials: 'include',
    });
    
    // Refresh notifications
    fetchNotifications();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/community/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { label: 'Home', href: '/community', icon: <HomeIcon /> },
    { label: 'Explore', href: '/community/explore', icon: <TrendingIcon /> },
    { label: 'Discussions', href: '/community/discussions', icon: <ForumIcon /> },
    { label: 'Bookmarks', href: '/community/bookmarks', icon: <BookmarkIcon /> },
    { label: 'My Profile', href: '/community/profile', icon: <PersonIcon /> },
  ];

  // Responsive drawer content
  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={user?.avatar}
            sx={{ width: 48, height: 48, border: '2px solid white' }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption">
              {user?.email || 'member@community.com'}
            </Typography>
          </Box>
        </Box>
        
        {/* Mobile Search */}
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: 2,
          }}
        >
          <InputBase
            placeholder="Search community..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              ml: 1,
              flex: 1,
              color: 'white',
              '&::placeholder': {
                color: 'rgba(255,255,255,0.7)',
              },
            }}
          />
          <IconButton type="submit" sx={{ p: '10px', color: 'white' }}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, p: 2 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            sx={{
              mb: 1,
              borderRadius: 2,
              color: pathname === item.href ? 'primary.main' : 'text.primary',
              bgcolor: pathname === item.href ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.12),
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: pathname === item.href ? 'primary.main' : 'inherit',
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: pathname === item.href ? 600 : 400,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Drawer Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <ListItemButton onClick={() => {
          router.push('/settings');
          setMobileOpen(false);
        }}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
        
        <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  // Mobile Search Bar (when search is open)
  const mobileSearchBar = (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      p: 1,
      bgcolor: 'background.paper',
      borderBottom: 1,
      borderColor: 'divider',
    }}>
      <IconButton onClick={() => setSearchOpen(false)}>
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
        }}
      >
        <InputBase
          autoFocus
          placeholder="Search discussions, users, topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
        />
        <IconButton type="submit" sx={{ p: '10px' }}>
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
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
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
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              href="/community"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                textDecoration: 'none',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              <ForumIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              Community
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 1, 
              mx: 3,
              flex: 1,
            }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  startIcon={item.icon}
                  sx={{
                    color: pathname === item.href ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                    minWidth: 'auto',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: pathname === item.href ? 600 : 400,
                    fontSize: '0.875rem',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Desktop Search */}
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
                  bgcolor: alpha('#000', 0.03),
                }}
              >
                <IconButton sx={{ p: '10px' }} onClick={() => document.querySelector('input')?.focus()}>
                  <SearchIcon />
                </IconButton>
                <InputBase
                  placeholder="Search discussions, users, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
                />
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
                sx={{ display: { md: 'none' } }}
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon />
              </IconButton>

              {/* Create Post Button */}
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
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  minWidth: 'auto',
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
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
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
                }}
              >
                <Avatar 
                  sx={{ 
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    border: '2px solid',
                    borderColor: 'background.paper',
                    boxShadow: 1,
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Box>

            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }
              }}
            >
              <MenuItem onClick={() => {
                router.push('/community/profile');
                handleMenuClose();
              }}>
                <PersonIcon sx={{ mr: 2, fontSize: 20 }} /> 
                <Typography variant="body2">My Profile</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                router.push('/settings');
                handleMenuClose();
              }}>
                <SettingsIcon sx={{ mr: 2, fontSize: 20 }} /> 
                <Typography variant="body2">Settings</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => {
                handleLogout();
                handleMenuClose();
              }} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} /> 
                <Typography variant="body2">Logout</Typography>
              </MenuItem>
            </Menu>

            {/* Notifications Menu */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationsClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  width: 320,
                  maxWidth: '90vw',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={600}>
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
                    <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No notifications yet
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {notifications.slice(0, 5).map((notification) => (
                      <MenuItem 
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification._id)}
                        sx={{ 
                          py: 1.5,
                          borderBottom: 1,
                          borderColor: 'divider',
                          '&:last-child': { borderBottom: 0 },
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="body2">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem sx={{ justifyContent: 'center', py: 1.5 }}>
                      <Button 
                        size="small" 
                        onClick={() => {
                          router.push('/community/notifications');
                          handleNotificationsClose();
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