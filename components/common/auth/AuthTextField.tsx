import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
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
  const [showPassword, setShowPassword] = useState(false);

  const getIcon = () => {
    switch (fieldType) {
      case 'email':
        return <Email sx={{ color: '#667eea', opacity: 0.8 }} />;
      case 'password':
        return <Lock sx={{ color: '#667eea', opacity: 0.8 }} />;
      case 'name':
        return <Person sx={{ color: '#667eea', opacity: 0.8 }} />;
      case 'phone':
        return <Phone sx={{ color: '#667eea', opacity: 0.8 }} />;
      case 'username':
        return <Badge sx={{ color: '#667eea', opacity: 0.8 }} />;
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
          <InputAdornment position="start">
            {getIcon()}
          </InputAdornment>
        ),
        endAdornment: showPasswordToggle && fieldType === 'password' ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              sx={{ 
                color: '#94a3b8',
                '&:hover': {
                  color: '#667eea',
                  background: 'rgba(102, 126, 234, 0.1)',
                }
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(102, 126, 234, 0.5)',
            background: 'rgba(30, 41, 59, 0.9)',
            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
          },
          '&.Mui-focused': {
            borderColor: '#667eea',
            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#94a3b8',
        },
        '& .MuiInputBase-input': {
          color: '#f8fafc',
        },
        ...props.sx,
      }}
    />
  );
};

export default AuthTextField;