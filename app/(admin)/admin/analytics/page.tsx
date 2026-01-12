"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Alert, CircularProgress } from '@mui/material';
import { Assessment } from '@mui/icons-material';
import {
  AnalyticsHeader,
  AnalyticsStatsGrid,
  AnalyticsChartsSection,
  TopUsersTable,
} from '@/components/admin/analytics';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('monthly');
  const {
    data,
    loading,
    error,
    authError,
    refresh,
  } = useAnalyticsData(timeRange);

  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      // Redirect to login after showing error
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    }
  }, [authError, router]);

  if (loading && !data) {
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

  if (authError) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Authentication failed. Redirecting to login page...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <AnalyticsHeader
        title="Analytics Dashboard"
        subtitle="Real-time business insights and performance metrics"
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onExportData={() => {
          if (data) {
            const csvContent = [
              ['Statistic', 'Value'],
              ['Total Revenue', data.stats.totalRevenue],
              ['Monthly Revenue', data.stats.monthlyRevenue],
              ['Active Subscriptions', data.stats.activeSubscriptions],
              ['Trial Users', data.stats.trialUsers],
              ['Total Users', data.stats.totalUsers],
              ['Payment Count', data.stats.paymentCount],
              ['Conversion Rate', data.stats.conversionRate + '%'],
              ['Avg Revenue Per User', data.stats.avgRevenuePerUser],
              [],
              ['Month', 'Revenue', 'Users', 'Payments', 'Active Users', 'Unique Users'],
              ...(data.monthlyData.map(item => [
                item.month, 
                item.revenue, 
                item.users, 
                item.payments, 
                item.activeUsers, 
                item.uniqueUsers
              ])),
              [],
              ['Top Users', 'Email', 'Plan', 'Status', 'Joined', 'Revenue', 'Payments', 'Last Payment'],
              ...(data.topUsers.map(user => [
                user.name, 
                user.email, 
                user.plan, 
                user.status, 
                user.joined, 
                user.revenue, 
                user.paymentCount, 
                user.lastPayment
              ])),
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics_${new Date().toISOString().split('T')[0]}_${timeRange}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
          }
        }}
        onRefresh={refresh}
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

      {/* Main Analytics Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Stats Overview */}
        {data && (
          <>
            <Box>
              <AnalyticsStatsGrid stats={data.stats} />
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
                <AnalyticsChartsSection
                  monthlyData={data.monthlyData}
                  planDistribution={data.planDistribution}
                />
              </Box>

              {/* Plan Distribution Donut Chart */}
              <Box>
                <AnalyticsChartsSection
                  monthlyData={data.monthlyData}
                  planDistribution={data.planDistribution}
                  showPlanDistribution={true}
                />
              </Box>
            </Box>

            {/* User Growth Chart */}
            <Box>
              <AnalyticsChartsSection
                monthlyData={data.monthlyData}
                showUserGrowth={true}
              />
            </Box>

            {/* Top Users Table */}
            <Box>
              <TopUsersTable users={data.topUsers} />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}