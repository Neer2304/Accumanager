// components/googleanalytics/components/AnalyticsStats.tsx
import React from 'react';
import {
  Box,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { Card } from '@/components/ui/Card';

interface AnalyticsStatsProps {
  stats: {
    monthlyRevenue: number;
    totalSales: number;
    totalCustomers: number;
    totalProducts?: number;
    lowStockProducts?: number;
  };
  recentInvoices: Array<{
    paymentStatus: string;
  }>;
  darkMode: boolean;
}

export const AnalyticsStats: React.FC<AnalyticsStatsProps> = ({ 
  stats, 
  recentInvoices, 
  darkMode 
}) => {
  const statItems = [
    { 
      title: 'Monthly Revenue', 
      value: stats.monthlyRevenue, 
      icon: '💰', 
      color: '#4285f4',
      description: 'Current month revenue',
      format: (val: number) => `₹${val.toLocaleString()}`
    },
    { 
      title: 'Total Sales', 
      value: stats.totalSales, 
      icon: '📈', 
      color: '#34a853',
      description: 'Items sold this month',
      format: (val: number) => val > 999 ? val.toLocaleString() : val
    },
    { 
      title: 'Total Customers', 
      value: stats.totalCustomers, 
      icon: '👥', 
      color: '#ea4335',
      description: 'Active customers',
      format: (val: number) => val > 999 ? val.toLocaleString() : val
    },
    { 
      title: 'Products', 
      value: stats.totalProducts || 0,
      icon: '📦', 
      color: '#fbbc04',
      description: 'Active products',
      format: (val: number) => val > 999 ? val.toLocaleString() : val
    },
    { 
      title: 'Pending Invoices', 
      value: recentInvoices.filter(inv => inv.paymentStatus === 'pending').length || 0,
      icon: '📄', 
      color: '#8ab4f8',
      description: 'Awaiting payment',
      format: (val: number) => val
    },
    { 
      title: 'Low Stock', 
      value: stats.lowStockProducts || 0,
      icon: '⚠️', 
      color: '#ff6d01',
      description: 'Products needing restock',
      format: (val: number) => val
    },
  ];

  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: { xs: 1.5, sm: 2, md: 3 },
      mb: { xs: 2, sm: 3, md: 4 },
    }}>
      {statItems.map((stat, index) => (
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
                  {stat.format(stat.value)}
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
  );
};