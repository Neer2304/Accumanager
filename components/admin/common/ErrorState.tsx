import React from 'react';
import { Box, Typography, Button, Alert, AlertTitle, Paper } from '@mui/material';
import { Refresh, ErrorOutline } from '@mui/icons-material';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showIcon?: boolean;
  severity?: 'error' | 'warning' | 'info';
  actionText?: string;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  showIcon = true,
  severity = 'error',
  actionText = 'Try Again',
  compact = false,
}) => {
  if (compact) {
    return (
      <Alert
        severity={severity}
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<Refresh />}
            >
              {actionText}
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    );
  }

  return (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        maxWidth: 400,
        mx: 'auto',
        my: 4,
      }}
      elevation={0}
      variant="outlined"
    >
      <Box sx={{ mb: 3 }}>
        {showIcon && (
          <ErrorOutline
            sx={{
              fontSize: 64,
              color: severity === 'error' ? 'error.main' : 
                     severity === 'warning' ? 'warning.main' : 
                     'info.main',
              opacity: 0.8,
            }}
          />
        )}
      </Box>
      
      <Typography variant="h6" gutterBottom color="text.primary" fontWeight="medium">
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      
      {onRetry && (
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={onRetry}
          size="large"
          sx={{ mt: 2 }}
        >
          {actionText}
        </Button>
      )}
    </Paper>
  );
};