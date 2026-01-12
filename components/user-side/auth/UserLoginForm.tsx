import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowForward,
  Security,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Common Components
import { PrimaryButton, SecondaryButton } from '@/components/common';
import { Icons } from '@/components/common/icons';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface UserLoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  loading: boolean;
  error?: string;
  onClearError: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

const UserLoginForm: React.FC<UserLoginFormProps> = ({
  onSubmit,
  loading,
  error,
  onClearError,
  onForgotPassword,
  onRegister,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={onClearError}
          variant="outlined"
        >
          {error}
        </Alert>
      )}

      {/* Email Field */}
      <TextField
        {...register('email')}
        fullWidth
        label="Email Address"
        variant="outlined"
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Password Field */}
      <TextField
        {...register('password')}
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
                size="medium"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Forgot Password Link */}
      <Box textAlign="right" mb={3}>
        <Link 
          component="button"
          type="button"
          onClick={onForgotPassword}
          sx={{ 
            fontSize: '0.95rem',
            fontWeight: 500,
            textDecoration: 'none',
            color: 'primary.main',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Forgot your password?
        </Link>
      </Box>

      {/* Submit Button */}
      <PrimaryButton
        type="submit"
        fullWidth
        loading={loading}
        // loadingText="Signing In..."
        endIcon={<ArrowForward />}
        sx={{
          py: 1.5,
          mb: 3,
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}
      >
        Sign In to Dashboard
      </PrimaryButton>

      {/* Demo Info */}
      <Alert 
        severity="info" 
        variant="outlined"
        sx={{ 
          mb: 3,
          borderRadius: 2,
          bgcolor: 'info.lighter',
        }}
        icon={<Icons.Info />}
      >
        <Typography variant="body2" fontWeight="500">
          Use your registered credentials to access your active subscription dashboard.
        </Typography>
      </Alert>

      {/* Sign Up Link */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link 
            component="button"
            type="button"
            onClick={onRegister}
            sx={{ 
              fontWeight: 'bold',
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Start Free Trial
          </Link>
        </Typography>
      </Box>

      {/* Security Note */}
      <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          align="center"
          sx={{ display: 'block', lineHeight: 1.5 }}
        >
          <Security /> Your login is secured with 256-bit SSL encryption
        </Typography>
      </Box>
    </Box>
  );
};

export default UserLoginForm;