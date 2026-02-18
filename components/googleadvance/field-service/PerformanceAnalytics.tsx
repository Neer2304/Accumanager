// components/googleadvance/field-service/PerformanceAnalytics.tsx

'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Paper,
  alpha,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Timeline,
  Speed,
  Star,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface PerformanceAnalyticsProps {
  analytics: any;
  currentColors: any;
  isMobile?: boolean;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  analytics,
  currentColors,
  isMobile = false,
}) => {
  const metrics = [
    {
      label: 'Completion Rate',
      value: analytics?.summary?.completionRate || 85,
      icon: <CheckCircle />,
      color: googleColors.green,
    },
    {
      label: 'Avg Response Time',
      value: analytics?.summary?.averageResponseTime || 45,
      unit: 'min',
      icon: <Speed />,
      color: googleColors.blue,
    },
    {
      label: 'Avg Rating',
      value: analytics?.summary?.averageRating || 4.5,
      icon: <Star />,
      color: googleColors.yellow,
    },
    {
      label: 'On-Time Rate',
      value: analytics?.summary?.onTimeRate || 78,
      icon: <Timeline />,
      color: googleColors.red,
    },
  ];

  const statusDistribution = [
    { status: 'Completed', count: 45, color: googleColors.green },
    { status: 'In Progress', count: 12, color: googleColors.blue },
    { status: 'Scheduled', count: 23, color: googleColors.yellow },
    { status: 'Pending', count: 8, color: googleColors.red },
  ];

  const total = statusDistribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <Box>
      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 2,
                background: currentColors.surface,
                border: `1px solid ${currentColors.border}`,
                borderRadius: 2,
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Box sx={{ color: metric.color }}>{metric.icon}</Box>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  {metric.label}
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {metric.value}{metric.unit}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Status Distribution */}
      <Card sx={{ background: currentColors.card, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Job Status Distribution
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {statusDistribution.map((item) => (
              <Box key={item.status}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{item.status}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {item.count} ({Math.round((item.count / total) * 100)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(item.count / total) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: currentColors.chipBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: item.color,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Technician Performance */}
      <Card sx={{ background: currentColors.card }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Technician Performance
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2, 3].map((i) => (
              <Box key={i}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="subtitle2">Technician {i}</Typography>
                  <Typography variant="body2" color={googleColors.green}>
                    95% completion
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={[95, 88, 92][i - 1]}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: currentColors.chipBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: googleColors.blue,
                    },
                  }}
                />
                <Box display="flex" justifyContent="space-between" mt={0.5}>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    Jobs: {[24, 18, 21][i - 1]}
                  </Typography>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    Rating: {[4.8, 4.6, 4.7][i - 1]} ⭐
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};