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
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
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
    console.log('Uploading image:', file, type);
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
          borderRadius: 2,
          maxHeight: '90vh',
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        },
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        borderBottom: 1,
        borderColor: darkMode ? '#3c4043' : '#dadce0',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Edit Profile
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': {
                backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ 
          overflowY: 'auto',
          bgcolor: darkMode ? '#202124' : '#ffffff',
        }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                bgcolor: darkMode ? '#3c1e1e' : '#fdecea',
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
                    border: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}
                />
                <Button
                  size="small"
                  startIcon={<UploadIcon />}
                  component="label"
                  sx={{
                    color: '#4285f4',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    },
                  }}
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
                        <LinkIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                    sx: { color: darkMode ? '#e8eaed' : '#202124' }
                  }}
                  InputLabelProps={{
                    sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
                  }}
                  helperText="Enter image URL or upload"
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

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Basic Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                required
                InputProps={{
                  sx: { color: darkMode ? '#e8eaed' : '#202124' }
                }}
                InputLabelProps={{
                  sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
                }}
                helperText="This will be your unique identifier in the community"
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
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                multiline
                rows={3}
                InputProps={{
                  sx: { color: darkMode ? '#e8eaed' : '#202124' }
                }}
                InputLabelProps={{
                  sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
                }}
                helperText="Tell the community about yourself (max 500 characters)"
                inputProps={{ maxLength: 500 }}
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
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
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
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
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
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Social Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Twitter"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                  })}
                  placeholder="https://twitter.com/username"
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
                  label="LinkedIn"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/in/username"
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
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Instagram"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/username"
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
                  label="Facebook"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                  })}
                  placeholder="https://facebook.com/username"
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
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
                    sx={{
                      bgcolor: darkMode ? '#303134' : '#f1f3f4',
                      color: darkMode ? '#8ab4f8' : '#4285f4',
                      borderColor: darkMode ? '#5f6368' : '#dadce0',
                      '& .MuiChip-deleteIcon': {
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField
                size="small"
                placeholder="Add expertise area"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                InputProps={{
                  sx: { color: darkMode ? '#e8eaed' : '#202124' }
                }}
                sx={{
                  flex: 1,
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
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddCategory}
                sx={{
                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: '#4285f4',
                    backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                  },
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
                    sx={{
                      '& .MuiSwitch-track': {
                        backgroundColor: darkMode ? '#5f6368' : '#bdc1c6',
                      },
                    }}
                  />
                }
                label="Private Profile"
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              />
              
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Who can message you
                </InputLabel>
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
                  sx={{
                    color: darkMode ? '#e8eaed' : '#202124',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4285f4',
                    },
                    '& .MuiSelect-icon': {
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    },
                  }}
                >
                  <MenuItem value="everyone">Everyone</MenuItem>
                  <MenuItem value="followers">Followers Only</MenuItem>
                  <MenuItem value="none">No One</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          borderTop: 1,
          borderColor: darkMode ? '#3c4043' : '#dadce0',
        }}>
          <Button 
            onClick={onClose}
            sx={{
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              },
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : null}
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
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}