"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Container,
  Stack,
  InputAdornment,
  Card,
  CardContent,
  Fade,
  Grow,
  Zoom,
  IconButton,
} from '@mui/material';
import { 
  Security, 
  Person,
  Email,
  Lock,
  VerifiedUser,
  Key,
  VpnKey,
  Visibility,
  VisibilityOff,
  RocketLaunch,
  Shield,
  AdminPanelSettings,
} from '@mui/icons-material';

export default function InitSetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    masterKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterKey, setShowMasterKey] = useState(false);

  // Load master key from environment (this will be empty on client-side)
  // The actual validation happens server-side
  const MASTER_KEY = process.env.NEXT_PUBLIC_SETUP_MASTER_KEY || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.password || !formData.masterKey) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain uppercase, lowercase letters and numbers');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/setup/init', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Setup-Key': 'SYSTEM_INITIALIZATION_REQUEST'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          masterKey: formData.masterKey
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('✅ System initialized successfully! Creating super admin account...');
        
        // Show success animation
        setTimeout(() => {
          setSuccess('✅ Super admin account created! Redirecting to login...');
          setTimeout(() => {
            router.push('/admin/login?message=system_initialized&first_setup=true');
          }, 1500);
        }, 1500);
      } else {
        setError(data.message || `Setup failed (${response.status})`);
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 0%, #0f172a 0%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          top: '20%',
          left: '10%',
          animation: 'float 6s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(149, 76, 233, 0.08) 0%, transparent 70%)',
          bottom: '20%',
          right: '10%',
          animation: 'float 8s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        }
      }}
    >
      {/* Animated background particles */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              background: `rgba(102, 126, 234, ${Math.random() * 0.3 + 0.1})`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `particleFloat ${Math.random() * 10 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              '@keyframes particleFloat': {
                '0%': {
                  transform: 'translateY(0) translateX(0)',
                  opacity: 0,
                },
                '10%': { opacity: 1 },
                '90%': { opacity: 1 },
                '100%': {
                  transform: `translateY(${Math.random() * -100 - 50}px) translateX(${Math.random() * 40 - 20}px)`,
                  opacity: 0,
                }
              }
            }}
          />
        ))}
      </Box>

      <Container maxWidth="md">
        <Grow in={true} timeout={800}>
          <Stack spacing={4}>
            {/* Header */}
            <Zoom in={true} timeout={1000}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 120,
                    height: 120,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    borderRadius: '50%',
                    mb: 3,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: -2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                      borderRadius: '50%',
                      filter: 'blur(10px)',
                      opacity: 0.5,
                      zIndex: -1,
                    }
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 60, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  System Initialization
                </Typography>
                <Typography variant="h6" color="#94a3b8" sx={{ mb: 1 }}>
                  Welcome to Your Admin Dashboard
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Create the first super admin account to get started
                </Typography>
              </Box>
            </Zoom>

            {/* Main Form */}
            <Fade in={true} timeout={1200}>
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
                  }
                }}
              >
                <Stack spacing={4}>
                  {/* Master Key Section */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Shield sx={{ color: '#667eea' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Master Authentication
                      </Typography>
                    </Stack>
                    
                    <TextField
                      fullWidth
                      label="System Master Key"
                      type={showMasterKey ? 'text' : 'password'}
                      value={formData.masterKey}
                      onChange={(e) => handleInputChange('masterKey', e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Enter the master key from .env.local"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKey sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowMasterKey(!showMasterKey)}
                              edge="end"
                              size="small"
                            >
                              {showMasterKey ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(30, 41, 59, 0.5)',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#667eea',
                            }
                          }
                        }
                      }}
                    />
                    <Typography variant="caption" color="#64748b" sx={{ mt: 1, display: 'block' }}>
                      Located in your .env.local file as SETUP_MASTER_KEY
                    </Typography>
                  </Box>

                  {/* Admin Details */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Person sx={{ color: '#667eea' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Admin Account Details
                      </Typography>
                    </Stack>
                    
                    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: '#667eea' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(30, 41, 59, 0.5)',
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: '#667eea' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(30, 41, 59, 0.5)',
                          }
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Password Section */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Lock sx={{ color: '#667eea' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Secure Password
                      </Typography>
                    </Stack>
                    
                    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: '#667eea' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        helperText="Min. 8 chars with uppercase, lowercase & numbers"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(30, 41, 59, 0.5)',
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <VerifiedUser sx={{ color: '#667eea' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(30, 41, 59, 0.5)',
                          }
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Status Messages */}
                  {success && (
                    <Alert 
                      severity="success" 
                      icon={<RocketLaunch />}
                      sx={{
                        background: 'rgba(22, 163, 74, 0.1)',
                        border: '1px solid rgba(22, 163, 74, 0.3)',
                      }}
                    >
                      {success}
                    </Alert>
                  )}

                  {error && (
                    <Alert 
                      severity="error"
                      sx={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  {/* Warning Card */}
                  <Zoom in={true}>
                    <Card 
                      sx={{ 
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Security sx={{ color: '#ef4444', mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold" color="#ef4444" gutterBottom>
                              ⚠️ CRITICAL SYSTEM OPERATION
                            </Typography>
                            <Typography variant="body2" color="warning.light">
                              This action will:
                            </Typography>
                            <Stack component="ul" spacing={0.5} sx={{ mt: 1, pl: 2 }}>
                              <Typography component="li" variant="body2" color="warning.light">
                                • Create the FIRST super admin account with FULL SYSTEM ACCESS
                              </Typography>
                              <Typography component="li" variant="body2" color="warning.light">
                                • Initialize the database with admin permissions
                              </Typography>
                              <Typography component="li" variant="body2" color="warning.light">
                                • Cannot be undone without database reset
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Zoom>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    variant="contained"
                    size="large"
                    disabled={loading}
                    fullWidth
                    startIcon={loading ? null : <RocketLaunch />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      '🚀 Initialize System & Create Admin'
                    )}
                  </Button>
                </Stack>
              </Paper>
            </Fade>

            {/* Footer */}
            <Typography 
              variant="caption" 
              align="center" 
              color="#64748b"
              sx={{ 
                display: 'block',
                opacity: 0.7,
                '& a': {
                  color: '#667eea',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }
              }}
            >
              Ensure your .env.local file contains SETUP_MASTER_KEY • System v1.0
            </Typography>
          </Stack>
        </Grow>
      </Container>
    </Box>
  );
}