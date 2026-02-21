// components/googleadminlayout/AdminLayout.tsx
"use client";

import React from 'react';
import {
  Box,
  Container,
  useTheme
} from '@mui/material';

// Import components
import { AdminAppBar } from './components/AdminAppBar';
import { AdminDrawer } from './components/AdminDrawer';
import { AdminMobileBottomBar } from './components/AdminMobileBottomBar';
import { AdminUserMenu } from './components/AdminUserMenu';
import { AdminLoadingState } from './components/AdminLoadingState';
import { AdminErrorAlert } from './components/AdminErrorAlert';

// Import hooks
import { useAdminLayout } from './hooks/useAdminLayout';

// Import navigation items
import { menuItems, quickLinks } from './components/AdminNavItems';

// Import types
import { googleColors } from './components/types';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();
  const {
    user,
    loading,
    error,
    drawerOpen,
    mobileMenuAnchor,
    isMobile,
    isTablet,
    darkMode,
    setError,
    handleLogout,
    handleMobileMenuOpen,
    handleMobileMenuClose,
    handleDrawerOpen,
    handleDrawerClose,
    handleNavigation,
  } = useAdminLayout();

  // For login and setup pages, don't show the layout
  if (['/admin/login', '/admin/setup'].includes(pathname)) {
    return <>{children}</>;
  }

  if (loading) {
    return <AdminLoadingState />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AdminAppBar
        user={user}
        isMobile={isMobile}
        darkMode={darkMode}
        onMenuClick={handleDrawerOpen}
        onMobileMenuOpen={handleMobileMenuOpen}
        onLogout={handleLogout}
      />

      {/* Drawer */}
      <AdminDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        user={user}
        menuItems={menuItems}
        quickLinks={quickLinks}
        pathname={pathname}
        isMobile={isMobile}
        darkMode={darkMode}
        onNavigate={handleNavigation}
      />

      {/* Mobile User Menu */}
      {user && isMobile && (
        <AdminUserMenu
          user={user}
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          onDashboard={() => handleNavigation('/admin/dashboard')}
          onSettings={() => handleNavigation('/admin/settings')}
          onLogout={handleLogout}
        />
      )}

      {/* Mobile Bottom Bar */}
      {isMobile && user && (
        <AdminMobileBottomBar
          menuItems={menuItems}
          pathname={pathname}
          darkMode={darkMode}
          onNavigate={handleNavigation}
        />
      )}

      {/* Main Content */}
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
            <AdminErrorAlert error={error} onClose={() => setError('')} />
          )}
          
          {children}
        </Container>
      </Box>
    </Box>
  );
}