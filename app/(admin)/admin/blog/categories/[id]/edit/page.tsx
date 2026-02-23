// app/admin/blog/categories/[id]/edit/page.tsx
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
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  ArrowBack,
  Save
} from '@mui/icons-material';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const categoryId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/blog/categories/${categoryId}`);
      const data = await res.json();

      if (data.success) {
        setFormData({
          name: data.data.name,
          slug: data.data.slug,
          description: data.data.description || ''
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`/api/admin/blog/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/blog/categories');
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
      <Container maxWidth="sm">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Back to Categories
        </Button>

        <Card sx={{ borderRadius: '12px' }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Edit Category
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Stack spacing={3}>
              <TextField
                label="Name *"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name)
                  });
                }}
                fullWidth
                required
              />

              <TextField
                label="Slug *"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                fullWidth
                required
                helperText="URL-friendly version of the name"
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.slug}
                sx={{ mt: 2 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}