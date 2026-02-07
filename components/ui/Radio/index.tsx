// components/ui/Radio/index.tsx
"use client";

import React from 'react';
import {
  Radio as MuiRadio,
  RadioProps as MuiRadioProps,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  alpha,
  useTheme,
  Typography,
} from '@mui/material';
import { Box } from 'lucide-react';

interface RadioProps extends MuiRadioProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  size?: 'small' | 'medium';
}

export const Radio: React.FC<RadioProps> = ({
  label,
  helperText,
  error = false,
  size = 'medium',
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const radio = (
    <MuiRadio
      size={size}
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
          control={radio}
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

  return radio;
};

interface RadioGroupProps {
  label?: string;
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  row?: boolean;
  error?: boolean;
  helperText?: string;
}

export const RadioGroup2: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  row = false,
  error = false,
  helperText,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <FormControl error={error}>
      {label && (
        <FormLabel 
          sx={{ 
            color: error ? '#ea4335' : (darkMode ? '#e8eaed' : '#202124'),
            mb: 1,
            '&.Mui-focused': {
              color: '#4285f4',
            },
          }}
        >
          {label}
        </FormLabel>
      )}
      <RadioGroup value={value} onChange={onChange} row={row}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={
              <Typography 
                variant="body2" 
                sx={{ 
                  color: error ? '#ea4335' : (darkMode ? '#e8eaed' : '#202124'),
                }}
              >
                {option.label}
              </Typography>
            }
            disabled={option.disabled}
          />
        ))}
      </RadioGroup>
      {helperText && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: error ? '#ea4335' : (darkMode ? '#9aa0a6' : '#5f6368'),
            mt: 0.5,
          }}
        >
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};