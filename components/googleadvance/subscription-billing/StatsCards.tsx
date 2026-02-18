// components/googleadvance/subscription-billing/StatsCards.tsx

'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  alpha,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  CalendarToday,
  CreditCard,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface StatsCardsProps {
  currentColors: any;
  primaryColor: string;
  isMobile?: boolean;
}

export const BillingStatsCards: React.FC<StatsCardsProps> = ({
  currentColors,
  primaryColor,
  isMobile = false,
}) => {
  const stats = [
    {
      label: 'Total Spent',
      value: '₹2,45,000',
      icon: <AttachMoney />,
      color: googleColors.green,
      trend: '+12.5%',
    },
    {
      label: 'Monthly Average',
      value: '₹24,500',
      icon: <TrendingUp />,
      color: googleColors.blue,
      trend: 'Last 12 months',
    },
    {
      label: 'Next Billing',
      value: 'Feb 15, 2024',
      icon: <CalendarToday />,
      color: googleColors.yellow,
      trend: '₹25,000',
    },
    {
      label: 'Payment Methods',
      value: '2',
      icon: <CreditCard />,
      color: googleColors.red,
      trend: 'Credit Card, UPI',
    },
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 3, 
      flexWrap: 'wrap',
    }}>
      {stats.map((stat, index) => (
        <Card
          key={index}
          sx={{
            flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 12px)',
            minWidth: isMobile ? '100%' : '200px',
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '12px',
          }}
        >
          <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography 
                variant="body2" 
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                {stat.label}
              </Typography>
              <Box sx={{ 
                p: 0.5, 
                borderRadius: 2,
                background: alpha(stat.color, 0.1),
                color: stat.color
              }}>
                {stat.icon}
              </Box>
            </Box>
            
            <Typography 
              variant="h5" 
              fontWeight="bold"
              fontSize={isMobile ? '1.25rem' : '1.5rem'}
              sx={{ mb: 0.5 }}
            >
              {stat.value}
            </Typography>
            
            <Typography 
              variant="caption" 
              color={currentColors.textSecondary}
              fontSize={isMobile ? '0.75rem' : '0.875rem'}
            >
              {stat.trend}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};