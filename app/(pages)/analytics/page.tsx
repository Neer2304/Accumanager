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
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
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
        {/* Header - Same style as All Actions page */}
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
                disabled={isLoading}
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

        {/* Error Alert */}
        {error && (
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
        )}

        {/* Loading State */}
        {isLoading && !data && (
          <Card sx={{ 
            textAlign: 'center', 
            py: 8, 
            mb: 3,
            px: 3
          }}>
            <LoadingIcon />
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 2
              }}
            >
              Loading Analytics Data...
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 1
              }}
            >
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
                isMobile={isMobile}
              />
              
              <StatsCard
                title="Total Sales"
                value={data.stats.totalSales}
                subtext="Items sold"
                type="sales"
                loading={isLoading}
                isMobile={isMobile}
              />
              
              <StatsCard
                title="Customers"
                value={data.stats.totalCustomers}
                subtext={`${data.recentCustomers.length} new recently`}
                type="customers"
                loading={isLoading}
                isMobile={isMobile}
              />
              
              <StatsCard
                title="Products"
                value={data.stats.totalProducts}
                subtext={`${data.stats.lowStockProducts} low in stock`}
                type="products"
                loading={isLoading}
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
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                height: { xs: 'auto', md: 350 }
              }}>
                <RevenueChart 
                  data={data.monthlyData} 
                  loading={isLoading}
                  isMobile={isMobile}
                />
                <CategoryChart 
                  data={data.categoryData} 
                  loading={isLoading}
                  isMobile={isMobile}
                />
              </Box>
            </Box>

            {/* Bottom Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              minHeight: { xs: 'auto', md: 300 }
            }}>
              <TopProductsList 
                products={data.topProducts}
                loading={isLoading}
                isMobile={isMobile}
              />
              <RecentInvoicesList 
                invoices={data.recentInvoices}
                loading={isLoading}
                isMobile={isMobile}
              />
            </Box>

            {/* Data Summary */}
            <Card sx={{ 
              mt: 3,
              p: 2
            }}>
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

        {/* Empty State */}
        {!isLoading && !data && !error && (
          <Card sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 3
          }}>
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
                mb: 3
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