// components/googlereports/components/ReportErrorAlert.tsx
import React from 'react';
import {
  Alert,
  useTheme
} from '@mui/material';

interface ReportErrorAlertProps {
  message: string;
  onClose: () => void;
}

export const ReportErrorAlert: React.FC<ReportErrorAlertProps> = ({ message, onClose }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Alert 
      severity="error" 
      sx={{ 
        mb: 3,
        borderRadius: '12px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: '1px solid #ea4335',
        color: darkMode ? '#e8eaed' : '#202124',
        '& .MuiAlert-icon': { color: '#ea4335' },
      }}
      onClose={onClose}
    >
      {message}
    </Alert>
  );
};