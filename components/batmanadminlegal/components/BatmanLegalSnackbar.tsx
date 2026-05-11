// components/batmanadminlegal/components/BatmanLegalSnackbar.tsx
'use client';

import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarState, batmanColors } from './types';

export const BatmanLegalSnackbar: React.FC<{ snackbar: SnackbarState; onClose: () => void; }> = ({ snackbar, onClose }) => {
  const severityColors = { success: '#34a853', error: '#ea4335' };
  return (
    <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity={snackbar.severity} onClose={onClose} sx={{ borderRadius: '12px', backgroundColor: batmanColors.surface, border: `2px solid ${severityColors[snackbar.severity]}`, color: batmanColors.ink, boxShadow: `0 4px 12px ${batmanColors.goldGlow}` }}>{snackbar.severity === 'success' ? '🦇 ' : '⚠️ '}{snackbar.message}</Alert>
    </Snackbar>
  );
};