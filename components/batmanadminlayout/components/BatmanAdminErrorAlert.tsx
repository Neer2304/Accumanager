// components/batmanadminlayout/components/BatmanAdminErrorAlert.tsx
import React from 'react';
import { Alert } from '@mui/material';
import { batmanColors } from './types';

interface BatmanAdminErrorAlertProps {
  error: string;
  onClose: () => void;
}

export const BatmanAdminErrorAlert: React.FC<BatmanAdminErrorAlertProps> = ({ error, onClose }) => {
  return (
    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', backgroundColor: alpha(batmanColors.error, 0.1), border: `2px solid ${batmanColors.error}`, color: batmanColors.error, '& .MuiAlert-icon': { color: batmanColors.error } }} onClose={onClose}>
      ⚡ {error}
    </Alert>
  );
};

function alpha(color: string, opacity: number): string {
  // Simple alpha function
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
}