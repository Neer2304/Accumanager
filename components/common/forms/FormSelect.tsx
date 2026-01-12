import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from '@mui/material';

interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  error?: string;
  helper?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  helper,
  required = false,
  fullWidth = true,
  disabled = false,
  size = 'small',
}) => {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <FormControl 
        fullWidth={fullWidth} 
        error={!!error}
        size={size}
        disabled={disabled}
      >
        <InputLabel>
          {label}{required ? ' *' : ''}
        </InputLabel>
        <Select
          label={`${label}${required ? ' *' : ''}`}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            borderRadius: 2,
            '& .MuiSelect-select': {
              fontSize: '0.875rem',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem 
              key={option.value} 
              value={option.value}
              sx={{ fontSize: '0.875rem' }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {(error || helper) && (
          <FormHelperText>{error || helper}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default FormSelect;