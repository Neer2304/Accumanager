"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useScrollTrigger,
  Slide,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  alpha,
  Badge,
  Typography as MuiTypography,
  CircularProgress,
  Fade,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard,
  AccountCircle,
  ExitToApp,
  Settings,
  Person,
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  Circle as CircleIcon,
  HelpCenter,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';

interface Props {
  children: React.ReactElement;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

function HideOnScroll(props: Props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export const LandingHeader: React.FC = () => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const isLarge = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Determine if mobile (xs, sm) vs tablet (md) vs desktop (lg and up)
  const isMobile = isSmall;
  const isTablet = !isSmall && isMedium;
  const isDesktop = !isMedium;

  const { mode, toggleTheme } = useThemeContext();
  const darkMode = mode === 'dark';

  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    router.push("/");
  };

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      setNotificationsLoading(true);
      const res = await fetch("/api/notifications", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setNotifications(result.data || []);
          const unread = (result.data || []).filter(
            (n: Notification) => !n.isRead,
          ).length;
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setNotifications((prev) =>
            prev.map((n) =>
              n._id === notificationId ? { ...n, isRead: true } : n,
            ),
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAll: true }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }

    handleNotificationMenuClose();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const getNotificationColor = (type: string) => {
    const colors = {
      info: "#4285f4",
      success: "#34a853",
      warning: "#fbbc05",
      error: "#ea4335",
    };
    return colors[type as keyof typeof colors] || "#4285f4";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const menuItems = [
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const userMenuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Dashboard fontSize="small" />,
    },
    { name: "Profile", href: "/profile", icon: <Person fontSize="small" /> },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings fontSize="small" />,
    },
    {
      name: "Help & Support",
      href: "/help-support",
      icon: <HelpCenter fontSize="small" />,
    },
  ];

  // Helper function for responsive font sizes
  const getResponsiveFontSize = () => {
    if (isXSmall) return '0.75rem';
    if (isSmall) return '0.85rem';
    if (isMedium) return '0.9rem';
    return '0.95rem';
  };

  // Helper function for responsive icon sizes
  const getResponsiveIconSize = () => {
    if (isXSmall) return 'small';
    if (isSmall) return 'small';
    return 'medium';
  };

  // Helper function for responsive spacing
  const getResponsiveSpacing = () => {
    if (isXSmall) return 0.5;
    if (isSmall) return 1;
    if (isMedium) return 1.5;
    return 2;
  };

  const drawer = (
    <Box
      sx={{
        width: { xs: '100%', sm: 320 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant={isXSmall ? "body1" : "h6"}
          component={Link}
          href="/"
          onClick={handleDrawerToggle}
          sx={{
            fontWeight: 600,
            color: darkMode ? '#e8eaed' : '#202124',
            textDecoration: "none",
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
          }}
        >
          AccumaManage
        </Typography>
        <IconButton 
          onClick={handleDrawerToggle} 
          size={isXSmall ? "small" : "medium"}
          sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
        >
          <CloseIcon fontSize={isXSmall ? "small" : "medium"} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", p: { xs: 1.5, sm: 2 } }}>
        {isAuthenticated ? (
          <>
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                mb: { xs: 2, sm: 3 },
                borderRadius: { xs: '8px', sm: '12px' },
                backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }}
            >
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: { xs: 1, sm: 2 }, 
                mb: 1 
              }}>
                <Avatar
                  sx={{
                    width: { xs: 36, sm: 44, md: 48 },
                    height: { xs: 36, sm: 44, md: 48 },
                    backgroundColor: '#4285f4',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {user?.name?.charAt(0) || <AccountCircle />}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant={isXSmall ? "body2" : "subtitle1"} 
                    fontWeight={500} 
                    noWrap
                    sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' } }}
                  >
                    {user?.name || "User"}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    noWrap
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}
                  >
                    {user?.email || "Welcome back!"}
                  </Typography>
                </Box>
              </Box>
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} unread`}
                  size={isXSmall ? "small" : "medium"}
                  sx={{ 
                    mt: 1,
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    height: { xs: 24, sm: 28 }
                  }}
                  onClick={handleNotificationMenuOpen}
                  clickable
                />
              )}
            </Box>

            <List dense>
              {userMenuItems.map((item) => (
                <ListItem
                  key={item.name}
                  component={Link}
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: { xs: '6px', sm: '8px' },
                    mb: { xs: 0.5, sm: 1 },
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1, sm: 1.5 },
                    "&:hover": {
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    },
                  }}
                >
                  <Box sx={{ 
                    mr: { xs: 1, sm: 2 }, 
                    color: '#4285f4',
                    '& svg': {
                      fontSize: { xs: '1rem', sm: '1.125rem' }
                    }
                  }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      fontWeight: 500,
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ 
              my: { xs: 1.5, sm: 2 }, 
              borderColor: darkMode ? '#3c4043' : '#dadce0' 
            }} />

            <Box sx={{ 
              px: { xs: 1.5, sm: 2 }, 
              py: { xs: 1, sm: 1.5 }, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <Typography 
                variant="body2" 
                color={darkMode ? '#9aa0a6' : '#5f6368'}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}
              >
                Theme
              </Typography>
              <IconButton
                onClick={toggleTheme}
                size={isXSmall ? "small" : "medium"}
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>

            <Divider sx={{ 
              my: { xs: 1.5, sm: 2 }, 
              borderColor: darkMode ? '#3c4043' : '#dadce0' 
            }} />

            <Button
              variant="outlined"
              fullWidth
              startIcon={<ExitToApp fontSize={isXSmall ? "small" : "medium"} />}
              onClick={handleLogout}
              sx={{
                mt: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 0.75, md: 1 },
                px: { xs: 1, sm: 2 },
                borderRadius: { xs: '16px', sm: '20px' },
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                minHeight: { xs: 36, sm: 40 },
                '&:hover': {
                  borderColor: darkMode ? '#5f6368' : '#4285f4',
                  backgroundColor: darkMode ? 'rgba(66, 133, 244, 0.1)' : 'rgba(66, 133, 244, 0.04)',
                }
              }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <List dense>
              {menuItems.map((item) => (
                <ListItem
                  key={item.name}
                  component="a"
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: { xs: '6px', sm: '8px' },
                    mb: { xs: 0.5, sm: 1 },
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1, sm: 1.5 },
                    "&:hover": {
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                      fontWeight: 500,
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ 
              px: { xs: 1.5, sm: 2 }, 
              py: { xs: 1, sm: 1.5 }, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <Typography 
                variant="body2" 
                color={darkMode ? '#9aa0a6' : '#5f6368'}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}
              >
                Theme
              </Typography>
              <IconButton
                onClick={toggleTheme}
                size={isXSmall ? "small" : "medium"}
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>

            <Box
              sx={{ 
                mt: { xs: 3, sm: 4 }, 
                display: "flex", 
                flexDirection: "column", 
                gap: { xs: 1, sm: 1.5 } 
              }}
            >
              <Button
                variant="contained"
                fullWidth
                component={Link}
                href="/dashboard"
                onClick={handleDrawerToggle}
                sx={{
                  py: { xs: 0.625, sm: 0.75, md: 1 },
                  px: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.95rem" },
                  backgroundColor: '#4285f4',
                  color: "white",
                  borderRadius: { xs: '16px', sm: '20px' },
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: { xs: 36, sm: 40 },
                  "&:hover": {
                    backgroundColor: '#3367d6',
                  },
                }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/login"
                onClick={handleDrawerToggle}
                sx={{
                  py: { xs: 0.625, sm: 0.75, md: 1 },
                  px: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.95rem" },
                  borderRadius: { xs: '16px', sm: '20px' },
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  minHeight: { xs: 36, sm: 40 },
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#4285f4',
                    backgroundColor: darkMode ? 'rgba(66, 133, 244, 0.1)' : 'rgba(66, 133, 244, 0.04)',
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: darkMode 
              ? alpha('#202124', 0.98)
              : alpha('#ffffff', 0.98),
            backdropFilter: "blur(20px)",
            color: darkMode ? '#e8eaed' : '#202124',
            boxShadow: darkMode 
              ? '0 1px 2px rgba(0,0,0,0.2)'
              : '0 1px 2px rgba(0,0,0,0.06)',
            borderBottom: darkMode 
              ? '1px solid #3c4043'
              : '1px solid #dadce0',
          }}
        >
          <Container 
            maxWidth="xl" 
            sx={{ 
              px: { 
                xs: 1, 
                sm: 2, 
                md: 3 
              } 
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                justifyContent: "space-between",
                py: { xs: 0.5, sm: 1 },
                gap: { xs: 0.5, sm: 1 },
                minHeight: { xs: '56px', sm: '64px' },
              }}
            >
              {/* Logo */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.75, sm: 1, md: 1.5 },
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    width: { xs: 28, sm: 32, md: 36 },
                    height: { xs: 28, sm: 32, md: 36 },
                    borderRadius: { xs: '6px', sm: '8px' },
                    backgroundColor: '#4285f4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                    flexShrink: 0,
                  }}
                >
                  A
                </Box>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component={Link}
                  href="/"
                  sx={{
                    fontWeight: 600,
                    color: darkMode ? '#e8eaed' : '#202124',
                    textDecoration: "none",
                    fontSize: {
                      xs: "0.95rem",
                      sm: "1.1rem",
                      md: "1.25rem",
                      lg: "1.5rem",
                    },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  AccumaManage
                </Typography>
              </Box>

              {/* Right Side Actions */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.25, sm: 0.5, md: 1 },
                }}
              >
                {/* Theme Toggle */}
                <Fade in>
                  <IconButton
                    onClick={toggleTheme}
                    size={getResponsiveIconSize()}
                    sx={{
                      color: darkMode ? '#e8eaed' : '#5f6368',
                      p: { xs: 0.5, sm: 0.75 },
                      "&:hover": {
                        backgroundColor: darkMode 
                          ? 'rgba(255,255,255,0.08)' 
                          : 'rgba(0,0,0,0.03)',
                      },
                    }}
                  >
                    {darkMode ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                </Fade>

                {/* Notifications Icon */}
                {isAuthenticated && (
                  <Fade in>
                    <IconButton
                      onClick={handleNotificationMenuOpen}
                      size={getResponsiveIconSize()}
                      sx={{
                        color: darkMode ? '#e8eaed' : '#5f6368',
                        p: { xs: 0.5, sm: 0.75 },
                        "&:hover": {
                          backgroundColor: darkMode 
                            ? 'rgba(255,255,255,0.08)' 
                            : 'rgba(0,0,0,0.03)',
                        },
                      }}
                    >
                      <Badge 
                        badgeContent={unreadCount} 
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            height: { xs: 16, sm: 18 },
                            minWidth: { xs: 16, sm: 18 },
                          }
                        }}
                      >
                        <NotificationsIcon fontSize={isMobile ? "small" : "medium"} />
                      </Badge>
                    </IconButton>
                  </Fade>
                )}

                {/* User Icon for Mobile/Tab */}
                {isAuthenticated && (isMobile || isTablet) && (
                  <>
                    <IconButton
                      onClick={handleMenuOpen}
                      size={getResponsiveIconSize()}
                      sx={{
                        p: { xs: 0.25, sm: 0.5 },
                        border: darkMode 
                          ? '1px solid #3c4043'
                          : '1px solid #dadce0',
                        "&:hover": {
                          borderColor: '#4285f4',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: { xs: 28, sm: 32, md: 36 },
                          height: { xs: 28, sm: 32, md: 36 },
                          backgroundColor: '#4285f4',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {user?.name?.charAt(0) || <AccountCircle />}
                      </Avatar>
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      sx={{
                        display: { lg: "none" },
                        "& .MuiPaper-root": {
                          mt: 1,
                          minWidth: { xs: 180, sm: 200 },
                          borderRadius: { xs: '10px', sm: '12px' },
                          backgroundColor: darkMode ? '#303134' : '#ffffff',
                          border: darkMode 
                            ? '1px solid #3c4043'
                            : '1px solid #dadce0',
                        },
                      }}
                    >
                      <Box sx={{ 
                        p: { xs: 1.5, sm: 2 }, 
                        pb: { xs: 0.5, sm: 1 } 
                      }}>
                        <MuiTypography 
                          variant={isMobile ? "body2" : "subtitle1"} 
                          fontWeight={600} 
                          color={darkMode ? '#e8eaed' : '#202124'}
                          sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem' } }}
                        >
                          {user?.name || "User"}
                        </MuiTypography>
                        <MuiTypography 
                          variant="caption" 
                          color={darkMode ? '#9aa0a6' : '#5f6368'}
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                          {user?.email || ""}
                        </MuiTypography>
                      </Box>
                      <Divider sx={{ 
                        my: { xs: 0.5, sm: 1 }, 
                        borderColor: darkMode ? '#3c4043' : '#dadce0' 
                      }} />
                      {userMenuItems.map((item) => (
                        <MenuItem
                          key={item.name}
                          component={Link}
                          href={item.href}
                          onClick={() => {
                            handleMenuClose();
                            handleDrawerToggle();
                          }}
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            py: { xs: 0.75, sm: 1 },
                            px: { xs: 1.5, sm: 2 },
                            fontSize: { xs: '0.85rem', sm: '0.9rem' },
                            '&:hover': {
                              backgroundColor: darkMode 
                                ? 'rgba(255,255,255,0.04)' 
                                : 'rgba(0,0,0,0.03)',
                            }
                          }}
                        >
                          <Box sx={{ 
                            mr: { xs: 1, sm: 1.5 }, 
                            color: '#4285f4',
                            '& svg': {
                              fontSize: { xs: '1rem', sm: '1.125rem' }
                            }
                          }}>
                            {item.icon}
                          </Box>
                          {item.name}
                        </MenuItem>
                      ))}
                      <Divider sx={{ 
                        my: { xs: 0.5, sm: 1 }, 
                        borderColor: darkMode ? '#3c4043' : '#dadce0' 
                      }} />
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{
                          color: '#ea4335',
                          py: { xs: 0.75, sm: 1 },
                          px: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.85rem', sm: '0.9rem' },
                          '&:hover': {
                            backgroundColor: darkMode 
                              ? 'rgba(234, 67, 53, 0.08)' 
                              : 'rgba(234, 67, 53, 0.04)',
                          }
                        }}
                      >
                        <Box sx={{ 
                          mr: { xs: 1, sm: 1.5 },
                          '& svg': {
                            fontSize: { xs: '1rem', sm: '1.125rem' }
                          }
                        }}>
                          <ExitToApp fontSize="inherit" />
                        </Box>
                        Sign Out
                      </MenuItem>
                    </Menu>
                  </>
                )}

                {/* Desktop Menu */}
                {isDesktop && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { md: 1, lg: 1.5 },
                    }}
                  >
                    {!isAuthenticated ? (
                      <>
                        {menuItems.slice(0, isMedium ? 2 : menuItems.length).map((item) => (
                          <Button
                            key={item.name}
                            component="a"
                            href={item.href}
                            sx={{
                              color: darkMode ? '#e8eaed' : '#5f6368',
                              fontWeight: 500,
                              fontSize: { md: "0.85rem", lg: "0.9rem" },
                              textTransform: 'none',
                              borderRadius: '16px',
                              px: { md: 1.5, lg: 2 },
                              py: { md: 0.5, lg: 0.625 },
                              minHeight: { md: 36, lg: 40 },
                              "&:hover": {
                                backgroundColor: darkMode 
                                  ? 'rgba(255,255,255,0.04)' 
                                  : 'rgba(0,0,0,0.02)',
                                color: darkMode ? '#e8eaed' : '#202124',
                              },
                            }}
                          >
                            {item.name}
                          </Button>
                        ))}
                        <Button
                          variant="outlined"
                          component={Link}
                          href="/login"
                          sx={{
                            ml: { md: 0.5, lg: 1 },
                            fontSize: { md: "0.85rem", lg: "0.9rem" },
                            borderRadius: '16px',
                            textTransform: 'none',
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                            px: { md: 1.5, lg: 2 },
                            py: { md: 0.5, lg: 0.625 },
                            minHeight: { md: 36, lg: 40 },
                            '&:hover': {
                              borderColor: '#4285f4',
                              backgroundColor: darkMode 
                                ? 'rgba(66, 133, 244, 0.08)' 
                                : 'rgba(66, 133, 244, 0.04)',
                            }
                          }}
                        >
                          Sign In
                        </Button>
                        <Button
                          variant="contained"
                          component={Link}
                          href="/dashboard"
                          sx={{
                            ml: { md: 0.5, lg: 1 },
                            backgroundColor: '#4285f4',
                            color: "white",
                            fontSize: { md: "0.85rem", lg: "0.9rem" },
                            borderRadius: '16px',
                            textTransform: 'none',
                            px: { md: 1.5, lg: 2 },
                            py: { md: 0.5, lg: 0.625 },
                            minHeight: { md: 36, lg: 40 },
                            fontWeight: 500,
                            boxShadow: 'none',
                            "&:hover": {
                              backgroundColor: '#3367d6',
                              boxShadow: '0 2px 6px rgba(66, 133, 244, 0.2)',
                            },
                          }}
                        >
                          Start Free Trial
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="text"
                          component={Link}
                          href="/dashboard"
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            fontWeight: 500,
                            fontSize: { md: "0.85rem", lg: "0.9rem" },
                            textTransform: 'none',
                            borderRadius: '16px',
                            px: { md: 1.5, lg: 2 },
                            py: { md: 0.5, lg: 0.625 },
                            minHeight: { md: 36, lg: 40 },
                            "&:hover": {
                              backgroundColor: darkMode 
                                ? 'rgba(255,255,255,0.04)' 
                                : 'rgba(0,0,0,0.02)',
                            }
                          }}
                        >
                          Dashboard
                        </Button>
                        <Button
                          variant="text"
                          component={Link}
                          href="/pricing"
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            fontWeight: 500,
                            fontSize: { md: "0.85rem", lg: "0.9rem" },
                            textTransform: 'none',
                            borderRadius: '16px',
                            px: { md: 1.5, lg: 2 },
                            py: { md: 0.5, lg: 0.625 },
                            minHeight: { md: 36, lg: 40 },
                            "&:hover": {
                              backgroundColor: darkMode 
                                ? 'rgba(255,255,255,0.04)' 
                                : 'rgba(0,0,0,0.02)',
                            }
                          }}
                        >
                          Pricing
                        </Button>

                        {/* User Menu for Desktop */}
                        <Box sx={{ ml: { md: 0.5, lg: 1 } }}>
                          <IconButton
                            onClick={handleMenuOpen}
                            sx={{
                              p: { md: 0.375, lg: 0.5 },
                              border: darkMode 
                                ? '1px solid #3c4043'
                                : '1px solid #dadce0',
                              "&:hover": {
                                borderColor: '#4285f4',
                              },
                            }}
                          >
                            <Avatar
                              sx={{
                                width: { md: 32, lg: 36 },
                                height: { md: 32, lg: 36 },
                                backgroundColor: '#4285f4',
                                fontSize: { md: '0.875rem', lg: '1rem' }
                              }}
                            >
                              {user?.name?.charAt(0) || <AccountCircle />}
                            </Avatar>
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                              sx: {
                                mt: 1,
                                minWidth: 200,
                                borderRadius: '12px',
                                backgroundColor: darkMode ? '#303134' : '#ffffff',
                                border: darkMode 
                                  ? '1px solid #3c4043'
                                  : '1px solid #dadce0',
                                "& .MuiMenuItem-root": {
                                  px: 2,
                                  py: 1.25,
                                  fontSize: "0.9rem",
                                  color: darkMode ? '#e8eaed' : '#202124',
                                  '&:hover': {
                                    backgroundColor: darkMode 
                                      ? 'rgba(255,255,255,0.04)' 
                                      : 'rgba(0,0,0,0.03)',
                                  }
                                },
                              },
                            }}
                          >
                            <Box sx={{ p: 2, pb: 1 }}>
                              <MuiTypography
                                variant="subtitle1"
                                fontWeight={600}
                                color={darkMode ? '#e8eaed' : '#202124'}
                              >
                                {user?.name || "User"}
                              </MuiTypography>
                              <MuiTypography
                                variant="caption"
                                color={darkMode ? '#9aa0a6' : '#5f6368'}
                              >
                                {user?.email || ""}
                              </MuiTypography>
                            </Box>
                            <Divider sx={{ my: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                            {userMenuItems.map((item) => (
                              <MenuItem
                                key={item.name}
                                component={Link}
                                href={item.href}
                                onClick={handleMenuClose}
                              >
                                <Box sx={{ mr: 2, color: '#4285f4' }}>
                                  {item.icon}
                                </Box>
                                {item.name}
                              </MenuItem>
                            ))}
                            <Divider sx={{ my: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                            <MenuItem 
                              onClick={handleLogout}
                              sx={{
                                color: '#ea4335',
                                '&:hover': {
                                  backgroundColor: darkMode 
                                    ? 'rgba(234, 67, 53, 0.08)' 
                                    : 'rgba(234, 67, 53, 0.04)',
                                }
                              }}
                            >
                              <Box sx={{ mr: 2 }}>
                                <ExitToApp fontSize="small" />
                              </Box>
                              Sign Out
                            </MenuItem>
                          </Menu>
                        </Box>
                      </>
                    )}
                  </Box>
                )}

                {/* Mobile Menu Button */}
                {(isMobile || isTablet) && (
                  <IconButton
                    onClick={handleDrawerToggle}
                    size={getResponsiveIconSize()}
                    sx={{
                      color: darkMode ? '#e8eaed' : '#202124',
                      p: { xs: 0.5, sm: 0.75 },
                    }}
                  >
                    <MenuIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            width: { xs: 'calc(100vw - 32px)', sm: 380 },
            maxWidth: { xs: 'calc(100vw - 32px)', sm: 380 },
            maxHeight: { xs: '60vh', sm: 400 },
            borderRadius: { xs: '10px', sm: '12px' },
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: darkMode 
              ? '1px solid #3c4043'
              : '1px solid #dadce0',
            boxShadow: darkMode 
              ? '0 4px 16px rgba(0,0,0,0.3)'
              : '0 4px 16px rgba(0,0,0,0.1)',
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: { xs: 1.5, sm: 2 }, pb: { xs: 1, sm: 1 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MuiTypography 
              variant={isMobile ? "subtitle1" : "h6"} 
              fontWeight={600} 
              color={darkMode ? '#e8eaed' : '#202124'}
              sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
            >
              Notifications
            </MuiTypography>
            {unreadCount > 0 && (
              <Button
                size={isMobile ? "small" : "medium"}
                startIcon={<MarkReadIcon fontSize={isMobile ? "small" : "medium"} />}
                onClick={handleMarkAllAsRead}
                disabled={notificationsLoading}
                sx={{
                  color: '#4285f4',
                  textTransform: 'none',
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  minHeight: { xs: 28, sm: 32 },
                }}
              >
                Mark all read
              </Button>
            )}
          </Box>
          {unreadCount > 0 && (
            <MuiTypography
              variant="caption"
              color={darkMode ? '#9aa0a6' : '#5f6368'}
              sx={{ 
                mt: 0.5, 
                display: 'block',
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            >
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </MuiTypography>
          )}
        </Box>

        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

        <Box sx={{ maxHeight: { xs: '45vh', sm: 300 }, overflow: "auto" }}>
          {notificationsLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 3,
                width: "100%",
              }}
            >
              <CircularProgress size={isMobile ? 20 : 24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                py: 3,
                textAlign: "center",
                width: "100%",
              }}
            >
              <MuiTypography 
                variant="body2" 
                color={darkMode ? '#9aa0a6' : '#5f6368'}
                sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
              >
                No notifications
              </MuiTypography>
            </Box>
          ) : (
            <Box sx={{ p: 0 }}>
              {notifications.slice(0, isMobile ? 5 : 10).map((notification) => (
                <MenuItem
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    borderLeft: `3px solid ${getNotificationColor(
                      notification.type
                    )}`,
                    cursor: "pointer",
                    backgroundColor: notification.isRead
                      ? "transparent"
                      : alpha(getNotificationColor(notification.type), darkMode ? 0.08 : 0.04),
                    "&:hover": {
                      backgroundColor: darkMode 
                        ? 'rgba(255,255,255,0.04)' 
                        : 'rgba(0,0,0,0.02)',
                    },
                    py: { xs: 1, sm: 1.25 },
                    px: { xs: 1.5, sm: 2 },
                    borderBottom: darkMode 
                      ? '1px solid #3c4043'
                      : '1px solid rgba(0,0,0,0.05)',
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: { xs: 0.75, sm: 1 },
                        mb: 0.5,
                      }}
                    >
                      {!notification.isRead && (
                        <CircleIcon
                          sx={{
                            fontSize: { xs: 6, sm: 8 },
                            color: getNotificationColor(notification.type),
                            mt: { xs: 0.5, sm: 0.75 },
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <MuiTypography
                          variant={isMobile ? "body2" : "subtitle2"}
                          fontWeight={notification.isRead ? "normal" : 500}
                          sx={{ 
                            lineHeight: 1.3,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}
                          color={darkMode ? '#e8eaed' : '#202124'}
                        >
                          {notification.title}
                        </MuiTypography>
                        <MuiTypography
                          variant="body2"
                          color={darkMode ? '#9aa0a6' : '#5f6368'}
                          sx={{
                            lineHeight: 1.4,
                            mt: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            fontSize: { xs: '0.75rem', sm: '0.85rem' }
                          }}
                        >
                          {notification.message}
                        </MuiTypography>
                        <MuiTypography
                          variant="caption"
                          color={darkMode ? '#9aa0a6' : '#5f6368'}
                          sx={{ 
                            mt: 0.5, 
                            display: "block",
                            fontSize: { xs: '0.65rem', sm: '0.75rem' }
                          }}
                        >
                          {formatTime(notification.createdAt)}
                        </MuiTypography>
                      </Box>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Box>
          )}
        </Box>

        {notifications.length > 0 && (
          <Box>
            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
            <MenuItem
              onClick={() => {
                router.push("/notifications");
                handleNotificationMenuClose();
              }}
              sx={{ 
                justifyContent: "center",
                py: { xs: 1, sm: 1.25 },
                '&:hover': {
                  backgroundColor: darkMode 
                    ? 'rgba(255,255,255,0.04)' 
                    : 'rgba(0,0,0,0.02)',
                }
              }}
            >
              <MuiTypography 
                variant="body2" 
                color="#4285f4"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
              >
                View all notifications
              </MuiTypography>
            </MenuItem>
          </Box>
        )}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: '100%', sm: 320 },
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};