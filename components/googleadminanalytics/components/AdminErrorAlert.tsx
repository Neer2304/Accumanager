// components/googleadminanalytics/components/AdminErrorAlert.tsx
import React from 'react';
import {
  Alert,
  Container,
  useTheme
} from '@mui/material';

interface AdminErrorAlertProps {
  message: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
}

export const AdminErrorAlert: React.FC<AdminErrorAlertProps> = ({ 
  message, 
  severity = 'error' 
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const colorMap = {
    error: '#ea4335',
    warning: '#fbbc04',
    info: '#1a73e8',
    success: '#34a853'
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Alert 
        severity={severity} 
        sx={{ 
          mb: 3,
          borderRadius: '12px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${colorMap[severity]}`,
          color: darkMode ? '#e8eaed' : '#202124',
          '& .MuiAlert-icon': { color: colorMap[severity] },
        }}
      >
        {message}
      </Alert>
    </Container>
  );
};