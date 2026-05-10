// components/proadminlegal/components/ProLegalErrorAlert.tsx
'use client';

import React from 'react';
import { Alert, AlertTitle, useTheme } from '@mui/material';

export const ProLegalErrorAlert: React.FC<{ message: string; }> = ({ message }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  return (
    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: '1px solid #ea4335', color: darkMode ? '#e8eaed' : '#202124', '& .MuiAlert-icon': { color: '#ea4335' } }}><AlertTitle>Error</AlertTitle>{message}</Alert>
  );
};