// InventoryMetrics.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { InventoryIcons } from '@/assets/icons/InventoryIcons';
import { INVENTORY_CONTENT } from '../InventoryContent';

interface InventoryMetricsProps {
  metrics: Array<{
    title: string;
    value: number;
    change: number;
    icon: string;
    trend: 'up' | 'down' | 'neutral';
  }>;
  theme: any;
}

export const InventoryMetrics = ({ metrics, theme }: InventoryMetricsProps) => {
  const darkMode = theme.palette.mode === 'dark';
  
  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: { xs: 1.5, sm: 2, md: 3 },
      mb: { xs: 2, sm: 3, md: 4 },
      '& > *': {
        flex: '1 1 calc(50% - 12px)',
        minWidth: 0,
        '@media (min-width: 600px)': {
          flex: '1 1 calc(50% - 16px)'
        },
        '@media (min-width: 900px)': {
          flex: '1 1 calc(25% - 18px)'
        }
      }
    }}>
      {metrics.map((metric, index) => {
        const IconComponent = InventoryIcons[metric.icon as keyof typeof InventoryIcons];
        
        return (
          <Card 
            key={index}
            sx={{ 
              borderRadius: 3,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: darkMode 
                  ? `0 8px 24px ${alpha(metric.trend === 'up' ? '#34a853' : metric.trend === 'down' ? '#fbbc04' : '#4285f4', 0.3)}`
                  : `0 8px 24px ${alpha(metric.trend === 'up' ? '#34a853' : metric.trend === 'down' ? '#fbbc04' : '#4285f4', 0.15)}`,
                transform: 'translateY(-2px)',
              },
              minHeight: { xs: 110, sm: 120, md: 130 }
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: darkMode 
                    ? alpha(metric.trend === 'up' ? '#34a853' : metric.trend === 'down' ? '#fbbc04' : '#4285f4', 0.2)
                    : alpha(metric.trend === 'up' ? '#34a853' : metric.trend === 'down' ? '#fbbc04' : '#4285f4', 0.1),
                  color: metric.trend === 'up' 
                    ? '#34a853'
                    : metric.trend === 'down'
                    ? '#fbbc04'
                    : '#4285f4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {IconComponent && <IconComponent size="medium" />}
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  color: metric.trend === 'up' 
                    ? '#34a853'
                    : metric.trend === 'down'
                    ? '#fbbc04'
                    : darkMode ? '#9aa0a6' : '#5f6368'
                }}>
                  {metric.trend === 'up' ? <InventoryIcons.TrendingUp size="small" /> : 
                   metric.trend === 'down' ? <InventoryIcons.TrendingDown size="small" /> : null}
                  <Typography variant="caption" fontWeight="medium">
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h3" fontWeight="bold" sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                color: darkMode ? '#e8eaed' : '#202124',
                mb: 1,
              }}>
                {metric.value}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}>
                {metric.title}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
