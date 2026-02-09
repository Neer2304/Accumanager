// app/(pages)/community/quick-setup/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
  Stack,
} from '@mui/material';
import {
  CheckCircle,
  ArrowBack,
  PersonAdd,
  People,
  Forum,
  ThumbUp,
  Share,
  AccountCircle,
  Settings,
  RocketLaunch,
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';

export default function QuickSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/community';
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  
  const steps = [
    'Checking authentication...',
    'Verifying user account...',
    'Creating community profile...',
    'Setting up preferences...',
    'Redirecting to community...'
  ];

  useEffect(() => {
    // Auto-start setup on page load
    handleQuickSetup();
  }, []);

  const handleQuickSetup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Check authentication
      setStep(0);
      setProgress(20);
      
      const authResponse = await fetch('/api/auth/session', {
        credentials: 'include',
      });
      
      if (!authResponse.ok) {
        throw new Error('Please sign in first');
      }
      
      const session = await authResponse.json();
      if (!session.user) {
        throw new Error('Please sign in first');
      }
      
      // Step 2: Check if already has profile
      setStep(1);
      setProgress(40);
      
      const meResponse = await fetch('/api/community/me', {
        credentials: 'include',
      });
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        if (meData.success && meData.data.hasCommunityProfile) {
          // Already has profile, redirect immediately
          router.push(redirectTo);
          return;
        }
      }
      
      // Step 3: Create minimal profile
      setStep(2);
      setProgress(60);
      
      const setupResponse = await fetch('/api/community/setup/minimal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({}),
      });
      
      setStep(3);
      setProgress(80);
      
      const setupData = await setupResponse.json();
      
      if (!setupData.success) {
        throw new Error(setupData.message || 'Failed to create profile');
      }
      
      // Step 4: Success, redirect
      setStep(4);
      setProgress(100);
      
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to setup community profile');
      setLoading(false);
    }
  };

  const handleManualSetup = () => {
    router.push('/community/setup');
  };

  const handleSignIn = () => {
    router.push('/api/auth/signin?callbackUrl=/community/quick-setup');
  };

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ 
          p: { xs: 3, sm: 4 }, 
          borderRadius: 3, 
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 4px 20px rgba(0,0,0,0.3)' 
            : '0 4px 20px rgba(0,0,0,0.1)',
        }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 3 
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
              mr: 2,
            }}>
              <RocketLaunch sx={{ fontSize: 32, color: '#4285f4' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Quick Community Setup
              </Typography>
              <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Get started with the community in just a few seconds
              </Typography>
            </Box>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                bgcolor: darkMode ? '#3c1e1e' : '#fdecea',
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          
          {/* Progress Section */}
          {loading && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 1 
              }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Setting up...
                </Typography>
                <Typography variant="body2" sx={{ color: '#4285f4', fontWeight: 500 }}>
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  mb: 2, 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4285f4',
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {steps[step]}
              </Typography>
            </Box>
          )}
          
          {/* Benefits Card */}
          <Card sx={{ 
            mb: 4, 
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: 2,
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <People sx={{ color: '#4285f4' }} />
                Community Benefits
              </Typography>
              <List disablePadding>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ 
                    minWidth: 40,
                    color: '#4285f4',
                  }}>
                    <People />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500 }}>
                        Connect with Business Owners
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Network with entrepreneurs and experts
                      </Typography>
                    }
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ 
                    minWidth: 40,
                    color: '#4285f4',
                  }}>
                    <Forum />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500 }}>
                        Join Discussions
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Share insights and get advice
                      </Typography>
                    }
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ 
                    minWidth: 40,
                    color: '#4285f4',
                  }}>
                    <ThumbUp />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500 }}>
                        Follow & Get Followed
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Build your professional network
                      </Typography>
                    }
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ 
                    minWidth: 40,
                    color: '#4285f4',
                  }}>
                    <Share />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500 }}>
                        Share Your Expertise
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Help others and establish credibility
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          {!loading && !error && (
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={handleQuickSetup}
                startIcon={<CheckCircle />}
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  backgroundColor: '#4285f4',
                  '&:hover': {
                    backgroundColor: '#3367d6',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: darkMode ? '#303134' : '#f1f3f4',
                    color: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                }}
              >
                Quick Setup (Auto-create)
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={handleManualSetup}
                startIcon={<PersonAdd />}
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: '#4285f4',
                    backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                  },
                  '&.Mui-disabled': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                }}
              >
                Custom Setup
              </Button>
              
              <Divider sx={{ 
                my: 1, 
                '&::before, &::after': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                }
              }}>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  or
                </Typography>
              </Divider>
              
              <Button
                variant="text"
                onClick={handleSignIn}
                disabled={loading}
                sx={{
                  color: '#4285f4',
                  '&:hover': {
                    backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                  },
                }}
              >
                Sign in with different account
              </Button>
            </Stack>
          )}
          
          {/* Loading State */}
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <CircularProgress size={24} sx={{ mr: 2, color: '#4285f4' }} />
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Setting up your profile...
              </Typography>
            </Box>
          )}
          
          {/* Back Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
              disabled={loading}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                },
              }}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}