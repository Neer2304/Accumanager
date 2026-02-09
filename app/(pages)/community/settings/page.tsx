// app/community/settings/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Card,
  CardContent,
  CardActions,
  Avatar,
  SelectChangeEvent,
  alpha,
  useTheme,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    showOnlineStatus: boolean;
    privateProfile: boolean;
    allowMessages: string; // 'everyone', 'followers', 'none'
  };
}

interface BlockedUser {
  _id: string;
  username: string;
  name: string;
  avatar?: string;
  blockedAt: string;
}

interface SettingsForm {
  emailNotifications: boolean;
  pushNotifications: boolean;
  showOnlineStatus: boolean;
  privateProfile: boolean;
  allowMessages: string;
  bio: string;
  location: string;
  website: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [formData, setFormData] = useState<SettingsForm>({
    emailNotifications: true,
    pushNotifications: true,
    showOnlineStatus: true,
    privateProfile: false,
    allowMessages: 'everyone',
    bio: '',
    location: '',
    website: '',
  });

  // Fetch user profile and settings
  useEffect(() => {
    fetchProfile();
    fetchBlockedUsers();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community/profile', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        setFormData({
          emailNotifications: data.data.preferences?.emailNotifications ?? true,
          pushNotifications: data.data.preferences?.pushNotifications ?? true,
          showOnlineStatus: data.data.preferences?.showOnlineStatus ?? true,
          privateProfile: data.data.preferences?.privateProfile ?? false,
          allowMessages: data.data.preferences?.allowMessages ?? 'everyone',
          bio: data.data.bio || '',
          location: data.data.location || '',
          website: data.data.website || '',
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch('/api/community/settings/blocked-users', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBlockedUsers(data.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch blocked users:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: keyof SettingsForm) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/community/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          preferences: {
            emailNotifications: formData.emailNotifications,
            pushNotifications: formData.pushNotifications,
            showOnlineStatus: formData.showOnlineStatus,
            privateProfile: formData.privateProfile,
            allowMessages: formData.allowMessages,
          },
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Settings saved successfully!');
        if (profile) {
          setProfile({
            ...profile,
            ...data.data,
          });
        }
      } else {
        setError(data.message || 'Failed to save settings');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/community/settings/blocked-users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBlockedUsers(prev => prev.filter(user => user._id !== userId));
          setSuccess('User unblocked successfully');
        }
      }
    } catch (error) {
      console.error('Failed to unblock user:', error);
      setError('Failed to unblock user');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch('/api/community/settings/delete-account', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      setError('Failed to delete account');
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

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff', 
      minHeight: '100vh',
      py: 4,
    }}>
      <Container maxWidth="lg">
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
            Settings
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
            }}>
              <SettingsIcon sx={{ fontSize: 32, color: '#4285f4' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Community Settings
              </Typography>
              <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Manage your community profile and preferences
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Alerts */}
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
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {/* Settings Form */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="h6" gutterBottom sx={{ 
            mb: 3, 
            color: darkMode ? '#e8eaed' : '#202124',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <PersonIcon sx={{ color: '#4285f4' }} />
            Profile Settings
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Profile Info */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Profile Information
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  placeholder="Tell the community about yourself..."
                  InputProps={{
                    sx: { color: darkMode ? '#e8eaed' : '#202124' }
                  }}
                  InputLabelProps={{
                    sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
                  }}
                  sx={{
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
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, USA"
                    InputProps={{
                      sx: { color: darkMode ? '#e8eaed' : '#202124' }
                    }}
                    InputLabelProps={{
                      sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
                    }}
                    sx={{
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
                  <TextField
                    fullWidth
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    InputProps={{
                      sx: { color: darkMode ? '#e8eaed' : '#202124' }
                    }}
                    InputLabelProps={{
                      sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
                    }}
                    sx={{
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
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Notification Settings */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <NotificationsIcon sx={{ color: '#4285f4' }} />
                Notifications
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.emailNotifications}
                      onChange={() => handleSwitchChange('emailNotifications')}
                      sx={{
                        '& .MuiSwitch-track': {
                          backgroundColor: darkMode ? '#5f6368' : '#bdc1c6',
                        },
                      }}
                    />
                  }
                  label="Email notifications"
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.pushNotifications}
                      onChange={() => handleSwitchChange('pushNotifications')}
                      sx={{
                        '& .MuiSwitch-track': {
                          backgroundColor: darkMode ? '#5f6368' : '#bdc1c6',
                        },
                      }}
                    />
                  }
                  label="Push notifications"
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                />
              </FormGroup>
            </Box>

            <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Privacy Settings */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <VisibilityIcon sx={{ color: '#4285f4' }} />
                Privacy
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.showOnlineStatus}
                      onChange={() => handleSwitchChange('showOnlineStatus')}
                      sx={{
                        '& .MuiSwitch-track': {
                          backgroundColor: darkMode ? '#5f6368' : '#bdc1c6',
                        },
                      }}
                    />
                  }
                  label="Show online status"
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.privateProfile}
                      onChange={() => handleSwitchChange('privateProfile')}
                      sx={{
                        '& .MuiSwitch-track': {
                          backgroundColor: darkMode ? '#5f6368' : '#bdc1c6',
                        },
                      }}
                    />
                  }
                  label="Private profile (followers only)"
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                />
              </FormGroup>
              
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Who can message you
                </InputLabel>
                <Select
                  name="allowMessages"
                  value={formData.allowMessages}
                  onChange={handleSelectChange}
                  label="Who can message you"
                  sx={{
                    color: darkMode ? '#e8eaed' : '#202124',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4285f4',
                    },
                  }}
                >
                  <MenuItem value="everyone">Everyone</MenuItem>
                  <MenuItem value="followers">Followers only</MenuItem>
                  <MenuItem value="none">No one</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : <SaveIcon />}
                disabled={saving}
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
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Blocked Users */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="h6" gutterBottom sx={{ 
            mb: 3, 
            color: darkMode ? '#e8eaed' : '#202124',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <BlockIcon sx={{ color: '#4285f4' }} />
            Blocked Users
          </Typography>
          
          {blockedUsers.length === 0 ? (
            <Alert 
              severity="info"
              sx={{ 
                borderRadius: 2,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
              }}
            >
              You haven't blocked any users.
            </Alert>
          ) : (
            <Stack spacing={2}>
              {blockedUsers.map((user) => (
                <Card key={user._id} sx={{ 
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: 2,
                }}>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={user.avatar}
                        sx={{ 
                          width: 40, 
                          height: 40,
                          bgcolor: darkMode ? '#5f6368' : '#4285f4',
                        }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          @{user.username}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Blocked on {new Date(user.blockedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => handleUnblockUser(user._id)}
                        sx={{
                          color: '#4285f4',
                          '&:hover': {
                            backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                          },
                        }}
                      >
                        Unblock
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Paper>

        {/* Account Actions */}
        <Paper sx={{ 
          p: 3, 
          borderRadius: 2,
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="h6" gutterBottom sx={{ 
            mb: 3, 
            color: darkMode ? '#e8eaed' : '#202124',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <SecurityIcon sx={{ color: '#4285f4' }} />
            Account Actions
          </Typography>
          
          <Stack spacing={2}>
            <Card sx={{ 
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: 2,
            }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Logout
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph>
                  Sign out from all devices
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    color: '#4285f4',
                    '&:hover': {
                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    },
                  }}
                >
                  Logout
                </Button>
              </CardActions>
            </Card>

            <Card sx={{ 
              bgcolor: darkMode ? '#3c1e1e' : '#fdecea',
              border: `1px solid ${darkMode ? '#5d3737' : '#f5c6cb'}`,
              borderRadius: 2,
            }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: '#ea4335' }}>
                  Delete Account
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#e57373' : '#721c24' }} paragraph>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteAccount}
                  sx={{
                    color: '#ea4335',
                    borderColor: '#ea4335',
                    '&:hover': {
                      backgroundColor: alpha('#ea4335', darkMode ? 0.1 : 0.05),
                      borderColor: '#ea4335',
                    },
                  }}
                  variant="outlined"
                >
                  Delete Account
                </Button>
              </CardActions>
            </Card>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}