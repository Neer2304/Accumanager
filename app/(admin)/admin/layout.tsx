// app/(admin)/admin/layout.tsx - FULLY RESPONSIVE GOOGLE MATERIAL DESIGN THEME
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Settings,
  Logout,
  Store,
  Description,
  AdminPanelSettings,
  BarChart,
  AnalyticsSharp,
  ChevronLeft,
  Home,
  MoreVert,
  Notifications,
  AccountCircle,
} from '@mui/icons-material';
import Link from 'next/link';
import { ProductIcon } from '@/components/common';
import { Support } from '@/assets/icons/HelpSupportIcons';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  // Google Material Design Colors
  const googleColors = {
    primary: '#1a73e8',
    primaryLight: '#8ab4f8',
    primaryDark: '#1669c1',
    secondary: '#34a853',
    warning: '#fbbc04',
    error: '#ea4335',
    grey50: '#f8f9fa',
    grey100: '#f1f3f4',
    grey200: '#e8eaed',
    grey300: '#dadce0',
    grey400: '#bdc1c6',
    grey500: '#9aa0a6',
    grey600: '#80868b',
    grey700: '#5f6368',
    grey800: '#3c4043',
    grey900: '#202124',
    cardBgLight: '#ffffff',
    cardBgDark: '#303134',
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        if (!['/admin/login', '/admin/setup'].includes(pathname)) {
          router.push('/admin/login');
        }
      }
    } catch (err) {
      console.error('Auth check error:', err);
      if (!['/admin/login', '/admin/setup'].includes(pathname)) {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/admin/dashboard',
      mobileText: 'Dashboard'
    },
    { 
      text: 'Users', 
      icon: <People />, 
      path: '/admin/users',
      mobileText: 'Users'
    },
    { 
      text: 'Analytics', 
      icon: <BarChart />, 
      path: '/admin/analytics',
      mobileText: 'Analytics'
    },
    { 
      text: 'Legal Docs', 
      icon: <Description />, 
      path: '/admin/legal',
      mobileText: 'Legal'
    },
    {
      text: 'Analysis',
      icon: <AnalyticsSharp />,
      path: '/admin/analysis',
      mobileText: 'Analysis'
    },
    {
      text: 'Products',
      icon: <ProductIcon />,
      path: '/admin/products',
      mobileText: 'Products'
    },
    {
      text: 'Support',
      icon: <Support/>,
      path: '/admin/support',
      mobileText: 'Support'
    },
    { 
      text: 'Settings', 
      icon: <Settings />, 
      path: '/admin/settings',
      mobileText: 'Settings'
    },
  ];

  if (loading && !['/admin/login', '/admin/setup'].includes(pathname)) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: darkMode ? googleColors.grey900 : googleColors.grey50,
      }}>
        <CircularProgress size={48} />
        <Typography 
          variant="body2" 
          sx={{ 
            ml: 2, 
            color: darkMode ? googleColors.grey500 : googleColors.grey600 
          }}
        >
          Loading admin panel...
        </Typography>
      </Box>
    );
  }

  // For login and setup pages, don't show the layout
  if (['/admin/login', '/admin/setup'].includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar - Mobile Optimized */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: 1300,
          backgroundColor: darkMode ? googleColors.grey900 : 'white',
          borderBottom: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
          boxShadow: isMobile 
            ? '0 1px 2px rgba(0,0,0,0.1)'
            : '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar sx={{ 
          px: { xs: 1.5, sm: 2, md: 3 },
          minHeight: { xs: 56, sm: 64 },
        }}>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              mr: { xs: 1, sm: 2 },
              color: darkMode ? googleColors.grey300 : googleColors.grey700,
              display: { xs: 'flex', md: 'flex' },
              '&:hover': {
                backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo/Brand */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
            flex: 1,
          }}>
            <AdminPanelSettings sx={{ 
              color: googleColors.primary,
              fontSize: { xs: 20, sm: 24, md: 28 },
            }} />
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: darkMode ? googleColors.grey200 : googleColors.grey900,
                fontWeight: 500,
                fontSize: { 
                  xs: '1rem', 
                  sm: '1.125rem', 
                  md: '1.25rem' 
                },
                lineHeight: 1.2,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: darkMode ? googleColors.grey200 : googleColors.grey900,
                fontWeight: 500,
                fontSize: '1rem',
                display: { xs: 'block', sm: 'none' },
              }}
            >
              Admin
            </Typography>
          </Box>
          
          {/* Desktop User Info */}
          {user && !isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, sm: 2 },
            }}>
              <Chip
                label="Admin"
                size="small"
                sx={{
                  backgroundColor: alpha(googleColors.primary, 0.1),
                  color: googleColors.primary,
                  fontWeight: 500,
                  border: `1px solid ${alpha(googleColors.primary, 0.3)}`,
                  display: { xs: 'none', sm: 'flex' },
                }}
              />
              
              <Avatar
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  backgroundColor: googleColors.primary,
                  fontSize: { xs: 12, sm: 14 },
                  fontWeight: 500,
                }}
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? googleColors.grey300 : googleColors.grey700,
                  fontWeight: 500,
                  display: { xs: 'none', md: 'block' },
                }}
              >
                {user.name}
              </Typography>
              
              <Tooltip title="Logout">
                <IconButton
                  onClick={handleLogout}
                  size="small"
                  sx={{
                    color: darkMode ? googleColors.grey500 : googleColors.grey600,
                    '&:hover': {
                      backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
                      color: googleColors.error,
                    },
                  }}
                >
                  <Logout fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          
          {/* Mobile User Menu */}
          {user && isMobile && (
            <>
              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{
                  color: darkMode ? googleColors.grey300 : googleColors.grey700,
                }}
              >
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
                sx={{
                  '& .MuiPaper-root': {
                    backgroundColor: darkMode ? googleColors.grey900 : 'white',
                    border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
                    borderRadius: '12px',
                    minWidth: 200,
                    mt: 1,
                  },
                }}
              >
                <MenuItem 
                  sx={{ 
                    py: 1.5,
                    borderBottom: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: googleColors.primary,
                        fontSize: 14,
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ 
                        color: darkMode ? googleColors.grey200 : googleColors.grey900,
                        fontWeight: 500,
                      }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: darkMode ? googleColors.grey500 : googleColors.grey600,
                      }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    router.push('/admin/dashboard');
                    handleMobileMenuClose();
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Dashboard fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">Dashboard</Typography>
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    router.push('/admin/settings');
                    handleMobileMenuClose();
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">Settings</Typography>
                </MenuItem>
                <Divider sx={{ 
                  borderColor: darkMode ? googleColors.grey800 : googleColors.grey200,
                  my: 1,
                }} />
                <MenuItem 
                  onClick={() => {
                    handleLogout();
                    handleMobileMenuClose();
                  }}
                  sx={{ 
                    py: 1.5,
                    color: googleColors.error,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer - Mobile Responsive */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 280 },
            maxWidth: { xs: '100%', sm: 280 },
            boxSizing: 'border-box',
            backgroundColor: darkMode ? googleColors.grey900 : 'white',
            borderRight: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
            boxShadow: isMobile 
              ? 'none'
              : '4px 0 20px rgba(0,0,0,0.05)',
          },
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 2, sm: 3 },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AdminPanelSettings sx={{ color: googleColors.primary }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: darkMode ? googleColors.grey200 : googleColors.grey900,
                fontWeight: 500,
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              Admin Panel
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setDrawerOpen(false)}
            size="small"
            sx={{
              color: darkMode ? googleColors.grey500 : googleColors.grey600,
            }}
          >
            <ChevronLeft />
          </IconButton>
        </Toolbar>
        
        <Box sx={{ 
          overflow: 'auto',
          height: 'calc(100vh - 64px)',
          pb: 8, // Extra padding for mobile bottom bar
        }}>
          {/* User Info */}
          {user && (
            <Box sx={{ 
              p: { xs: 2.5, sm: 3 }, 
              borderBottom: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: { xs: 44, sm: 48 },
                    height: { xs: 44, sm: 48 },
                    backgroundColor: googleColors.primary,
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: 600,
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: darkMode ? googleColors.grey200 : googleColors.grey900,
                      fontWeight: 600,
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? googleColors.grey500 : googleColors.grey600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label="Administrator"
                size="small"
                sx={{
                  backgroundColor: alpha(googleColors.primary, 0.1),
                  color: googleColors.primary,
                  fontWeight: 500,
                  border: `1px solid ${alpha(googleColors.primary, 0.3)}`,
                }}
              />
            </Box>
          )}

          {/* Navigation Menu */}
          <List sx={{ p: { xs: 1.5, sm: 2 } }}>
            <ListItem sx={{ p: 0, mb: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  px: 2,
                  color: darkMode ? googleColors.grey500 : googleColors.grey600,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                Main Navigation
              </Typography>
            </ListItem>
            
            {menuItems.map((item) => {
              const isSelected = pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    selected={isSelected}
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      borderRadius: '12px',
                      py: { xs: 1.25, sm: 1.5 },
                      '&.Mui-selected': {
                        backgroundColor: alpha(googleColors.primary, darkMode ? 0.2 : 0.1),
                        '&:hover': {
                          backgroundColor: alpha(googleColors.primary, darkMode ? 0.25 : 0.15),
                        },
                      },
                      '&:hover': {
                        backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: isSelected ? googleColors.primary : (darkMode ? googleColors.grey400 : googleColors.grey600),
                      minWidth: { xs: 36, sm: 40 },
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected 
                          ? googleColors.primary 
                          : (darkMode ? googleColors.grey300 : googleColors.grey700),
                        fontSize: { xs: '0.875rem', sm: '0.95rem' },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ 
            borderColor: darkMode ? googleColors.grey800 : googleColors.grey200, 
            my: { xs: 2, sm: 2 } 
          }} />

          {/* Quick Links */}
          <List sx={{ p: { xs: 1.5, sm: 2 } }}>
            <ListItem sx={{ p: 0, mb: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  px: 2,
                  color: darkMode ? googleColors.grey500 : googleColors.grey600,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                Quick Links
              </Typography>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/dashboard"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: '12px',
                  py: { xs: 1.25, sm: 1.5 },
                  '&:hover': {
                    backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: darkMode ? googleColors.grey400 : googleColors.grey600,
                  minWidth: { xs: 36, sm: 40 },
                }}>
                  <Home />
                </ListItemIcon>
                <ListItemText 
                  primary="Main Dashboard" 
                  primaryTypographyProps={{
                    color: darkMode ? googleColors.grey300 : googleColors.grey700,
                    fontSize: { xs: '0.875rem', sm: '0.95rem' },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Mobile Bottom Action Bar */}
        {isMobile && user && (
          <Box sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: darkMode ? googleColors.grey900 : 'white',
            borderTop: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            py: 1,
            zIndex: 1000,
          }}>
            {menuItems.slice(0, 4).map((item, index) => {
              const isSelected = pathname === item.path;
              return (
                <IconButton
                  key={index}
                  component={Link}
                  href={item.path}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    color: isSelected ? googleColors.primary : (darkMode ? googleColors.grey400 : googleColors.grey600),
                    flexDirection: 'column',
                    borderRadius: 2,
                    p: 1,
                    minWidth: 64,
                  }}
                >
                  {item.icon}
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.65rem',
                    mt: 0.5,
                    color: isSelected ? googleColors.primary : (darkMode ? googleColors.grey500 : googleColors.grey600),
                  }}>
                    {item.mobileText}
                  </Typography>
                </IconButton>
              );
            })}
          </Box>
        )}
      </Drawer>

      {/* Main Content - Mobile Optimized */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          backgroundColor: darkMode ? googleColors.grey900 : googleColors.grey50,
          minHeight: '100vh',
          pt: { xs: 7, sm: 8 }, // Adjusted for different AppBar heights
          pb: { xs: 8, sm: 4 }, // Extra padding for mobile bottom bar
          overflowX: 'hidden',
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            p: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
                border: `1px solid ${googleColors.error}`,
                color: darkMode ? googleColors.grey200 : googleColors.grey900,
                '& .MuiAlert-icon': { color: googleColors.error },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1.5, sm: 2 },
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
          
          {children}
        </Container>
      </Box>
    </Box>
  );
}