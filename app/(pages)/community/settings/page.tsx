// app/community/settings/page.tsx - REDESIGNED VERSION
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
  InputAdornment,
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
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Theme colors (matching Facebook-style)
const useColors = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  return {
    dark,
    bg: dark ? "#18191a" : "#f0f2f5",
    surface: dark ? "#242526" : "#ffffff",
    surface2: dark ? "#3a3b3c" : "#f0f2f5",
    border: dark ? "#3e4042" : "#e4e6ea",
    ink: dark ? "#e4e6eb" : "#050505",
    inkSub: dark ? "#b0b3b8" : "#65676b",
    inkMuted: dark ? "#6a6d73" : "#8a8d91",
    blue: "#1877f2",
    blueSoft: dark ? "rgba(24,119,242,0.15)" : "rgba(24,119,242,0.08)",
    green: dark ? "#45bd62" : "#31a24c",
    red: dark ? "#f28b82" : "#e41e3f",
    purple: dark ? "#b39ddb" : "#7b1fa2",
  };
};

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
    allowMessages: string;
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
  const c = useColors();
  
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

  useEffect(() => {
    fetchProfile();
    fetchBlockedUsers();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community/profile', { credentials: 'include' });
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
      const response = await fetch('/api/community/settings/blocked-users', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (data.success) setBlockedUsers(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch blocked users:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof SettingsForm) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/community/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
        if (profile) setProfile({ ...profile, ...data.data });
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
      const response = await fetch(`/api/community/settings/blocked-users/${userId}`, { method: 'DELETE', credentials: 'include' });
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
    const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    if (response.ok) router.push('/login');
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    const response = await fetch('/api/community/settings/delete-account', { method: 'DELETE', credentials: 'include' });
    if (response.ok) router.push('/login');
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: c.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: c.blue }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: c.bg, minHeight: "100vh" }}>
      {/* Sticky Header */}
      <Box sx={{ 
        position: "sticky", top: 0, zIndex: 100,
        bgcolor: alpha(c.surface, 0.95), borderBottom: `1px solid ${c.border}`,
        backdropFilter: "blur(10px)"
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.25 }}>
            <IconButton size="small" onClick={() => router.back()}
              sx={{ bgcolor: c.surface2, color: c.ink, "&:hover": { bgcolor: c.border } }}>
              <ArrowBackIcon sx={{ fontSize: 19 }} />
            </IconButton>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: c.ink }}>
              Settings
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ 
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 56, height: 56, borderRadius: "50%", bgcolor: alpha(c.blue, 0.1)
            }}>
              <SettingsIcon sx={{ fontSize: 28, color: c.blue }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: c.ink }}>
                Community Settings
              </Typography>
              <Typography sx={{ color: c.inkSub, fontSize: "0.85rem" }}>
                Manage your community profile and preferences
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: "12px" }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Profile Settings Card */}
        <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, mb: 3, overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${c.border}` }}>
            <Typography sx={{ fontWeight: 600, color: c.ink, display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon sx={{ fontSize: 20, color: c.blue }} /> Profile Information
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                multiline
                rows={3}
                placeholder="Tell the community about yourself..."
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: c.surface2, "& fieldset": { borderColor: "transparent" }, "&:hover fieldset": { borderColor: c.border } },
                  "& .MuiInputLabel-root": { color: c.inkMuted }
                }}
              />
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon sx={{ fontSize: 18, color: c.inkMuted }} /></InputAdornment> }}
                  sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: c.surface2, "& fieldset": { borderColor: "transparent" } } }}
                />
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  InputProps={{ startAdornment: <InputAdornment position="start"><LanguageIcon sx={{ fontSize: 18, color: c.inkMuted }} /></InputAdornment> }}
                  sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: c.surface2, "& fieldset": { borderColor: "transparent" } } }}
                />
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* Notification Settings Card */}
        <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, mb: 3, overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${c.border}` }}>
            <Typography sx={{ fontWeight: 600, color: c.ink, display: "flex", alignItems: "center", gap: 1 }}>
              <NotificationsIcon sx={{ fontSize: 20, color: c.blue }} /> Notifications
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <FormControlLabel
                control={<Switch checked={formData.emailNotifications} onChange={() => handleSwitchChange('emailNotifications')} />}
                label="Email notifications"
                sx={{ color: c.ink }}
              />
              <FormControlLabel
                control={<Switch checked={formData.pushNotifications} onChange={() => handleSwitchChange('pushNotifications')} />}
                label="Push notifications"
                sx={{ color: c.ink }}
              />
            </Stack>
          </Box>
        </Paper>

        {/* Privacy Settings Card */}
        <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, mb: 3, overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${c.border}` }}>
            <Typography sx={{ fontWeight: 600, color: c.ink, display: "flex", alignItems: "center", gap: 1 }}>
              <VisibilityIcon sx={{ fontSize: 20, color: c.blue }} /> Privacy
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch checked={formData.showOnlineStatus} onChange={() => handleSwitchChange('showOnlineStatus')} />}
                label="Show online status"
                sx={{ color: c.ink }}
              />
              <FormControlLabel
                control={<Switch checked={formData.privateProfile} onChange={() => handleSwitchChange('privateProfile')} />}
                label="Private profile (followers only)"
                sx={{ color: c.ink }}
              />
              <FormControl fullWidth>
                <InputLabel sx={{ color: c.inkMuted }}>Who can message you</InputLabel>
                <Select
                  name="allowMessages"
                  value={formData.allowMessages}
                  onChange={handleSelectChange}
                  label="Who can message you"
                  sx={{ borderRadius: "12px", bgcolor: c.surface2, color: c.ink }}
                >
                  <MenuItem value="everyone">Everyone</MenuItem>
                  <MenuItem value="followers">Followers only</MenuItem>
                  <MenuItem value="none">No one</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </Paper>

        {/* Blocked Users Card */}
        <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, mb: 3, overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${c.border}` }}>
            <Typography sx={{ fontWeight: 600, color: c.ink, display: "flex", alignItems: "center", gap: 1 }}>
              <BlockIcon sx={{ fontSize: 20, color: c.red }} /> Blocked Users
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            {blockedUsers.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: "12px", bgcolor: c.surface2 }}>You haven't blocked any users.</Alert>
            ) : (
              <Stack spacing={2}>
                {blockedUsers.map((user) => (
                  <Card key={user._id} sx={{ bgcolor: c.surface2, borderRadius: "12px" }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar src={user.avatar} sx={{ width: 40, height: 40, bgcolor: c.blue }}>{user.name.charAt(0)}</Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: c.ink }}>{user.name}</Typography>
                          <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>@{user.username}</Typography>
                        </Box>
                        <Button size="small" onClick={() => handleUnblockUser(user._id)} sx={{ color: c.blue }}>Unblock</Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Paper>

        {/* Account Actions Card */}
        <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, mb: 3, overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${c.border}` }}>
            <Typography sx={{ fontWeight: 600, color: c.ink, display: "flex", alignItems: "center", gap: 1 }}>
              <SecurityIcon sx={{ fontSize: 20, color: c.green }} /> Account Actions
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Card sx={{ bgcolor: c.surface2, borderRadius: "12px" }}>
                <CardContent>
                  <Typography sx={{ fontWeight: 600, color: c.ink }}>Logout</Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted }}>Sign out from all devices</Typography>
                </CardContent>
                <CardActions>
                  <Button startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ color: c.blue }}>Logout</Button>
                </CardActions>
              </Card>
              <Card sx={{ bgcolor: alpha(c.red, 0.1), borderRadius: "12px" }}>
                <CardContent>
                  <Typography sx={{ fontWeight: 600, color: c.red }}>Delete Account</Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted }}>Permanently delete your account and all associated data. This action cannot be undone.</Typography>
                </CardContent>
                <CardActions>
                  <Button startIcon={<DeleteIcon />} onClick={handleDeleteAccount} variant="outlined" sx={{ color: c.red, borderColor: c.red }}>Delete Account</Button>
                </CardActions>
              </Card>
            </Stack>
          </Box>
        </Paper>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <SaveIcon />}
            onClick={handleSubmit}
            disabled={saving}
            sx={{ borderRadius: "40px", textTransform: "none", px: 4, py: 1, bgcolor: c.blue, "&:hover": { bgcolor: "#166fe5" } }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}