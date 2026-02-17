// app/login/page.tsx
'use client'

import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Button,
  TextField,
  InputAdornment,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Security,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Dashboard,
  VerifiedUser,
  Shield,
  Login as LoginIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Analytics,
  Inventory,
  People,
  Smartphone,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: LoginFormData) => {
    clearError();
    login(data);
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleGoogleRedirect = () => router.push("/google-login");
  const handleGithubRedirect = () => router.push("/github-login");

  // Features data
  const features = [
    { icon: <Analytics />, title: 'Advanced Analytics', description: 'Real-time business insights' },
    { icon: <Inventory />, title: 'Inventory Management', description: 'Track products effortlessly' },
    { icon: <People />, title: 'Customer CRM', description: 'Manage customer relationships' },
    { icon: <Smartphone />, title: 'Mobile App', description: 'Access anywhere, anytime' },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: darkMode
        ? 'radial-gradient(circle at 10% 30%, rgba(138, 180, 248, 0.05) 0%, transparent 30%), radial-gradient(circle at 90% 70%, rgba(218, 165, 32, 0.05) 0%, transparent 30%), #1a1c1e'
        : 'radial-gradient(circle at 10% 30%, rgba(26, 115, 232, 0.03) 0%, transparent 30%), radial-gradient(circle at 90% 70%, rgba(218, 165, 32, 0.03) 0%, transparent 30%), #f8f9fa',
      position: 'relative',
      overflow: 'hidden',
      p: { xs: 2, sm: 3, md: 0 },
    }}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? 4 : 8,
        }}
      >
        {/* Left Side - Branding Section (Hidden on mobile) */}
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              maxWidth: 500,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                fontWeight="800"
                gutterBottom
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: {
                    xs: '2rem',
                    sm: '2.5rem',
                    md: '3rem',
                  },
                  lineHeight: 1.2,
                }}
              >
                Welcome Back to AccuManage
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  fontSize: {
                    xs: '1rem',
                    md: '1.1rem',
                  },
                  lineHeight: 1.6,
                  maxWidth: '90%',
                }}
              >
                Sign in to access your business dashboard and continue growing with our powerful management tools.
              </Typography>
            </Box>

            {/* Feature Cards */}
            <Stack spacing={2} sx={{ width: '100%' }}>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: darkMode ? 'rgba(48, 49, 52, 0.5)' : 'rgba(248, 249, 250, 0.8)',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode
                        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>

            {/* Trust Indicators */}
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Card
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 20,
                  backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.05)',
                  border: `1px solid ${darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)'}`,
                }}
              >
                <Security sx={{ fontSize: 16, color: darkMode ? '#34a853' : '#34a853' }} />
                <Typography variant="caption" fontWeight="500" sx={{ color: darkMode ? '#34a853' : '#34a853' }}>
                  Enterprise Security
                </Typography>
              </Card>
              
              <Card
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 20,
                  backgroundColor: darkMode ? 'rgba(66, 133, 244, 0.1)' : 'rgba(66, 133, 244, 0.05)',
                  border: `1px solid ${darkMode ? 'rgba(66, 133, 244, 0.2)' : 'rgba(66, 133, 244, 0.1)'}`,
                }}
              >
                <VerifiedUser sx={{ fontSize: 16, color: darkMode ? '#4285f4' : '#4285f4' }} />
                <Typography variant="caption" fontWeight="500" sx={{ color: darkMode ? '#4285f4' : '#4285f4' }}>
                  99.9% Uptime
                </Typography>
              </Card>
            </Stack>
          </Box>
        )}

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            maxWidth: isMobile ? '100%' : 450,
            width: '100%',
          }}
        >
          <Card sx={{
            borderRadius: '28px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: darkMode
                ? '0 16px 48px rgba(0, 0, 0, 0.6)'
                : '0 16px 48px rgba(0, 0, 0, 0.12)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #1a73e8, #8ab4f8, #fbbc04)',
              zIndex: 1,
            },
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 4.5 } }}>
              {/* Header */}
              <Stack spacing={3} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ position: 'relative', width: '100%' }}>
                  <Tooltip title="Back to Home">
                    <IconButton
                      component={Link}
                      href="/"
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        backgroundColor: darkMode ? 'rgba(60, 64, 67, 0.5)' : 'rgba(218, 220, 224, 0.5)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#e8eaed',
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      }}
                    >
                      <ArrowBack />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    border: `2px solid ${darkMode ? '#8ab4f8' : '#1a73e8'}`,
                    boxShadow: darkMode
                      ? '0 0 0 4px rgba(138, 180, 248, 0.1)'
                      : '0 0 0 4px rgba(26, 115, 232, 0.1)',
                  }}
                >
                  <Dashboard sx={{ fontSize: 44 }} />
                </Avatar>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      color: darkMode ? '#e8eaed' : '#202124',
                      letterSpacing: '-0.5px',
                      mb: 1,
                    }}
                  >
                    Sign In
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    Access your business dashboard
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    px: 2,
                    py: 0.75,
                    borderRadius: '20px',
                    backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.05)',
                    border: `1px solid ${darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)'}`,
                  }}
                >
                  <Security sx={{ fontSize: 16, color: darkMode ? '#34a853' : '#34a853' }} />
                  <Typography variant="caption" sx={{ color: darkMode ? '#34a853' : '#34a853', fontWeight: 500 }}>
                    Secure 256-bit SSL Encrypted Access
                  </Typography>
                </Stack>
              </Stack>

              {/* Error Alert */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                    border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)'}`,
                    color: darkMode ? '#f28b82' : '#c5221f',
                  }}
                  onClose={clearError}
                >
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email Address"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isLoading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
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
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
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
                      '& .MuiFormHelperText-root': {
                        color: darkMode ? '#f28b82' : '#d32f2f',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={isLoading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              '&:hover': {
                                color: darkMode ? '#8ab4f8' : '#1a73e8',
                                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
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
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
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
                      '& .MuiFormHelperText-root': {
                        color: darkMode ? '#f28b82' : '#d32f2f',
                      },
                    }}
                  />

                  {/* Forgot Password Link */}
                  <Box textAlign="right">
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={handleForgotPassword}
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        textDecoration: "none",
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                        '&:hover': { textDecoration: "underline" },
                      }}
                    >
                      Forgot your password?
                    </MuiLink>
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: '28px',
                      backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      color: darkMode ? '#202124' : '#ffffff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                        boxShadow: darkMode
                          ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                          : '0 4px 12px rgba(26, 115, 232, 0.3)',
                      },
                      '&:disabled': {
                        backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      },
                    }}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
                  </Button>

                  {/* Divider */}
                  <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                    <Divider sx={{ flex: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ px: 2, fontWeight: 600, fontSize: "0.75rem", letterSpacing: 1 }}
                    >
                      OR CONTINUE WITH
                    </Typography>
                    <Divider sx={{ flex: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                  </Box>

                  {/* Social Login Buttons */}
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<GoogleIcon />}
                      onClick={handleGoogleRedirect}
                      sx={{
                        py: 1.2,
                        borderRadius: '12px',
                        textTransform: "none",
                        fontWeight: 600,
                        color: darkMode ? '#e8eaed' : '#202124',
                        borderColor: darkMode ? '#3c4043' : '#dadce0',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s",
                      }}
                    >
                      Google
                    </Button>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<GitHubIcon />}
                      onClick={handleGithubRedirect}
                      sx={{
                        py: 1.2,
                        borderRadius: '12px',
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: darkMode ? '#8ab4f8' : '#24292e',
                        color: darkMode ? '#202124' : 'white',
                        '&:hover': {
                          bgcolor: darkMode ? '#aecbfa' : '#1b1f23',
                          transform: "translateY(-1px)",
                          boxShadow: darkMode
                            ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                            : '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        transition: "all 0.2s",
                      }}
                    >
                      GitHub
                    </Button>
                  </Stack>
                </Stack>
              </form>

              {/* Sign Up Link */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <MuiLink
                    component="button"
                    type="button"
                    onClick={handleRegister}
                    sx={{
                      fontWeight: "bold",
                      textDecoration: "none",
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      '&:hover': { textDecoration: "underline" },
                    }}
                  >
                    Start Free Trial
                  </MuiLink>
                </Typography>
              </Box>

              {/* Security Features */}
              <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 3 }}>
                {[
                  { icon: '🔐', label: '256-bit SSL' },
                  { icon: '👁️', label: '2FA Ready' },
                  { icon: '📊', label: 'Activity Logs' },
                ].map((feature, index) => (
                  <Stack key={index} alignItems="center" spacing={0.5}>
                    <Typography sx={{ fontSize: '1.2rem' }}>{feature.icon}</Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      {feature.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}