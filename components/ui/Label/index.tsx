// components/ui/Label/index.tsx
"use client";

import React from 'react';
import { Typography, Box, alpha, useTheme } from '@mui/material';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  disabled?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  size = 'md',
  error = false,
  disabled = false,
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const sizes = {
    sm: { fontSize: '0.8125rem', mb: 0.5 },
    md: { fontSize: '0.875rem', mb: 0.75 },
    lg: { fontSize: '0.9375rem', mb: 1 },
  };

  const getColor = () => {
    if (error) return '#ea4335';
    if (disabled) return darkMode ? '#5f6368' : '#9aa0a6';
    return darkMode ? '#e8eaed' : '#202124';
  };

  return (
    <Typography
      component="label"
      variant="body2"
      sx={{
        display: 'block',
        fontWeight: 500,
        color: getColor(),
        ...sizes[size],
        '&:after': required ? {
          content: '"*"',
          color: '#ea4335',
          ml: 0.5,
        } : {},
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export const InputHelper: React.FC<{ 
  children: React.ReactNode; 
  error?: boolean;
}> = ({
  children,
  error = false,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Typography
      variant="caption"
      sx={{
        display: 'block',
        mt: 0.5,
        color: error ? '#ea4335' : (darkMode ? '#9aa0a6' : '#5f6368'),
        fontSize: '0.75rem',
        lineHeight: 1.4,
      }}
    >
      {children}
    </Typography>
  );
};