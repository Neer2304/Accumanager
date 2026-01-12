import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  sx?: SxProps<Theme>;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  sx,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        ...sx,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', fontWeight: 600 }}
            >
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
        </Box>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: trend.isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;