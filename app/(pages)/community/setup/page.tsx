// app/community/setup/page.tsx - REDESIGNED VERSION
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
  InputAdornment,
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
  People as PeopleIcon,
  Forum as ForumIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';

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

export default function CommunitySetupPage() {
  const router = useRouter();
  const c = useColors();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [communityProfile, setCommunityProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/community/me', { credentials: 'include' });
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Community profile created successfully!');
        setCommunityProfile(data.data);
        setTimeout(() => router.push('/community'), 2000);
      } else {
        setError(data.message || 'Failed to create profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

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
        setTimeout(() => router.push('/community'), 1000);
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
      <Box sx={{ bgcolor: c.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: c.blue }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ bgcolor: c.bg, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="md">
          <Alert 
            severity="warning" 
            sx={{ borderRadius: "12px" }}
            action={
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push('/auth/login')}
                sx={{ color: c.blue, borderColor: c.blue }}
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
              <ArrowBack sx={{ fontSize: 19 }} />
            </IconButton>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: c.ink }}>
              Setup Profile
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {/* Welcome Header */}
        <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 3, mb: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ 
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 64, height: 64, borderRadius: "50%", bgcolor: alpha(c.blue, 0.1), mb: 2
            }}>
              <PeopleIcon sx={{ fontSize: 32, color: c.blue }} />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: c.ink, mb: 1 }}>
              {communityProfile ? 'Update Your Profile' : 'Join the Community'}
            </Typography>
            <Typography sx={{ color: c.inkSub, fontSize: "0.85rem" }}>
              {communityProfile 
                ? 'Update your community profile information'
                : 'Create your profile to connect with other members'}
            </Typography>
          </Box>
        </Paper>

        {/* User Info Card */}
        <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Avatar src={userData?.user?.avatar} sx={{ width: 64, height: 64, bgcolor: c.blue }}>
              {userData?.user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink }}>
                {userData?.user?.name || 'User'}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted }}>
                {userData?.user?.email || 'No email'}
              </Typography>
              {communityProfile && (
                <Chip 
                  label={`@${communityProfile.username}`} 
                  size="small" 
                  sx={{ mt: 0.5, bgcolor: c.green, color: "#fff" }} 
                />
              )}
            </Box>
          </Box>
        </Paper>

        {/* Error/Success Messages */}
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

        {/* Quick Setup Button */}
        {!communityProfile && (
          <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 3, mb: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAutoCreate}
                disabled={loading}
                startIcon={<AutoFixHighIcon />}
                sx={{ 
                  borderRadius: "40px", textTransform: "none", px: 4, py: 1.5,
                  bgcolor: "#fbbc04", color: "#202124",
                  "&:hover": { bgcolor: "#f57c00" }
                }}
              >
                Quick Setup (Auto-create)
              </Button>
              <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted, mt: 1 }}>
                We'll create a profile with your email as username
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Setup Form */}
        <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 3 }}>
          <Typography sx={{ fontWeight: 600, color: c.ink, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <DescriptionIcon sx={{ fontSize: 20, color: c.blue }} /> Customize Your Profile
          </Typography>

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
              required
              helperText="Choose a unique username (3-20 characters)"
              InputProps={{
                startAdornment: <InputAdornment position="start"><AccountCircle sx={{ color: c.inkMuted }} /></InputAdornment>,
              }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: c.surface2, "& fieldset": { borderColor: "transparent" }, "&:hover fieldset": { borderColor: c.border } }
              }}
            />

            <TextField
              fullWidth
              label="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              multiline
              rows={3}
              helperText="Tell the community about yourself"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: c.surface2, "& fieldset": { borderColor: "transparent" }, "&:hover fieldset": { borderColor: c.border } }
              }}
            />
          </Stack>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, flexWrap: "wrap", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/community')}
              disabled={loading}
              sx={{ borderRadius: "40px", textTransform: "none", borderColor: c.border, color: c.ink }}
            >
              Skip for Now
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchUserData}
                disabled={loading}
                sx={{ borderRadius: "40px", textTransform: "none", borderColor: c.border, color: c.ink }}
              >
                Refresh
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: "40px", textTransform: "none", px: 3, bgcolor: c.blue, "&:hover": { bgcolor: "#166fe5" } }}
              >
                {communityProfile ? 'Update Profile' : 'Create Profile'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Benefits Card */}
        <Paper sx={{ borderRadius: "16px", bgcolor: alpha(c.blue, 0.05), border: `1px solid ${alpha(c.blue, 0.15)}`, p: 3, mt: 3 }}>
          <Typography sx={{ fontWeight: 600, color: c.blue, mb: 2, fontSize: "0.9rem" }}>
            ✨ Why create a community profile?
          </Typography>
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: alpha(c.green, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PeopleIcon sx={{ fontSize: 14, color: c.green }} />
              </Box>
              <Typography sx={{ fontSize: "0.8rem", color: c.inkSub }}>Connect with other business owners</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: alpha(c.blue, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ForumIcon sx={{ fontSize: 14, color: c.blue }} />
              </Box>
              <Typography sx={{ fontSize: "0.8rem", color: c.inkSub }}>Share experiences and get advice</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: alpha(c.purple, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BusinessIcon sx={{ fontSize: 14, color: c.purple }} />
              </Box>
              <Typography sx={{ fontSize: "0.8rem", color: c.inkSub }}>Build your professional network</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: alpha(c.red, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ThumbUpIcon sx={{ fontSize: 14, color: c.red }} />
              </Box>
              <Typography sx={{ fontSize: "0.8rem", color: c.inkSub }}>Participate in community discussions</Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}