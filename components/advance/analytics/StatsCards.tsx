// components/advance/analytics/StatsCards.tsx
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  AttachMoney,
  AccountBalance,
  People,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface StatsCardsProps {
  totalRevenue: number;
  monthlyRevenue: number;
  totalCustomers: number;
  totalSales: number;
  avgOrderValue: number;
  revenueGrowth: number;
  subscriptionMetrics: any;
  customerMetrics: any;
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalRevenue,
  monthlyRevenue,
  totalCustomers,
  totalSales,
  avgOrderValue,
  revenueGrowth,
  subscriptionMetrics,
  customerMetrics,
  currentColors,
  primaryColor,
  isMobile,
}) => {
  const googleColors = {
    blue: '#4285F4',
    green: '#34A853',
    yellow: '#FBBC04',
    red: '#EA4335',
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <AttachMoney />,
      color: googleColors.green,
      subtitle: `${revenueGrowth > 0 ? '+' : ''}${Math.round(revenueGrowth)}% from last period`,
      growth: revenueGrowth > 0,
    },
    {
      title: 'Monthly Revenue',
      value: `₹${monthlyRevenue.toLocaleString()}`,
      icon: <AccountBalance />,
      color: primaryColor,
      subtitle: subscriptionMetrics.mrr ? `MRR: ₹${subscriptionMetrics.mrr.toLocaleString()}` : 'Current month',
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toLocaleString(),
      icon: <People />,
      color: googleColors.green,
      subtitle: `${customerMetrics.activeCustomers} active • ${customerMetrics.newCustomers || 0} new this month`,
    },
    {
      title: 'Total Sales',
      value: totalSales.toLocaleString(),
      icon: <ShoppingCart />,
      color: googleColors.yellow,
      subtitle: `Avg Order: ₹${avgOrderValue.toLocaleString()}`,
    },
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 3,
      mb: 3,
      justifyContent: isMobile ? 'center' : 'flex-start'
    }}>
      {stats.map((stat, index) => (
        <Card 
          key={index}
          sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 36px)',
            minWidth: isMobile ? '100%' : '250px',
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: isMobile ? 36 : 48,
                  height: isMobile ? 36 : 48,
                  borderRadius: 2,
                  background: alpha(stat.color, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha(stat.color, 0.3)}`,
                }}
              >
                {React.cloneElement(stat.icon, { 
                  sx: { color: stat.color, fontSize: isMobile ? 20 : 24 } 
                })}
              </Box>
              <Box>
                <Typography 
                  variant="caption" 
                  color={currentColors.textSecondary}
                  fontSize={isMobile ? '0.75rem' : '0.875rem'}
                >
                  {stat.title}
                </Typography>
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  fontWeight="bold" 
                  color={currentColors.textPrimary}
                >
                  {stat.value}
                </Typography>
              </Box>
            </Box>
            <Typography 
              variant="caption" 
              color={currentColors.textSecondary}
              fontSize={isMobile ? '0.75rem' : '0.875rem'}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {stat.growth !== undefined && (
                <>
                  {stat.growth ? (
                    <TrendingUp fontSize="small" sx={{ color: googleColors.green }} />
                  ) : (
                    <TrendingDown fontSize="small" sx={{ color: googleColors.red }} />
                  )}
                </>
              )}
              {stat.subtitle}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StatsCards;