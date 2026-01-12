import React from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  alpha,
} from '@mui/material';
import { Person, Storage, Dataset } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  icon?: React.ReactNode;
  value: string | number;
  description?: string;
  progress?: {
    value: number;
    label?: string;
    thresholds?: { warning: number; critical: number };
  };
  gradient?: string;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  icon,
  value,
  description,
  progress,
  gradient,
  color = '#ffffff',
}) => {
  const defaultIcon = () => {
    if (title.toLowerCase().includes('document')) return <Person />;
    if (title.toLowerCase().includes('storage')) return <Storage />;
    if (title.toLowerCase().includes('collection')) return <Dataset />;
    return <Person />;
  };

  const getProgressColor = (value: number) => {
    if (!progress?.thresholds) return '#0d9488';
    if (value > progress.thresholds.critical) return '#f43f5e';
    if (value > progress.thresholds.warning) return '#f97316';
    return '#10b981';
  };

  return (
    <Paper
      sx={{
        p: 3,
        background: gradient || `linear-gradient(135deg, ${alpha(color, 0.9)} 0%, ${alpha(color, 0.6)} 100%)`,
        color: gradient ? 'white' : '#1e293b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: 150,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: gradient ? 'none' : alpha('#ffffff', 0.95),
          zIndex: 0,
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {icon || defaultIcon()}
        </Box>
        <Typography variant={typeof value === 'number' ? "h4" : "h5"} fontWeight="bold" gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ opacity: gradient ? 0.9 : 0.7, mb: 1 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {description}
          </Typography>
        )}
        
        {progress && (
          <Box sx={{ mt: 2, width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={progress.value}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(getProgressColor(progress.value), 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: getProgressColor(progress.value),
                  borderRadius: 3,
                },
              }}
            />
            {progress.label && (
              <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.8 }}>
                {progress.label}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};