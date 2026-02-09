// app/community/create/page.tsx
"use client";

import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'general', name: 'General Discussion', icon: '💬', color: '#4285f4' },
  { id: 'questions', name: 'Questions & Answers', icon: '❓', color: '#ea4335' },
  { id: 'tips', name: 'Tips & Tricks', icon: '💡', color: '#34a853' },
  { id: 'bugs', name: 'Bug Reports', icon: '🐛', color: '#fbbc04' },
  { id: 'features', name: 'Feature Requests', icon: '✨', color: '#f57c00' },
  { id: 'announcements', name: 'Announcements', icon: '📢', color: '#9c27b0' },
];

export default function CreatePostPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: [] as string[],
    newTag: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          tags: formData.tags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/community/post/${data.data._id}`);
        }, 2000);
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim().toLowerCase()],
        newTag: '',
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (success) {
    return (
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="md">
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 3,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Typography variant="h5" color="#34a853" gutterBottom>
              🎉 Post Created Successfully!
            </Typography>
            <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph>
              Your post has been published to the community.
            </Typography>
            <CircularProgress size={24} sx={{ mt: 2, color: '#4285f4' }} />
            <Typography variant="caption" display="block" sx={{ mt: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Redirecting to your post...
            </Typography>
          </Paper>
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
        {/* Back Button */}
        <Button
          component={Link}
          href="/community"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            mb: 3,
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
            },
          }}
        >
          Back to Community
        </Button>

        {/* Header */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          bgcolor: darkMode ? '#303134' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="h4" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Create New Post
          </Typography>
          <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Share your knowledge, ask questions, or start a discussion with the community.
          </Typography>
        </Paper>

        {/* Error Alert */}
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

        {/* Form */}
        <Paper sx={{ 
          p: 3, 
          borderRadius: 2,
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Title */}
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What would you like to discuss?"
                required
                InputProps={{
                  sx: { 
                    fontSize: '1.1rem', 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }
                }}
                InputLabelProps={{
                  sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
                }}
                helperText="Be specific and descriptive"
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

              {/* Content */}
              <TextField
                fullWidth
                label="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Describe your question, issue, or discussion topic in detail..."
                multiline
                rows={10}
                required
                InputProps={{
                  sx: { color: darkMode ? '#e8eaed' : '#202124' }
                }}
                InputLabelProps={{
                  sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
                }}
                helperText="Provide as much detail as possible. Use markdown for formatting."
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

              {/* Category & Tags */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Category */}
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Category"
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
                    {CATEGORIES.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{category.icon}</span>
                          {category.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Tags */}
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <TextField
                    fullWidth
                    label="Tags"
                    value={formData.newTag}
                    onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tags (press Enter)"
                    InputProps={{
                      sx: { color: darkMode ? '#e8eaed' : '#202124' },
                      startAdornment: (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
                          <TagIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          {formData.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              onDelete={() => handleRemoveTag(tag)}
                              sx={{ 
                                mr: 0.5,
                                backgroundColor: alpha('#4285f4', 0.1),
                                color: '#4285f4',
                                '& .MuiChip-deleteIcon': {
                                  color: '#4285f4',
                                },
                              }}
                            />
                          ))}
                        </Box>
                      ),
                    }}
                    InputLabelProps={{
                      sx: { color: darkMode ? '#9aa0a6' : '#5f6368' }
                    }}
                    helperText="Add relevant tags to help others find your post"
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

              {/* Guidelines */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  borderRadius: 1,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  📝 Posting Guidelines
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  • Be respectful and professional<br/>
                  • Provide clear and detailed information<br/>
                  • Use proper formatting and spacing<br/>
                  • Tag your post appropriately<br/>
                  • Check for duplicates before posting
                </Typography>
              </Paper>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  component={Link}
                  href="/community"
                  variant="outlined"
                  disabled={loading}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: '#4285f4',
                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : <SendIcon />}
                  disabled={loading || !formData.title.trim() || !formData.content.trim()}
                  sx={{ 
                    minWidth: 120,
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
                  {loading ? 'Creating...' : 'Publish Post'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
