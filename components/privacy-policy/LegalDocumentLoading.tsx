// components/privacy-policy/LegalDocumentLoading.tsx
"use client";

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LegalDocumentLoadingProps {
  message?: string;
}

export function LegalDocumentLoading({ message = "Loading Document..." }: LegalDocumentLoadingProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh' 
    }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }} color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}