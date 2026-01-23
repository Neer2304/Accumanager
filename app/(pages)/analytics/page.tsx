// app/(pages)/analytics/page.tsx - UPDATED WITH RESPONSIVE FIXES
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
  IconButton,
  useMediaQuery,
  useTheme,
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

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <MainLayout title="Business Analytics">
      <Box sx={{ 
        p: isMobile ? 1 : isTablet ? 2 : 3,
        maxWidth: '100%',
        overflowX: 'hidden'
      }}>
        {/* Header with Back Button */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          mb: isMobile ? 2 : 4,
          gap: isMobile ? 1 : 2,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? 1 : 2,
            mb: isMobile ? 1 : 0
          }}>
            <IconButton 
              onClick={handleGoBack}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                mr: isMobile ? 0.5 : 1,
                p: isMobile ? 0.5 : 1
              }}
            >
              <ArrowBack fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <AnalyticsIcon />
            <Box>
              <Typography 
                variant={isMobile ? "h6" : isTablet ? "h5" : "h4"} 
                fontWeight="bold" 
                gutterBottom={!isMobile}
                sx={{ 
                  fontSize: isMobile ? '1.1rem' : isTablet ? '1.5rem' : '2rem',
                  lineHeight: isMobile ? 1.2 : 1.5
                }}
              >
                Business Analytics
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  display: isMobile ? 'none' : 'block'
                }}
              >
                Real-time business performance metrics
              </Typography>
            </Box>
          </Box>
          
          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={isMobile ? 1 : 2} 
            alignItems={isMobile ? "stretch" : "center"}
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            {!isOnline && (
              <Card sx={{ 
                px: isMobile ? 1 : 2, 
                py: isMobile ? 0.5 : 1, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                bgcolor: alpha('#ed6c02', 0.1),
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }}>
                <OfflineIcon />
                <Typography 
                  variant="caption" 
                  color="warning.main"
                  sx={{ fontSize: isMobile ? '0.7rem' : 'inherit' }}
                >
                  Offline Mode
                </Typography>
              </Card>
            )}
            
            <Button 
              variant="outlined" 
              onClick={handleDownloadReport}
              disabled={isLoading}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                px: isMobile ? 1 : 2,
                py: isMobile ? 0.5 : 1
              }}
            >
              Download Report
            </Button>
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: isMobile ? 2 : 3, 
              borderRadius: 2,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              py: isMobile ? 1 : 2
            }}
            action={
              <Button 
                color="inherit" 
                size={isMobile ? "small" : "medium"}
                onClick={() => refetch()}
                sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
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
            py: isMobile ? 4 : 8, 
            mb: isMobile ? 2 : 3,
            px: isMobile ? 1 : 3
          }}>
            <LoadingIcon />
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              sx={{ 
                mt: isMobile ? 1 : 2,
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Loading Analytics Data...
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: isMobile ? 0.5 : 1,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                px: isMobile ? 1 : 0
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
              flexDirection: isMobile ? 'column' : 'row',
              flexWrap: 'wrap',
              gap: isMobile ? 1 : 2,
              mb: isMobile ? 2 : 4
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
            <Box sx={{ mb: isMobile ? 2 : 4 }}>
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                fontWeight="bold" 
                sx={{ 
                  mb: isMobile ? 1 : 2,
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}
              >
                Revenue & Sales Trend
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : isTablet ? 'column' : 'row',
                gap: isMobile ? 1 : 3,
                height: isMobile ? 'auto' : 350
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
              flexDirection: isMobile ? 'column' : isTablet ? 'column' : 'row',
              gap: isMobile ? 1 : 3,
              minHeight: isMobile ? 'auto' : 300
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
              mt: isMobile ? 1 : 3,
              p: isMobile ? 1 : 2
            }}>
              <CardContent sx={{ p: isMobile ? '8px !important' : 2 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}
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
            py: isMobile ? 4 : 8,
            px: isMobile ? 1 : 3
          }}>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              gutterBottom
              sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
            >
              No Analytics Data Available
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: isMobile ? 1.5 : 3,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                px: isMobile ? 1 : 0
              }}
            >
              Start adding products, customers, and invoices to see your business analytics
            </Typography>
            <Stack 
              direction={isMobile ? "column" : "row"} 
              spacing={isMobile ? 1 : 2} 
              justifyContent="center"
              sx={{ width: '100%' }}
            >
              <Button 
                variant="contained" 
                onClick={() => window.location.href = '/products/add'}
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  px: isMobile ? 2 : 3
                }}
              >
                Add Products
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => window.location.href = '/customers'}
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  px: isMobile ? 2 : 3
                }}
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