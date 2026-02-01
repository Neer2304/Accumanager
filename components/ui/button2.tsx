"use client";

import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

interface Button2Props extends MuiButtonProps {
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export const Button2: React.FC<Button2Props> = ({
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
  return (
    <MuiButton
      variant={variant}
      size={size}
      color={color}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 500,
        ...sx,
      }}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : iconLeft}
      endIcon={iconRight}
      {...props}
    >
      {children}
    </MuiButton>
  );
};