// app/components/user-side/meetings&notes/common/ErrorState.tsx
"use client";

import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Error as ErrorIcon, Refresh } from '@mui/icons-material';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  message = 'Something went wrong',
  onRetry 
}: ErrorStateProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '200px',
      gap: 3
    }}>
      <ErrorIcon sx={{ fontSize: 60, color: 'error.main' }} />
      
      <Typography variant="h6" color="error">
        {message}
      </Typography>
      
      {onRetry && (
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
}