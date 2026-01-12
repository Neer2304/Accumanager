import React from 'react';
import { TextField, TextFieldProps, Box } from '@mui/material';

interface FormTextAreaProps extends Omit<TextFieldProps, 'error'> {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
  required?: boolean;
  rows?: number;
  fullWidth?: boolean;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  helper,
  required = false,
  rows = 4,
  fullWidth = true,
  ...props
}) => {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        label={`${label}${required ? ' *' : ''}`}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        helperText={error || helper}
        multiline
        rows={rows}
        fullWidth={fullWidth}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
          },
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
          },
        }}
        {...props}
      />
    </Box>
  );
};

export default FormTextArea;