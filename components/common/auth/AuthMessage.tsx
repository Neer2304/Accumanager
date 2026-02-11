'use client';

import React from 'react';
import { Alert, AlertProps, useTheme } from '@mui/material';
import {
  Security,
  CheckCircle,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';

type MessageType = 'success' | 'error' | 'warning' | 'info' | 'security';

interface AuthMessageProps extends Omit<AlertProps, 'severity'> {
  type: MessageType;
  message: string;
  closable?: boolean;
  onClose?: () => void;
}

const AuthMessage: React.FC<AuthMessageProps> = ({
  type,
  message,
  closable = false,
  onClose,
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getSeverity = (): AlertProps['severity'] => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'security':
        return 'success';
      default:
        return 'info';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'info':
        return <Info />;
      case 'security':
        return <Security />;
      default:
        return undefined;
    }
  };

  const getStyles = () => {
    const baseStyles = {
      borderRadius: '12px',
      border: '1px solid',
      '& .MuiAlert-icon': { color: 'inherit' },
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.05)',
          borderColor: darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)',
          color: darkMode ? '#34a853' : '#1e7e34',
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
          borderColor: darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)',
          color: darkMode ? '#f28b82' : '#c5221f',
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
          borderColor: darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)',
          color: darkMode ? '#fdd663' : '#b45a1c',
        };
      case 'info':
        return {
          ...baseStyles,
          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
          borderColor: darkMode ? 'rgba(138, 180, 248, 0.2)' : 'rgba(26, 115, 232, 0.1)',
          color: darkMode ? '#8ab4f8' : '#1a73e8',
        };
      case 'security':
        return {
          ...baseStyles,
          backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.05)',
          borderColor: darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)',
          color: darkMode ? '#34a853' : '#1e7e34',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Alert
      severity={getSeverity()}
      icon={getIcon()}
      onClose={closable ? onClose : undefined}
      sx={getStyles()}
      {...props}
    >
      {message}
    </Alert>
  );
};

export default AuthMessage;