// components/proadminlayout/components/ProAdminErrorAlert.tsx
import React from 'react';
import { Alert } from '@mui/material';
import { proColors } from './types';

interface ProAdminErrorAlertProps {
  error: string;
  onClose: () => void;
}

export const ProAdminErrorAlert: React.FC<ProAdminErrorAlertProps> = ({ error, onClose }) => {
  return (
    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', border: `1px solid ${proColors.error}`, '& .MuiAlert-icon': { color: proColors.error } }} onClose={onClose}>
      {error}
    </Alert>
  );
};