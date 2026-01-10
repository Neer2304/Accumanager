// components/Loading/LoadingSpinner.tsx
'use client'

import React from 'react';
import { Box, Typography } from '@mui/material';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 80,
          height: 80,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: '3px solid',
            borderColor: 'primary.100',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: '3px solid transparent',
            borderTop: '3px solid',
            borderTopColor: 'primary.main',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 12,
            height: 12,
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
              '50%': { opacity: 0.7, transform: 'translate(-50%, -50%) scale(0.8)' },
            },
          }}
        />
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: 'text.secondary',
          fontWeight: 'medium',
          position: 'relative',
          '&::after': {
            content: '"..."',
            animation: 'typing 1.5s steps(3, end) infinite',
            '@keyframes typing': {
              '0%, 20%': { content: '"."' },
              '40%': { content: '".."' },
              '60%, 100%': { content: '"..."' },
            },
          },
        }}
      >
        {message.replace('...', '')}
      </Typography>
    </Box>
  );
};