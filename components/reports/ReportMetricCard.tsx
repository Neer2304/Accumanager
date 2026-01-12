import React, { ReactNode } from 'react';
import { Card, CardContent, Typography, Box, Chip, CardProps, CircularProgress } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface ReportMetricCardProps extends CardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  subtitle?: string;
  loading?: boolean;
}

const ReportMetricCard: React.FC<ReportMetricCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  subtitle,
  loading = false,
  sx,
  ...props
}) => {
  const getTrendColor = () => {
    if (!trend) return 'text.secondary';
    return trend.direction === 'up' ? 'success.main' : 'error.main';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.direction === 'up' ? (
      <TrendingUp sx={{ fontSize: 16 }} />
    ) : (
      <TrendingDown sx={{ fontSize: 16 }} />
    );
  };

  return (
    <Card sx={{ height: '100%', ...sx }} {...props}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
            {title}
          </Typography>
          {icon && (
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}.light`, color: `${color}.main` }}>
              {icon}
            </Box>
          )}
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
            
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {subtitle}
              </Typography>
            )}
            
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                //   icon={getTrendIcon()}
                  label={`${trend.value}%`}
                  size="small"
                  sx={{
                    bgcolor: getTrendColor(),
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {trend.label || 'vs last period'}
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportMetricCard;