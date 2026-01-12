import React from 'react';
import {
  LinearProgress,
  Typography,
  Box,
  alpha,
  useTheme,
} from '@mui/material';

interface ResourceProgressProps {
  label: string;
  value: number;
  unit?: string;
  thresholds?: {
    warning: number;
    critical: number;
  };
  showLabel?: boolean;
  height?: number;
}

export const ResourceProgress: React.FC<ResourceProgressProps> = ({
  label,
  value,
  unit = '%',
  thresholds = { warning: 60, critical: 80 },
  showLabel = true,
  height = 8,
}) => {
  const theme = useTheme();

  const getColor = (value: number) => {
    if (value > thresholds.critical) return theme.palette.error.main;
    if (value > thresholds.warning) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const getBgColor = (value: number) => {
    if (value > thresholds.critical) return alpha(theme.palette.error.main, 0.1);
    if (value > thresholds.warning) return alpha(theme.palette.warning.main, 0.1);
    return alpha(theme.palette.success.main, 0.1);
  };

  return (
    <Box sx={{ mb: 1 }}>
      {showLabel && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="caption" fontWeight="medium" color="text.primary">
            {value}{unit}
          </Typography>
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height,
          borderRadius: 4,
          bgcolor: getBgColor(value),
          '& .MuiLinearProgress-bar': {
            bgcolor: getColor(value),
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
};