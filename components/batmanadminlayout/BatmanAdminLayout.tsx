// components/batmanadminlayout/BatmanAdminLayout.tsx
"use client";

import React from 'react';
import { Box, Container } from '@mui/material';
import { BatmanAdminAppBar } from './components/BatmanAdminAppBar';
import { BatmanAdminDrawer } from './components/BatmanAdminDrawer';
import { BatmanAdminMobileBottomBar } from './components/BatmanAdminMobileBottomBar';
import { BatmanAdminUserMenu } from './components/BatmanAdminUserMenu';
import { BatmanAdminLoadingState } from './components/BatmanAdminLoadingState';
import { BatmanAdminErrorAlert } from './components/BatmanAdminErrorAlert';
import { useBatmanAdminLayout } from './hooks/useBatmanAdminLayout';
import { menuItems, quickLinks } from './components/BatmanAdminNavItems';
import { batmanColors } from './components/types';
import { usePathname } from 'next/navigation';

export default function BatmanAdminLayout({ children }: { children: React.ReactNode }) {
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
  } = useBatmanAdminLayout();

  if (['/batman-admin/login', '/batman-admin/setup'].includes(pathname)) {
    return <>{children}</>;
  }

  if (loading) {
    return <BatmanAdminLoadingState />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <BatmanAdminAppBar
        user={user}
        isMobile={isMobile}
        darkMode={darkMode}
        onMenuClick={handleDrawerOpen}
        onMobileMenuOpen={handleMobileMenuOpen}
        onLogout={handleLogout}
      />

      <BatmanAdminDrawer
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
        <BatmanAdminUserMenu
          user={user}
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          onDashboard={() => handleNavigation('/batman-admin/dashboard')}
          onSettings={() => handleNavigation('/batman-admin/settings')}
          onLogout={handleLogout}
        />
      )}

      {isMobile && user && (
        <BatmanAdminMobileBottomBar
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
          backgroundColor: darkMode ? batmanColors.bg : batmanColors.bgLight,
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
            <BatmanAdminErrorAlert error={error} onClose={() => setError('')} />
          )}
          {children}
        </Container>
      </Box>
    </Box>
  );
}