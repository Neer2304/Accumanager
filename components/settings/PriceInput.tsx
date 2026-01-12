import React from 'react';
import { TextField, TextFieldProps, Box, Typography } from '@mui/material';

interface PriceInputProps extends Omit<TextFieldProps, 'onChange'> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  currency?: string;
}

const PriceInput: React.FC<PriceInputProps> = ({
  label,
  value,
  onChange,
  currency = '₹',
  ...props
}) => {
  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        margin="normal"
        InputProps={{
          startAdornment: (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <Typography sx={{ minWidth: '20px' }}>{currency}</Typography>
            </Box>
          ),
        }}
        {...props}
      />
    </Box>
  );
};

export default PriceInput;