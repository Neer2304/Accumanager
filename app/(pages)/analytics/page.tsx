// app/(pages)/analytics/page.tsx - UPDATED WITH COMPONENTS AND BACK BUTTON
"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Button,
  Stack,
  alpha,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsIcon, OfflineIcon, LoadingIcon } from '@/assets/icons/AnalyticsIcons';
import StatsCard from '@/components/analytics/AnalyticsStatsCard';
import RevenueChart from '@/components/analytics/RevenueChart';
import CategoryChart from '@/components/analytics/CategoryChart';
import TopProductsList from '@/components/analytics/TopProductsList';
import RecentInvoicesList from '@/components/analytics/RecentInvoicesList';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('monthly');
  
  const { 
    data, 
    isLoading, 
    error, 
    isOnline, 
    updateTimeRange, 
    refetch, 
    downloadReport 
  } = useAnalytics(timeRange);

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange);
    updateTimeRange(newRange);
  };

  const handleDownloadReport = async () => {
    const success = await downloadReport();
    if (success) {
      // Show success message
      console.log('Report downloaded successfully');
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <MainLayout title="Business Analytics">
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header with Back Button */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 4,
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={handleGoBack}
              sx={{ mr: 1 }}
              size="small"
            >
              <ArrowBack />
            </IconButton>
            <AnalyticsIcon />
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Business Analytics
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time business performance metrics
              </Typography>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {!isOnline && (
              <Card sx={{ 
                px: 2, 
                py: 1, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                bgcolor: alpha('#ed6c02', 0.1) 
              }}>
                <OfflineIcon />
                <Typography variant="caption" color="warning.main">
                  Offline Mode
                </Typography>
              </Card>
            )}
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => handleTimeRangeChange(e.target.value)}
                size="small"
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              onClick={handleDownloadReport}
              disabled={isLoading}
            >
              Download Report
            </Button>
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && !data && (
          <Card sx={{ textAlign: 'center', py: 8, mb: 3 }}>
            <LoadingIcon />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading Analytics Data...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait while we fetch your business insights
            </Typography>
          </Card>
        )}

        {/* Data Content */}
        {data && (
          <>
            {/* Key Stats Cards */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: 2,
              mb: 4
            }}>
              <StatsCard
                title="Monthly Revenue"
                value={data.stats.monthlyRevenue}
                subtext={`From ${data.recentInvoices.length} invoices`}
                type="revenue"
                loading={isLoading}
              />
              
              <StatsCard
                title="Total Sales"
                value={data.stats.totalSales}
                subtext="Items sold"
                type="sales"
                loading={isLoading}
              />
              
              <StatsCard
                title="Customers"
                value={data.stats.totalCustomers}
                subtext={`${data.recentCustomers.length} new recently`}
                type="customers"
                loading={isLoading}
              />
              
              <StatsCard
                title="Products"
                value={data.stats.totalProducts}
                subtext={`${data.stats.lowStockProducts} low in stock`}
                type="products"
                loading={isLoading}
              />
            </Box>

            {/* Charts Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Revenue & Sales Trend
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3 
              }}>
                <RevenueChart 
                  data={data.monthlyData} 
                  loading={isLoading}
                />
                <CategoryChart 
                  data={data.categoryData} 
                  loading={isLoading}
                />
              </Box>
            </Box>

            {/* Bottom Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', lg: 'row' },
              gap: 3 
            }}>
              <TopProductsList 
                products={data.topProducts}
                loading={isLoading}
              />
              <RecentInvoicesList 
                invoices={data.recentInvoices}
                loading={isLoading}
              />
            </Box>

            {/* Data Summary */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Data Period: {new Date(data.period.startDate).toLocaleDateString()} to{' '}
                  {new Date(data.period.endDate).toLocaleDateString()} •{' '}
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} View
                </Typography>
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !data && !error && (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom>
              No Analytics Data Available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start adding products, customers, and invoices to see your business analytics
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                onClick={() => window.location.href = '/products/add'}
              >
                Add Products
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => window.location.href = '/customers'}
              >
                Manage Customers
              </Button>
            </Stack>
          </Card>
        )}
      </Box>
    </MainLayout>
  );
}