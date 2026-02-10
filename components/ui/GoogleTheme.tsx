// components/ui/GoogleTheme.tsx
import React from 'react';
import {
  Paper,
  Button,
  Chip,
  TextField,
  Alert,
  Typography,
  Box,
  IconButton,
  alpha,
  useTheme,
  Dialog,
} from '@mui/material';

// Google-themed Card
export const GoogleCard = ({ children, sx = {}, elevation = 0, ...props }: any) => (
  <Paper
    elevation={elevation}
    sx={{
      borderRadius: '12px',
      border: '1px solid #dadce0',
      backgroundColor: '#fff',
      boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
      },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Paper>
);

// Google-themed Button
export const GoogleButton = ({ children, sx = {}, variant = 'contained', size = 'medium', ...props }: any) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Button
      variant={variant}
      size={size}
      sx={{
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: 500,
        letterSpacing: '0.25px',
        px: 3,
        py: 1,
        fontSize: '0.875rem',
        ...(variant === 'contained' && {
          backgroundColor: '#1a73e8',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#0d62d9',
            boxShadow: '0 1px 3px rgba(60,64,67,0.3), 0 4px 8px rgba(60,64,67,0.15)',
          },
          '&.Mui-disabled': {
            backgroundColor: '#f1f3f4',
            color: '#9aa0a6',
          },
        }),
        ...(variant === 'outlined' && {
          borderColor: isDark ? '#5f6368' : '#dadce0',
          color: isDark ? '#e8eaed' : '#3c4043',
          '&:hover': {
            backgroundColor: isDark ? '#3c4043' : '#f8f9fa',
            borderColor: isDark ? '#8ab4f8' : '#cce0fc',
          },
        }),
        ...(variant === 'text' && {
          color: '#1a73e8',
          '&:hover': {
            backgroundColor: alpha('#1a73e8', 0.08),
          },
        }),
        ...(size === 'small' && {
          px: 2,
          py: 0.5,
          fontSize: '0.8125rem',
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

// Google-themed Chip
export const GoogleChip = ({ label, sx = {}, color = 'default', ...props }: any) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const colorStyles = {
    default: {
      bg: isDark ? '#3c4043' : '#f1f3f4',
      color: isDark ? '#e8eaed' : '#3c4043',
    },
    primary: {
      bg: '#e8f0fe',
      color: '#1967d2',
    },
    secondary: {
      bg: '#fce8e6',
      color: '#c5221f',
    },
    success: {
      bg: '#e6f4ea',
      color: '#137333',
    },
    warning: {
      bg: '#fef7e0',
      color: '#b06000',
    },
  };

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        borderRadius: '12px',
        height: '24px',
        fontSize: '0.75rem',
        fontWeight: 500,
        ...colorStyles[color],
        '& .MuiChip-deleteIcon': {
          fontSize: '16px',
          color: 'inherit',
          opacity: 0.7,
          '&:hover': {
            opacity: 1,
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};

// Google-themed Alert
export const GoogleAlert = ({ severity = 'info', children, sx = {}, onClose, ...props }: any) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const severityStyles = {
    error: {
      bg: isDark ? '#3c221e' : '#fce8e6',
      color: isDark ? '#f28b82' : '#c5221f',
      border: isDark ? '1px solid #5c302b' : '1px solid #f28b82',
    },
    warning: {
      bg: isDark ? '#3c2c1e' : '#fef7e0',
      color: isDark ? '#fdd663' : '#b06000',
      border: isDark ? '1px solid #5c4532' : '1px solid #fdd663',
    },
    info: {
      bg: isDark ? '#1e3a5f' : '#e8f0fe',
      color: isDark ? '#8ab4f8' : '#1967d2',
      border: isDark ? '1px solid #2d4d81' : '1px solid #8ab4f8',
    },
    success: {
      bg: isDark ? '#1e3a2e' : '#e6f4ea',
      color: isDark ? '#81c995' : '#137333',
      border: isDark ? '1px solid #2d5c48' : '1px solid #81c995',
    },
  };

  return (
    <Alert
      severity={severity}
      onClose={onClose}
      sx={{
        borderRadius: '8px',
        alignItems: 'center',
        ...severityStyles[severity],
        '& .MuiAlert-icon': {
          color: 'inherit',
        },
        '& .MuiAlert-message': {
          color: 'inherit',
          fontSize: '0.875rem',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Alert>
  );
};

// Google-themed Typography
export const GoogleTypography = ({ variant = 'body1', children, sx = {}, ...props }: any) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const variantStyles = {
    h1: {
      fontSize: '2.25rem',
      fontWeight: 400,
      letterSpacing: '-0.5px',
      color: isDark ? '#e8eaed' : '#202124',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 400,
      letterSpacing: '-0.25px',
      color: isDark ? '#e8eaed' : '#202124',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
      color: isDark ? '#e8eaed' : '#202124',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: isDark ? '#e8eaed' : '#202124',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: isDark ? '#e8eaed' : '#202124',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: isDark ? '#e8eaed' : '#202124',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: isDark ? '#9aa0a6' : '#5f6368',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: isDark ? '#9aa0a6' : '#5f6368',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: isDark ? '#e8eaed' : '#3c4043',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: isDark ? '#9aa0a6' : '#5f6368',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: isDark ? '#9aa0a6' : '#5f6368',
    },
  };

  return (
    <Typography
      variant={variant}
      sx={{
        ...variantStyles[variant],
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

// Google-themed TextField
export const GoogleTextField = ({ sx = {}, variant = 'outlined', size = 'medium', ...props }: any) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <TextField
      variant={variant}
      size={size}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: isDark ? '#303134' : '#fff',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? '#5f6368' : '#dadce0',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1a73e8',
            borderWidth: '2px',
          },
        },
        '& .MuiInputLabel-root': {
          color: isDark ? '#9aa0a6' : '#5f6368',
          '&.Mui-focused': {
            color: '#1a73e8',
          },
        },
        '& .MuiInputBase-input': {
          color: isDark ? '#e8eaed' : '#202124',
        },
        '& .MuiFormHelperText-root': {
          color: isDark ? '#9aa0a6' : '#5f6368',
        },
        ...sx,
      }}
      {...props}
    />
  );
};

// Google-themed Dialog
export const GoogleDialog = ({ open, onClose, title, children, maxWidth = 'sm', fullWidth = true, actions, ...props }: any) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          backgroundColor: isDark ? '#303134' : '#fff',
          border: isDark ? '1px solid #5f6368' : '1px solid #dadce0',
        },
      }}
      {...props}
    >
      {title && (
        <Box sx={{ p: 3, pb: 2, borderBottom: isDark ? '1px solid #5f6368' : '1px solid #dadce0' }}>
          <GoogleTypography variant="h6">
            {title}
          </GoogleTypography>
        </Box>
      )}
      
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
      
      {actions && (
        <Box sx={{ 
          p: 3, 
          pt: 2, 
          borderTop: isDark ? '1px solid #5f6368' : '1px solid #dadce0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
        }}>
          {actions}
        </Box>
      )}
    </Dialog>
  );
};