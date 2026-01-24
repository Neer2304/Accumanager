// components/attendance/CustomSelect.tsx
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme
} from '@mui/material';

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (event: any) => void;
  options: Array<{ value: string; label: string }>;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  helperText,
  required
}) => {
  const theme = useTheme();
  
  return (
    <FormControl fullWidth error={!!error} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: 2,
              mt: 1,
              boxShadow: theme.shadows[3],
            }
          }
        }}
      >
        <MenuItem value=""><em>Select {label}</em></MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};