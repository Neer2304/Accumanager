// components/googlereports/ReportsPage.tsx
'use client';

import React from 'react';
import {
  Box,
  Container,
  useTheme
} from '@mui/material';
import {
  TrendingUp as TrendIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

// Import components
import { ReportHeader } from './components/ReportHeader';
import { ReportMetricsGrid } from './components/ReportMetricsGrid';
import { ReportChartCard } from './components/ReportChartCard';
import { ReportStatusGrid } from './components/ReportStatusGrid';
import { ReportExportActions } from './components/ReportExportActions';
import { ReportLoadingState } from './components/ReportLoadingState';
import { ReportErrorAlert } from './components/ReportErrorAlert';

// Import charts
import { RevenueLineChart } from './charts/RevenueLineChart';
import { UserBarChart } from './charts/UserBarChart';
import { PlanPieChart } from './charts/PlanPieChart';
import { StatusPieChart } from './charts/StatusPieChart';

// Import hooks
import { useReports } from './hooks/useReports';

// Import types
import { StatusItem } from './components/types';

export default function ReportsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const {
    data,
    loading,
    error,
    timeRange,
    setError,
    handleExportReport,
    handleTimeRangeChange,
    formatCurrency,
    getStatusColor
  } = useReports();

  if (loading && !data) {
    return <ReportLoadingState />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
    }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <ReportHeader
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          onExport={handleExportReport}
          loading={loading}
        />

        {/* Error Alert */}
        {error && (
          <ReportErrorAlert message={error} onClose={() => setError('')} />
        )}

        {/* Key Metrics */}
        {data && (
          <>
            <ReportMetricsGrid
              metrics={data.metrics}
              formatCurrency={formatCurrency}
              loading={loading}
            />

            {/* Charts - Row 1 */}
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              mb: 3
            }}>
              {/* Revenue Chart */}
              <Box sx={{ 
                flex: {
                  xs: '1 1 100%',
                  md: '1 1 calc(66.666% - 24px)'
                },
                minWidth: '300px'
              }}>
                <ReportChartCard
                  title="Revenue Trends"
                  subtitle="Monthly revenue performance"
                  icon={<TrendIcon />}
                  chart={<RevenueLineChart data={data.monthlyRevenue} />}
                  loading={loading}
                />
              </Box>

              {/* User Growth */}
              <Box sx={{ 
                flex: {
                  xs: '1 1 100%',
                  md: '1 1 calc(33.333% - 24px)'
                },
                minWidth: '300px'
              }}>
                <ReportChartCard
                  title="User Growth"
                  subtitle="New user acquisition"
                  icon={<PeopleIcon />}
                  chart={<UserBarChart data={data.userGrowth} />}
                  loading={loading}
                />
              </Box>
            </Box>

            {/* Charts - Row 2 */}
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              mb: 3
            }}>
              {/* Plan Distribution */}
              <Box sx={{ 
                flex: {
                  xs: '1 1 100%',
                  md: '1 1 calc(50% - 24px)'
                },
                minWidth: '300px'
              }}>
                <ReportChartCard
                  title="Plan Distribution"
                  subtitle="User subscription plans"
                  icon={<PaymentIcon />}
                  chart={<PlanPieChart data={data.planDistribution} />}
                  loading={loading}
                  chartHeight={350}
                />
              </Box>

              {/* Payment Status */}
              <Box sx={{ 
                flex: {
                  xs: '1 1 100%',
                  md: '1 1 calc(50% - 24px)'
                },
                minWidth: '300px'
              }}>
                <ReportChartCard
                  title="Payment Status"
                  subtitle="Payment distribution by status"
                  icon={<PaymentIcon />}
                  chart={<StatusPieChart data={data.paymentStatus} />}
                  loading={loading}
                  chartHeight={350}
                />
              </Box>
            </Box>

            {/* Status Grids */}
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              mb: 3
            }}>
              {/* Subscription Status */}
              <Box sx={{ 
                flex: {
                  xs: '1 1 100%',
                  md: '1 1 calc(50% - 24px)'
                },
                minWidth: '300px'
              }}>
                <ReportStatusGrid
                  title="Subscription Status"
                  items={data.subscriptionStatus.map((item, index) => ({
                    label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
                    value: item.count,
                    color: getStatusColor(index),
                  }))}
                  columns={2}
                />
              </Box>

              {/* Quick Stats */}
              <Box sx={{ 
                flex: {
                  xs: '1 1 100%',
                  md: '1 1 calc(50% - 24px)'
                },
                minWidth: '300px'
              }}>
                <ReportStatusGrid
                  title="Quick Stats"
                  items={[
                    {
                      label: 'Active Users',
                      value: data.metrics.activeUsers,
                      color: '#4285f4',
                    },
                    {
                      label: 'New Users',
                      value: data.metrics.newUsers,
                      color: '#34a853',
                    },
                    {
                      label: 'Conversion Rate',
                      value: `${data.metrics.conversionRate}%`,
                      color: '#fbbc04',
                    },
                    {
                      label: 'Churn Rate',
                      value: `${data.metrics.churnRate}%`,
                      color: '#ea4335',
                    },
                  ]}
                  columns={2}
                />
              </Box>
            </Box>

            {/* Export Actions */}
            <Box sx={{ mt: 3 }}>
              <ReportExportActions
                onExport={handleExportReport}
                disabled={loading}
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}