// components/googleadminsettings/components/SettingsSuccessAlert.tsx
import React from 'react';
import {
  Alert,
  useTheme
} from '@mui/material';

interface SettingsSuccessAlertProps {
  message: string;
  onClose: () => void;
}

export const SettingsSuccessAlert: React.FC<SettingsSuccessAlertProps> = ({ message, onClose }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Alert 
      severity="success" 
      sx={{ 
        mb: 3,
        borderRadius: '12px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: '1px solid #34a853',
        color: darkMode ? '#e8eaed' : '#202124',
        '& .MuiAlert-icon': { color: '#34a853' },
      }}
      onClose={onClose}
    >
      {message}
    </Alert>
  );
};