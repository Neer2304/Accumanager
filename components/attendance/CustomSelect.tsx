"use client";

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  alpha
} from '@mui/material';

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (event: any) => void;
  options: Array<{ value: string; label: string }>;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  darkMode?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  helperText,
  required,
  darkMode = false
}) => {
  
  const selectColors = {
    background: darkMode ? '#202124' : '#ffffff',
    border: darkMode ? '#5f6368' : '#dadce0',
    borderHover: darkMode ? '#8ab4f8' : '#4285f4',
    borderFocus: darkMode ? '#8ab4f8' : '#4285f4',
    text: darkMode ? '#e8eaed' : '#202124',
    textSecondary: darkMode ? '#9aa0a6' : '#5f6368',
    dropdown: darkMode ? '#303134' : '#ffffff',
    dropdownHover: darkMode ? '#3c4043' : '#f8f9fa',
    dropdownSelected: darkMode ? '#4285f4' : '#e3f2fd',
  };

  return (
    <FormControl fullWidth error={!!error} required={required}>
      <InputLabel 
        sx={{ 
          color: selectColors.textSecondary,
          '&.Mui-focused': {
            color: selectColors.borderFocus,
          },
          '&.Mui-error': {
            color: darkMode ? '#f28b82' : '#d93025',
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        sx={{
          borderRadius: '8px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error 
              ? (darkMode ? '#f28b82' : '#d93025')
              : selectColors.border,
            borderWidth: '1px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: error 
              ? (darkMode ? '#f28b82' : '#d93025')
              : selectColors.borderHover,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: error 
              ? (darkMode ? '#f28b82' : '#d93025')
              : selectColors.borderFocus,
            borderWidth: '2px',
          },
          backgroundColor: selectColors.background,
          color: selectColors.text,
          '& .MuiSelect-icon': {
            color: selectColors.textSecondary,
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '8px',
              mt: 0.5,
              backgroundColor: selectColors.dropdown,
              color: selectColors.text,
              border: `1px solid ${selectColors.border}`,
              boxShadow: darkMode 
                ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
              maxHeight: 300,
            }
          },
          MenuListProps: {
            sx: {
              '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
                minHeight: '36px',
              }
            }
          }
        }}
      >
        <MenuItem value="" sx={{ 
          color: selectColors.textSecondary,
          fontStyle: 'italic',
          '&:hover': {
            backgroundColor: selectColors.dropdownHover,
          }
        }}>
          Select {label}
        </MenuItem>
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            sx={{
              '&:hover': {
                backgroundColor: selectColors.dropdownHover,
              },
              '&.Mui-selected': {
                backgroundColor: selectColors.dropdownSelected,
                color: darkMode ? '#8ab4f8' : '#4285f4',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: darkMode 
                    ? alpha('#4285f4', 0.8)
                    : alpha('#4285f4', 0.95),
                }
              }
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 0.5, 
            ml: 1.5,
            color: error 
              ? (darkMode ? '#f28b82' : '#d93025')
              : selectColors.textSecondary,
            display: 'block',
          }}
        >
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};