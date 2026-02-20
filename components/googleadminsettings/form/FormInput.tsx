// components/googleadminsettings/form/FormInput.tsx
import React from 'react';
import {
  TextField,
  TextFieldProps,
  useTheme
} from '@mui/material';

interface FormInputProps extends Omit<TextFieldProps, 'onChange'> {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  fullWidth = true,
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      size="small"
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
  );
};