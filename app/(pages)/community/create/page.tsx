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
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Send as SendIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  EmojiEmotions as EmojiIcon,
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
  };
};

const CATEGORIES = [
  { id: 'general', name: 'General Discussion', icon: '💬', color: '#1877f2' },
  { id: 'questions', name: 'Questions & Answers', icon: '❓', color: '#e41e3f' },
  { id: 'tips', name: 'Tips & Tricks', icon: '💡', color: '#31a24c' },
  { id: 'bugs', name: 'Bug Reports', icon: '🐛', color: '#fbbc04' },
  { id: 'features', name: 'Feature Requests', icon: '✨', color: '#f57c00' },
  { id: 'announcements', name: 'Announcements', icon: '📢', color: '#7b1fa2' },
];

export default function CreatePostPage() {
  const router = useRouter();
  const c = useColors();
  
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
        headers: { 'Content-Type': 'application/json' },
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
      <Box sx={{ bgcolor: c.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="md">
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: "16px", 
            bgcolor: c.surface,
            border: `1px solid ${c.border}`,
          }}>
            <Box sx={{ 
              width: 64, height: 64, borderRadius: "50%", 
              bgcolor: alpha(c.green, 0.1), 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 2
            }}>
              <SendIcon sx={{ fontSize: 32, color: c.green }} />
            </Box>
            <Typography variant="h5" fontWeight={600} sx={{ color: c.ink, mb: 1 }}>
              Post Created Successfully! 🎉
            </Typography>
            <Typography sx={{ color: c.inkSub, mb: 3 }}>
              Your post has been published to the community.
            </Typography>
            <CircularProgress size={24} sx={{ color: c.blue }} />
            <Typography variant="caption" display="block" sx={{ mt: 1, color: c.inkMuted }}>
              Redirecting to your post...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  const selectedCategory = CATEGORIES.find(c => c.id === formData.category);

  return (
    <Box sx={{ bgcolor: c.bg, minHeight: '100vh' }}>
      {/* Sticky Header */}
      <Box sx={{ 
        position: "sticky", top: 0, zIndex: 100,
        bgcolor: alpha(c.surface, 0.95), borderBottom: `1px solid ${c.border}`,
        backdropFilter: "blur(10px)"
      }}>
        <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.25 }}>
            <IconButton size="small" onClick={() => router.back()}
              sx={{ bgcolor: c.surface2, color: c.ink, "&:hover": { bgcolor: c.border } }}>
              <ArrowBackIcon sx={{ fontSize: 19 }} />
            </IconButton>
            <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: c.ink }}>
              Create New Post
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {/* Title Input */}
            <Paper sx={{ 
              borderRadius: "16px", 
              bgcolor: c.surface, 
              border: `1px solid ${c.border}`,
              overflow: "hidden"
            }}>
              <Box sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 600, color: c.ink, mb: 1, fontSize: "0.85rem" }}>
                  Title
                </Typography>
                <TextField
                  fullWidth
                  placeholder="What would you like to discuss?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  variant="outlined"
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: c.surface2,
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: c.border },
                      "&.Mui-focused fieldset": { borderColor: c.blue, borderWidth: 1.5 },
                    },
                    "& .MuiInputBase-input": { 
                      color: c.ink, 
                      fontSize: "0.95rem",
                      "&::placeholder": { color: c.inkMuted }
                    }
                  }}
                />
                <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted, mt: 0.5 }}>
                  Be specific and descriptive (max 200 characters)
                </Typography>
              </Box>
            </Paper>

            {/* Content Input */}
            <Paper sx={{ 
              borderRadius: "16px", 
              bgcolor: c.surface, 
              border: `1px solid ${c.border}`,
              overflow: "hidden"
            }}>
              <Box sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 600, color: c.ink, mb: 1, fontSize: "0.85rem" }}>
                  Content
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Describe your question, issue, or discussion topic in detail..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  multiline
                  rows={8}
                  variant="outlined"
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: c.surface2,
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: c.border },
                      "&.Mui-focused fieldset": { borderColor: c.blue, borderWidth: 1.5 },
                    },
                    "& .MuiInputBase-input": { 
                      color: c.ink, 
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      "&::placeholder": { color: c.inkMuted }
                    }
                  }}
                />
                
                {/* Formatting tips */}
                <Box sx={{ display: "flex", gap: 2, mt: 1.5, flexWrap: "wrap" }}>
                  <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted, display: "flex", alignItems: "center", gap: 0.5 }}>
                    💡 Use **bold** or *italic* for emphasis
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted, display: "flex", alignItems: "center", gap: 0.5 }}>
                    📋 Use bullet points for lists
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Category & Tags Row */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              {/* Category */}
              <Paper sx={{ 
                flex: 1,
                borderRadius: "16px", 
                bgcolor: c.surface, 
                border: `1px solid ${c.border}`,
                overflow: "hidden"
              }}>
                <Box sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 600, color: c.ink, mb: 1, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CategoryIcon sx={{ fontSize: 16, color: c.blue }} /> Category
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      sx={{
                        borderRadius: "12px",
                        bgcolor: c.surface2,
                        color: c.ink,
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: c.border },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: c.blue }
                      }}
                    >
                      {CATEGORIES.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <span style={{ fontSize: "1.1rem" }}>{category.icon}</span>
                            <span style={{ color: c.ink }}>{category.name}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedCategory && (
                    <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted, mt: 1 }}>
                      Selected: <span style={{ color: selectedCategory.color }}>{selectedCategory.name}</span>
                    </Typography>
                  )}
                </Box>
              </Paper>

              {/* Tags */}
              <Paper sx={{ 
                flex: 1.5,
                borderRadius: "16px", 
                bgcolor: c.surface, 
                border: `1px solid ${c.border}`,
                overflow: "hidden"
              }}>
                <Box sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 600, color: c.ink, mb: 1, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <TagIcon sx={{ fontSize: 16, color: c.blue }} /> Tags
                  </Typography>
                  <Box sx={{ 
                    display: "flex", 
                    flexWrap: "wrap", 
                    gap: 0.5, 
                    mb: 1.5,
                    minHeight: "32px"
                  }}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        onDelete={() => handleRemoveTag(tag)}
                        sx={{
                          bgcolor: alpha(c.blue, 0.1),
                          color: c.blue,
                          borderRadius: "20px",
                          "& .MuiChip-deleteIcon": { color: c.blue, fontSize: 14 }
                        }}
                      />
                    ))}
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="Add tags (press Enter)"
                    value={formData.newTag}
                    onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                    onKeyDown={handleKeyDown}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: c.surface2,
                        "& fieldset": { borderColor: "transparent" },
                        "&:hover fieldset": { borderColor: c.border },
                        "&.Mui-focused fieldset": { borderColor: c.blue }
                      },
                      "& .MuiInputBase-input": { color: c.ink, fontSize: "0.85rem" }
                    }}
                  />
                  <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted, mt: 1 }}>
                    Add relevant tags to help others find your post
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: "12px",
                  bgcolor: alpha(c.red, 0.1),
                  color: c.red,
                }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {/* Guidelines Card */}
            <Paper sx={{ 
              borderRadius: "16px", 
              bgcolor: alpha(c.blue, 0.04), 
              border: `1px solid ${alpha(c.blue, 0.15)}`,
              overflow: "hidden"
            }}>
              <Box sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 600, color: c.blue, mb: 1.5, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                  📝 Posting Guidelines
                </Typography>
                <Stack spacing={1}>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkSub, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box component="span" sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: c.green }} /> 
                    Be respectful and professional
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkSub, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box component="span" sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: c.green }} /> 
                    Provide clear and detailed information
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkSub, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box component="span" sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: c.green }} /> 
                    Use proper formatting and spacing
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkSub, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box component="span" sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: c.green }} /> 
                    Tag your post appropriately
                  </Typography>
                </Stack>
              </Box>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, pt: 1 }}>
              <Button
                component={Link}
                href="/community"
                variant="outlined"
                disabled={loading}
                sx={{
                  borderRadius: "40px",
                  textTransform: "none",
                  px: 3,
                  py: 0.75,
                  borderColor: c.border,
                  color: c.inkSub,
                  "&:hover": { borderColor: c.blue, bgcolor: alpha(c.blue, 0.05) }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <SendIcon sx={{ fontSize: 18 }} />}
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                sx={{ 
                  borderRadius: "40px",
                  textTransform: "none",
                  px: 4,
                  py: 0.75,
                  bgcolor: c.blue,
                  "&:hover": { bgcolor: "#166fe5" }
                }}
              >
                {loading ? 'Creating...' : 'Publish Post'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}