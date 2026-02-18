// components/googlepipelinestages/components/StagesStats.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import { PipelineStats } from '../types';
import { GOOGLE_COLORS } from '../constants';

interface StagesStatsProps {
  stats: PipelineStats;
}

export const StagesStats: React.FC<StagesStatsProps> = ({ stats }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const statCards = [
    { 
      label: 'Total Stages', 
      value: stats.totalStages, 
      color: GOOGLE_COLORS.blue 
    },
    { 
      label: 'Active Stages', 
      value: stats.activeStages, 
      color: GOOGLE_COLORS.green 
    },
    { 
      label: 'Total Deals', 
      value: stats.totalDeals, 
      color: GOOGLE_COLORS.purple 
    },
    { 
      label: 'Pipeline Value', 
      value: `$${stats.totalValue.toLocaleString()}`, 
      color: GOOGLE_COLORS.orange 
    },
    { 
      label: 'Avg Probability', 
      value: `${stats.avgProbability.toFixed(1)}%`, 
      color: GOOGLE_COLORS.teal 
    }
  ];

  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      mb: 4
    }}>
      {statCards.map((stat, index) => (
        <Paper key={index} sx={{
          flex: '1 1 calc(20% - 16px)',
          minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
          p: 2,
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '16px',
        }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            {stat.label}
          </Typography>
          <Typography variant="h5" sx={{ color: stat.color, fontWeight: 500, mt: 0.5 }}>
            {stat.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};