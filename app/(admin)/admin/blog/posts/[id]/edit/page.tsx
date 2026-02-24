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
  Alert,
  CircularProgress,
  useTheme,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  alpha
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Preview,
  Image as ImageIcon,
  Delete,
  Close,
  Link as LinkIcon,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Title,
  Code,
  Undo,
  Redo
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';

// Rich Text Editor Component
const RichTextEditor = ({ content, onChange, darkMode }: any) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      TextStyle,
      Color,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: 'min-height: 400px; padding: 1rem;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    const [linkUrl, setLinkUrl] = useState('');

    const addLink = () => {
      const url = window.prompt('Enter URL:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    };

    const addImage = () => {
      const url = window.prompt('Enter image URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    };

    return (
      <Box sx={{ 
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        pb: 1,
        mb: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5
      }}>
        <ToggleButtonGroup size="small">
          <ToggleButton 
            value="bold" 
            selected={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBold fontSize="small" />
          </ToggleButton>
          <ToggleButton 
            value="italic"
            selected={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalic fontSize="small" />
          </ToggleButton>
          <ToggleButton 
            value="underline"
            selected={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <FormatUnderlined fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup size="small">
          <ToggleButton 
            value="bulletList"
            selected={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulleted fontSize="small" />
          </ToggleButton>
          <ToggleButton 
            value="orderedList"
            selected={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumbered fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup size="small">
          <ToggleButton 
            value="h1"
            selected={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Title fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>1</Typography>
          </ToggleButton>
          <ToggleButton 
            value="h2"
            selected={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Title fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>2</Typography>
          </ToggleButton>
          <ToggleButton 
            value="h3"
            selected={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Title fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>3</Typography>
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup size="small">
          <ToggleButton value="link" onClick={addLink}>
            <LinkIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="image" onClick={addImage}>
            <ImageIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="codeBlock" 
            selected={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup size="small" sx={{ ml: 'auto' }}>
          <ToggleButton value="undo" onClick={() => editor.chain().focus().undo().run()}>
            <Undo fontSize="small" />
          </ToggleButton>
          <ToggleButton value="redo" onClick={() => editor.chain().focus().redo().run()}>
            <Redo fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      borderRadius: '8px',
      backgroundColor: darkMode ? '#303134' : '#fff',
      p: 2
    }}>
      <MenuBar />
      <EditorContent editor={editor} />
    </Box>
  );
};

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
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.7)'
                          }
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
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: darkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02)
                        }
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
}