// components/googleadminlegal/components/LegalSnackbar.tsx
import React from 'react';
import {
  Snackbar,
  Alert,
  useTheme
} from '@mui/material';
import { SnackbarState } from './types';

interface LegalSnackbarProps {
  snackbar: SnackbarState;
  onClose: () => void;
}

export const LegalSnackbar: React.FC<LegalSnackbarProps> = ({ snackbar, onClose }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const severityColors = {
    success: '#34a853',
    error: '#ea4335'
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity={snackbar.severity}
        onClose={onClose}
        sx={{
          borderRadius: '12px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${severityColors[snackbar.severity]}`,
          color: darkMode ? '#e8eaed' : '#202124',
          '& .MuiAlert-icon': { color: severityColors[snackbar.severity] },
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};