'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  Link as MuiLink,
} from '@mui/material';
import {
  ArrowBack,
  AdminPanelSettings,
  Security,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Dashboard,
  VerifiedUser,
  Shield,
  Login as LoginIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkAdminAuth();

    const msg = searchParams.get('message');
    if (msg === 'setup_complete') {
      setMessage('Super admin account created successfully! Please login.');
    }
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      if (response.ok) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      // Not logged in
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

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
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10 }}>
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
                <AdminPanelSettings sx={{ fontSize: 44 }} />
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
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  Access your admin dashboard
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
                  Enterprise-grade security
                </Typography>
              </Stack>
            </Stack>

            {/* Messages */}
            {message && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.05)',
                  border: `1px solid ${darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)'}`,
                  color: darkMode ? '#34a853' : '#1e7e34',
                  '& .MuiAlert-icon': {
                    color: darkMode ? '#34a853' : '#1e7e34',
                  },
                }}
              >
                {message}
              </Alert>
            )}

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
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
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
                  }}
                />

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
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
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                  sx={{
                    mt: 2,
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
                  {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                </Button>
              </Stack>
            </form>

            {/* Footer Links */}
            <Stack spacing={2} sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Don't have admin access?{' '}
                <MuiLink
                  component={Link}
                  href="/admin/setup"
                  sx={{
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Setup First Admin
                </MuiLink>
              </Typography>

              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Forgot password?{' '}
                <MuiLink
                  component={Link}
                  href="/admin/forgot-password"
                  sx={{
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Reset here
                </MuiLink>
              </Typography>
            </Stack>

            <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Security Features */}
            <Stack direction="row" spacing={3} justifyContent="center">
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

            {/* Return to Main Site */}
            <Button
              component={Link}
              href="/"
              variant="outlined"
              fullWidth
              startIcon={<ArrowBack />}
              sx={{
                mt: 3,
                py: 1.25,
                borderRadius: '28px',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                },
              }}
            >
              Return to Main Site
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}