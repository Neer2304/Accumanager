// components/admin/common/StatsCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  trendLabel?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  trendLabel,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: darkMode 
            ? '0 8px 16px rgba(0,0,0,0.2)'
            : '0 8px 16px rgba(0,0,0,0.05)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontWeight: 500,
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 500,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: alpha(color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
        
        {subtitle && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              mb: 1,
            }}
          >
            {subtitle}
          </Typography>
        )}
        
        {(trend !== undefined || trendLabel) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            {trend !== undefined && (
              <Chip
                icon={trend >= 0 ? <TrendingUp /> : <TrendingDown />}
                label={`${trend >= 0 ? '+' : ''}${trend}%`}
                size="small"
                sx={{
                  backgroundColor: trend >= 0 ? alpha('#34a853', 0.1) : alpha('#ea4335', 0.1),
                  color: trend >= 0 ? '#34a853' : '#ea4335',
                  fontWeight: 500,
                  border: 'none',
                }}
              />
            )}
            {trendLabel && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}
              >
                {trendLabel}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};