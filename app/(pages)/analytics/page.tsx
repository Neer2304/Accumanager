"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Button,
  Stack,
  alpha,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link as MuiLink,
  Container,
  Skeleton,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Analytics,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsIcon, OfflineIcon, LoadingIcon } from '@/assets/icons/AnalyticsIcons';
import StatsCard from '@/components/analytics/AnalyticsStatsCard';
import RevenueChart from '@/components/analytics/RevenueChart';
import CategoryChart from '@/components/analytics/CategoryChart';
import TopProductsList from '@/components/analytics/TopProductsList';
import RecentInvoicesList from '@/components/analytics/RecentInvoicesList';

// Loading Skeleton Component
const AnalyticsSkeleton = () => (
  <>
    {/* Header Skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width={120} height={40} sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="text" width={200} height={25} />
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Box>
          <Skeleton variant="text" width={300} height={50} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={250} height={25} />
        </Box>
        <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 1 }} />
      </Box>
    </Box>

    {/* Stats Cards Skeleton */}
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
      gap: 2,
      mb: 4
    }}>
      {[1, 2, 3, 4].map((item) => (
        <Card key={item} sx={{ p: 2 }}>
          <CardContent sx={{ p: '16px !important' }}>
            <Skeleton variant="text" width="60%" height={25} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={20} />
          </CardContent>
        </Card>
      ))}
    </Box>

    {/* Charts Section Skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width={250} height={35} sx={{ mb: 3 }} />
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        height: { xs: 'auto', md: 350 }
      }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
      </Box>
    </Box>

    {/* Lists Section Skeleton */}
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      gap: 3,
      mb: 3
    }}>
      <Card sx={{ height: '100%', minHeight: 300 }}>
        <CardContent>
          <Skeleton variant="text" width={200} height={35} sx={{ mb: 2 }} />
          {[1, 2, 3, 4, 5].map((item) => (
            <Box key={item} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="90%" height={25} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          ))}
        </CardContent>
      </Card>
      
      <Card sx={{ height: '100%', minHeight: 300 }}>
        <CardContent>
          <Skeleton variant="text" width={200} height={35} sx={{ mb: 2 }} />
          {[1, 2, 3, 4, 5].map((item) => (
            <Box key={item} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="90%" height={25} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>

    {/* Data Summary Skeleton */}
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Skeleton variant="text" width="100%" height={20} />
      </CardContent>
    </Card>
  </>
);

export default function AnalyticsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [timeRange] = useState('monthly');
  
  const { 
    data, 
    isLoading, 
    error, 
    isOnline, 
    refetch, 
    downloadReport 
  } = useAnalytics(timeRange);

  const handleDownloadReport = async () => {
    const success = await downloadReport();
    if (success) {
      // Show success message
      console.log('Report downloaded successfully');
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <MainLayout title="Business Analytics">
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Loading State - Full Page Skeleton */}
        {isLoading && (
          <AnalyticsSkeleton />
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Box sx={{ mb: 3 }}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                py: 2
              }}
              action={
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
            <AnalyticsSkeleton />
          </Box>
        )}

        {/* Data Content */}
        {!isLoading && !error && data && (
          <>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Button
                startIcon={<BackIcon />}
                onClick={handleBack}
                sx={{ mb: 2 }}
                size="small"
              >
                Back to Dashboard
              </Button>

              <Breadcrumbs sx={{ mb: 2 }}>
                <MuiLink
                  component={Link}
                  href="/dashboard"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    textDecoration: 'none',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  Dashboard
                </MuiLink>
                <Typography color="text.primary">Analytics</Typography>
              </Breadcrumbs>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 3
              }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Business Analytics
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Real-time business performance metrics and insights
                  </Typography>
                </Box>

                <Stack 
                  direction="row" 
                  spacing={2} 
                  alignItems="center"
                  sx={{ flexWrap: 'wrap' }}
                >
                  {!isOnline && (
                    <Card sx={{ 
                      px: 2, 
                      py: 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      bgcolor: alpha('#ed6c02', 0.1),
                      fontSize: '0.75rem'
                    }}>
                      <OfflineIcon />
                      <Typography 
                        variant="caption" 
                        color="warning.main"
                      >
                        Offline Mode
                      </Typography>
                    </Card>
                  )}
                  
                  <Button 
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadReport}
                    size="medium"
                    sx={{ 
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Download Report
                  </Button>
                </Stack>
              </Box>
            </Box>

            {/* Key Stats Cards */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 4
            }}>
              <StatsCard
                title="Monthly Revenue"
                value={data.stats.monthlyRevenue}
                subtext={`From ${data.recentInvoices.length} invoices`}
                type="revenue"
                loading={false}
                isMobile={isMobile}
              />
              
              <StatsCard
                title="Total Sales"
                value={data.stats.totalSales}
                subtext="Items sold"
                type="sales"
                loading={false}
                isMobile={isMobile}
              />
              
              <StatsCard
                title="Customers"
                value={data.stats.totalCustomers}
                subtext={`${data.recentCustomers.length} new recently`}
                type="customers"
                loading={false}
                isMobile={isMobile}
              />
              
              <StatsCard
                title="Products"
                value={data.stats.totalProducts}
                subtext={`${data.stats.lowStockProducts} low in stock`}
                type="products"
                loading={false}
                isMobile={isMobile}
              />
            </Box>

            {/* Charts Section */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ 
                  mb: 2
                }}
              >
                Revenue & Sales Trend
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                height: { xs: 'auto', md: 350 }
              }}>
                <RevenueChart 
                  data={data.monthlyData} 
                  loading={false}
                  isMobile={isMobile}
                />
                <CategoryChart 
                  data={data.categoryData} 
                  loading={false}
                  isMobile={isMobile}
                />
              </Box>
            </Box>

            {/* Bottom Section */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              mb: 3
            }}>
              <TopProductsList 
                products={data.topProducts}
                loading={false}
                isMobile={isMobile}
              />
              <RecentInvoicesList 
                invoices={data.recentInvoices}
                loading={false}
                isMobile={isMobile}
              />
            </Box>

            {/* Data Summary */}
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: '16px !important' }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                >
                  Data Period: {new Date(data.period.startDate).toLocaleDateString()} to{' '}
                  {new Date(data.period.endDate).toLocaleDateString()} • Monthly View
                </Typography>
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State - When no data available */}
        {!isLoading && !error && !data && (
          <Card sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 3,
            mt: 4
          }}>
            <Analytics sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography 
              variant="h6" 
              gutterBottom
            >
              No Analytics Data Available
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              Start adding products, customers, and invoices to see your business analytics
            </Typography>
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              justifyContent="center"
            >
              <Button 
                variant="contained" 
                onClick={() => window.location.href = '/products/add'}
                size="medium"
              >
                Add Products
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => window.location.href = '/customers'}
                size="medium"
              >
                Manage Customers
              </Button>
            </Stack>
          </Card>
        )}
      </Container>
    </MainLayout>
  );
}