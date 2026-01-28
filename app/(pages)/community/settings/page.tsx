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
  Grid,
  Avatar,
  IconButton,
  Chip,
  SelectChangeEvent,
  alpha,
  useTheme,
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
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          ⚙️ Settings
        </Typography>
        <Typography color="text.secondary" paragraph>
          Manage your community profile and preferences
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Settings Form */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Profile Settings
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Profile Info */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, USA"
                />
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Notification Settings */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Notifications
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.emailNotifications}
                    onChange={() => handleSwitchChange('emailNotifications')}
                  />
                }
                label="Email notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.pushNotifications}
                    onChange={() => handleSwitchChange('pushNotifications')}
                  />
                }
                label="Push notifications"
              />
            </FormGroup>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Privacy Settings */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              <VisibilityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Privacy
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showOnlineStatus}
                    onChange={() => handleSwitchChange('showOnlineStatus')}
                  />
                }
                label="Show online status"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.privateProfile}
                    onChange={() => handleSwitchChange('privateProfile')}
                  />
                }
                label="Private profile (followers only)"
              />
            </FormGroup>
            
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Who can message you</InputLabel>
              <Select
                name="allowMessages"
                value={formData.allowMessages}
                onChange={handleSelectChange}
                label="Who can message you"
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
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Blocked Users */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          <BlockIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Blocked Users
        </Typography>
        
        {blockedUsers.length === 0 ? (
          <Alert severity="info">
            You haven't blocked any users.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {blockedUsers.map((user) => (
              <Card key={user._id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.avatar}>
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{user.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Blocked on {new Date(user.blockedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      onClick={() => handleUnblockUser(user._id)}
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
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Account Actions
        </Typography>
        
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Logout
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Sign out from all devices
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardActions>
          </Card>

          <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="error">
                Delete Account
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Permanently delete your account and all associated data. This action cannot be undone.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleDeleteAccount}
                color="error"
                variant="outlined"
              >
                Delete Account
              </Button>
            </CardActions>
          </Card>
        </Stack>
      </Paper>
    </Container>
  );
}