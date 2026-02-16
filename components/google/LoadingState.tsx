// components/google/LoadingState.tsx
"use client";

import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  SxProps,
  Theme,
} from '@mui/material';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  size?: number;
  sx?: SxProps<Theme>;
}

export function LoadingState({
  message = 'Loading...',
  fullScreen = false,
  size = 40,
  sx,
}: LoadingStateProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullScreen ? '100vh' : '60vh',
        gap: 2,
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        ...sx,
      }}
    >
      <CircularProgress
        size={size}
        thickness={size > 40 ? 3.6 : 4}
        sx={{ color: '#4285f4' }}
      />
      <Typography
        variant="body1"
        sx={{
          color: darkMode ? '#9aa0a6' : '#5f6368',
          fontWeight: 300,
        }}
        align="center"
      >
        {message}
      </Typography>
    </Box>
  );
}