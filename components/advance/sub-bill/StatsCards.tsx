// components/advance/sub-bill/StatsCards.tsx
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  AttachMoney,
  People,
  TrendingUp,
  CheckCircle,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface StatsCardsProps {
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ currentColors, primaryColor, isMobile }) => {
  const stats = [
    {
      title: 'Total Spent',
      value: '₹1,388',
      icon: <AttachMoney />,
      color: '#34A853',
      change: '+45% from last year',
    },
    {
      title: 'Active Months',
      value: '13',
      icon: <CheckCircle />,
      color: '#4285F4',
      change: '4 subscriptions total',
    },
    {
      title: 'Avg. Monthly',
      value: '₹347',
      icon: <TrendingUp />,
      color: '#FBBC04',
      change: 'Per subscription cycle',
    },
    {
      title: 'Success Rate',
      value: '100%',
      icon: <People />,
      color: '#34A853',
      change: 'All payments successful',
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
              {stat.change}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StatsCards;