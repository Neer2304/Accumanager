// app/admin/blog/posts/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Grid,
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
  Delete,
  Close
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const postId = params.id as string;
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  
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

  useEffect(() => {
    fetchData();
  }, [postId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [postRes, categoriesRes] = await Promise.all([
        fetch(`/api/admin/blog/posts/${postId}`),
        fetch('/api/admin/blog/categories')
      ]);

      const postData = await postRes.json();
      const categoriesData = await categoriesRes.json();

      if (postData.success) {
        setFormData({
          title: postData.data.title,
          slug: postData.data.slug,
          excerpt: postData.data.excerpt || '',
          content: postData.data.content || '',
          categoryId: postData.data.category?.id || '',
          tags: postData.data.tags || [],
          coverImage: postData.data.coverImage || '',
          readTime: postData.data.readTime || 5,
          featured: postData.data.featured || false,
          published: postData.data.published || false
        });
      } else {
        setError(postData.message);
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
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

  const handleSave = async (publish?: boolean) => {
    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published: publish !== undefined ? publish : formData.published
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      setSaving(true);
      const res = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'DELETE'
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

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ]
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
              Edit Post
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
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDelete}
                disabled={saving}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave()}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Stack>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
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
                  <Box sx={{ 
                    '.quill': { 
                      backgroundColor: darkMode ? '#303134' : '#fff',
                      borderRadius: '8px',
                      '& .ql-toolbar': {
                        borderColor: darkMode ? '#3c4043' : '#dadce0'
                      },
                      '& .ql-container': {
                        borderColor: darkMode ? '#3c4043' : '#dadce0',
                        minHeight: '400px'
                      }
                    }
                  }}>
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      modules={quillModules}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
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
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      />
                    }
                    label="Published"
                  />
                  
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
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add a tag"
                      fullWidth
                    />
                    <Button variant="outlined" onClick={handleAddTag}>
                      Add
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
                          color: 'white'
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
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        const url = prompt('Enter image URL:');
                        if (url) setFormData({ ...formData, coverImage: url });
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}