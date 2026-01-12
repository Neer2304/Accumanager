"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Alert, CircularProgress } from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';
import {
  DashboardHeader,
  StatsOverview,
  UsageAnalytics,
  UserManagement,
  RevenueInsights,
  PlatformMetrics,
} from '@/components/admin/dashboard';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('7d');
  const {
    data: stats,
    loading,
    error,
    refresh,
  } = useDashboardData(timeRange);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <DashboardHeader
        title="Admin Analytics"
        subtitle="Real-time platform insights"
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRefresh={refresh}
        onLogout={handleLogout}
      />

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => {}}
        >
          {error}
        </Alert>
      )}

      {/* Main Dashboard Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Stats Overview */}
        {stats && (
          <>
            <Box>
              <StatsOverview
                totalUsers={stats.totalUsers}
                activeUsers={stats.activeUsers}
                trialUsers={stats.trialUsers}
                revenue={stats.revenue}
                totalUsageHours={stats.totalUsageHours}
                avgDailyUsage={stats.avgDailyUsage}
                peakConcurrentUsers={stats.peakConcurrentUsers}
                userGrowth={stats.userGrowth}
                revenueGrowth={stats.revenueGrowth}
              />
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
              {/* Usage Analytics */}
              <Box>
                <UsageAnalytics
                  dailyUsage={stats.dailyUsage || []}
                  planDistribution={stats.planDistribution || []}
                />
              </Box>

              {/* Revenue Insights */}
              <Box>
                <RevenueInsights
                  revenueTrend={stats.revenueTrend || []}
                  planDistribution={stats.planDistribution || []}
                />
              </Box>
            </Box>

            {/* User Management */}
            <Box>
              <UserManagement
                users={stats.recentUsers || []}
                onViewAll={() => router.push('/admin/users')}
              />
            </Box>

            {/* Platform Metrics */}
            <Box>
              <PlatformMetrics
                totalProducts={stats.totalProducts}
                totalUsageHours={stats.totalUsageHours}
                revenue={stats.revenue}
                totalUsers={stats.totalUsers}
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}