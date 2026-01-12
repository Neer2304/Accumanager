import React from 'react';
import { Alert, AlertProps } from '@mui/material';
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
  const getSeverity = (): AlertProps['severity'] => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'security': return 'success';
      default: return 'info';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      case 'warning': return <Warning />;
      case 'info': return <Info />;
      case 'security': return <Security />;
      default: return undefined;
    }
  };

  const getStyles = () => {
    const baseStyles = {
      borderRadius: 2,
      border: '1px solid',
      '& .MuiAlert-icon': { color: 'inherit' },
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          background: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          color: '#10b981',
        };
      case 'error':
        return {
          ...baseStyles,
          background: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
        };
      case 'warning':
        return {
          ...baseStyles,
          background: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          color: '#f59e0b',
        };
      case 'info':
        return {
          ...baseStyles,
          background: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          color: '#3b82f6',
        };
      case 'security':
        return {
          ...baseStyles,
          background: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          color: '#10b981',
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