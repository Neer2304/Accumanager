// components/privacy-policy/LegalDocumentError.tsx
"use client";

import React from 'react';
import { Box, Alert, Paper, Typography, Button } from '@mui/material';
import { ArrowBack as BackIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Link from 'next/link';

interface LegalDocumentErrorProps {
  error: string;
  onRetry: () => void;
  homeLink?: string;
}

export function LegalDocumentError({ 
  error, 
  onRetry, 
  homeLink = "/" 
}: LegalDocumentErrorProps) {
  return (
    <>
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Error Loading Document
        </Typography>
        <Typography variant="body2">
          {error}
        </Typography>
      </Alert>
      
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Document Not Available
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          We apologize for the inconvenience. Please try again later or contact support.
        </Typography>
        <Button 
          variant="contained" 
          onClick={onRetry}
          startIcon={<RefreshIcon />}
          sx={{ mr: 2 }}
        >
          Retry
        </Button>
        <Button 
          variant="outlined" 
          component={Link} 
          href={homeLink}
          startIcon={<BackIcon />}
        >
          Go to Homepage
        </Button>
      </Paper>
    </>
  );
}