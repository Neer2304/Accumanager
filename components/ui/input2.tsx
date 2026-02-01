"use client";

import React from 'react';
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
} from '@mui/material';

interface Input2Props extends Omit<MuiTextFieldProps, 'variant'> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
}

export const Input2: React.FC<Input2Props> = ({
  startIcon,
  endIcon,
  helperText,
  errorText,
  variant = 'outlined',
  sx = {},
  ...props
}) => {
  return (
    <MuiTextField
      variant={variant}
      error={!!errorText}
      helperText={errorText || helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx,
      }}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : undefined,
      }}
      {...props}
    />
  );
};