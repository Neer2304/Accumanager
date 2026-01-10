import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material'
import {
  ShoppingBag as ProductsIcon,
  People as CustomersIcon,
  Receipt as SalesIcon,
  AttachMoney as RevenueIcon,
  Inventory as LowStockIcon,
  PendingActions as PendingIcon
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

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

  const statCards = [
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: <ProductsIcon />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      icon: <CustomersIcon />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
    },
    {
      title: 'Sales',
      value: actualSales,
      icon: <SalesIcon />,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      isSales: true
    },
    {
      title: 'Revenue',
      value: `₹${actualRevenue.toLocaleString()}`,
      icon: <RevenueIcon />,
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.1),
      isRevenue: true
    },
    {
      title: 'Low Stock',
      value: stats.lowStockProducts,
      icon: <LowStockIcon />,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
    },
    {
      title: 'Pending',
      value: stats.pendingBills,
      icon: <PendingIcon />,
      color: theme.palette.secondary.main,
      bgColor: alpha(theme.palette.secondary.main, 0.1),
    }
  ]

  const getGridTemplateColumns = () => {
    if (isMobile) return 'repeat(2, 1fr)'
    if (isTablet) return 'repeat(3, 1fr)'
    return 'repeat(6, 1fr)'
  }

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: getGridTemplateColumns(),
      gap: { xs: 1, sm: 1.5, md: 2 },
      width: '100%'
    }}>
      {statCards.map((card, index) => (
        <Card 
          key={index}
          sx={{ 
            height: '100%',
            transition: 'all 0.3s ease',
            border: `1px solid ${alpha(card.color, 0.2)}`,
            borderRadius: { xs: 1, sm: 1.5 },
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 20px ${alpha(card.color, 0.2)}`,
              borderColor: card.color
            },
            minHeight: { xs: 80, sm: 100 }
          }}
        >
          <CardContent sx={{ 
            p: { xs: 1, sm: 1.5, md: 2 },
            '&:last-child': { pb: { xs: 1, sm: 1.5, md: 2 } }
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  display="block"
                  sx={{ 
                    fontSize: { 
                      xs: '0.65rem', 
                      sm: '0.7rem', 
                      md: '0.75rem' 
                    },
                    mb: { xs: 0.25, sm: 0.5 },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {card.title}
                </Typography>
                <Typography 
                  variant="h6" 
                  component="div" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: { 
                      xs: '0.875rem', 
                      sm: '1rem', 
                      md: '1.25rem' 
                    },
                    lineHeight: 1.2,
                    color: card.color,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {card.value}
                </Typography>
                {(card.isSales || card.isRevenue) && actualSales === 0 && (
                  <Typography 
                    variant="caption" 
                    color="text.disabled"
                    sx={{ 
                      fontSize: '0.6rem',
                      display: 'block',
                      mt: 0.5
                    }}
                  >
                    {actualSales === 0 ? 'No sales data' : ''}
                  </Typography>
                )}
              </Box>
              <Avatar
                sx={{
                  backgroundColor: card.bgColor,
                  color: card.color,
                  width: { xs: 28, sm: 36, md: 44 },
                  height: { xs: 28, sm: 36, md: 44 },
                  border: `1px solid ${alpha(card.color, 0.2)}`,
                  ml: 1
                }}
              >
                {React.cloneElement(card.icon, {
                  fontSize: isMobile ? 'small' : isTablet ? 'medium' : 'inherit'
                })}
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default StatsCards