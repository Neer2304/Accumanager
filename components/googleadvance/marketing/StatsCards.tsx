// components/googleadvance/marketing/StatsCards.tsx

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
  Campaign,
  TrendingUp,
  People,
  AttachMoney,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface MarketingStatsCardsProps {
  analytics: any;
  currentColors: any;
  isMobile?: boolean;
}

export const MarketingStatsCards: React.FC<MarketingStatsCardsProps> = ({
  analytics,
  currentColors,
  isMobile = false,
}) => {
  const stats = [
    {
      label: 'Total Campaigns',
      value: analytics?.totalCampaigns || 0,
      icon: <Campaign />,
      color: googleColors.blue,
      trend: `${analytics?.activeCampaigns || 0} active`,
    },
    {
      label: 'Open Rate',
      value: `${analytics?.averageOpenRate?.toFixed(1) || 0}%`,
      icon: <TrendingUp />,
      color: googleColors.green,
      trend: 'Avg. open rate',
    },
    {
      label: 'Conversion Rate',
      value: `${analytics?.averageConversionRate?.toFixed(1) || 0}%`,
      icon: <People />,
      color: googleColors.yellow,
      trend: 'Avg. conversion',
    },
    {
      label: 'Total Revenue',
      value: `₹${(analytics?.totalRevenue || 0).toLocaleString()}`,
      icon: <AttachMoney />,
      color: googleColors.red,
      trend: 'From campaigns',
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