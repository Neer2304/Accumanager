'use client';

import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
  useTheme,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  Phone,
  Badge,
} from '@mui/icons-material';

type AuthFieldType = 'email' | 'password' | 'text' | 'name' | 'phone' | 'username';

interface AuthTextFieldProps extends Omit<TextFieldProps, 'type'> {
  fieldType: AuthFieldType;
  showPasswordToggle?: boolean;
}

const AuthTextField: React.FC<AuthTextFieldProps> = ({
  fieldType,
  showPasswordToggle = fieldType === 'password',
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [showPassword, setShowPassword] = useState(false);

  const getIcon = () => {
    const iconSx = { color: darkMode ? '#9aa0a6' : '#5f6368' };
    
    switch (fieldType) {
      case 'email':
        return <Email sx={iconSx} />;
      case 'password':
        return <Lock sx={iconSx} />;
      case 'name':
        return <Person sx={iconSx} />;
      case 'phone':
        return <Phone sx={iconSx} />;
      case 'username':
        return <Badge sx={iconSx} />;
      default:
        return null;
    }
  };

  const getType = () => {
    if (fieldType === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return fieldType === 'email' ? 'email' : 'text';
  };

  const getLabel = () => {
    switch (fieldType) {
      case 'email':
        return 'Email Address';
      case 'password':
        return 'Password';
      case 'name':
        return 'Full Name';
      case 'phone':
        return 'Phone Number';
      case 'username':
        return 'Username';
      default:
        return props.label || '';
    }
  };

  return (
    <TextField
      {...props}
      type={getType()}
      label={props.label || getLabel()}
      fullWidth
      margin="normal"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{getIcon()}</InputAdornment>
        ),
        endAdornment:
          showPasswordToggle && fieldType === 'password' ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode
                      ? 'rgba(138, 180, 248, 0.1)'
                      : 'rgba(26, 115, 232, 0.05)',
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
            backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
          },
          '&.Mui-focused': {
            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
            boxShadow: `0 0 0 3px ${
              darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'
            }`,
          },
        },
        '& .MuiInputLabel-root': {
          color: darkMode ? '#9aa0a6' : '#5f6368',
          '&.Mui-focused': {
            color: darkMode ? '#8ab4f8' : '#1a73e8',
          },
        },
        '& .MuiInputBase-input': {
          color: darkMode ? '#e8eaed' : '#202124',
        },
        ...props.sx,
      }}
    />
  );
};

export default AuthTextField;