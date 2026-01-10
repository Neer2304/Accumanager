// app/loading.tsx
'use client'

import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress 
          size={80}
          thickness={4}
          sx={{ 
            color: 'white',
            mb: 3 
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 'medium',
          }}
        >
          Loading AccumaManage...
        </Typography>
      </Box>
    </Box>
  );
}