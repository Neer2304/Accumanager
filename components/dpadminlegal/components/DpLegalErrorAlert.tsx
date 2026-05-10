// components/dpadminlegal/components/DpLegalErrorAlert.tsx
'use client';

import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { dpColors } from './types';

export const DpLegalErrorAlert: React.FC<{ message: string; }> = ({ message }) => {
  return (
    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.error}`, color: dpColors.ink, '& .MuiAlert-icon': { color: dpColors.error } }}>
      <AlertTitle sx={{ color: dpColors.error }}>Error - Maximum Effort Failed!</AlertTitle>
      {message}
    </Alert>
  );
};