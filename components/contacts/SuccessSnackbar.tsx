// components/contacts/SuccessSnackbar.tsx
"use client";

import React from 'react';
import {
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface SuccessSnackbarProps {
  open: boolean;
  onClose: () => void;
}

export const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
  open,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          borderRadius: 3,
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        icon={<CheckCircle fontSize="large" />}
        sx={{
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(76, 175, 80, 0.2)',
          '& .MuiAlert-icon': {
            alignItems: 'center',
          },
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Message Sent Successfully!
        </Typography>
        <Typography variant="body2">
          We&apos;ll get back to you within 24 hours. Check your email for confirmation.
        </Typography>
      </Alert>
    </Snackbar>
  );
};