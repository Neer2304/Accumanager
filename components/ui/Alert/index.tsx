// components/ui/Alert/index.tsx
"use client";

import React from 'react';
import { 
  Alert as MuiAlert, 
  AlertProps as MuiAlertProps, 
  AlertTitle,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface AlertProps extends MuiAlertProps {
  title?: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: 'standard' | 'filled' | 'outlined';
  severity?: 'success' | 'info' | 'warning' | 'error';
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
  variant = 'standard',
  severity = 'info',
  icon,
  action,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getSeverityColors = () => {
    const colors = {
      success: { bg: '#d9f0e1', border: '#c1e0d2', text: '#0d652d', icon: '#34a853' },
      info: { bg: '#e3f2fd', border: '#bbdefb', text: '#0d3064', icon: '#4285f4' },
      warning: { bg: '#fef7e0', border: '#ffcc80', text: '#653c00', icon: '#fbbc04' },
      error: { bg: '#fce8e6', border: '#f4c7c3', text: '#c5221f', icon: '#ea4335' },
    };

    const darkColors = {
      success: { bg: '#0d652d', border: '#0d652d', text: '#d9f0e1', icon: '#34a853' },
      info: { bg: '#0d3064', border: '#0d3064', text: '#e3f2fd', icon: '#4285f8' },
      warning: { bg: '#653c00', border: '#653c00', text: '#fef7e0', icon: '#fbbc04' },
      error: { bg: '#420000', border: '#420000', text: '#fce8e6', icon: '#ea4335' },
    };

    return darkMode ? darkColors[severity] : colors[severity];
  };

  const colors = getSeverityColors();

  return (
    <MuiAlert
      variant={variant}
      severity={severity}
      onClose={dismissible ? onDismiss : undefined}
      icon={icon}
      action={action || (dismissible && (
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onDismiss}
          sx={{
            color: colors.text,
            '&:hover': {
              backgroundColor: alpha(colors.icon, 0.1),
            },
          }}
        >
          <Close fontSize="inherit" />
        </IconButton>
      ))}
      sx={{
        borderRadius: '12px',
        alignItems: 'flex-start',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        color: colors.text,
        '& .MuiAlert-icon': {
          color: colors.icon,
          mt: 0.5,
        },
        '& .MuiAlert-message': {
          flex: 1,
          py: 0.5,
        },
        ...sx,
      }}
      {...props}
    >
      {title && (
        <AlertTitle sx={{ 
          fontWeight: 600, 
          color: colors.text,
          mb: message || children ? 0.5 : 0,
        }}>
          {title}
        </AlertTitle>
      )}
      {message || children}
    </MuiAlert>
  );
};