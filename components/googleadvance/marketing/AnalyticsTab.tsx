// components/googleadvance/marketing/AnalyticsTab.tsx

'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  Timeline,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface AnalyticsTabProps {
  analytics: any;
  campaigns: any[];
  currentColors: any;
  primaryColor: string;
  isMobile?: boolean;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  analytics,
  campaigns,
  currentColors,
  primaryColor,
  isMobile = false,
}) => {
  const metrics = [
    {
      label: 'Total Campaigns',
      value: analytics?.totalCampaigns || 0,
      icon: <Timeline />,
      color: googleColors.blue,
    },
    {
      label: 'Avg Open Rate',
      value: `${analytics?.averageOpenRate?.toFixed(1) || 0}%`,
      icon: <TrendingUp />,
      color: googleColors.green,
    },
    {
      label: 'Avg Click Rate',
      value: `${analytics?.averageClickRate?.toFixed(1) || 0}%`,
      icon: <People />,
      color: googleColors.yellow,
    },
    {
      label: 'Total Revenue',
      value: `₹${(analytics?.totalRevenue || 0).toLocaleString()}`,
      icon: <AttachMoney />,
      color: googleColors.red,
    },
  ];

  const channelPerformance = [
    { channel: 'Email', openRate: 45, clickRate: 12, conversionRate: 3.5 },
    { channel: 'SMS', openRate: 98, clickRate: 8, conversionRate: 2.1 },
    { channel: 'Push', openRate: 65, clickRate: 15, conversionRate: 4.2 },
  ];

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ background: currentColors.card, height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="body2" color={currentColors.textSecondary}>
                    {metric.label}
                  </Typography>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2,
                    background: alpha(metric.color, 0.1),
                    color: metric.color,
                  }}>
                    {metric.icon}
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Channel Performance */}
      <Card sx={{ background: currentColors.card, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Channel Performance
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {channelPerformance.map((channel) => (
              <Box key={channel.channel}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle2">{channel.channel}</Typography>
                  <Box display="flex" gap={2}>
                    <Chip 
                      label={`Open: ${channel.openRate}%`} 
                      size="small"
                      sx={{ backgroundColor: alpha(googleColors.blue, 0.1), color: googleColors.blue }}
                    />
                    <Chip 
                      label={`Click: ${channel.clickRate}%`} 
                      size="small"
                      sx={{ backgroundColor: alpha(googleColors.green, 0.1), color: googleColors.green }}
                    />
                    <Chip 
                      label={`Conv: ${channel.conversionRate}%`} 
                      size="small"
                      sx={{ backgroundColor: alpha(googleColors.yellow, 0.1), color: googleColors.yellow }}
                    />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={channel.openRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: currentColors.chipBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: googleColors.blue,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Top Performing Campaigns */}
      <Card sx={{ background: currentColors.card }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Top Performing Campaigns
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {campaigns
              .filter(c => c.status === 'completed')
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 3)
              .map((campaign, index) => (
                <Box key={campaign._id}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box>
                      <Typography variant="subtitle2">
                        {index + 1}. {campaign.name}
                      </Typography>
                      <Typography variant="caption" color={currentColors.textSecondary}>
                        {campaign.type} • {new Date(campaign.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold" color={googleColors.green}>
                      ₹{campaign.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={2}>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Open: {Math.round((campaign.opened / campaign.sent) * 100)}%
                    </Typography>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Click: {Math.round((campaign.clicked / campaign.sent) * 100)}%
                    </Typography>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Conv: {Math.round((campaign.converted / campaign.sent) * 100)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};