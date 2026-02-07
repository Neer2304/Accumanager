// components/ui/Dialog/index.tsx
"use client";

import React from 'react';
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
  alpha,
  useTheme,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Box } from 'lucide-react';

interface DialogProps extends MuiDialogProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onClose?: () => void;
  dividers?: boolean;
  fullScreen?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  subtitle,
  children,
  actions,
  onClose,
  dividers = false,
  fullScreen = false,
  maxWidth = 'sm',
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <MuiDialog
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          minWidth: fullScreen ? '100%' : 300,
          ...sx,
        },
      }}
      {...props}
    >
      {title && (
        <MuiDialogTitle
          sx={{
            py: 2,
            px: 3,
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124' }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {onClose && (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f5f5f5',
                  },
                }}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        </MuiDialogTitle>
      )}
      <MuiDialogContent dividers={dividers} sx={{ p: 3 }}>
        {children}
      </MuiDialogContent>
      {actions && (
        <MuiDialogActions
          sx={{
            p: 2,
            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            gap: 1,
          }}
        >
          {actions}
        </MuiDialogActions>
      )}
    </MuiDialog>
  );
};