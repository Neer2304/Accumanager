"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Alert,
  CircularProgress,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Assessment,
  ArrowBack,
  Refresh,
  Download,
} from '@mui/icons-material';
import { AnalyticsChartsSection } from '@/components/admin/analytics/AnalyticsChartsSection';
import { AnalyticsStatsGrid } from '@/components/admin/analytics/AnalyticsStatsGrid';
import { TopUsersTable } from '@/components/admin/analytics/TopUsersTable';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import Link from 'next/link';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';
  
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
        gap: 2,
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      }}>
        <CircularProgress size={60} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
        <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
          Loading analytics dashboard...
        </Typography>
      </Box>
    );
  }

  if (authError) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: '1px solid #ea4335',
            color: darkMode ? '#e8eaed' : '#202124',
            '& .MuiAlert-icon': { color: '#ea4335' },
          }}
        >
          Authentication failed. Redirecting to login page...
        </Alert>
      </Container>
    );
  }

  const handleExportData = () => {
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
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
          <Button
            component={Link}
            href="/admin/dashboard"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 3,
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.08)',
              },
            }}
          >
            Back to Dashboard
          </Button>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: '16px',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Assessment sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Box>
                <Typography 
                  variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                    lineHeight: 1.2,
                  }}
                >
                  Analytics Dashboard
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mt: 0.5,
                  }}
                >
                  Real-time business insights and performance metrics
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e: SelectChangeEvent) => setTimeRange(e.target.value)}
                  sx={{
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                    }
                  }}
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refresh}
                size="small"
                sx={{
                  borderRadius: '8px',
                  borderWidth: 2,
                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': { 
                    borderWidth: 2,
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  },
                  minHeight: { xs: 40, sm: 36 }
                }}
              >
                Refresh
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleExportData}
                size="small"
                sx={{
                  backgroundColor: '#1a73e8',
                  '&:hover': {
                    backgroundColor: '#1669c1',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
                  },
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
              >
                Export Data
              </Button>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: '1px solid #ea4335',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#ea4335' },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Main Analytics Content */}
        {data && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Stats Overview */}
            <Box>
              <AnalyticsStatsGrid stats={data.stats} darkMode={darkMode} />
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
                  darkMode={darkMode}
                />
              </Box>

              {/* Plan Distribution Donut Chart */}
              <Box>
                <AnalyticsChartsSection
                  monthlyData={data.monthlyData}
                  planDistribution={data.planDistribution}
                  showPlanDistribution={true}
                  darkMode={darkMode}
                />
              </Box>
            </Box>

            {/* User Growth Chart */}
            <Box>
              <AnalyticsChartsSection
                monthlyData={data.monthlyData}
                showUserGrowth={true}
                darkMode={darkMode}
              />
            </Box>

            {/* Top Users Table */}
            <Box>
              <TopUsersTable users={data.topUsers} darkMode={darkMode} />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}