// components/ui/Input/index.tsx - UPDATED VERSION
"use client";

import React from 'react';
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

interface InputProps extends Omit<MuiTextFieldProps, 'variant'> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  label?: string;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  startIcon,
  endIcon,
  helperText,
  errorText,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  label,
  clearable = false,
  onClear,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const handleClear = () => {
    if (onClear && props.value) {
      onClear();
    }
  };

  const endAdornment = clearable && props.value ? (
    <InputAdornment position="end">
      <IconButton
        size="small"
        onClick={handleClear}
        sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
    </InputAdornment>
  ) : endIcon ? (
    <InputAdornment position="end" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
      {endIcon}
    </InputAdornment>
  ) : undefined;

  return (
    <MuiTextField
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      label={label}
      error={!!errorText}
      helperText={errorText || helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? '#5f6368' : '#202124',
            },
          },
          '&.Mui-focused': {
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4285f4',
              borderWidth: 2,
            },
          },
          '&.Mui-error': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ea4335',
            },
          },
        },
        '& .MuiInputLabel-root': {
          color: darkMode ? '#9aa0a6' : '#5f6368',
          '&.Mui-focused': {
            color: '#4285f4',
          },
          '&.Mui-error': {
            color: '#ea4335',
          },
        },
        '& .MuiFormHelperText-root': {
          marginLeft: 0,
          fontSize: '0.75rem',
          color: errorText 
            ? '#ea4335' 
            : (darkMode ? '#9aa0a6' : '#5f6368'),
        },
        ...sx,
      }}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            {startIcon}
          </InputAdornment>
        ) : undefined,
        endAdornment,
      }}
      {...props}
    />
  );
};