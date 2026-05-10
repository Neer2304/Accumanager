// components/dpadminlayout/DpAdminLayout.tsx (Deadpool Theme - COMPLETE)
"use client";

import React from 'react';
import { Box, Container } from '@mui/material';
import { DpAdminAppBar } from './components/DpAdminAppBar';
import { DpAdminDrawer } from './components/DpAdminDrawer';
import { DpAdminMobileBottomBar } from './components/DpAdminMobileBottomBar';
import { DpAdminUserMenu } from './components/DpAdminUserMenu';
import { DpAdminLoadingState } from './components/DpAdminLoadingState';
import { DpAdminErrorAlert } from './components/DpAdminErrorAlert';
import { useDpAdminLayout } from './hooks/useDpAdminLayout';
import { menuItems, quickLinks } from './components/DpAdminNavItems';
import { dpColors } from './components/types';
import { usePathname } from 'next/navigation';

export default function DpAdminLayout({ children }: { children: React.ReactNode }) {
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
  } = useDpAdminLayout();

  if (['/dp-admin/login', '/dp-admin/setup'].includes(pathname)) {
    return <>{children}</>;
  }

  if (loading) {
    return <DpAdminLoadingState />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <DpAdminAppBar
        user={user}
        isMobile={isMobile}
        darkMode={darkMode}
        onMenuClick={handleDrawerOpen}
        onMobileMenuOpen={handleMobileMenuOpen}
        onLogout={handleLogout}
      />

      <DpAdminDrawer
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
        <DpAdminUserMenu
          user={user}
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          onDashboard={() => handleNavigation('/dp-admin/dashboard')}
          onSettings={() => handleNavigation('/dp-admin/settings')}
          onLogout={handleLogout}
        />
      )}

      {isMobile && user && (
        <DpAdminMobileBottomBar
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
          backgroundColor: darkMode ? dpColors.bg : dpColors.bgLight,
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
            <DpAdminErrorAlert error={error} onClose={() => setError('')} />
          )}
          {children}
        </Container>
      </Box>
    </Box>
  );
}