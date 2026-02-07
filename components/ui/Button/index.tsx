// components/ui/Button/index.tsx
"use client";

import React from 'react';
import { 
  Button as MuiButton, 
  ButtonProps as MuiButtonProps, 
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material';

interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  iconLeft,
  iconRight,
  disabled,
  fullWidth = false,
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getColorValue = () => {
    const colors = {
      primary: '#4285f4',
      secondary: '#34a853',
      error: '#ea4335',
      warning: '#fbbc04',
      info: '#8ab4f8',
      success: '#34a853',
      inherit: 'inherit',
    };
    return colors[color];
  };

  const colorValue = getColorValue();
  const isDarkBackground = darkMode && variant === 'contained';

  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: '12px',
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.01em',
      transition: 'all 0.2s ease',
    };

    if (variant === 'contained') {
      return {
        ...baseStyles,
        backgroundColor: colorValue,
        color: isDarkBackground ? '#202124' : '#ffffff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        '&:hover': {
          backgroundColor: alpha(colorValue, 0.9),
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&.Mui-disabled': {
          backgroundColor: darkMode ? '#3c4043' : '#dadce0',
          color: darkMode ? '#9aa0a6' : '#5f6368',
        },
      };
    }

    if (variant === 'outlined') {
      return {
        ...baseStyles,
        borderColor: color === 'inherit' ? 'inherit' : alpha(colorValue, 0.5),
        color: color === 'inherit' ? 'inherit' : colorValue,
        '&:hover': {
          borderColor: colorValue,
          backgroundColor: alpha(colorValue, 0.08),
        },
        '&.Mui-disabled': {
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          color: darkMode ? '#9aa0a6' : '#5f6368',
        },
      };
    }

    // text variant
    return {
      ...baseStyles,
      color: color === 'inherit' ? 'inherit' : colorValue,
      '&:hover': {
        backgroundColor: alpha(colorValue, 0.08),
      },
      '&.Mui-disabled': {
        color: darkMode ? '#9aa0a6' : '#5f6368',
      },
    };
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: '0.8125rem',
          padding: '4px 12px',
          minHeight: 32,
        };
      case 'large':
        return {
          fontSize: '0.9375rem',
          padding: '10px 24px',
          minHeight: 44,
        };
      default: // medium
        return {
          fontSize: '0.875rem',
          padding: '8px 16px',
          minHeight: 36,
        };
    }
  };

  return (
    <MuiButton
      variant={variant}
      size={size}
      color={color as any}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : iconLeft}
      endIcon={iconRight}
      sx={{
        ...getButtonStyles(),
        ...getSizeStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};