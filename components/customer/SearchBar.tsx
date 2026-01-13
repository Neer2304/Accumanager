import React from 'react';
import { Card, CardContent, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isMobile?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search customers...",
  isMobile = false 
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            sx: { 
              height: isMobile ? 48 : 56,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }
          }}
          variant="outlined"
        />
      </CardContent>
    </Card>
  );
};