// components/proadminlayout/ProAdminLayout.tsx (Professional Theme - COMPLETE)
"use client";

import React from 'react';
import { Box, Container } from '@mui/material';
import { ProAdminAppBar } from './components/ProAdminAppBar';
import { ProAdminDrawer } from './components/ProAdminDrawer';
import { ProAdminMobileBottomBar } from './components/ProAdminMobileBottomBar';
import { ProAdminUserMenu } from './components/ProAdminUserMenu';
import { ProAdminLoadingState } from './components/ProAdminLoadingState';
import { ProAdminErrorAlert } from './components/ProAdminErrorAlert';
import { useProAdminLayout } from './hooks/useProAdminLayout';
import { menuItems, quickLinks } from './components/ProAdminNavItems';
import { proColors } from './components/types';
import { usePathname } from 'next/navigation';

export default function ProAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
//   const theme = useTheme();
  const {
    user,
    loading,
    error,
    drawerOpen,
    mobileMenuAnchor,
    isMobile,
    // isTablet,
    darkMode,
    setError,
    handleLogout,
    handleMobileMenuOpen,
    handleMobileMenuClose,
    handleDrawerOpen,
    handleDrawerClose,
    handleNavigation,
  } = useProAdminLayout();

  if (['/pro-admin/login', '/pro-admin/setup'].includes(pathname)) {
    return <>{children}</>;
  }

  if (loading) {
    return <ProAdminLoadingState />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <ProAdminAppBar
        user={user}
        isMobile={isMobile}
        darkMode={darkMode}
        onMenuClick={handleDrawerOpen}
        onMobileMenuOpen={handleMobileMenuOpen}
        onLogout={handleLogout}
      />

      <ProAdminDrawer
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

      {user && isMobile && (
        <ProAdminUserMenu
          user={user}
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          onDashboard={() => handleNavigation('/pro-admin/dashboard')}
          onSettings={() => handleNavigation('/pro-admin/settings')}
          onLogout={handleLogout}
        />
      )}

      {isMobile && user && (
        <ProAdminMobileBottomBar
          menuItems={menuItems}
          pathname={pathname}
          darkMode={darkMode}
          onNavigate={handleNavigation}
        />
      )}

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          backgroundColor: darkMode ? proColors.grey900 : proColors.grey50,
          minHeight: '100vh',
          pt: { xs: 7, sm: 8 },
          pb: { xs: 8, sm: 4 },
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
            <ProAdminErrorAlert error={error} onClose={() => setError('')} />
          )}
          {children}
        </Container>
      </Box>
    </Box>
  );
}