import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { GOOGLE_COLORS } from '../constants';

interface LeadStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    color: string;
    icon: React.ReactNode;
  }>;
  darkMode: boolean;
}

export function LeadStats({ stats, darkMode }: LeadStatsProps) {
  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      mb: 4
    }}>
      {stats.map((stat, index) => (
        <Paper
          key={index}
          sx={{
            flex: '1 1 calc(20% - 16px)',
            minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 14px)', md: 'calc(20% - 16px)' },
            p: 2,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
              borderColor: stat.color
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {stat.label}
              </Typography>
              <Typography variant="h5" sx={{ color: stat.color, fontWeight: 500, mt: 0.5 }}>
                {stat.value}
              </Typography>
            </Box>
            <Box sx={{
              p: 1,
              borderRadius: '12px',
              bgcolor: alpha(stat.color, 0.1),
              color: stat.color
            }}>
              {stat.icon}
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}