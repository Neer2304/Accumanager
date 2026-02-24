// app/admin/blog/posts/create/page.tsx (FIXED)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Preview,
  Image as ImageIcon,
  Link as LinkIcon,
  Add,
  Close
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

// Dynamically import the rich text editor with no SSR
const RichTextEditor = dynamic(
  () => import('@/components/admin/blog/RichTextEditor'),
  { 
    ssr: false,
    loading: () => (
      <Box sx={{ 
        height: 400, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px'
      }}>
        <CircularProgress />
      </Box>
    )
  }
);

export default function CreatePostPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tags: [] as string[],
    coverImage: '',
    readTime: 5,
    featured: false,
    published: false
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/blog/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async (publish: boolean) => {
    try {
      setSaving(true);
      setError(null);

      // Validate
      if (!formData.title || !formData.slug || !formData.excerpt || !formData.content || !formData.categoryId) {
        throw new Error('Please fill all required fields');
      }

      const res = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published: publish
        })
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/blog/posts');
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            sx={{ mb: 2 }}
          >
            Back to Posts
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" fontWeight="bold">
              Create New Post
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Preview />}
                onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
                disabled={!formData.slug}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave(false)}
                disabled={saving}
                sx={{ backgroundColor: '#5f6368', '&:hover': { backgroundColor: '#4a4d52' } }}
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave(true)}
                disabled={saving}
                sx={{ backgroundColor: '#34a853', '&:hover': { backgroundColor: '#2d9248' } }}
              >
                {saving ? 'Publishing...' : 'Publish'}
              </Button>
            </Stack>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Main Content - Flexbox layout instead of Grid */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3
        }}>
          {/* Left Column - Main Content */}
          <Box sx={{ flex: { md: 2 } }}>
            <Stack spacing={3}>
              {/* Title */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <TextField
                    fullWidth
                    label="Title *"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    variant="outlined"
                  />
                </CardContent>
              </Card>

              {/* Slug */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <TextField
                    fullWidth
                    label="Slug *"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    helperText="URL-friendly version of the title"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </CardContent>
              </Card>

              {/* Excerpt */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <TextField
                    fullWidth
                    label="Excerpt *"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    multiline
                    rows={3}
                    helperText="Brief summary of the post (max 160 characters)"
                    inputProps={{ maxLength: 160 }}
                  />
                </CardContent>
              </Card>

              {/* Content */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Content *
                  </Typography>
                  <RichTextEditor 
                    content={formData.content}
                    onChange={(content: string) => setFormData({ ...formData, content })}
                    darkMode={darkMode}
                  />
                </CardContent>
              </Card>
            </Stack>
          </Box>

          {/* Right Column - Sidebar */}
          <Box sx={{ flex: { md: 1 } }}>
            <Stack spacing={3}>
              {/* Publish Settings */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Publish Settings
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                    }
                    label="Feature this post"
                  />
                </CardContent>
              </Card>

              {/* Category */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Category *
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Select Category</InputLabel>
                    <Select
                      value={formData.categoryId}
                      label="Select Category"
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <TextField
                      size="small"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a tag"
                      fullWidth
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      <Add />
                    </Button>
                  </Stack>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        size="small"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Cover Image */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Cover Image
                  </Typography>
                  {formData.coverImage ? (
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <img
                        src={formData.coverImage}
                        alt="Cover"
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '8px'
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                        }}
                        onClick={() => setFormData({ ...formData, coverImage: '' })}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  ) : (
                    <Paper
                      sx={{
                        border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
                        borderRadius: '8px',
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: darkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02)
                        }
                      }}
                      onClick={() => {
                        const url = prompt('Enter image URL:');
                        if (url) {
                          setFormData({ ...formData, coverImage: url });
                        }
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Click to add cover image
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </Card>

              {/* Read Time */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Read Time
                  </Typography>
                  <TextField
                    type="number"
                    fullWidth
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">minutes</InputAdornment>
                    }}
                  />
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}