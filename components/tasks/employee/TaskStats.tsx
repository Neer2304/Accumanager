import React from 'react';
import { Paper, Typography, Box, useMediaQuery } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    assigned: number;
  };
  isMobile: boolean;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ stats, isMobile }) => {
  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      label: 'Completed',
      value: stats.completed,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ];

  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 2,
          flexWrap: 'wrap',
        }}
      >
        {statItems.map((item, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              flex: 1,
              minWidth: 80,
              background: item.gradient,
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {item.value}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {item.label.split(' ')[0]}
            </Typography>
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3,
        flexWrap: 'wrap',
      }}
    >
      {statItems.map((item, index) => (
        <Paper
          key={index}
          sx={{
            p: { xs: 2, sm: 3 },
            flex: 1,
            minWidth: { xs: '100%', sm: '180px' },
            background: item.gradient,
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight="bold" gutterBottom>
            {item.value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {item.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};