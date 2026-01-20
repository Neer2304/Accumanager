'use client'

import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  Alert,
  Divider,
  Button,
  alpha
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowForward,
  Security,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Common Components
import { PrimaryButton } from '@/components/common';
import { Icons } from '@/components/common/icons';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleGoogleRedirect = () => {
    // Redirects to the isolated google-login folder we created
    router.push('/google-login');
  };

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
        endIcon={<ArrowForward />}
        sx={{
          py: 1.5,
          mb: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}
      >
        Sign In to Dashboard
      </PrimaryButton>

      {/* --- GOOGLE LOGIN SECTION --- */}
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, fontWeight: 500 }}>
          OR
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon sx={{ color: '#DB4437' }} />}
        onClick={handleGoogleRedirect}
        sx={{
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          borderColor: alpha('#000', 0.1),
          color: 'text.primary',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: alpha('#000', 0.02),
            borderColor: alpha('#000', 0.2),
            transform: 'translateY(-1px)',
          },
        }}
      >
        Continue with Google
      </Button>
      {/* ---------------------------- */}

      {/* Demo Info */}
      <Alert 
        severity="info" 
        variant="outlined"
        sx={{ 
          mt: 3,
          mb: 3,
          borderRadius: 2,
          bgcolor: 'info.lighter',
        }}
        icon={<Icons.Info />}
      >
        <Typography variant="body2" fontWeight="500">
          Use your registered credentials or social login to access your dashboard.
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
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
        >
          <Security sx={{ fontSize: '0.9rem' }} /> Your login is secured with 256-bit SSL encryption
        </Typography>
      </Box>
    </Box>
  );
};

export default UserLoginForm;