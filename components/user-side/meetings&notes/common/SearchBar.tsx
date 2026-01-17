// app/components/user-side/meetings&notes/common/SearchBar.tsx
"use client";

import React from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

export interface SearchBarProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search...',
  ...props 
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      variant="outlined"
      size="small"
      {...props}
    />
  );
}