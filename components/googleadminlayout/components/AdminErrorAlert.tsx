// components/googleadminlayout/components/AdminErrorAlert.tsx
import React from 'react';
import {
  Alert,
  useTheme
} from '@mui/material';
import { googleColors } from './types';

interface AdminErrorAlertProps {
  error: string;
  onClose: () => void;
}

export const AdminErrorAlert: React.FC<AdminErrorAlertProps> = ({ error, onClose }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Alert 
      severity="error" 
      sx={{ 
        mb: 3,
        borderRadius: '12px',
        backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
        border: `1px solid ${googleColors.error}`,
        color: darkMode ? googleColors.grey200 : googleColors.grey900,
        '& .MuiAlert-icon': { color: googleColors.error },
        fontSize: { xs: '0.875rem', sm: '1rem' },
        py: { xs: 1.5, sm: 2 },
      }}
      onClose={onClose}
    >
      {error}
    </Alert>
  );
};