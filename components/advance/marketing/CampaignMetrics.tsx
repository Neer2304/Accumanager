// components/advance/marketing/CampaignMetrics.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

interface CampaignMetricsProps {
  campaigns: any[];
  analytics: any;
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

// Google colors
const googleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
  
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    border: '#DADCE0',
    card: '#FFFFFF',
    chipBackground: '#F1F3F4',
    header: '#FFFFFF',
    sidebar: '#FFFFFF',
    hover: '#F8F9FA',
    active: '#E8F0FE',
  },
  
  dark: {
    background: '#202124',
    surface: '#303134',
    textPrimary: '#E8EAED',
    textSecondary: '#9AA0A6',
    border: '#3C4043',
    card: '#303134',
    chipBackground: '#3C4043',
    header: '#303134',
    sidebar: '#202124',
    hover: '#3C4043',
    active: '#5F6368',
  }
};

const CampaignMetrics: React.FC<CampaignMetricsProps> = ({
  campaigns,
  analytics,
  currentColors,
  primaryColor,
  isMobile,
}) => {
  const calculateMetrics = (campaign: any) => {
    const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent * 100) : 0;
    const clickRate = campaign.sent > 0 ? (campaign.clicked / campaign.sent * 100) : 0;
    return { openRate, clickRate };
  };

  return (
    <Card sx={{ 
      mb: 3, 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          mb={3} 
          color={currentColors.textPrimary}
          fontSize={isMobile ? '1rem' : '1.125rem'}
        >
          Campaign Performance
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
          {/* Active Campaigns Performance */}
          <Box sx={{ flex: 1 }}>
            {campaigns.slice(0, 3).map((campaign) => {
              const metrics = calculateMetrics(campaign);
              
              return (
                <Box key={campaign._id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography 
                      variant="body2" 
                      fontWeight="medium" 
                      sx={{ 
                        color: currentColors.textPrimary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '70%'
                      }}
                    >
                      {campaign.name}
                    </Typography>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        background: alpha(
                          campaign.status === 'active' 
                            ? googleColors.green 
                            : campaign.status === 'paused'
                            ? googleColors.yellow
                            : currentColors.textSecondary,
                          0.1
                        ),
                        color: campaign.status === 'active' 
                          ? googleColors.green 
                          : campaign.status === 'paused'
                          ? googleColors.yellow
                          : currentColors.textSecondary,
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}
                    >
                      {campaign.status}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Open Rate
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" color={currentColors.textPrimary}>
                      {metrics.openRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(metrics.openRate, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(currentColors.border, 0.3),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: metrics.openRate > 50 
                          ? googleColors.green 
                          : metrics.openRate > 25 
                          ? googleColors.yellow 
                          : googleColors.red,
                        borderRadius: 3,
                      },
                      mb: 2,
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Click Rate
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" color={currentColors.textPrimary}>
                      {metrics.clickRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(metrics.clickRate, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(currentColors.border, 0.3),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: metrics.clickRate > 10 
                          ? googleColors.green 
                          : metrics.clickRate > 5 
                          ? googleColors.yellow 
                          : googleColors.red,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>

          {/* Overall Metrics */}
          <Box sx={{ flex: 1, borderLeft: isMobile ? 'none' : `1px solid ${currentColors.border}`, pl: isMobile ? 0 : 3 }}>
            {[
              { 
                label: 'Average Open Rate', 
                value: analytics.averageOpenRate, 
                target: 25, 
                color: googleColors.green,
                description: 'Industry average: 20-25%'
              },
              { 
                label: 'Average Click Rate', 
                value: analytics.averageClickRate, 
                target: 10, 
                color: googleColors.blue,
                description: 'Industry average: 8-12%'
              },
              { 
                label: 'Average Conversion', 
                value: analytics.averageConversionRate, 
                target: 5, 
                color: googleColors.green,
                description: 'Industry average: 3-5%'
              },
            ].map((metric, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: currentColors.textPrimary }}>
                    {metric.label}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: metric.color }}>
                      {metric.value.toFixed(1)}%
                    </Typography>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.25,
                        background: metric.value >= metric.target 
                          ? alpha(googleColors.green, 0.1)
                          : alpha(googleColors.yellow, 0.1),
                        color: metric.value >= metric.target 
                          ? googleColors.green
                          : googleColors.yellow,
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {metric.value >= metric.target ? '✓ On Target' : 'Needs Work'}
                    </Box>
                  </Box>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={Math.min(metric.value, 100)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: alpha(currentColors.border, 0.3),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: metric.color,
                      borderRadius: 3,
                    },
                  }}
                />
                
                <Typography variant="caption" color={currentColors.textSecondary} sx={{ mt: 0.5, display: 'block' }}>
                  {metric.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CampaignMetrics;