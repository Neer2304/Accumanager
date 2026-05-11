// components/batmanadminlegal/components/BatmanLegalErrorAlert.tsx
'use client';

import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { batmanColors } from './types';

export const BatmanLegalErrorAlert: React.FC<{ message: string; }> = ({ message }) => {
  return (
    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.error}`, color: batmanColors.ink, '& .MuiAlert-icon': { color: batmanColors.error } }}>
      <AlertTitle sx={{ color: batmanColors.error }}>System Error - Access Denied</AlertTitle>
      {message}
    </Alert>
  );
};