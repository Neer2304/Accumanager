// components/googleadminanalytics/AdminAnalyticsPage.tsx
'use client';

import React from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';

// Import components
import { AdminHeader } from './components/AdminHeader';
import { AdminControls } from './components/AdminControls';
import { AdminStatsGrid } from './components/AdminStatsGrid';
import { AdminChartsSection } from './components/AdminChartsSection';
import { AdminTopUsersTable } from './components/AdminTopUsersTable';
import { AdminLoadingState } from './components/AdminLoadingState';
import { AdminErrorAlert } from './components/AdminErrorAlert';

// Import hooks
import { useAdminAnalytics } from './hooks/useAdminAnalytics';

function AdminAnalyticsContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  
  const {
    timeRange,
    data,
    loading,
    error,
    authError,
    setTimeRange,
    refresh,
    exportData
  } = useAdminAnalytics();

  if (loading && !data) {
    return <AdminLoadingState />;
  }

  if (authError) {
    return (
      <AdminErrorAlert 
        message="Authentication failed. Redirecting to login page..." 
        severity="error"
      />
    );
  }

  if (error && !loading) {
    return (
      <AdminErrorAlert message={error} severity="error" />
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
          <AdminHeader
            title="Analytics Dashboard"
            subtitle="Real-time business insights and performance metrics"
            backLink="/admin/dashboard"
            backText="Back to Dashboard"
          />

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mt: 2
          }}>
            <Box /> {/* Empty box for spacing */}
            <AdminControls
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              onRefresh={refresh}
              onExport={exportData}
              loading={loading}
              isMobile={isMobile}
            />
          </Box>
        </Box>

        {/* Main Analytics Content */}
        {data && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Stats Overview */}
            <Box>
              <AdminStatsGrid stats={data.stats} darkMode={darkMode} />
            </Box>

            {/* Charts Section */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                md: '2fr 1fr' 
              }, 
              gap: 3 
            }}>
              {/* Revenue Chart */}
              <Box>
                <AdminChartsSection
                  monthlyData={data.monthlyData}
                  planDistribution={data.planDistribution}
                  darkMode={darkMode}
                />
              </Box>

              {/* Plan Distribution Donut Chart */}
              <Box>
                <AdminChartsSection
                  monthlyData={data.monthlyData}
                  planDistribution={data.planDistribution}
                  showPlanDistribution={true}
                  darkMode={darkMode}
                />
              </Box>
            </Box>

            {/* User Growth Chart */}
            <Box>
              <AdminChartsSection
                monthlyData={data.monthlyData}
                showUserGrowth={true}
                darkMode={darkMode}
              />
            </Box>

            {/* Top Users Table */}
            <Box>
              <AdminTopUsersTable users={data.topUsers} darkMode={darkMode} />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

// Main exported component with layout wrapper
export default function AdminAnalyticsPage() {
  return (
    <MainLayout title="Admin Analytics">
      <AdminAnalyticsContent />
    </MainLayout>
  );
}