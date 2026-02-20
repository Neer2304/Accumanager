// components/ui/Checkbox/index.tsx
"use client";

import React from 'react';
import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControlLabel,
  alpha,
  useTheme,
  Typography,
} from '@mui/material';
import { Box } from 'lucide-react';

interface CheckboxProps extends MuiCheckboxProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  size?: 'small' | 'medium';
  indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  helperText,
  error = false,
  size = 'medium',
  indeterminate = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const checkbox = (
    <MuiCheckbox
      size={size}
      indeterminate={indeterminate}
      sx={{
        color: error ? '#ea4335' : (darkMode ? '#9aa0a6' : '#5f6368'),
        '&:hover': {
          backgroundColor: alpha('#4285f4', 0.08),
        },
        '&.Mui-checked': {
          color: '#4285f4',
        },
        '&.Mui-disabled': {
          color: darkMode ? '#5f6368' : '#dadce0',
        },
        ...sx,
      }}
      {...props}
    />
  );

  if (label) {
    return (
      <Box>
        <FormControlLabel
          control={checkbox}
          label={
            <Typography 
              variant="body2" 
              sx={{ 
                color: error ? '#ea4335' : (darkMode ? '#e8eaed' : '#202124'),
                fontWeight: 400,
              }}
            >
              {label}
            </Typography>
          }
        />
        {helperText && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: error ? '#ea4335' : (darkMode ? '#9aa0a6' : '#5f6368'),
              ml: 4,
              display: 'block',
              mt: 0.5,
            }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    );
  }

  return checkbox;
};