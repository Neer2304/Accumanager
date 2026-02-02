// components/team/ActivityCard.tsx
"use client";

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Activity } from '@/types/teamActivity';
import { formatTime } from '@/utils/dateFormatter';
import { getActivityIcon } from '@/utils/activityUtils';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        transition: 'all 0.3s',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
          }}
        >
          {getActivityIcon(activity.type)}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {activity.userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(activity.timestamp)}
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            {activity.description}
          </Typography>
          
          {(activity.projectName || activity.taskName) && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {activity.projectName && (
                <Chip
                  label={activity.projectName}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
              {activity.taskName && (
                <Chip
                  label={activity.taskName}
                  size="small"
                  color="primary"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          )}
          
          {activity.metadata?.points && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <Box sx={{ 
                width: 16, 
                height: 16, 
                borderRadius: '50%', 
                bgcolor: theme.palette.warning.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Typography variant="caption" sx={{ color: 'white', fontSize: 10 }}>
                  +
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {activity.metadata.points} points
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};