// components/googleadminsettings/form/PriceInput.tsx
import React from 'react';
import {
  TextField,
  TextFieldProps,
  Box,
  Typography,
  useTheme
} from '@mui/material';

interface PriceInputProps extends Omit<TextFieldProps, 'onChange'> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  currency?: string;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  label,
  value,
  onChange,
  currency = '₹',
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        size="small"
        InputProps={{
          startAdornment: (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <Typography 
                sx={{ 
                  minWidth: '20px',
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                {currency}
              </Typography>
            </Box>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            '&:hover': {
              backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
            },
          },
          '& .MuiInputLabel-root': {
            color: darkMode ? '#9aa0a6' : '#5f6368',
          },
          '& .MuiInputBase-input': {
            color: darkMode ? '#e8eaed' : '#202124',
          },
        }}
        {...props}
      />
    </Box>
  );
};