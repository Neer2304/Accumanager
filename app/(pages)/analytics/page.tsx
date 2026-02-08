"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
  alpha,
  Breadcrumbs,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Alert } from '@/components/ui/Alert';
import { useAnalytics } from '@/hooks/useAnalytics';

// Import analytics components
import { AnalyticsGrid } from '@/components/analytics/AnalyticsGrid';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { AnalyticsSkeleton } from '@/components/analytics/AnalyticsSkeleton';

// Define the expected data structure
interface AnalyticsData {
  stats: {
    monthlyRevenue: number;
    totalSales: number;
    totalCustomers: number;
    totalProducts?: number; // Make optional since error says it doesn't exist
    lowStockProducts?: number; // Make optional
  };
  recentInvoices: Array<{
    invoiceNumber: string;
    invoiceDate: Date;
    grandTotal: number;
    paymentStatus: string;
    customer: {
      name: string;
    };
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    sales: number;
    profit: number;
    invoices: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export default function AnalyticsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
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

  // Type guard to check if data is valid
  const isDataValid = (data: any): data is AnalyticsData => {
    return data && 
           data.stats && 
           data.recentInvoices !== undefined && 
           data.topProducts !== undefined;
  };

  // Calculate stats from data with proper null checks
  const calculateStats = () => {
    if (!isDataValid(data)) return null;

    const totalMessages = data.recentInvoices.length || 0;
    const unreadMessages = data.recentInvoices.filter(inv => inv.paymentStatus === 'pending').length || 0;
    const starredMessages = data.topProducts.length || 0;
    const meetingInvites = data.categoryData?.length || 0;
    const pendingMeetings = data.monthlyData?.filter(m => m.revenue > 0).length || 0;
    const attachments = data.stats.totalProducts || 0;

    return {
      totalMessages,
      unreadMessages,
      starredMessages,
      meetingInvites,
      pendingMeetings,
      attachments
    };
  };

  const stats = calculateStats();
  const isValidData = isDataValid(data);

  if (isLoading) {
    return (
      <MainLayout title="Business Analytics">
        <Box sx={{ 
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
          minHeight: '100vh',
        }}>
          <AnalyticsSkeleton darkMode={darkMode} />
        </Box>
      </MainLayout>
    );
  }

  if (error && !isLoading) {
    return (
      <MainLayout title="Business Analytics">
        <Box sx={{ 
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
          minHeight: '100vh',
          py: 4,
        }}>
          <Container maxWidth="xl">
            <Alert
              severity="error"
              title="Error Loading Analytics"
              message={error}
              action={
                <Button
                  variant="outlined"
                  onClick={() => refetch()}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Retry
                </Button>
              }
              sx={{ mb: 3 }}
            />
            <AnalyticsSkeleton darkMode={darkMode} />
          </Container>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Business Analytics">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Analytics
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant="h4" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Business Analytics
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Real-time business performance metrics and insights
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <Chip
              label="Business Intelligence"
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                borderColor: alpha('#4285f4', 0.3),
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            />
            {!isOnline && (
              <Chip
                label="Offline Mode"
                variant="outlined"
                sx={{
                  backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                  borderColor: alpha('#fbbc04', 0.3),
                  color: darkMode ? '#fdd663' : '#fbbc04',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header Controls */}
          <Card
            title="Analytics Dashboard"
            subtitle={isValidData ? `Data from ${new Date(data.period.startDate).toLocaleDateString()} to ${new Date(data.period.endDate).toLocaleDateString()}` : 'Loading analytics data...'}
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<BackIcon />}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDownloadReport}
                  startIcon={<DownloadIcon />}
                  sx={{ 
                    backgroundColor: '#34a853',
                    '&:hover': { backgroundColor: '#2d9248' }
                  }}
                >
                  Download Report
                </Button>
              </Box>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          />

          {/* Stats Overview */}
          {stats && isValidData && (
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2, md: 3 },
              mb: { xs: 2, sm: 3, md: 4 },
            }}>
              {[
                { 
                  title: 'Monthly Revenue', 
                  value: data.stats.monthlyRevenue, 
                  icon: '💰', 
                  color: '#4285f4',
                  description: 'Current month revenue' 
                },
                { 
                  title: 'Total Sales', 
                  value: data.stats.totalSales, 
                  icon: '📈', 
                  color: '#34a853',
                  description: 'Items sold this month' 
                },
                { 
                  title: 'Total Customers', 
                  value: data.stats.totalCustomers, 
                  icon: '👥', 
                  color: '#ea4335',
                  description: 'Active customers' 
                },
                { 
                  title: 'Products', 
                  value: data.stats.totalProducts || 0, // Use 0 as fallback
                  icon: '📦', 
                  color: '#fbbc04',
                  description: 'Active products' 
                },
                { 
                  title: 'Pending Invoices', 
                  value: data.recentInvoices.filter(inv => inv.paymentStatus === 'pending').length || 0, 
                  icon: '📄', 
                  color: '#8ab4f8',
                  description: 'Awaiting payment' 
                },
                { 
                  title: 'Low Stock', 
                  value: data.stats.lowStockProducts || 0, // Use 0 as fallback
                  icon: '⚠️', 
                  color: '#ff6d01',
                  description: 'Products needing restock' 
                },
              ].map((stat, index) => (
                <Card 
                  key={`stat-${index}`}
                  hover
                  sx={{ 
                    flex: '1 1 calc(33.333% - 16px)', 
                    minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 16px)' },
                    p: { xs: 1.5, sm: 2, md: 3 }, 
                    borderRadius: '16px', 
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    background: darkMode 
                      ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                      : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-2px)', 
                      boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368', 
                            fontWeight: 400,
                            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                            display: 'block',
                          }}
                        >
                          {stat.title}
                        </Typography>
                        <Typography 
                          variant="h4"
                          sx={{ 
                            color: stat.color, 
                            fontWeight: 600,
                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                          }}
                        >
                          {typeof stat.value === 'number' && stat.title.includes('Revenue') 
                            ? `₹${stat.value.toLocaleString()}`
                            : typeof stat.value === 'number' && stat.value > 999 
                              ? stat.value.toLocaleString()
                              : stat.value
                          }
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        p: { xs: 0.75, sm: 1 }, 
                        borderRadius: '10px', 
                        backgroundColor: alpha(stat.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                      }}>
                        {stat.icon}
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                        display: 'block',
                      }}
                    >
                      {stat.description}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          )}

          {/* Charts Section */}
          {isValidData && (
            <AnalyticsCharts
              monthlyData={data.monthlyData}
              categoryData={data.categoryData}
              darkMode={darkMode}
            />
          )}

          {/* Analytics Grid */}
          {isValidData && (
            <AnalyticsGrid
              topProducts={data.topProducts}
              recentInvoices={data.recentInvoices}
              darkMode={darkMode}
            />
          )}

          {/* Empty State */}
          {!isValidData && !isLoading && !error && (
            <Card sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 3,
              mt: 4,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <AnalyticsIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                No Analytics Data Available
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 3,
                  maxWidth: 500,
                  mx: 'auto',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}
              >
                Start adding products, customers, and invoices to see your business analytics
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  onClick={() => window.location.href = '/products/add'}
                  sx={{ 
                    backgroundColor: '#34a853',
                    '&:hover': { backgroundColor: '#2d9248' }
                  }}
                >
                  Add Products
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => window.location.href = '/customers'}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Manage Customers
                </Button>
              </Box>
            </Card>
          )}
        </Container>
      </Box>
    </MainLayout>
  );
}