// app/(pages)/community/setup/page.tsx - SIMPLIFIED
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
} from '@mui/material';
import {
  AccountCircle,
  Email,
  ArrowBack,
  Save,
  Refresh,
  PersonAdd,
  CheckCircle,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function CommunitySetupPage() {
  const router = useRouter();
  
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
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error || 'Please sign in to create a community profile'}
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push('/auth/login')} // Your login page
        >
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          {communityProfile ? 'Update Community Profile' : 'Create Your Community Profile'}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Join our community to connect with other business owners
        </Typography>

        {/* User Info Card */}
        <Card sx={{ mb: 4, bgcolor: 'background.default' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
              >
                {userData?.user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6">{userData?.user?.name || 'User'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData?.user?.email || 'No email'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    size="small"
                    label={`User ID: ${userData?.user?._id?.substring(0, 8)}...`}
                    variant="outlined"
                  />
                  {communityProfile && (
                    <Chip
                      size="small"
                      label={`Username: ${communityProfile.username}`}
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Quick Setup Button */}
        {!communityProfile && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleAutoCreate}
              disabled={loading}
              startIcon={<PersonAdd />}
              sx={{ py: 1.5, px: 4 }}
            >
              Quick Setup (Auto-create)
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              We'll create a profile with your email as username
            </Typography>
          </Box>
        )}

        {/* OR Divider */}
        {!communityProfile && (
          <Divider sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary">OR</Typography>
          </Divider>
        )}

        {/* Setup Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
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
                <AccountCircle sx={{ mr: 1, color: 'action.active' }} />
              ),
            }}
            sx={{ mb: 3 }}
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
            sx={{ mb: 3 }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/community')}
              disabled={loading}
            >
              Skip for Now
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchUserData}
                disabled={loading}
              >
                Refresh
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                disabled={loading}
              >
                {communityProfile ? 'Update Profile' : 'Create Profile'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}