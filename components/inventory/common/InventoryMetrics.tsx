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
  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { 
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)'
      },
      gap: 3,
      mb: 4
    }}>
      {metrics.map((metric, index) => {
        const IconComponent = InventoryIcons[metric.icon as keyof typeof InventoryIcons];
        
        return (
          <Card 
            key={index}
            sx={{ 
              borderRadius: 3,
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.8)
                : theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
                transform: 'translateY(-2px)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: metric.trend === 'up' 
                    ? alpha(theme.palette.success.main, 0.1)
                    : metric.trend === 'down'
                    ? alpha(theme.palette.warning.main, 0.1)
                    : alpha(theme.palette.info.main, 0.1),
                  color: metric.trend === 'up' 
                    ? theme.palette.success.main
                    : metric.trend === 'down'
                    ? theme.palette.warning.main
                    : theme.palette.info.main,
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
                    ? theme.palette.success.main
                    : metric.trend === 'down'
                    ? theme.palette.warning.main
                    : theme.palette.text.secondary
                }}>
                  {metric.trend === 'up' ? <InventoryIcons.TrendingUp size="small" /> : 
                   metric.trend === 'down' ? <InventoryIcons.TrendingDown size="small" /> : null}
                  <Typography variant="caption" fontWeight="medium">
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
                {metric.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metric.title}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};