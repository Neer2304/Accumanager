import React from 'react';
import { TextField, TextFieldProps, Box, Typography } from '@mui/material';

interface FormInputProps extends Omit<TextFieldProps, 'error'> {
  label: string;
  name: string;
  error?: string;
  helper?: string;
  required?: boolean;
  fullWidth?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  error,
  helper,
  required = false,
  fullWidth = true,
  ...props
}) => {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        label={`${label}${required ? ' *' : ''}`}
        name={name}
        error={!!error}
        helperText={error || helper}
        fullWidth={fullWidth}
        variant="outlined"
        size="small"
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

export default FormInput;