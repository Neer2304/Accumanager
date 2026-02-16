// components/google/ConfirmationDialog.tsx
"use client";

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Stack,
  useTheme,
  SxProps,
  Theme,
} from '@mui/material';
import { Alert } from '@/components/ui/Alert';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'warning' | 'error' | 'info';
  details?: React.ReactNode;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

export function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning',
  details,
  loading = false,
  sx,
}: ConfirmationDialogProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const severityColors = {
    warning: {
      main: darkMode ? '#fdd663' : '#fbbc04',
      background: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
    },
    error: {
      main: darkMode ? '#f28b82' : '#ea4335',
      background: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
    },
    info: {
      main: darkMode ? '#8ab4f8' : '#4285f4',
      background: darkMode ? 'rgba(66, 133, 244, 0.1)' : 'rgba(66, 133, 244, 0.05)',
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.08)',
          ...sx,
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          pb: 2,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          fontWeight: 500,
          color: severityColors[severity].main,
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Alert
            severity={severity}
            sx={{
              borderRadius: '12px',
              backgroundColor: severityColors[severity].background,
            //   border: `1px solid ${alpha(severityColors[severity].main, 0.2)}`,
              color: severityColors[severity].main,
            }}
          >
            {message}
          </Alert>
          {details && (
            <Paper
              sx={{
                p: 2,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}
            >
              {details}
            </Paper>
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: '20px',
            px: 2.5,
            py: 0.75,
            color: darkMode ? '#e8eaed' : '#202124',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={severity === 'error' ? 'error' : 'primary'}
          disabled={loading}
          sx={{
            borderRadius: '20px',
            px: 2.5,
            py: 0.75,
            backgroundColor: severity === 'error'
              ? darkMode ? '#f28b82' : '#ea4335'
              : severity === 'warning'
              ? darkMode ? '#fdd663' : '#fbbc04'
              : darkMode ? '#8ab4f8' : '#4285f4',
            color: severity === 'warning' ? (darkMode ? '#202124' : '#ffffff') : '#ffffff',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: severity === 'error'
                ? darkMode ? '#f28b82' : '#d32f2f'
                : severity === 'warning'
                ? darkMode ? '#fdd663' : '#fbbc04'
                : darkMode ? '#8ab4f8' : '#3367d6',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}