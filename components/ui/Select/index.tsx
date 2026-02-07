// components/ui/Select/index.tsx
"use client";

import React from 'react';
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
  useTheme,
  Box as MuiBox,
  Typography,
  FormHelperText,
} from '@mui/material';

interface SelectProps extends Omit<MuiSelectProps, 'error' | 'helperText'> {
  label?: string;
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
    icon?: React.ReactNode;
  }>;
  helperText?: string;
  errorText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  helperText,
  errorText,
  fullWidth = true,
  size = 'medium',
  sx = {},
  value,
  onChange,
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const handleChange = (event: any) => {
    if (onChange) {
      onChange(event, event.target.value);
    }
  };

  return (
    <FormControl 
      fullWidth={fullWidth} 
      size={size}
      error={!!errorText}
    >
      {label && (
        <InputLabel 
          id={`select-label-${label.replace(/\s+/g, '-')}`}
          sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&.Mui-focused': {
              color: '#4285f4',
            },
            '&.Mui-error': {
              color: '#ea4335',
            },
          }}
        >
          {label}
        </InputLabel>
      )}
      <MuiSelect
        labelId={label ? `select-label-${label.replace(/\s+/g, '-')}` : undefined}
        label={label}
        value={value}
        onChange={handleChange}
        sx={{
          borderRadius: '12px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#3c4043' : '#dadce0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#5f6368' : '#202124',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4285f4',
            borderWidth: 2,
          },
          ...sx,
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '8px',
              marginTop: '4px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              boxShadow: darkMode 
                ? '0 4px 20px rgba(0,0,0,0.3)' 
                : '0 4px 20px rgba(0,0,0,0.1)',
              '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
                minHeight: 36,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f5f5f5',
                },
                '&.Mui-selected': {
                  backgroundColor: alpha('#4285f4', 0.1),
                  color: '#4285f4',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: alpha('#4285f4', 0.2),
                  },
                },
              },
            },
          },
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem 
            key={String(option.value)} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.icon && (
              <MuiBox sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                {option.icon}
              </MuiBox>
            )}
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {(errorText || helperText) && (
        <FormHelperText sx={{ 
          color: errorText ? '#ea4335' : (darkMode ? '#9aa0a6' : '#5f6368'),
          marginLeft: 0,
          fontSize: '0.75rem',
        }}>
          {errorText || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};