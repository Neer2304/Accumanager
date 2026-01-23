// app/(pages)/live-activity/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Alert, CircularProgress, Button, IconButton } from '@mui/material';
import { MoreVert, Construction } from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

// Import components
import { DevelopmentNotice } from '@/components/live-activity/DevelopmentNotice';
import { HeaderSection } from '@/components/live-activity/HeaderSection';
import { StatsOverview } from '@/components/live-activity/StatsOverview';
import { EmployeeActivityList } from '@/components/live-activity/EmployeeActivityList';
import { SidebarSection } from '@/components/live-activity/SidebarSection';
import { AccessDeniedView } from '@/components/live-activity/AccessDeniedView';
import { UpgradeDialog } from '@/components/live-activity/UpgradeDialog';

// Import hooks and types
import { useLiveActivityData } from '@/components/live-activity/hooks/useLiveActivityData';

export default function LiveActivityPage() {
  const {
    loading,
    error,
    employees,
    recentEvents,
    stats,
    autoRefresh,
    subscriptionStatus,
    upgradeDialogOpen,
    accessDenied,
    setAutoRefresh,
    setUpgradeDialogOpen,
    setAccessDenied,
    refreshData,
    handleUpgradePlan,
    fetchSubscriptionStatus
  } = useLiveActivityData();

  const [showDemoAlert, setShowDemoAlert] = useState(true);

  // Add development notice if no subscription or in development
  const showDevelopmentNotice = !subscriptionStatus?.isActive || subscriptionStatus?.plan === 'trial';

  if (loading) {
    return (
      <MainLayout title="Live Activity">
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Live Activity">
      <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
        
        {/* Development Notice */}
        {showDevelopmentNotice && showDemoAlert && (
          <DevelopmentNotice 
            onClose={() => setShowDemoAlert(false)}
            subscriptionPlan={subscriptionStatus?.plan}
            isActive={subscriptionStatus?.isActive}
          />
        )}

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              error.includes('subscription') && (
                <Button color="inherit" size="small" onClick={() => setUpgradeDialogOpen(true)}>
                  Upgrade
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}

        {/* Access Denied View */}
        {accessDenied ? (
          <AccessDeniedView 
            onUpgradeClick={() => setUpgradeDialogOpen(true)}
          />
        ) : (
          <>
            {/* Header */}
            <HeaderSection 
              subscriptionStatus={subscriptionStatus}
              onRefresh={refreshData}
              loading={loading}
            />

            {/* Stats Overview */}
            <StatsOverview stats={stats} />

            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              gap: 3,
              mt: 3 
            }}>
              {/* Employee Activity List */}
              <Box sx={{ flex: 2 }}>
                <EmployeeActivityList 
                  employees={employees}
                  autoRefresh={autoRefresh}
                  onAutoRefreshChange={setAutoRefresh}
                  stats={stats}
                />
              </Box>

              {/* Sidebar Section */}
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 350 } }}>
                <SidebarSection 
                  recentEvents={recentEvents}
                  employees={employees}
                />
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Upgrade Dialog */}
      <UpgradeDialog 
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        onUpgrade={handleUpgradePlan}
      />
    </MainLayout>
  );
}