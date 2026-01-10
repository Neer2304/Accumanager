"use client";

import React, { useState, useEffect } from 'react';
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
  Grid,
  InputAdornment,
  Fade,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  alpha,
  useTheme,
  StepConnector,
  stepConnectorClasses,
} from '@mui/material';
import { 
  AdminPanelSettings, 
  Security, 
  CheckCircle,
  Person,
  Email,
  Store,
  Lock,
  VerifiedUser,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Define steps outside of component
const STEPS = ['Account Info', 'Security Setup', 'Complete'];

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[400],
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[400],
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    transform: 'scale(1.1)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  }),
}));

function ColorlibStepIcon(props: any) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <Person />,
    2: <Lock />,
    3: <CheckCircle />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

export default function AdminSetupPage() {
  const router = useRouter();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopName: ''
  });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [hoverEffect, setHoverEffect] = useState(false);

  useEffect(() => {
    checkIfSetupNeeded();
  }, []);

  const checkIfSetupNeeded = async () => {
  try {
    const response = await fetch('/api/admin/setup/check');
    const data = await response.json();
    
    console.log('Setup check response:', data);
    
    if (data.adminExists && data.adminCount > 0) {
      // Check if we should still allow setup (for fixing issues)
      const urlParams = new URLSearchParams(window.location.search);
      const forceSetup = urlParams.get('force') === 'true';
      
      if (!forceSetup) {
        // Admin exists, redirect to login
        router.push('/admin/login');
      } else {
        // Allow forced setup with warning
        setError('⚠️ WARNING: Admin already exists. You are forcing setup mode.');
      }
    }
  } catch (err) {
    console.error('Setup check failed:', err);
    // Don't redirect on error, allow user to try setup
  } finally {
    setChecking(false);
  }
};

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.name || !formData.email) {
        setError('Name and email are required');
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Password fields are required');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          shopName: formData.shopName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Super admin account created successfully!');
        setActiveStep(2);
        setTimeout(() => {
          router.push('/admin/login?message=setup_complete');
        }, 3000);
      } else {
        setError(data.message || 'Setup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = () => {
    if (activeStep === 2) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    } else {
      handleNext();
    }
  };

  if (checking) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

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
        p: 2,
      }}
    >
      {/* Background elements - FIXED with pointer-events: none */}
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
          pointerEvents: 'none',
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
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            onMouseEnter={() => setHoverEffect(true)}
            onMouseLeave={() => setHoverEffect(false)}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
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
              zIndex: 2,
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
                pointerEvents: 'none',
              },
            }}
          >
            {/* Content container with proper z-index */}
            <Box sx={{ position: 'relative', zIndex: 3 }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.08)',
                      boxShadow: '0 25px 50px rgba(102, 126, 234, 0.6)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
                      zIndex: -1,
                      filter: 'blur(15px)',
                      opacity: 0.6,
                      pointerEvents: 'none',
                    },
                  }}
                >
                  <Security sx={{ fontSize: 48, color: 'white' }} />
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
                    mb: 1,
                  }}
                >
                  System Initialization
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#94a3b8',
                    fontWeight: 400,
                    opacity: 0.9,
                  }}
                >
                  Create your first super administrator account
                </Typography>
              </Box>

              {/* Custom Stepper */}
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel 
                connector={<ColorlibConnector />}
                sx={{ mb: 6 }}
              >
                {STEPS.map((label) => (  // Changed from steps to STEPS
                  <Step key={label}>
                    <StepLabel 
                      StepIconComponent={ColorlibStepIcon}
                      sx={{
                        '& .MuiStepLabel-label': {
                          color: '#94a3b8',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          '&.Mui-active': {
                            color: '#667eea',
                            fontWeight: 600,
                          },
                          '&.Mui-completed': {
                            color: '#10b981',
                          },
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Messages */}
              {success && (
                <Alert 
                  icon={<CheckCircle fontSize="inherit" />}
                  severity="success"
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10b981',
                    '& .MuiAlert-icon': { color: '#10b981' },
                  }}
                >
                  {success}
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

              {/* Step 1: Account Info */}
              {activeStep === 0 && (
                <Fade in timeout={300}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        mb: 3, 
                        color: '#667eea',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Person />
                      Account Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          disabled={loading}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: '#667eea', opacity: 0.8 }} />
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
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Shop/Business Name (Optional)"
                          value={formData.shopName}
                          onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                          disabled={loading}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Store sx={{ color: '#667eea', opacity: 0.8 }} />
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
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* Step 2: Security Setup */}
              {activeStep === 1 && (
                <Fade in timeout={300}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        mb: 3, 
                        color: '#667eea',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Lock />
                      Security Setup
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          disabled={loading}
                          helperText="At least 6 characters"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock sx={{ color: '#667eea', opacity: 0.8 }} />
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
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Confirm Password"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                          disabled={loading}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <VerifiedUser sx={{ color: '#667eea', opacity: 0.8 }} />
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
                      </Grid>
                    </Grid>
                    <Card sx={{ 
                      mt: 4, 
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid',
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      backdropFilter: 'blur(10px)',
                    }}>
                      <CardContent sx={{ py: 2.5 }}>
                        <Typography variant="body2" sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1.5,
                          color: '#94a3b8',
                        }}>
                          <Security sx={{ color: '#667eea', fontSize: 18 }} />
                          This will create the first administrator account with full system access.
                          Make sure to keep your credentials secure.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Fade>
              )}

              {/* Step 3: Complete */}
              {activeStep === 2 && (
                <Fade in timeout={300}>
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CheckCircle sx={{ 
                      fontSize: 100, 
                      color: '#10b981', 
                      mb: 3,
                      filter: 'drop-shadow(0 10px 20px rgba(16, 185, 129, 0.3))',
                    }} />
                    <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: '#f8fafc', mb: 2 }}>
                      System Ready!
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: '#94a3b8', 
                      mb: 4, 
                      maxWidth: 500, 
                      mx: 'auto',
                      lineHeight: 1.6,
                    }}>
                      Your super admin account has been created successfully.
                      You will be redirected to the login page in a moment.
                    </Typography>
                    <CircularProgress size={28} sx={{ color: '#667eea' }} />
                  </Box>
                </Fade>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0 || loading}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.25,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#94a3b8',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    background: 'rgba(30, 41, 59, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#f8fafc',
                      background: 'rgba(30, 41, 59, 0.8)',
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      transform: 'translateX(-2px)',
                    },
                    '&:disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  Back
                </Button>
                
                <Button
                  onClick={handleSetup}
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <AdminPanelSettings />}
                  disabled={loading}
                  sx={{
                    borderRadius: 3,
                    px: 6,
                    py: 1.75,
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
                  {loading 
                    ? 'Creating Account...' 
                    : activeStep === 2 
                      ? 'Complete Setup' 
                      : activeStep === 1 
                        ? 'Create Account' 
                        : 'Continue'
                  }
                </Button>
              </Box>

              {/* Footer */}
              <Box sx={{ 
                mt: 6, 
                pt: 4, 
                borderTop: '1px solid', 
                borderColor: 'rgba(255, 255, 255, 0.05)',
                textAlign: 'center',
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#64748b', 
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  mb: 2,
                }}>
                  <span>⚡</span>
                  <span>System initialization</span>
                  <span>•</span>
                  <span>Super admin privileges</span>
                  <span>•</span>
                  <span>Full access control</span>
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => router.push('/admin/login')}
                  sx={{ 
                    textTransform: 'none',
                    color: '#667eea',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  Already have an account? Login here
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}