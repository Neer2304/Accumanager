"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  IconButton,
  Avatar,
  Typography,
  Stack,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

// Types
export interface CommunityProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
    shopName?: string;
    subscription?: {
      plan: string;
      status: string;
    };
  };
  username: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    instagram: string;
    facebook: string;
  };
  isVerified: boolean;
  verificationBadge: boolean;
  expertInCategories: string[];
  followers: string[];
  following: string[];
  followerCount: number;
  followingCount: number;
  communityStats: {
    totalPosts: number;
    totalComments: number;
    totalLikesReceived: number;
    totalLikesGiven: number;
    totalBookmarks: number;
    engagementScore: number;
    lastActive: Date;
    joinDate: Date;
  };
  badges: string[];
  preferences: {
    privateProfile: boolean;
    allowMessages: 'everyone' | 'followers' | 'none';
  };
}

interface CommunityProfileDialogProps {
  open: boolean;
  onClose: () => void;
  profile: CommunityProfile | null;
  onUpdate: (updatedProfile: CommunityProfile) => void;
}

// Google Colors
const GoogleColors = {
  blue: '#4285f4',
  blueHover: '#3367d6',
  red: '#ea4335',
  yellow: '#fbbc04',
  green: '#34a853',
  grayText: '#5f6368',
  grayBorder: '#dadce0',
  darkBg: '#202124',
  darkSurface: '#303134',
  darkBorder: '#3c4043',
  darkText: '#e8eaed',
  darkTextSecondary: '#9aa0a6',
};

export default function CommunityProfileDialog({
  open,
  onClose,
  profile,
  onUpdate,
}: CommunityProfileDialogProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    website: '',
    avatar: '',
    coverImage: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      instagram: '',
      facebook: '',
    },
    preferences: {
      privateProfile: false,
      allowMessages: 'everyone' as 'everyone' | 'followers' | 'none',
    },
    expertInCategories: [] as string[],
  });
  const [newCategory, setNewCategory] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        avatar: profile.avatar || '',
        coverImage: profile.coverImage || '',
        socialLinks: {
          twitter: profile.socialLinks?.twitter || '',
          linkedin: profile.socialLinks?.linkedin || '',
          instagram: profile.socialLinks?.instagram || '',
          facebook: profile.socialLinks?.facebook || '',
        },
        preferences: {
          privateProfile: profile.preferences?.privateProfile || false,
          allowMessages: (profile.preferences?.allowMessages as 'everyone' | 'followers' | 'none') || 'everyone',
        },
        expertInCategories: profile.expertInCategories || [],
      });
      setAvatarPreview(profile.avatar || '');
      setCoverPreview(profile.coverImage || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        const updatedProfile = {
          ...data.data,
          followers: profile?.followers || [],
          following: profile?.following || [],
        };
        onUpdate(updatedProfile);
        setTimeout(() => onClose(), 1000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !formData.expertInCategories.includes(newCategory.trim())) {
      setFormData({
        ...formData,
        expertInCategories: [...formData.expertInCategories, newCategory.trim()],
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData({
      ...formData,
      expertInCategories: formData.expertInCategories.filter(c => c !== category),
    });
  };

  const handleImageUpload = (file: File, type: 'avatar' | 'cover') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setAvatarPreview(reader.result as string);
        setFormData({ ...formData, avatar: reader.result as string });
      } else {
        setCoverPreview(reader.result as string);
        setFormData({ ...formData, coverImage: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const socialLinks = [
    { key: 'twitter', label: 'Twitter', icon: <TwitterIcon sx={{ color: '#1DA1F2' }} />, placeholder: 'https://twitter.com/username' },
    { key: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon sx={{ color: '#0077B5' }} />, placeholder: 'https://linkedin.com/in/username' },
    { key: 'instagram', label: 'Instagram', icon: <InstagramIcon sx={{ color: '#E4405F' }} />, placeholder: 'https://instagram.com/username' },
    { key: 'facebook', label: 'Facebook', icon: <FacebookIcon sx={{ color: '#1877F2' }} />, placeholder: 'https://facebook.com/username' },
  ];

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '& fieldset': { borderColor: darkMode ? GoogleColors.darkBorder : GoogleColors.grayBorder },
      '&:hover fieldset': { borderColor: GoogleColors.blue },
      '&.Mui-focused fieldset': { borderColor: GoogleColors.blue, borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { color: darkMode ? GoogleColors.darkTextSecondary : GoogleColors.grayText },
    '& .MuiInputLabel-root.Mui-focused': { color: GoogleColors.blue },
    '& .MuiInputBase-input': { color: darkMode ? GoogleColors.darkText : '#202124' },
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: darkMode ? GoogleColors.darkBg : '#ffffff',
            border: `1px solid ${darkMode ? GoogleColors.darkBorder : GoogleColors.grayBorder}`,
            overflow: 'hidden',
          },
        }}
      >
        {/* Header with Cover Image */}
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          {/* Cover Image */}
          <Box
            sx={{
              height: { xs: 120, sm: 160 },
              bgcolor: darkMode ? GoogleColors.darkSurface : '#f1f3f4',
              backgroundImage: coverPreview ? `url(${coverPreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            <Tooltip title="Change Cover">
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  bgcolor: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
                  '&:hover': { bgcolor: darkMode ? 'rgba(0,0,0,0.8)' : '#ffffff' },
                }}
              >
                <UploadIcon sx={{ fontSize: 18 }} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'cover');
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Avatar */}
          <Box sx={{ position: 'absolute', bottom: -40, left: { xs: 16, sm: 24 } }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={avatarPreview}
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  border: `4px solid ${darkMode ? GoogleColors.darkBg : '#ffffff'}`,
                  bgcolor: GoogleColors.blue,
                  fontSize: { xs: 32, sm: 40 },
                }}
              >
                {formData.username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Tooltip title="Change Avatar">
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: darkMode ? GoogleColors.darkSurface : '#ffffff',
                    border: `1px solid ${darkMode ? GoogleColors.darkBorder : GoogleColors.grayBorder}`,
                    '&:hover': { bgcolor: darkMode ? GoogleColors.darkBg : '#f8f9fa' },
                  }}
                  size="small"
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'avatar');
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: darkMode ? 'rgba(0,0,0,0.8)' : '#ffffff' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Title */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 6, sm: 7 }, pb: 1, flexShrink: 0 }}>
          <Typography variant="h5" component="div" fontWeight={600} sx={{ color: darkMode ? GoogleColors.darkText : '#202124' }}>
            Edit Profile
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? GoogleColors.darkTextSecondary : GoogleColors.grayText, mt: 0.5 }}>
            Manage your profile information and privacy settings
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <DialogContent sx={{ 
            overflowY: 'auto', 
            px: { xs: 2, sm: 3 }, 
            py: 2,
            flex: 1,
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: darkMode ? GoogleColors.darkSurface : '#f1f3f4', borderRadius: '4px' },
            '&::-webkit-scrollbar-thumb': { background: darkMode ? GoogleColors.darkBorder : GoogleColors.grayBorder, borderRadius: '4px' },
          }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Basic Info Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? GoogleColors.darkText : '#202124', mb: 2 }}>
                Basic Information
              </Typography>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                  required
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ color: darkMode ? GoogleColors.darkTextSecondary : GoogleColors.grayText }}>@</Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth
                  label="Bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  multiline
                  rows={3}
                  placeholder="Tell the community about yourself..."
                  size="small"
                  inputProps={{ maxLength: 500 }}
                  helperText={`${formData.bio.length}/500 characters`}
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon sx={{ fontSize: 18, color: darkMode ? GoogleColors.darkTextSecondary : GoogleColors.grayText }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth
                  label="Website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon sx={{ fontSize: 18, color: darkMode ? GoogleColors.darkTextSecondary : GoogleColors.grayText }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />
              </Stack>
            </Box>

            <Divider sx={{ my: 3, borderColor: darkMode ? GoogleColors.darkBorder : GoogleColors.grayBorder }} />

            {/* Social Links Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? GoogleColors.darkText : '#202124', mb: 2 }}>
                Social Links
              </Typography>
              <Stack spacing={2}>
                {socialLinks.map((social) => (
                  <TextField
                    key={social.key}
                    fullWidth
                    label={social.label}
                    value={formData.socialLinks[social.key as keyof typeof formData.socialLinks]}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, [social.key]: e.target.value }
                    })}
                    placeholder={social.placeholder}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {social.icon}
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldSx}
                  />
                ))}
              </Stack>
            </Box>

            <Divider sx={{ my: 3, borderColor: darkMode ? GoogleColors.darkBorder : GoogleColors.grayBorder }} />

            {/* Expertise Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? GoogleColors.darkText : '#202124', mb: 2 }}>
                Areas of Expertise
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {formData.expertInCategories.length === 0 ? (
                    <Typography variant="body2" sx={{ color: darkMode ? GoogleColors.darkTextSecondary : GoogleColors.grayText, py: 1 }}>
                      No expertise areas added yet
                    </Typography>
                  ) : (
                    formData.expertInCategories.map((category, index) => (
                      <Chip
                        key={index}
                        label={category}
                        onDelete={() => handleRemoveCategory(category)}
                        deleteIcon={<DeleteIcon />}
                        sx={{
                          bgcolor: darkMode ? alpha(GoogleColors.blue, 0.1) : alpha(GoogleColors.blue, 0.08),
                          color: GoogleColors.blue,
                          borderRadius: 2,
                        }}
                      />
                    ))
                  )}
                </Stack>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add expertise area (e.g., Technology, Design)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  sx={textFieldSx}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: GoogleColors.blue,
                    color: GoogleColors.blue,
                    whiteSpace: 'nowrap',
                    minWidth: { xs: '100%', sm: 80 },
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 3, borderColor: darkMode ? GoogleColors.darkBorder : GoogleColors.grayBorder }} />

            {/* Privacy Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? GoogleColors.darkText : '#202124', mb: 2 }}>
                Privacy & Security
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: darkMode ? GoogleColors.darkBorder : GoogleColors.grayBorder }}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.preferences.privateProfile}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, privateProfile: e.target.checked }
                        })}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={500}>Private Profile</Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? GoogleColors.darkTextSecondary : GoogleColors.grayText }}>
                          Only approved followers can see your posts and stories
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', m: 0 }}
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel>Message Permissions</InputLabel>
                    <Select
                      value={formData.preferences.allowMessages}
                      label="Message Permissions"
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, allowMessages: e.target.value as any }
                      })}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="everyone">Everyone</MenuItem>
                      <MenuItem value="followers">Followers Only</MenuItem>
                      <MenuItem value="none">No One</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Paper>
            </Box>
          </DialogContent>

          <DialogActions sx={{ 
            px: { xs: 2, sm: 3 }, 
            py: 2.5,
            borderTop: `1px solid ${darkMode ? GoogleColors.darkBorder : GoogleColors.grayBorder}`,
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            flexShrink: 0,
          }}>
            <Button onClick={onClose} disabled={loading} fullWidth sx={{ order: { xs: 2, sm: 1 } }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              startIcon={loading ? <CircularProgress size={18} /> : <CheckCircleIcon />}
              sx={{ order: { xs: 1, sm: 2 }, bgcolor: GoogleColors.blue, '&:hover': { bgcolor: GoogleColors.blueHover } }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}