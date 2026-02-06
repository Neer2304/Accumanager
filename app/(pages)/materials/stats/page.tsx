'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  CircularProgress, 
  Box,
  Alert,
  Button,
  Paper,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Breadcrumbs,
  Link as MuiLink,
  MenuItem,
  Menu,
  Divider
} from '@mui/material';
import { 
  Refresh, 
  Download,
  Home as HomeIcon,
  TrendingUp,
  Inventory,
  AttachMoney,
  Warning,
  Error,
  BarChart,
  PieChart,
  Timeline,
  InsertDriveFile as ExcelIcon,
  PictureAsPdf as PdfIcon,
  CloudDownload as CloudDownloadIcon,
  Category as CategoryIcon,
  Storage,
  Assessment,
  Analytics,
  ShowChart,
  DonutLarge,
  Equalizer
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  PointElement,
  LineElement
);

export default function StatsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/material/stats');
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error fetching statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  const handleExportClick = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    handleExportMenuClose();
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel...');
    handleExportMenuClose();
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
    handleExportMenuClose();
  };

  const handleExportAll = () => {
    console.log('Exporting all data...');
    handleExportMenuClose();
  };

  // Generate chart data
  const getChartData = () => {
    if (!stats) return null;

    const { categories = [], status = [], overview = { totalMaterials: 0 } } = stats;

    // Color palette
    const colors = {
      primary: '#4285f4',
      success: '#34a853',
      warning: '#fbbc04',
      error: '#ea4335',
      secondary: '#8ab4f8',
      tertiary: '#f28b82'
    };

    // Category distribution chart
    const topCategories = categories.slice(0, 5);
    const categoryData = {
      labels: topCategories.map(c => c.category),
      datasets: [{
        data: topCategories.map(c => c.count),
        backgroundColor: [
          colors.primary,
          colors.success,
          colors.warning,
          colors.error,
          colors.secondary
        ],
        borderWidth: 0,
        hoverOffset: 15,
        borderRadius: 8
      }]
    };

    // Stock status chart - Horizontal bar
    const statusItems = [
      { label: 'In Stock', value: status.find(s => s.status === 'in-stock')?.count || 0, color: colors.success },
      { label: 'Low Stock', value: status.find(s => s.status === 'low-stock')?.count || 0, color: colors.warning },
      { label: 'Out of Stock', value: status.find(s => s.status === 'out-of-stock')?.count || 0, color: colors.error }
    ].filter(item => item.value > 0);

    const statusData = {
      labels: statusItems.map(s => s.label),
      datasets: [{
        data: statusItems.map(s => s.value),
        backgroundColor: statusItems.map(s => alpha(s.color, 0.8)),
        borderColor: statusItems.map(s => s.color),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    };

    // Usage trend chart - Last 7 days
    const usageData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Material Used',
          data: [42, 58, 35, 62, 48, 52, 40],
          borderColor: colors.error,
          backgroundColor: alpha(colors.error, 0.1),
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.error,
          pointBorderColor: darkMode ? '#202124' : '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Material Restocked',
          data: [25, 38, 45, 30, 42, 28, 35],
          borderColor: colors.success,
          backgroundColor: alpha(colors.success, 0.1),
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.success,
          pointBorderColor: darkMode ? '#202124' : '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };

    // Stock value trend - Last 6 months
    const valueData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Stock Value ($)',
        data: [12500, 14500, 18000, 22000, 19500, 24000],
        backgroundColor: [
          alpha(colors.primary, 0.8),
          alpha(colors.primary, 0.8),
          alpha(colors.primary, 0.8),
          alpha(colors.primary, 0.8),
          alpha(colors.primary, 0.8),
          alpha(colors.primary, 0.8)
        ],
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    };

    return { categoryData, statusData, usageData, valueData };
  };

  // Common chart options
  const getChartOptions = (type = 'default') => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            padding: isMobile ? 15 : 20,
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            boxHeight: 8,
            color: darkMode ? '#e8eaed' : '#202124',
            font: {
              size: isMobile ? 10 : isTablet ? 11 : 12,
              family: "'Roboto', 'Helvetica', 'Arial', sans-serif"
            }
          }
        },
        tooltip: {
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          titleColor: darkMode ? '#e8eaed' : '#202124',
          bodyColor: darkMode ? '#e8eaed' : '#202124',
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          borderWidth: 1,
          cornerRadius: 8,
          padding: isMobile ? 8 : 12,
          titleFont: {
            size: isMobile ? 11 : 12,
            weight: '500' as const
          },
          bodyFont: {
            size: isMobile ? 11 : 12
          },
          boxPadding: 6
        }
      },
      layout: {
        padding: {
          top: isMobile ? 10 : 20,
          bottom: isMobile ? 10 : 20
        }
      }
    };

    if (type === 'bar') {
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: darkMode ? '#3c4043' : alpha('#dadce0', 0.3),
              drawBorder: false
            },
            ticks: {
              color: darkMode ? '#9aa0a6' : '#5f6368',
              font: {
                size: isMobile ? 10 : isTablet ? 11 : 12
              },
              padding: 8
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: darkMode ? '#9aa0a6' : '#5f6368',
              font: {
                size: isMobile ? 10 : isTablet ? 11 : 12
              },
              padding: 8
            }
          }
        }
      };
    }

    if (type === 'line') {
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: darkMode ? '#3c4043' : alpha('#dadce0', 0.3),
              drawBorder: false
            },
            ticks: {
              color: darkMode ? '#9aa0a6' : '#5f6368',
              font: {
                size: isMobile ? 10 : isTablet ? 11 : 12
              },
              padding: 8
            }
          },
          x: {
            grid: {
              color: darkMode ? '#3c4043' : alpha('#dadce0', 0.3),
              drawBorder: false
            },
            ticks: {
              color: darkMode ? '#9aa0a6' : '#5f6368',
              font: {
                size: isMobile ? 10 : isTablet ? 11 : 12
              },
              padding: 8
            }
          }
        }
      };
    }

    return baseOptions;
  };

  if (loading && !stats) {
    return (
      <MainLayout title="Material Statistics">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            backgroundColor: darkMode ? '#202124' : '#ffffff',
          }}
        >
          <CircularProgress sx={{ color: '#4285f4' }} />
        </Box>
      </MainLayout>
    );
  }

  const chartData = getChartData();

  return (
    <MainLayout title="Material Statistics">
      <Box sx={{ 
        p: { xs: 1, sm: 2, md: 3 },
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
        transition: 'all 0.3s ease',
      }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Fade in>
            <Breadcrumbs 
              sx={{ 
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
              }}
            >
              <MuiLink
                component={Link}
                href="/dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 300,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
                  "&:hover": { 
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                }}
              >
                <HomeIcon sx={{ 
                  mr: 0.5, 
                  fontSize: { xs: '14px', sm: '16px', md: '18px' }
                }} />
                Dashboard
              </MuiLink>
              <Typography 
                color={darkMode ? '#e8eaed' : '#202124'}
                fontWeight={400}
                fontSize={{ xs: '0.7rem', sm: '0.8rem', md: '0.85rem' }}
              >
                Statistics
              </Typography>
            </Breadcrumbs>
          </Fade>

          <Fade in timeout={300}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1.5, sm: 2 },
                mb: { xs: 2, sm: 3 },
              }}
            >
              <Box>
                <Typography 
                  variant={isMobile ? "h6" : isTablet ? "h5" : "h4"}
                  fontWeight={500}
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}
                >
                  Material Statistics
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 300,
                    fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem', lg: '1rem' },
                    lineHeight: 1.4
                  }}
                >
                  Comprehensive analytics and insights for your inventory management
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ 
                  width: { xs: "100%", sm: "auto" },
                  flexWrap: 'wrap',
                }}
              >
                {/* Time Range Filter */}
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {['7d', '30d', '90d', '1y'].map((range) => (
                    <Chip
                      key={range}
                      label={range}
                      onClick={() => setTimeRange(range)}
                      variant={timeRange === range ? "filled" : "outlined"}
                      size="small"
                      sx={{
                        backgroundColor: timeRange === range ? '#4285f4' : 'transparent',
                        color: timeRange === range ? 'white' : (darkMode ? '#e8eaed' : '#202124'),
                        borderColor: darkMode ? '#3c4043' : '#dadce0',
                        fontWeight: 500,
                        fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                        height: { xs: 28, sm: 32 },
                        '&:hover': {
                          backgroundColor: timeRange === range ? '#4285f4' : (darkMode ? '#3c4043' : '#f8f9fa'),
                        }
                      }}
                    />
                  ))}
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    variant="outlined"
                    disabled={loading}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      borderRadius: '12px',
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      fontWeight: 500,
                      minWidth: 'auto',
                      px: { xs: 1.5, sm: 2, md: 3 },
                      py: { xs: 0.5, sm: 0.75 },
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                      "&:hover": {
                        borderColor: darkMode ? '#5f6368' : '#202124',
                        backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                      },
                    }}
                  >
                    {isMobile ? '' : 'Refresh'}
                  </Button>

                  <Button
                    startIcon={<Download />}
                    onClick={handleExportClick}
                    variant="contained"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: '#4285f4',
                      color: 'white',
                      fontWeight: 500,
                      minWidth: 'auto',
                      px: { xs: 1.5, sm: 2, md: 3 },
                      py: { xs: 0.5, sm: 0.75 },
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                      "&:hover": {
                        backgroundColor: '#3367d6',
                        boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                      },
                    }}
                  >
                    {isMobile ? '' : 'Export'}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Fade>

          {/* Export Menu */}
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={handleExportMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                borderRadius: '12px',
                boxShadow: darkMode 
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(0,0,0,0.1)',
                minWidth: 180,
                mt: 1
              }
            }}
          >
            <MenuItem 
              onClick={handleExportCSV}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: '0.875rem',
                fontWeight: 400,
                py: 1.5,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <ExcelIcon fontSize="small" />
                <Typography variant="body2">CSV Export</Typography>
              </Stack>
            </MenuItem>
            <MenuItem 
              onClick={handleExportExcel}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: '0.875rem',
                fontWeight: 400,
                py: 1.5,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <ExcelIcon fontSize="small" />
                <Typography variant="body2">Excel Export</Typography>
              </Stack>
            </MenuItem>
            <MenuItem 
              onClick={handleExportPDF}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: '0.875rem',
                fontWeight: 400,
                py: 1.5,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <PdfIcon fontSize="small" />
                <Typography variant="body2">PDF Report</Typography>
              </Stack>
            </MenuItem>
            <Divider sx={{ 
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              my: 0.5,
            }} />
            <MenuItem 
              onClick={handleExportAll}
              sx={{
                color: darkMode ? '#8ab4f8' : '#1a73e8',
                fontSize: '0.875rem',
                fontWeight: 500,
                py: 1.5,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <CloudDownloadIcon fontSize="small" />
                <Typography variant="body2">Export All Data</Typography>
              </Stack>
            </MenuItem>
          </Menu>
        </Box>

        {/* Error Alert */}
        {error && (
          <Fade in>
            <Alert
              severity="error"
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                borderRadius: '12px',
                backgroundColor: darkMode ? '#422006' : '#fef7e0',
                color: darkMode ? '#fbbc04' : '#f57c00',
                border: darkMode ? '1px solid #653c00' : '1px solid #ffcc80',
                fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                fontWeight: 400,
              }}
              onClose={() => setError('')}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={handleRefresh}
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Stats Summary Cards */}
        <Fade in timeout={400}>
          <Box sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 }
          }}>
            {[
              { 
                title: 'Total Materials', 
                value: stats?.overview?.totalMaterials || 0, 
                icon: <Inventory />, 
                color: '#4285f4',
                description: 'Across all categories'
              },
              { 
                title: 'Stock Value', 
                value: `$${stats?.overview?.totalStockValue?.toLocaleString() || '0'}`, 
                icon: <AttachMoney />, 
                color: '#34a853',
                description: 'Current valuation'
              },
              { 
                title: 'Low Stock', 
                value: stats?.overview?.lowStockCount || 0, 
                icon: <Warning />, 
                color: '#fbbc04',
                description: 'Needs attention'
              },
              { 
                title: 'Out of Stock', 
                value: stats?.overview?.outOfStockCount || 0, 
                icon: <Error />, 
                color: '#ea4335',
                description: 'Restock required'
              }
            ].map((stat, index) => (
              <Paper
                key={index}
                sx={{
                  flex: '1 1 calc(25% - 24px)',
                  minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 24px)' },
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
                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`
                  }
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ 
                      p: { xs: 0.75, sm: 1 },
                      borderRadius: '10px',
                      backgroundColor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {React.cloneElement(stat.icon, { 
                        sx: { 
                          fontSize: { xs: 20, sm: 24, md: 28 },
                          color: stat.color 
                        } 
                      })}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontWeight: 400,
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          display: 'block',
                          lineHeight: 1.2
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant={isMobile ? "h6" : "h5"}
                        sx={{ 
                          color: stat.color,
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                          lineHeight: 1.2
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 300,
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      display: 'block'
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Fade>

        {/* Charts Grid - Equal Size and Spacing */}
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 2, sm: 3, md: 4 }
        }}>
          {/* Chart 1: Category Distribution */}
          <Fade in timeout={500}>
            <Paper
              sx={{
                flex: '1 1 calc(50% - 12px)',
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', lg: 'calc(25% - 24px)' },
                p: { xs: 1.5, sm: 2, md: 3 },
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                display: 'flex',
                flexDirection: 'column',
                minHeight: { xs: 320, sm: 360, md: 400 }
              }}
            >
              <Stack spacing={2} sx={{ height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ 
                    p: 0.75,
                    borderRadius: '8px',
                    backgroundColor: alpha('#4285f4', 0.1)
                  }}>
                    <DonutLarge sx={{ fontSize: 20, color: '#4285f4' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant={isMobile ? "subtitle2" : "h6"}
                      fontWeight={500}
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        lineHeight: 1.2
                      }}
                    >
                      Category Distribution
                    </Typography>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }
                      }}
                    >
                      Materials by category
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ 
                  flex: 1, 
                  position: 'relative',
                  minHeight: { xs: 200, sm: 240, md: 280 }
                }}>
                  {chartData && (
                    <Doughnut 
                      data={chartData.categoryData} 
                      options={getChartOptions()} 
                    />
                  )}
                </Box>
              </Stack>
            </Paper>
          </Fade>

          {/* Chart 2: Stock Status */}
          <Fade in timeout={600}>
            <Paper
              sx={{
                flex: '1 1 calc(50% - 12px)',
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', lg: 'calc(25% - 24px)' },
                p: { xs: 1.5, sm: 2, md: 3 },
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                display: 'flex',
                flexDirection: 'column',
                minHeight: { xs: 320, sm: 360, md: 400 }
              }}
            >
              <Stack spacing={2} sx={{ height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ 
                    p: 0.75,
                    borderRadius: '8px',
                    backgroundColor: alpha('#34a853', 0.1)
                  }}>
                    <Equalizer sx={{ fontSize: 20, color: '#34a853' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant={isMobile ? "subtitle2" : "h6"}
                      fontWeight={500}
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        lineHeight: 1.2
                      }}
                    >
                      Stock Status
                    </Typography>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }
                      }}
                    >
                      Inventory health overview
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ 
                  flex: 1, 
                  position: 'relative',
                  minHeight: { xs: 200, sm: 240, md: 280 }
                }}>
                  {chartData && (
                    <Bar 
                      data={chartData.statusData} 
                      options={getChartOptions('bar')} 
                    />
                  )}
                </Box>
              </Stack>
            </Paper>
          </Fade>

          {/* Chart 3: Usage Trends */}
          <Fade in timeout={700}>
            <Paper
              sx={{
                flex: '1 1 calc(50% - 12px)',
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', lg: 'calc(25% - 24px)' },
                p: { xs: 1.5, sm: 2, md: 3 },
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                display: 'flex',
                flexDirection: 'column',
                minHeight: { xs: 320, sm: 360, md: 400 }
              }}
            >
              <Stack spacing={2} sx={{ height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ 
                    p: 0.75,
                    borderRadius: '8px',
                    backgroundColor: alpha('#ea4335', 0.1)
                  }}>
                    <ShowChart sx={{ fontSize: 20, color: '#ea4335' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant={isMobile ? "subtitle2" : "h6"}
                      fontWeight={500}
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        lineHeight: 1.2
                      }}
                    >
                      Usage Trends
                    </Typography>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }
                      }}
                    >
                      Weekly patterns
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ 
                  flex: 1, 
                  position: 'relative',
                  minHeight: { xs: 200, sm: 240, md: 280 }
                }}>
                  {chartData && (
                    <Line 
                      data={chartData.usageData} 
                      options={getChartOptions('line')} 
                    />
                  )}
                </Box>
              </Stack>
            </Paper>
          </Fade>

          {/* Chart 4: Stock Value */}
          <Fade in timeout={800}>
            <Paper
              sx={{
                flex: '1 1 calc(50% - 12px)',
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', lg: 'calc(25% - 24px)' },
                p: { xs: 1.5, sm: 2, md: 3 },
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                display: 'flex',
                flexDirection: 'column',
                minHeight: { xs: 320, sm: 360, md: 400 }
              }}
            >
              <Stack spacing={2} sx={{ height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ 
                    p: 0.75,
                    borderRadius: '8px',
                    backgroundColor: alpha('#fbbc04', 0.1)
                  }}>
                    <Analytics sx={{ fontSize: 20, color: '#fbbc04' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant={isMobile ? "subtitle2" : "h6"}
                      fontWeight={500}
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        lineHeight: 1.2
                      }}
                    >
                      Stock Value
                    </Typography>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }
                      }}
                    >
                      Monthly valuation
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ 
                  flex: 1, 
                  position: 'relative',
                  minHeight: { xs: 200, sm: 240, md: 280 }
                }}>
                  {chartData && (
                    <Bar 
                      data={chartData.valueData} 
                      options={getChartOptions('bar')} 
                    />
                  )}
                </Box>
              </Stack>
            </Paper>
          </Fade>
        </Box>

        {/* Additional Stats */}
        <Fade in timeout={900}>
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2, md: 3 },
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}
          >
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight={500}
              sx={{ 
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
              }}
            >
              Detailed Insights
            </Typography>

            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2, md: 3 }
            }}>
              {/* Categories */}
              <Paper
                sx={{
                  flex: '1 1 calc(50% - 12px)',
                  minWidth: { xs: '100%', md: 'calc(50% - 16px)' },
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CategoryIcon sx={{ 
                      fontSize: { xs: 18, sm: 20 },
                      color: '#4285f4' 
                    }} />
                    <Typography 
                      variant="subtitle2" 
                      fontWeight={500}
                      sx={{ 
                        fontSize: { xs: '0.85rem', sm: '0.9rem' }
                      }}
                    >
                      Top Categories
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {stats?.categories?.slice(0, 5).map((category, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1,
                          borderRadius: '8px',
                          backgroundColor: index % 2 === 0 
                            ? (darkMode ? '#303134' : '#ffffff')
                            : 'transparent',
                        }}
                      >
                        <Typography 
                          variant="body2"
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.85rem' },
                            color: darkMode ? '#e8eaed' : '#202124'
                          }}
                        >
                          {category.category}
                        </Typography>
                        <Chip
                          label={category.count}
                          size="small"
                          sx={{
                            backgroundColor: darkMode ? '#3c4043' : '#e8f0fe',
                            color: darkMode ? '#8ab4f8' : '#1a73e8',
                            fontWeight: 500,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Paper>

              {/* Status Breakdown */}
              <Paper
                sx={{
                  flex: '1 1 calc(50% - 12px)',
                  minWidth: { xs: '100%', md: 'calc(50% - 16px)' },
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Storage sx={{ 
                      fontSize: { xs: 18, sm: 20 },
                      color: '#34a853' 
                    }} />
                    <Typography 
                      variant="subtitle2" 
                      fontWeight={500}
                      sx={{ 
                        fontSize: { xs: '0.85rem', sm: '0.9rem' }
                      }}
                    >
                      Status Breakdown
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {stats?.status?.map((statusItem, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1,
                          borderRadius: '8px',
                          backgroundColor: index % 2 === 0 
                            ? (darkMode ? '#303134' : '#ffffff')
                            : 'transparent',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 
                                statusItem.status === 'in-stock' ? '#34a853' :
                                statusItem.status === 'low-stock' ? '#fbbc04' :
                                statusItem.status === 'out-of-stock' ? '#ea4335' : '#8ab4f8'
                            }}
                          />
                          <Typography 
                            variant="body2"
                            sx={{ 
                              fontSize: { xs: '0.8rem', sm: '0.85rem' },
                              color: darkMode ? '#e8eaed' : '#202124',
                              textTransform: 'capitalize'
                            }}
                          >
                            {statusItem.status.replace('-', ' ')}
                          </Typography>
                        </Stack>
                        <Chip
                          label={`${statusItem.count}`}
                          size="small"
                          sx={{
                            backgroundColor: 
                              statusItem.status === 'in-stock' ? (darkMode ? '#0d652d' : '#d9f0e1') :
                              statusItem.status === 'low-stock' ? (darkMode ? '#653c00' : '#fef7e0') :
                              statusItem.status === 'out-of-stock' ? (darkMode ? '#5c1a1a' : '#fce8e6') : 
                              (darkMode ? '#1c3f91' : '#e8f0fe'),
                            color: 
                              statusItem.status === 'in-stock' ? (darkMode ? '#34a853' : '#0d652d') :
                              statusItem.status === 'low-stock' ? (darkMode ? '#fbbc04' : '#653c00') :
                              statusItem.status === 'out-of-stock' ? (darkMode ? '#ea4335' : '#5c1a1a') : 
                              (darkMode ? '#8ab4f8' : '#1a73e8'),
                            fontWeight: 500,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </MainLayout>
  );
}