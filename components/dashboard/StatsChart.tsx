import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip // Add this import
} from '@mui/material'
import {
  ShoppingBag as ProductsIcon,
  People as CustomersIcon,
  Receipt as SalesIcon,
  AttachMoney as RevenueIcon,
  Inventory as LowStockIcon,
  PendingActions as PendingIcon,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning
} from '@mui/icons-material'
import { DashboardStats } from '@/types'

interface StatsCardsProps {
  stats: DashboardStats
  salesData?: any[]
  topProducts?: any[]
}

const StatsCards: React.FC<StatsCardsProps> = ({ 
  stats, 
  salesData = [], 
  topProducts = [] 
}) => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  // Calculate ACTUAL sales and revenue
  const calculateActualSales = () => {
    if (stats.totalSales > 0) return stats.totalSales;
    
    if (salesData && salesData.length > 0) {
      return salesData.reduce((sum, item) => sum + (item.sales || 0), 0);
    }
    
    if (topProducts && topProducts.length > 0) {
      return topProducts.reduce((sum, product) => sum + (product.sales || 0), 0);
    }
    
    return 0;
  }

  const calculateActualRevenue = () => {
    if (stats.monthlyRevenue > 0) return stats.monthlyRevenue;
    
    if (salesData && salesData.length > 0) {
      return salesData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    }
    
    if (topProducts && topProducts.length > 0) {
      return topProducts.reduce((sum, product) => sum + (product.revenue || 0), 0);
    }
    
    return 0;
  }

  const actualSales = calculateActualSales();
  const actualRevenue = calculateActualRevenue();

  // Format large numbers with K/L/Cr suffixes
  const formatCompactNumber = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1)}K`;
    }
    return `₹${num}`;
  };

  const statCards = [
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: <ProductsIcon />,
      color: '#4285f4',
      bgColor: darkMode ? alpha('#4285f4', 0.15) : alpha('#4285f4', 0.08),
      trend: stats.totalProducts > 0 ? '+12%' : null,
      status: stats.totalProducts > 0 ? 'good' : 'neutral'
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      icon: <CustomersIcon />,
      color: '#34a853',
      bgColor: darkMode ? alpha('#34a853', 0.15) : alpha('#34a853', 0.08),
      trend: stats.totalCustomers > 0 ? '+8%' : null,
      status: stats.totalCustomers > 0 ? 'good' : 'neutral'
    },
    {
      title: 'Total Sales',
      value: actualSales,
      icon: <SalesIcon />,
      color: '#fbbc04',
      bgColor: darkMode ? alpha('#fbbc04', 0.15) : alpha('#fbbc04', 0.08),
      isSales: true,
      trend: actualSales > 0 ? '+24%' : null,
      status: actualSales > 0 ? 'good' : 'warning'
    },
    {
      title: 'Revenue',
      value: formatCompactNumber(actualRevenue), // Apply compact formatting
      fullValue: `₹${actualRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, // Full value for tooltip
      icon: <RevenueIcon />,
      color: '#ea4335',
      bgColor: darkMode ? alpha('#ea4335', 0.15) : alpha('#ea4335', 0.08),
      isRevenue: true,
      trend: actualRevenue > 0 ? '+18%' : null,
      status: actualRevenue > 0 ? 'good' : 'warning'
    },
    {
      title: 'Low Stock',
      value: stats.lowStockProducts,
      icon: <LowStockIcon />,
      color: '#ea4335',
      bgColor: darkMode ? alpha('#ea4335', 0.15) : alpha('#ea4335', 0.08),
      status: stats.lowStockProducts > 0 ? 'critical' : 'good',
      badge: stats.lowStockProducts > 0 ? 'Alert' : 'Good'
    },
    {
      title: 'Pending Bills',
      value: stats.pendingBills,
      icon: <PendingIcon />,
      color: '#8e44ad',
      bgColor: darkMode ? alpha('#8e44ad', 0.15) : alpha('#8e44ad', 0.08),
      status: stats.pendingBills > 0 ? 'warning' : 'good',
      badge: stats.pendingBills > 0 ? 'Pending' : 'Clear'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'good': return <CheckCircle sx={{ fontSize: 12, color: '#34a853' }} />
      case 'warning': return <Warning sx={{ fontSize: 12, color: '#fbbc04' }} />
      case 'critical': return <Warning sx={{ fontSize: 12, color: '#ea4335' }} />
      default: return null
    }
  }

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(6, 1fr)'
      },
      gap: { xs: 1, sm: 1.5, md: 2 },
      width: '100%'
    }}>
      {statCards.map((card, index) => (
        <Card 
          key={index}
          sx={{ 
            height: '100%',
            transition: 'all 0.2s ease',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: { xs: 2, sm: 2.5 },
            overflow: 'visible',
            position: 'relative',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? `0 6px 16px ${alpha(card.color, 0.3)}`
                : `0 6px 16px ${alpha(card.color, 0.15)}`,
              borderColor: alpha(card.color, 0.5)
            },
            minHeight: { xs: 100, sm: 110, md: 120 }
          }}
        >
          {/* Status Badge */}
          {card.badge && (
            <Box
              sx={{
                position: 'absolute',
                top: -8,
                right: 12,
                backgroundColor: card.status === 'critical' 
                  ? darkMode ? alpha('#ea4335', 0.9) : '#ea4335'
                  : card.status === 'warning'
                  ? darkMode ? alpha('#fbbc04', 0.9) : '#fbbc04'
                  : darkMode ? alpha('#34a853', 0.9) : '#34a853',
                color: darkMode ? '#ffffff' : '#ffffff',
                px: 1,
                py: 0.25,
                borderRadius: 1,
                fontSize: '0.6rem',
                fontWeight: 'bold',
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
                zIndex: 1,
                boxShadow: `0 2px 8px ${alpha(card.color, 0.3)}`
              }}
            >
              {card.badge}
            </Box>
          )}

          <CardContent sx={{ 
            p: { xs: 1.25, sm: 1.5, md: 1.75 },
            '&:last-child': { pb: { xs: 1.25, sm: 1.5, md: 1.75 } },
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header with Icon and Trend */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'space-between', 
              mb: 1.5,
              minHeight: 36
            }}>
              <Avatar
                sx={{
                  backgroundColor: card.bgColor,
                  color: card.color,
                  width: { xs: 32, sm: 36, md: 40 },
                  height: { xs: 32, sm: 36, md: 40 },
                  border: `2px solid ${alpha(card.color, 0.2)}`,
                  boxShadow: `0 2px 8px ${alpha(card.color, 0.2)}`
                }}
              >
                {React.cloneElement(card.icon, {
                  sx: { 
                    fontSize: { xs: 16, sm: 18, md: 20 },
                    fontWeight: 'bold'
                  }
                })}
              </Avatar>
              
              {card.trend && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  backgroundColor: card.status === 'good' 
                    ? darkMode ? alpha('#34a853', 0.2) : alpha('#34a853', 0.1)
                    : darkMode ? alpha('#fbbc04', 0.2) : alpha('#fbbc04', 0.1),
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  border: `1px solid ${
                    card.status === 'good' 
                      ? alpha('#34a853', 0.3)
                      : alpha('#fbbc04', 0.3)
                  }`
                }}>
                  {card.status === 'good' ? (
                    <TrendingUp sx={{ fontSize: 12, color: '#34a853' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 12, color: '#fbbc04' }} />
                  )}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: { xs: '0.6rem', sm: '0.65rem' },
                      fontWeight: 'bold',
                      color: card.status === 'good' 
                        ? darkMode ? '#81c995' : '#34a853'
                        : darkMode ? '#fdd663' : '#fbbc04'
                    }}
                  >
                    {card.trend}
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Title */}
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: { 
                  xs: '0.65rem', 
                  sm: '0.7rem', 
                  md: '0.75rem' 
                },
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.5
              }}
            >
              {getStatusIcon(card.status)}
              {card.title}
            </Typography>
            
            {/* Value - Add Tooltip for Revenue */}
            {card.title === 'Revenue' ? (
              <Tooltip title={card.fullValue || `₹${actualRevenue.toLocaleString('en-IN')}`} arrow>
                <Typography 
                  variant="h5" 
                  component="div" 
                  fontWeight={600}
                  sx={{ 
                    fontSize: { 
                      xs: '1.1rem', 
                      sm: '1.25rem', 
                      md: '1.5rem' 
                    },
                    lineHeight: 1.1,
                    color: darkMode ? '#e8eaed' : '#202124',
                    mb: 1,
                    letterSpacing: '-0.5px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {card.value}
                </Typography>
              </Tooltip>
            ) : (
              <Typography 
                variant="h5" 
                component="div" 
                fontWeight={600}
                sx={{ 
                  fontSize: { 
                    xs: '1.1rem', 
                    sm: '1.25rem', 
                    md: '1.5rem' 
                  },
                  lineHeight: 1.1,
                  color: darkMode ? '#e8eaed' : '#202124',
                  mb: 1,
                  letterSpacing: '-0.5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {card.title === 'Total Sales' ? card.value : card.value}
              </Typography>
            )}
            
            {/* Status Messages */}
            <Box sx={{ mt: 'auto', minHeight: 20 }}>
              {(card.isSales || card.isRevenue) && actualSales === 0 && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.65rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontStyle: 'italic'
                  }}
                >
                  No data yet
                </Typography>
              )}
              
              {card.title === 'Low Stock' && stats.lowStockProducts > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Warning sx={{ fontSize: 12, color: '#ea4335' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: { xs: '0.6rem', sm: '0.65rem' },
                      color: darkMode ? '#f28b82' : '#ea4335',
                      fontWeight: 500
                    }}
                  >
                    Check inventory
                  </Typography>
                </Box>
              )}
              
              {card.title === 'Pending Bills' && stats.pendingBills > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Warning sx={{ fontSize: 12, color: '#fbbc04' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: { xs: '0.6rem', sm: '0.65rem' },
                      color: darkMode ? '#fdd663' : '#fbbc04',
                      fontWeight: 500
                    }}
                  >
                    Action required
                  </Typography>
                </Box>
              )}
              
              {card.title === 'Low Stock' && stats.lowStockProducts === 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircle sx={{ fontSize: 12, color: '#34a853' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: { xs: '0.6rem', sm: '0.65rem' },
                      color: darkMode ? '#81c995' : '#34a853',
                      fontWeight: 500
                    }}
                  >
                    Stock good
                  </Typography>
                </Box>
              )}
              
              {card.title === 'Pending Bills' && stats.pendingBills === 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircle sx={{ fontSize: 12, color: '#34a853' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: { xs: '0.6rem', sm: '0.65rem' },
                      color: darkMode ? '#81c995' : '#34a853',
                      fontWeight: 500
                    }}
                  >
                    All clear
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default StatsCards