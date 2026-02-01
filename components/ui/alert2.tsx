"use client";

import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps, AlertTitle } from '@mui/material';

interface Alert2Props extends MuiAlertProps {
  title?: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: 'standard' | 'filled' | 'outlined';
}

export const Alert2: React.FC<Alert2Props> = ({
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
  variant = 'standard',
  sx = {},
  ...props
}) => {
  return (
    <MuiAlert
      variant={variant}
      onClose={dismissible ? onDismiss : undefined}
      sx={{
        borderRadius: 2,
        alignItems: 'center',
        ...sx,
      }}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message || children}
    </MuiAlert>
  );
};