// components/advance/marketing/StatsCards.tsx
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  Campaign,
  Visibility,
  TrendingUp,
  ShoppingCart,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface StatsCardsProps {
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

const StatsCards: React.FC<StatsCardsProps> = ({ 
  analytics, 
  currentColors, 
  primaryColor, 
  isMobile 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: 'Total Campaigns',
      value: analytics.totalCampaigns,
      icon: <Campaign />,
      color: primaryColor,
      subtitle: `${analytics.activeCampaigns} active • ${analytics.draftCampaigns} draft`,
    },
    {
      title: 'Avg Open Rate',
      value: `${analytics.averageOpenRate.toFixed(1)}%`,
      icon: <Visibility />,
      color: googleColors.green,
      subtitle: `${analytics.totalOpened.toLocaleString()} opened`,
    },
    {
      title: 'Avg Conversion',
      value: `${analytics.averageConversionRate.toFixed(1)}%`,
      icon: <TrendingUp />,
      color: googleColors.green,
      subtitle: `${analytics.totalConverted.toLocaleString()} converted`,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics.totalRevenue),
      icon: <ShoppingCart />,
      color: googleColors.yellow,
      subtitle: `From ${analytics.totalRecipients.toLocaleString()} recipients`,
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
            >
              {stat.subtitle}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StatsCards;