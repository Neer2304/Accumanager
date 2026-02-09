// app/(pages)/community/setup/page.tsx - UPDATED WITH GOOGLE DESIGN
"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Stack,
  Card,
  CardContent,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccountCircle,
  Email,
  ArrowBack,
  Save,
  Refresh,
  PersonAdd,
  CheckCircle,
  Home as HomeIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  AutoFixHigh as AutoFixHighIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import { CheckCircleIcon } from 'lucide-react';

export default function CommunitySetupPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [communityProfile, setCommunityProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  });

  // Check authentication and fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data from YOUR API
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/community/me', {
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success && data.isAuthenticated) {
        setIsAuthenticated(true);
        setUserData(data.data);
        
        if (data.data.communityProfile) {
          setCommunityProfile(data.data.communityProfile);
          setFormData({
            username: data.data.communityProfile.username || '',
            bio: data.data.communityProfile.bio || '',
          });
        } else {
          // Set default username from email
          const defaultUsername = data.data.user?.username || 
                                 data.data.user?.email?.split('@')[0] || 
                                 'user';
          setFormData({
            username: defaultUsername,
            bio: `Hello! I'm ${data.data.user?.name || 'a new member'}`,
          });
        }
      } else {
        setIsAuthenticated(false);
        setError(data.message || 'Please sign in to continue');
      }
    } catch (err: any) {
      console.error('Failed to fetch user data:', err);
      setIsAuthenticated(false);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/community/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Community profile created successfully!');
        setCommunityProfile(data.data);
        
        // Redirect to community page after 2 seconds
        setTimeout(() => {
          router.push('/community');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  // Quick auto-create profile
  const handleAutoCreate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/community/setup/auto-create', {
        method: 'POST',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Profile created automatically! Redirecting...');
        setTimeout(() => {
          router.push('/community');
        }, 1000);
      } else {
        setError(data.message || 'Failed to auto-create profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CircularProgress sx={{ color: '#4285f4' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff', 
        minHeight: '100vh',
        py: 4,
      }}>
        <Container maxWidth="md">
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
            }}
            action={
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push('/auth/login')}
                sx={{
                  color: '#4285f4',
                  borderColor: '#4285f4',
                  '&:hover': {
                    backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    borderColor: '#4285f4',
                  },
                }}
              >
                Sign In
              </Button>
            }
          >
            {error || 'Please sign in to create a community profile'}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff', 
      minHeight: '100vh',
      py: 4,
    }}>
      <Container maxWidth="md">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink
            component={Link}
            href="/dashboard"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': { color: darkMode ? '#8ab4f8' : '#4285f4' },
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
            Dashboard
          </MuiLink>
          <MuiLink
            component={Link}
            href="/community"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': { color: darkMode ? '#8ab4f8' : '#4285f4' },
            }}
          >
            Community
          </MuiLink>
          <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Setup Profile
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ 
            mb: 3,
            color: '#4285f4',
            '&:hover': {
              backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
            },
          }}
        >
          Back
        </Button>

        <Paper sx={{ 
          p: 4, 
          borderRadius: 2,
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight={700} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {communityProfile ? 'Update Community Profile' : 'Create Your Community Profile'}
            </Typography>
            
            <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 4 }}>
              Join our community to connect with other business owners
            </Typography>
          </Box>

          {/* User Info Card */}
          <Card sx={{ 
            mb: 4, 
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: '#4285f4',
                      fontSize: 32,
                      border: `3px solid ${darkMode ? '#202124' : '#ffffff'}`,
                    }}
                  >
                    {userData?.user?.name?.charAt(0) || 'U'}
                  </Avatar>
                  {communityProfile && (
                    <CheckCircleIcon 
                      // sx={{ 
                      //   position: 'absolute',
                      //   bottom: 0,
                      //   right: 0,
                      //   color: '#4285f4',
                      //   bgcolor: darkMode ? '#202124' : '#ffffff',
                      //   borderRadius: '50%',
                      //   fontSize: 20,
                      // }} 
                    />
                  )}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {userData?.user?.name || 'User'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {userData?.user?.email || 'No email'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label={`User ID: ${userData?.user?._id?.substring(0, 8)}...`}
                      variant="outlined"
                      sx={{
                        bgcolor: darkMode ? '#303134' : '#f1f3f4',
                        color: darkMode ? '#e8eaed' : '#202124',
                        borderColor: darkMode ? '#5f6368' : '#dadce0',
                      }}
                    />
                    {communityProfile && (
                      <Chip
                        size="small"
                        label={`Username: ${communityProfile.username}`}
                        sx={{
                          bgcolor: '#34a853',
                          color: 'white',
                          fontWeight: 500,
                        }}
                        icon={<CheckCircleIcon />}
                      />
                    )}
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Error/Success Messages */}
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
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                bgcolor: darkMode ? '#1c351e' : '#e8f5e9',
              }}
            >
              {success}
            </Alert>
          )}

          {/* Quick Setup Button */}
          {!communityProfile && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Tooltip title="We'll create a profile with your email as username">
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAutoCreate}
                  disabled={loading}
                  startIcon={<AutoFixHighIcon />}
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    backgroundColor: '#fbbc04',
                    color: '#202124',
                    '&:hover': {
                      backgroundColor: '#f57c00',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: darkMode ? '#303134' : '#f1f3f4',
                      color: darkMode ? '#5f6368' : '#bdc1c6',
                    },
                  }}
                >
                  Quick Setup (Auto-create)
                </Button>
              </Tooltip>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 1 }}>
                We'll create a profile with your email as username
              </Typography>
            </Box>
          )}

          {/* OR Divider */}
          {!communityProfile && (
            <Divider sx={{ 
              my: 4, 
              '&::before, &::after': {
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              },
            }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', px: 2 }}>
                OR
              </Typography>
            </Divider>
          )}

          {/* Setup Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom sx={{ 
              mt: 3, 
              color: darkMode ? '#e8eaed' : '#202124',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <DescriptionIcon sx={{ color: '#4285f4' }} />
              Customize Your Profile
            </Typography>

            {/* Username */}
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              helperText="Choose a unique username (3-20 characters)"
              InputProps={{
                startAdornment: (
                  <AccountCircle sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                ),
                sx: { color: darkMode ? '#e8eaed' : '#202124' }
              }}
              InputLabelProps={{
                sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4285f4',
                  },
                },
              }}
            />

            {/* Bio */}
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              multiline
              rows={3}
              helperText="Tell the community about yourself"
              InputProps={{
                sx: { color: darkMode ? '#e8eaed' : '#202124' }
              }}
              InputLabelProps={{
                sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4285f4',
                  },
                },
              }}
            />

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'space-between', 
              mt: 4,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/community')}
                disabled={loading}
                sx={{
                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: '#4285f4',
                    backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                  },
                }}
              >
                Skip for Now
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Tooltip title="Refresh user data">
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchUserData}
                    disabled={loading}
                    sx={{
                      borderColor: darkMode ? '#5f6368' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: '#4285f4',
                        backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                      },
                    }}
                  >
                    Refresh
                  </Button>
                </Tooltip>
                
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : <Save />}
                  disabled={loading}
                  sx={{
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
                  {communityProfile ? 'Update Profile' : 'Create Profile'}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Additional Info */}
          <Box sx={{ 
            mt: 6, 
            p: 3, 
            borderRadius: 2,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Why create a community profile?
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon  />
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Connect with other business owners
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon  />
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Share experiences and get advice
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon/>
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Build your professional network
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon  />
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Participate in community discussions
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}