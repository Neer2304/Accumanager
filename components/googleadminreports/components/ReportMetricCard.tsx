// components/googlereports/components/ReportMetricCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { Trend } from './types';

interface ReportMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: Trend;
  subtitle?: string;
  loading?: boolean;
}

export const ReportMetricCard: React.FC<ReportMetricCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  subtitle,
  loading = false,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getColorValue = () => {
    const colors = {
      primary: darkMode ? '#8ab4f8' : '#1a73e8',
      secondary: '#34a853',
      success: '#34a853',
      error: '#ea4335',
      warning: '#fbbc04',
      info: darkMode ? '#8ab4f8' : '#5f6368',
    };
    return colors[color];
  };

  const getTrendColor = () => {
    if (!trend) return darkMode ? '#9aa0a6' : '#5f6368';
    return trend.direction === 'up' ? '#34a853' : '#ea4335';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.direction === 'up' ? (
      <TrendingUp sx={{ fontSize: 14 }} />
    ) : (
      <TrendingDown sx={{ fontSize: 14 }} />
    );
  };

  return (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${alpha(getColorValue(), 0.15)}`,
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              textTransform: 'uppercase',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ 
            p: 1, 
            borderRadius: '10px', 
            backgroundColor: alpha(getColorValue(), 0.1),
            color: getColorValue(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} sx={{ color: getColorValue() }} />
          </Box>
        ) : (
          <>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: darkMode ? '#e8eaed' : '#202124',
                mb: 0.5,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              {value}
            </Typography>
            
            {subtitle && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  display: 'block',
                  mb: 1
                }}
              >
                {subtitle}
              </Typography>
            )}
            
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip
                //   icon={getTrendIcon()}
                  label={`${trend.value > 0 ? '+' : ''}${trend.value}%`}
                  size="small"
                  sx={{
                    backgroundColor: alpha(getTrendColor(), 0.1),
                    color: getTrendColor(),
                    border: 'none',
                    fontWeight: 600,
                    height: 24,
                    '& .MuiChip-icon': { 
                      color: getTrendColor(),
                      fontSize: 14,
                      marginLeft: '4px'
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
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