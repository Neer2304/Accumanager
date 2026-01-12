import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  Alert,
  Fade,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Email,
  Lock,
  Store,
  ArrowForward,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Common Components
import { PrimaryButton } from '@/components/common';
import { Icons } from '@/components/common/icons';

const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase, one lowercase, and one number'),
  confirmPassword: z.string(),
  shopName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface UserRegistrationFormProps {
  onSubmit: (data: RegisterFormData) => void;
  loading: boolean;
  error?: string;
  onClearError: () => void;
  onLogin: () => void;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({
  onSubmit,
  loading,
  error,
  onClearError,
  onLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fill in your details to get started
        </Typography>
      </Box>

      {error && (
        <Fade in={!!error}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            onClose={onClearError}
            icon={false}
            variant="outlined"
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Name Field */}
      <TextField
        {...register('name')}
        fullWidth
        label="Full Name"
        variant="outlined"
        margin="normal"
        error={!!errors.name}
        helperText={errors.name?.message}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonAdd color="action" />
            </InputAdornment>
          ),
        }}
      />

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

      {/* Shop Name Field */}
      <TextField
        {...register('shopName')}
        fullWidth
        label="Business/Shop Name (Optional)"
        variant="outlined"
        margin="normal"
        error={!!errors.shopName}
        helperText={errors.shopName?.message}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Store color="action" />
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

      {/* Confirm Password Field */}
      <TextField
        {...register('confirmPassword')}
        fullWidth
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        variant="outlined"
        margin="normal"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={toggleConfirmPasswordVisibility}
                edge="end"
                size="medium"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Submit Button */}
      <PrimaryButton
        type="submit"
        fullWidth
        loading={loading}
        // loadingText="Creating Account..."
        endIcon={<ArrowForward />}
        disabled={!isValid}
        sx={{
          py: 1.5,
          mb: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}
      >
        Start Free Trial
      </PrimaryButton>

      {/* Login Link */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link 
            component="button"
            type="button"
            onClick={onLogin}
            sx={{ 
              fontWeight: 'bold',
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign In Here
          </Link>
        </Typography>
      </Box>

      {/* Terms & Privacy */}
      <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          align="center"
          sx={{ display: 'block' }}
        >
          By signing up, you agree to our{' '}
          <Link 
            href="/terms-of-service" 
            sx={{ 
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link 
            href="/privacy-policy" 
            sx={{ 
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default UserRegistrationForm;