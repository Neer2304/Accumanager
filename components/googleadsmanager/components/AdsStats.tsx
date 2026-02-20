// components/googleadsmanager/components/AdsStats.tsx
import React from 'react';
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  useTheme
} from '@mui/material';
import {
  MonetizationOn,
  Visibility,
  TrendingUp,
  Campaign
} from '@mui/icons-material';
import { CampaignStats } from './types';

interface AdsStatsProps {
  stats: CampaignStats;
}

export const AdsStats: React.FC<AdsStatsProps> = ({ stats }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const statCards = [
    {
      icon: <MonetizationOn />,
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      label: 'Total Revenue',
      color: '#34a853',
    },
    {
      icon: <Visibility />,
      value: stats.totalImpressions.toLocaleString(),
      label: 'Total Impressions',
      color: darkMode ? '#8ab4f8' : '#1a73e8',
    },
    {
      icon: <TrendingUp />,
      value: `${stats.averageCTR.toFixed(2)}%`,
      label: 'Average CTR',
      color: '#fbbc04',
    },
    {
      icon: <Campaign />,
      value: stats.activeCount,
      label: 'Active Campaigns',
      color: '#ea4335',
    },
  ];

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ mb: 4, flexWrap: "wrap" }}
    >
      {statCards.map((stat, index) => (
        <Card key={index} sx={{ 
          flex: 1, 
          minWidth: 200,
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 2px 8px rgba(0, 0, 0, 0.15)'
            : '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ 
                bgcolor: darkMode ? `${stat.color}20` : `${stat.color}10`,
                color: stat.color,
              }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                  {stat.label}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};