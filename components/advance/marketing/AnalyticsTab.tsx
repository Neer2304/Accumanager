// components/advance/marketing/AnalyticsTab.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  Campaign,
  PlayArrow,
  People,
  Send,
  Visibility,
  ShoppingCart,
  TrendingUp,
  Email,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const googleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
};

interface AnalyticsTabProps {
  analytics: any;
  campaigns: any[];
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  analytics,
  campaigns,
  currentColors,
  primaryColor,
  isMobile,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!analytics) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color={currentColors.textSecondary}>
          No analytics data available
        </Typography>
      </Box>
    );
  }

  // Calculate campaign performance distribution
  const performanceDistribution = {
    high: campaigns.filter((campaign) => {
      const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent * 100) : 0;
      return openRate >= 50;
    }).length,
    medium: campaigns.filter((campaign) => {
      const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent * 100) : 0;
      return openRate >= 20 && openRate < 50;
    }).length,
    low: campaigns.filter((campaign) => {
      const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent * 100) : 0;
      return openRate < 20;
    }).length,
  };

  const stats = [
    { 
      label: 'Total Campaigns', 
      value: analytics.totalCampaigns, 
      color: primaryColor, 
      icon: <Campaign />,
      description: `${analytics.activeCampaigns} active, ${analytics.draftCampaigns} draft`
    },
    { 
      label: 'Active Campaigns', 
      value: analytics.activeCampaigns, 
      color: googleColors.green, 
      icon: <PlayArrow />,
      description: 'Currently running campaigns'
    },
    { 
      label: 'Total Recipients', 
      value: analytics.totalRecipients.toLocaleString(), 
      color: googleColors.blue, 
      icon: <People />,
      description: 'Unique recipients reached'
    },
    { 
      label: 'Total Sent', 
      value: analytics.totalSent.toLocaleString(), 
      color: googleColors.blue, 
      icon: <Send />,
      description: 'Total messages sent'
    },
    { 
      label: 'Total Opened', 
      value: analytics.totalOpened.toLocaleString(), 
      color: googleColors.yellow, 
      icon: <Visibility />,
      description: `${((analytics.totalOpened / analytics.totalSent) * 100).toFixed(1)}% open rate`
    },
    { 
      label: 'Total Revenue', 
      value: formatCurrency(analytics.totalRevenue), 
      color: googleColors.green, 
      icon: <ShoppingCart />,
      description: 'Revenue generated from campaigns'
    },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
        Campaign Analytics
      </Typography>
      
      {/* Stats Grid */}
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
              flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 24px)',
              minWidth: isMobile ? '100%' : '300px',
              background: currentColors.card,
              border: `1px solid ${currentColors.border}`,
              borderRadius: '12px',
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: isMobile ? 40 : 48,
                    height: isMobile ? 40 : 48,
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
                    variant={isMobile ? "h5" : "h4"} 
                    fontWeight="bold" 
                    color={currentColors.textPrimary}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={currentColors.textSecondary}
                    fontSize={isMobile ? '0.875rem' : '1rem'}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
              <Typography 
                variant="caption" 
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                {stat.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {/* Performance Metrics */}
      <Card sx={{ 
        mb: 3,
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
            Performance Metrics
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[
              { 
                label: 'Average Open Rate', 
                value: analytics.averageOpenRate, 
                target: 25, 
                color: googleColors.green,
                description: 'Percentage of recipients who opened the campaign'
              },
              { 
                label: 'Average Click Rate', 
                value: analytics.averageClickRate, 
                target: 10, 
                color: googleColors.blue,
                description: 'Percentage of recipients who clicked links'
              },
              { 
                label: 'Average Conversion Rate', 
                value: analytics.averageConversionRate, 
                target: 5, 
                color: googleColors.green,
                description: 'Percentage of recipients who converted'
              },
            ].map((metric, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium" sx={{ color: currentColors.textPrimary }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      {metric.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: metric.color }}>
                      {metric.value.toFixed(1)}%
                    </Typography>
                    <Chip
                      label={`Target: ${metric.target}%`}
                      size="small"
                      sx={{
                        background: metric.value >= metric.target 
                          ? alpha(googleColors.green, 0.1)
                          : alpha(googleColors.yellow, 0.1),
                        color: metric.value >= metric.target 
                          ? googleColors.green
                          : googleColors.yellow,
                        fontWeight: 'medium'
                      }}
                    />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(metric.value, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(currentColors.border, 0.3),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: metric.color,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
          
          {/* Performance Distribution */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color={currentColors.textPrimary}>
              Campaign Performance Distribution
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[
                { label: 'High Performance', count: performanceDistribution.high, color: googleColors.green, threshold: '≥50% open rate' },
                { label: 'Medium Performance', count: performanceDistribution.medium, color: googleColors.yellow, threshold: '20-49% open rate' },
                { label: 'Low Performance', count: performanceDistribution.low, color: googleColors.red, threshold: '<20% open rate' },
              ].map((item, index) => (
                <Paper 
                  key={index}
                  sx={{ 
                    flex: 1,
                    p: 2,
                    background: currentColors.surface,
                    border: `1px solid ${currentColors.border}`,
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ color: item.color, mb: 1 }}>
                    {item.count}
                  </Typography>
                  <Typography variant="body2" color={currentColors.textPrimary} fontWeight="medium">
                    {item.label}
                  </Typography>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    {item.threshold}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Top Performing Campaigns */}
      {analytics.topPerforming && analytics.topPerforming.length > 0 && (
        <Card sx={{ 
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
              Top Performing Campaigns
            </Typography>
            
            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ background: currentColors.surface }}>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Campaign</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }} align="right">Open Rate</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }} align="right">Click Rate</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }} align="right">Conversion</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }} align="right">Revenue</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }} align="right">ROI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.topPerforming.map((campaign: any) => {
                    const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent * 100) : 0;
                    const clickRate = campaign.sent > 0 ? (campaign.clicked / campaign.sent * 100) : 0;
                    const conversionRate = campaign.sent > 0 ? (campaign.converted / campaign.sent * 100) : 0;
                    const roi = campaign.revenue > 0 ? ((campaign.revenue - (campaign.sent * 0.5)) / (campaign.sent * 0.5) * 100) : 0;
                    
                    return (
                      <TableRow key={campaign._id} sx={{ '&:hover': { background: alpha(primaryColor, 0.02) } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {campaign.type === 'email' && <Email fontSize="small" sx={{ color: googleColors.blue }} />}
                            <Box>
                              <Typography variant="body2" fontWeight="medium" color={currentColors.textPrimary}>
                                {campaign.name}
                              </Typography>
                              <Typography variant="caption" color={currentColors.textSecondary}>
                                {campaign.type} • {campaign.status}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${openRate.toFixed(1)}%`}
                            size="small"
                            sx={{
                              background: openRate >= 50 
                                ? alpha(googleColors.green, 0.1)
                                : openRate >= 25 
                                ? alpha(googleColors.yellow, 0.1)
                                : alpha(googleColors.red, 0.1),
                              color: openRate >= 50 
                                ? googleColors.green
                                : openRate >= 25 
                                ? googleColors.yellow
                                : googleColors.red,
                              fontWeight: 'medium'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold" color={currentColors.textPrimary}>
                            {clickRate.toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold" color={currentColors.textPrimary}>
                            {conversionRate.toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold" color={currentColors.textPrimary}>
                            {formatCurrency(campaign.revenue)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${roi.toFixed(0)}%`}
                            size="small"
                            sx={{
                              background: roi > 100 
                                ? alpha(googleColors.green, 0.1)
                                : roi > 0 
                                ? alpha(googleColors.yellow, 0.1)
                                : alpha(googleColors.red, 0.1),
                              color: roi > 100 
                                ? googleColors.green
                                : roi > 0 
                                ? googleColors.yellow
                                : googleColors.red,
                              fontWeight: 'medium'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AnalyticsTab;