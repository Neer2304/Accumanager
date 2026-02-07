// components/ui/Progress/index.tsx
"use client";

import React from 'react';
import { 
  LinearProgress as MuiLinearProgress,
  CircularProgress as MuiCircularProgress,
  LinearProgressProps as MuiLinearProgressProps,
  CircularProgressProps as MuiCircularProgressProps,
  Box,
  alpha,
  useTheme,
  Typography,
} from '@mui/material';

interface LinearProgressProps extends MuiLinearProgressProps {
  label?: string;
  valueLabel?: string;
  showValue?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium';
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  label,
  valueLabel,
  showValue = false,
  color = 'primary',
  size = 'medium',
  value = 0,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getColorValue = () => {
    const colors = {
      primary: '#4285f4',
      secondary: '#34a853',
      error: '#ea4335',
      warning: '#fbbc04',
      info: '#8ab4f8',
      success: '#34a853',
    };
    return colors[color];
  };

  const colorValue = getColorValue();

  return (
    <Box sx={{ width: '100%' }}>
      {(label || showValue) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          {label && (
            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {label}
            </Typography>
          )}
          {showValue && (
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {valueLabel || `${Math.round(value)}%`}
            </Typography>
          )}
        </Box>
      )}
      <MuiLinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: size === 'small' ? 4 : 6,
          borderRadius: '4px',
          backgroundColor: darkMode ? '#3c4043' : '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            borderRadius: '4px',
            backgroundColor: colorValue,
          },
          ...sx,
        }}
        {...props}
      />
    </Box>
  );
};

interface CircularProgressProps extends MuiCircularProgressProps {
  label?: string;
  showValue?: boolean;
  value?: number;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  label,
  showValue = false,
  value = 0,
  color = 'primary',
  size = 'medium',
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const sizes = {
    small: 40,
    medium: 60,
    large: 80,
  };

  const getColorValue = () => {
    const colors = {
      primary: '#4285f4',
      secondary: '#34a853',
      error: '#ea4335',
      warning: '#fbbc04',
      info: '#8ab4f8',
      success: '#34a853',
    };
    return colors[color];
  };

  const colorValue = getColorValue();

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <MuiCircularProgress
        variant="determinate"
        value={value}
        size={sizes[size]}
        thickness={4}
        sx={{
          color: colorValue,
          ...sx,
        }}
        {...props}
      />
      {(label || showValue) && (
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {showValue && (
            <Typography
              variant={size === 'large' ? 'h6' : size === 'medium' ? 'body1' : 'body2'}
              component="div"
              sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124' }}
            >
              {`${Math.round(value)}%`}
            </Typography>
          )}
          {label && size === 'large' && (
            <Typography
              variant="caption"
              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}
            >
              {label}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};