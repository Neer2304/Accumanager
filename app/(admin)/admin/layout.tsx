// app/(admin)/admin/layout.tsx - UPDATED
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
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
} from '@mui/icons-material';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        // If not authenticated and not on login/setup page, redirect
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

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/admin/dashboard' 
    },
    { 
      text: 'Users', 
      icon: <People />, 
      path: '/admin/users' 
    },
    { 
      text: 'Analytics', 
      icon: <BarChart />, 
      path: '/admin/analytics' 
    },
    { 
      text: 'Legal Documents', 
      icon: <Description />, 
      path: '/admin/legal' 
    },
    { 
      text: 'Settings', 
      icon: <Settings />, 
      path: '/admin/settings' 
    },
  ];

  if (loading && !['/admin/login', '/admin/setup'].includes(pathname)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // For login and setup pages, don't show the layout
  if (['/admin/login', '/admin/setup'].includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <AdminPanelSettings sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">
                {user.name}
              </Typography>
              <Button 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<Logout />}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ px: 2, py: 1 }}
              >
                MAIN NAVIGATION
              </Typography>
            </ListItem>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={pathname === item.path}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: pathname === item.path ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontWeight: pathname === item.path ? 'bold' : 'normal'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          backgroundColor: 'background.default',
          minHeight: '100vh'
        }}
      >
        <Toolbar /> {/* This adds spacing below AppBar */}
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        
        <Container maxWidth="xl" sx={{ p: 0 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}