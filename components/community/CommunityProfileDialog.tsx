// components/community/CommunityProfileDialog.tsx
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
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

// Define the CommunityProfile interface here since it's not exported from CommunityProfilePage
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
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
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
    allowMessages: string;
  };
}

interface CommunityProfileDialogProps {
  open: boolean;
  onClose: () => void;
  profile: CommunityProfile | null;
  onUpdate: (updatedProfile: CommunityProfile) => void;
}

export default function CommunityProfileDialog({
  open,
  onClose,
  profile,
  onUpdate,
}: CommunityProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        avatar: profile.avatar || '',
        coverImage: profile.coverImage || '',
        socialLinks: profile.socialLinks || {
          twitter: '',
          linkedin: '',
          instagram: '',
          facebook: '',
        },
        preferences: profile.preferences || {
          privateProfile: false,
          allowMessages: 'everyone',
        },
        expertInCategories: profile.expertInCategories || [],
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        onUpdate(data.data);
        onClose();
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

  const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
    // Implement image upload logic here
    // This would typically upload to Cloudinary, AWS S3, or similar
    console.log('Uploading image:', file, type);
    // For demo, just use a placeholder
    if (type === 'avatar') {
      setFormData({ ...formData, avatar: URL.createObjectURL(file) });
    } else {
      setFormData({ ...formData, coverImage: URL.createObjectURL(file) });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit Profile</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ overflowY: 'auto' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Avatar & Cover Image */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Profile Images
            </Typography>
            <Stack direction="row" spacing={3} alignItems="flex-start">
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={formData.avatar}
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 40,
                    mb: 1,
                  }}
                />
                <Button
                  size="small"
                  startIcon={<UploadIcon />}
                  component="label"
                >
                  Upload Avatar
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'avatar');
                    }}
                  />
                </Button>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Avatar URL"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Enter image URL or upload"
                />
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Basic Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Basic Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                required
                helperText="This will be your unique identifier in the community"
              />
              <TextField
                fullWidth
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                multiline
                rows={3}
                helperText="Tell the community about yourself (max 500 characters)"
                inputProps={{ maxLength: 500 }}
              />
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Social Links */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Social Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Twitter"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                    })}
                    placeholder="https://twitter.com/username"
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="LinkedIn"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                    })}
                    placeholder="https://instagram.com/username"
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                    })}
                    placeholder="https://facebook.com/username"
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Expert Categories */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Areas of Expertise
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {formData.expertInCategories.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    onDelete={() => handleRemoveCategory(category)}
                    deleteIcon={<DeleteIcon />}
                  />
                ))}
              </Stack>
            </Box>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Add expertise area"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddCategory}
              >
                Add
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Privacy Settings */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Privacy Settings
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.preferences.privateProfile}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        privateProfile: e.target.checked
                      }
                    })}
                  />
                }
                label="Private Profile"
              />
              
              <FormControl fullWidth size="small">
                <InputLabel>Who can message you</InputLabel>
                <Select
                  value={formData.preferences.allowMessages}
                  label="Who can message you"
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      allowMessages: e.target.value as 'everyone' | 'followers' | 'none'
                    }
                  })}
                >
                  <MenuItem value="everyone">Everyone</MenuItem>
                  <MenuItem value="followers">Followers Only</MenuItem>
                  <MenuItem value="none">No One</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}