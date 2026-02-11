'use client';

import React from 'react';
import {
  Alert,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

interface SubscriptionStatusProps {
  isLoading: boolean;
  isActive: boolean;
  isOnline: boolean;
  remainingInvoices: number;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  isLoading,
  isActive,
  isOnline,
  remainingInvoices,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  if (isLoading) {
    return (
      <CircularProgress
        size={20}
        sx={{
          color: darkMode ? '#8ab4f8' : '#1a73e8',
          mb: 2,
        }}
      />
    );
  }

  if (!isActive && isOnline) {
    return (
      <Alert
        severity="error"
        icon={<ErrorIcon />}
        sx={{
          mb: 3,
          borderRadius: '12px',
          backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
          border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)'}`,
          color: darkMode ? '#f28b82' : '#c5221f',
          '& .MuiAlert-icon': {
            color: darkMode ? '#f28b82' : '#c5221f',
          },
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          Your subscription is not active. Please renew to create bills.
        </Typography>
      </Alert>
    );
  }

  if (remainingInvoices <= 5 && isOnline) {
    return (
      <Alert
        severity="warning"
        icon={<WarningIcon />}
        sx={{
          mb: 3,
          borderRadius: '12px',
          backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
          border: `1px solid ${darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)'}`,
          color: darkMode ? '#fdd663' : '#b45a1c',
          '& .MuiAlert-icon': {
            color: darkMode ? '#fdd663' : '#b45a1c',
          },
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          You have {remainingInvoices} invoices remaining. Consider upgrading your plan.
        </Typography>
      </Alert>
    );
  }

  return null;
};