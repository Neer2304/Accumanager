// components/dpadminlayout/components/DpAdminErrorAlert.tsx
import React from 'react';
import { Alert } from '@mui/material';
import { dpColors } from './types';

interface DpAdminErrorAlertProps {
  error: string;
  onClose: () => void;
}

export const DpAdminErrorAlert: React.FC<DpAdminErrorAlertProps> = ({ error, onClose }) => {
  return (
    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', backgroundColor: dpColors.redSoft, border: `2px solid ${dpColors.error}`, color: dpColors.error, '& .MuiAlert-icon': { color: dpColors.error } }} onClose={onClose}>
      ⚠️ {error}
    </Alert>
  );
};