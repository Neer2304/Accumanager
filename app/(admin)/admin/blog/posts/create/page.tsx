// app/admin/blog/posts/create/page.tsx
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
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Preview,
  Image as ImageIcon,
  Link as LinkIcon,
  Add,
  Close,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

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
        borderRadius: '12px',
        background: 'transparent',
      }}>
        <CircularProgress size={28} sx={{ color: '#1a73e8' }} />
      </Box>
    ),
  }
);

export default function CreatePostPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title:      '',
    slug:       '',
    excerpt:    '',
    content:    '',
    categoryId: '',
    tags:       [] as string[],
    coverImage: '',
    readTime:   5,
    featured:   false,
    published:  false,
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => { fetchCategories() }, []);

  const fetchCategories = async () => {
    try {
      const res  = await fetch('/api/admin/blog/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) =>
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }
  };

  const handleSave = async (publish: boolean) => {
    try {
      setSaving(true); setError(null);
      if (!formData.title || !formData.slug || !formData.excerpt || !formData.content || !formData.categoryId)
        throw new Error('Please fill all required fields');

      const res  = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, published: publish }),
      });
      const data = await res.json();
      if (data.success) router.push('/admin/blog/posts');
      else setError(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Design tokens ────────────────────────────────────────────────────────
  const pageBg   = darkMode ? '#13151a' : '#f0f4f8'
  const cardBg   = darkMode ? '#1c1f26' : '#ffffff'
  const cardBorder = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const labelColor = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'
  const headingColor = darkMode ? '#e8eaed' : '#202124'

  // ── Shared card style ────────────────────────────────────────────────────
  const cardSx = {
    borderRadius: '14px',
    backgroundColor: cardBg,
    border: `1px solid ${cardBorder}`,
    boxShadow: darkMode
      ? '0 2px 16px rgba(0,0,0,0.35)'
      : '0 1px 8px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s ease',
    '&:hover': {
      boxShadow: darkMode
        ? '0 4px 24px rgba(0,0,0,0.45)'
        : '0 4px 16px rgba(0,0,0,0.09)',
    },
  }

  // ── Section label ─────────────────────────────────────────────────────────
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography
      variant="overline"
      sx={{
        display: 'block',
        mb: 1.5,
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: labelColor,
      }}
    >
      {children}
    </Typography>
  )

  // ── Styled card heading ────────────────────────────────────────────────────
  const CardHeading = ({ children }: { children: React.ReactNode }) => (
    <Typography
      variant="subtitle1"
      sx={{
        mb: 1.5,
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: labelColor,
      }}
    >
      {children}
    </Typography>
  )

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: pageBg, py: 4 }}>

      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <Container maxWidth="lg">

        {/* ── Page header ──────────────────────────────────────────────── */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            sx={{
              mb: 2.5,
              color: darkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)',
              fontSize: '0.82rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
              px: 0,
              '&:hover': { background: 'transparent', color: '#1a73e8' },
            }}
          >
            Back to Posts
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: headingColor, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Create New Post
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: labelColor, fontSize: '0.83rem' }}>
                Draft, preview and publish your content
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
              <Button
                variant="outlined"
                startIcon={<Preview />}
                onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
                disabled={!formData.slug}
                size="small"
                sx={{
                  borderRadius: '10px',
                  borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                  color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.02em',
                  px: 2, py: 1,
                  '&:hover': { borderColor: '#1a73e8', color: '#1a73e8', background: alpha('#1a73e8', 0.06) },
                }}
              >
                Preview
              </Button>

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave(false)}
                disabled={saving}
                size="small"
                sx={{
                  borderRadius: '10px',
                  background: darkMode ? '#2d3139' : '#e8eaed',
                  color: darkMode ? 'rgba(255,255,255,0.78)' : '#3c4043',
                  fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.02em',
                  px: 2.5, py: 1,
                  boxShadow: 'none',
                  '&:hover': { background: darkMode ? '#363a44' : '#dadce0', boxShadow: 'none' },
                }}
              >
                {saving ? 'Saving…' : 'Save Draft'}
              </Button>

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave(true)}
                disabled={saving}
                size="small"
                sx={{
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)',
                  color: '#fff',
                  fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.02em',
                  px: 2.5, py: 1,
                  boxShadow: '0 2px 10px rgba(26,115,232,0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1557b0 0%, #0d47a1 100%)',
                    boxShadow: '0 4px 16px rgba(26,115,232,0.45)',
                  },
                }}
              >
                {saving ? 'Publishing…' : 'Publish'}
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* ── Error alert ── */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              mb: 3, borderRadius: '12px',
              border: '1px solid rgba(217,48,37,0.25)',
              background: darkMode ? 'rgba(217,48,37,0.12)' : 'rgba(217,48,37,0.06)',
            }}
          >
            {error}
          </Alert>
        )}

        {/* ── Two-column layout ── */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: 'flex-start',
        }}>

          {/* ══ LEFT COLUMN — Main content ════════════════════════════════ */}
          <Box sx={{ flex: { md: '0 0 62%' }, minWidth: 0 }}>
            <Stack spacing={2.5}>

              {/* Title */}
              <Card sx={cardSx} elevation={0}>
                <CardContent sx={{ p: 2.5 }}>
                  <SectionLabel>Title *</SectionLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter your post title…"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '& fieldset': { borderColor: cardBorder },
                        '&:hover fieldset': { borderColor: '#1a73e8' },
                        '&.Mui-focused fieldset': { borderColor: '#1a73e8' },
                      },
                      '& input::placeholder': { color: labelColor, opacity: 1 },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Slug */}
              <Card sx={cardSx} elevation={0}>
                <CardContent sx={{ p: 2.5 }}>
                  <SectionLabel>Slug *</SectionLabel>
                  <TextField
                    fullWidth
                    placeholder="post-url-slug"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    required
                    helperText="URL-friendly version of the title"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon sx={{ fontSize: 16, color: labelColor }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        fontFamily: 'monospace',
                        fontSize: '0.88rem',
                        '& fieldset': { borderColor: cardBorder },
                        '&:hover fieldset': { borderColor: '#1a73e8' },
                        '&.Mui-focused fieldset': { borderColor: '#1a73e8' },
                      },
                      '& .MuiFormHelperText-root': { color: labelColor, fontSize: '0.75rem', mt: 1 },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Excerpt */}
              <Card sx={cardSx} elevation={0}>
                <CardContent sx={{ p: 2.5 }}>
                  <SectionLabel>Excerpt *</SectionLabel>
                  <TextField
                    fullWidth
                    placeholder="Write a brief summary of your post…"
                    value={formData.excerpt}
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    multiline
                    rows={3}
                    helperText="Brief summary of the post (max 160 characters)"
                    inputProps={{ maxLength: 160 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        lineHeight: 1.65,
                        '& fieldset': { borderColor: cardBorder },
                        '&:hover fieldset': { borderColor: '#1a73e8' },
                        '&.Mui-focused fieldset': { borderColor: '#1a73e8' },
                      },
                      '& .MuiFormHelperText-root': { color: labelColor, fontSize: '0.75rem', mt: 1 },
                      '& textarea::placeholder': { color: labelColor, opacity: 1 },
                    }}
                  />
                  {/* Character counter */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: formData.excerpt.length >= 140 ? '#ea4335' : labelColor, fontSize: '0.72rem' }}>
                      {formData.excerpt.length} / 160
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Content editor */}
              <Card sx={cardSx} elevation={0}>
                <CardContent sx={{ p: 2.5 }}>
                  <SectionLabel>Content *</SectionLabel>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content: string) => setFormData({ ...formData, content })}
                    darkMode={darkMode}
                  />
                </CardContent>
              </Card>

            </Stack>
          </Box>

          {/* ══ RIGHT COLUMN — Sidebar ════════════════════════════════════ */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={2.5}>

              {/* Publish settings */}
              <Card sx={cardSx} elevation={0}>
                <CardContent sx={{ p: 2.5 }}>
                  <CardHeading>Publish Settings</CardHeading>
                  <Divider sx={{ mb: 2, borderColor: cardBorder }} />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.featured}
                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#1a73e8' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1a73e8' },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem', color: darkMode ? 'rgba(255,255,255,0.75)' : '#3c4043' }}>
                        Feature this post
                      </Typography>
                    }
                  />
                </CardContent>
              </Card>

              {/* Category */}
              <Card sx={cardSx} elevation={0}>
                <CardContent sx={{ p: 2.5 }}>
                  <CardHeading>Category *</CardHeading>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.85rem', color: labelColor }}>Select Category</InputLabel>
                    <Select
                      value={formData.categoryId}
                      label="Select Category"
                      onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                      sx={{
                        borderRadius: '10px',
                        fontSize: '0.875rem',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: cardBorder },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1a73e8' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1a73e8' },
                      }}
                    >
                      {categories.map(cat => (
                        <MenuItem key={cat._id} value={cat._id} sx={{ fontSize: '0.875rem' }}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card sx={cardSx} elevation={0}>
                <CardContent sx={{ p: 2.5 }}>
                  <CardHeading>Tags</CardHeading>
                  <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                    <TextField
                      size="small"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a tag…"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          '& fieldset': { borderColor: cardBorder },
                          '&:hover fieldset': { borderColor: '#1a73e8' },
                          '&.Mui-focused fieldset': { borderColor: '#1a73e8' },
                        },
                        '& input::placeholder': { color: labelColor, opacity: 1, fontSize: '0.82rem' },
                      }}
                    />
                    <IconButton
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                      sx={{
                        width: 36, height: 36,
                        borderRadius: '8px',
                        border: `1px solid ${cardBorder}`,
                        color: tagInput.trim() ? '#1a73e8' : labelColor,
                        '&:hover': { background: alpha('#1a73e8', 0.08), borderColor: '#1a73e8' },
                      }}
                    >
                      <Add sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {formData.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        size="small"
                        sx={{
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          height: 26,
                          background: darkMode ? 'rgba(26,115,232,0.15)' : 'rgba(26,115,232,0.08)',
                          color: '#1a73e8',
                          border: '1px solid rgba(26,115,232,0.2)',
                          '& .MuiChip-deleteIcon': { color: 'rgba(26,115,232,0.5)', fontSize: 14, '&:hover': { color: '#ea4335' } },
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Cover image */}
              <Card sx={cardSx} elevation={0}>
                <CardContent sx={{ p: 2.5 }}>
                  <CardHeading>Cover Image</CardHeading>
                  {formData.coverImage ? (
                    <Box sx={{ position: 'relative' }}>
                      <Box sx={{
                        borderRadius: '10px', overflow: 'hidden',
                        border: `1px solid ${cardBorder}`,
                      }}>
                        <img
                          src={formData.coverImage}
                          alt="Cover"
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute', top: 8, right: 8,
                          width: 28, height: 28,
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          backdropFilter: 'blur(4px)',
                          '&:hover': { backgroundColor: 'rgba(217,48,37,0.8)' },
                        }}
                        onClick={() => setFormData({ ...formData, coverImage: '' })}
                      >
                        <Close sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Paper
                      elevation={0}
                      onClick={() => {
                        const url = prompt('Enter image URL:');
                        if (url) setFormData({ ...formData, coverImage: url });
                      }}
                      sx={{
                        border: `2px dashed ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                        borderRadius: '12px',
                        p: 3, textAlign: 'center', cursor: 'pointer',
                        background: 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#1a73e8',
                          background: alpha('#1a73e8', 0.04),
                        },
                      }}
                    >
                      <Box sx={{
                        width: 44, height: 44, borderRadius: '12px', margin: '0 auto 10px',
                        background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <ImageIcon sx={{ fontSize: 22, color: labelColor }} />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)', mb: 0.25 }}>
                        Click to add cover image
                      </Typography>
                      <Typography variant="caption" sx={{ color: labelColor, fontSize: '0.72rem' }}>
                        Paste an image URL
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </Card>

              {/* Read time */}
              <Card sx={cardSx} elevation={0}>
                <CardContent sx={{ p: 2.5 }}>
                  <CardHeading>Read Time</CardHeading>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    value={formData.readTime}
                    onChange={e => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption" sx={{ color: labelColor, fontSize: '0.78rem' }}>
                            minutes
                          </Typography>
                        </InputAdornment>
                      ),
                      inputProps: { min: 1, max: 120 },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        '& fieldset': { borderColor: cardBorder },
                        '&:hover fieldset': { borderColor: '#1a73e8' },
                        '&.Mui-focused fieldset': { borderColor: '#1a73e8' },
                      },
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