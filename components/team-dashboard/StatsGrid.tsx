"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person,
  Assignment,
  CheckCircle,
  TrendingUp,
  Schedule,
  Error,
} from '@mui/icons-material';

interface StatsGridProps {
  stats: {
    totalEmployees: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    inProgressTasks: number;
    completionRate: number;
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const theme = useTheme();

  const statItems = [
    {
      title: 'Team Members',
      value: stats.totalEmployees,
      icon: <Person />,
      color: theme.palette.primary.main,
      trend: '+2 this month',
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: <Assignment />,
      color: theme.palette.info.main,
      trend: `${stats.completedTasks} completed`,
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      trend: `${stats.completionRate}% rate`,
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      icon: <TrendingUp />,
      color: theme.palette.warning.main,
      trend: 'Active work',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks,
      icon: <Error />,
      color: theme.palette.error.main,
      trend: 'Needs attention',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: <Schedule />,
      color: theme.palette.secondary.main,
      trend: 'Team performance',
    },
  ];

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(6, 1fr)',
      },
      gap: 2,
    }}>
      {statItems.map((item, index) => (
        <Card key={index} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(item.color, 0.1),
                  color: item.color,
                  width: 48,
                  height: 48,
                }}
              >
                {item.icon}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.trend}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};