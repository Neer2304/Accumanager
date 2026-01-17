// app/components/user-side/meetings&notes/common/LoadingState.tsx
"use client";

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export interface LoadingStateProps {
  message?: string;
  size?: number;
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 40 
}: LoadingStateProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '200px',
      gap: 2
    }}>
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}