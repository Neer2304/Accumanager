"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Container,
  Link as MuiLink,
  InputAdornment,
  Fade,
  alpha,
  useTheme,
} from '@mui/material';
import { 
  AdminPanelSettings, 
  Login as LoginIcon,
  Email,
  Lock,
  ArrowBack,
  Security,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [hoverEffect, setHoverEffect] = useState(false);

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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite alternate',
        },
        '@keyframes pulse': {
          '0%': { opacity: 0.3 },
          '100%': { opacity: 0.6 },
        },
      }}
    >
      {/* Animated background elements - FIXED: Added pointer-events: none */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
          pointerEvents: 'none', // FIX: Allows clicks to pass through
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite reverse',
          pointerEvents: 'none', // FIX: Allows clicks to pass through
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            onMouseEnter={() => setHoverEffect(true)}
            onMouseLeave={() => setHoverEffect(false)}
            sx={{
              p: { xs: 3, sm: 4, md: 4.5 },
              borderRadius: 4,
              background: `
                linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)
              `,
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.2),
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 ${alpha(theme.palette.common.white, 0.1)}
              `,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoverEffect ? 'translateY(-8px)' : 'translateY(0)',
              zIndex: 2, // FIX: Ensure it's above background elements
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
                animation: 'shimmer 2s infinite linear',
                zIndex: 1,
              },
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '-200px 0' },
                '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                padding: '2px',
                background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.1))',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                opacity: hoverEffect ? 1 : 0.5,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none', // FIX: Allows clicks to pass through
              },
            }}
          >
            {/* Content container with proper z-index */}
            <Box sx={{ position: 'relative', zIndex: 3 }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    position: 'relative',
                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.08) rotate(5deg)',
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: '-3px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
                      zIndex: -1,
                      filter: 'blur(10px)',
                      opacity: 0.7,
                      pointerEvents: 'none',
                    },
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 44, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  fontWeight="800" 
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 30%, #f093fb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#94a3b8',
                    fontWeight: 400,
                    mb: 1,
                  }}
                >
                  Access your admin dashboard
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Security sx={{ fontSize: 16, color: '#10b981' }} />
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    Enterprise-grade security
                  </Typography>
                </Box>
              </Box>

              {/* Messages */}
              {message && (
                <Alert 
                  severity="success"
                  icon={<Security />}
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10b981',
                    '& .MuiAlert-icon': { color: '#10b981' },
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
                    borderRadius: 2,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    '& .MuiAlert-icon': { color: '#ef4444' },
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3.5 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    margin="normal"
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#667eea', opacity: 0.8 }} />
                        </InputAdornment>
                      ),
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
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    margin="normal"
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#667eea', opacity: 0.8 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{ 
                              minWidth: 'auto', 
                              color: '#94a3b8',
                              '&:hover': {
                                color: '#667eea',
                                background: 'rgba(102, 126, 234, 0.1)',
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </Button>
                        </InputAdornment>
                      ),
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
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <LoginIcon />}
                  disabled={loading}
                  sx={{
                    mt: 1,
                    mb: 3,
                    py: 1.75,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: '200% 100%',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-3px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
                      backgroundPosition: '100% 0',
                    },
                    '&:active': {
                      transform: 'translateY(0) scale(0.98)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      transition: 'left 0.7s ease',
                    },
                    '&:hover::before': {
                      left: '100%',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                      boxShadow: 'none',
                      transform: 'none',
                    },
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                </Button>
              </form>

              {/* Footer Links */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 3, color: '#94a3b8' }}>
                  Don't have admin access?{' '}
                  <MuiLink
                    component={Link}
                    href="/admin/setup"
                    sx={{ 
                      textDecoration: 'none',
                      fontWeight: '600',
                      color: '#667eea',
                      position: 'relative',
                      padding: '0 4px',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#f093fb',
                        '&::after': {
                          width: '100%',
                          left: 0,
                        },
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: '50%',
                        width: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #667eea, #f093fb)',
                        transition: 'all 0.3s ease',
                      },
                    }}
                  >
                    Setup First Admin
                  </MuiLink>
                </Typography>
                
                <MuiLink
                  component={Link}
                  href="/"
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: '#64748b',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    padding: '8px 16px',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(30, 41, 59, 0.5)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#f8fafc',
                      background: 'rgba(30, 41, 59, 0.8)',
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      transform: 'translateX(-4px)',
                      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <ArrowBack sx={{ fontSize: 18, mr: 1 }} />
                  Return to Main Site
                </MuiLink>
              </Box>

              {/* Security Features */}
              <Box sx={{ 
                mt: 5, 
                pt: 3, 
                borderTop: '1px solid', 
                borderColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
              }}>
                {[
                  { icon: '🔐', text: '256-bit SSL' },
                  { icon: '👁️', text: '2FA Ready' },
                  { icon: '📊', text: 'Activity Logs' },
                ].map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5,
                      opacity: 0.7,
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                      '&:hover': {
                        opacity: 1,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: '1.2rem' }}>{feature.icon}</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                      {feature.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}