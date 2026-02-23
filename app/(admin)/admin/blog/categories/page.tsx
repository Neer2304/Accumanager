// app/admin/blog/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  useTheme,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  ArrowBack,
  Category as CategoryIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });
  const [creating, setCreating] = useState(false);
  
  // Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/blog/categories');
      const data = await res.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch categories');
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

  const handleCreate = async () => {
    try {
      setCreating(true);
      setError(null);

      const res = await fetch('/api/admin/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });

      const data = await res.json();

      if (data.success) {
        fetchCategories();
        setCreateDialogOpen(false);
        setNewCategory({ name: '', slug: '', description: '' });
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/blog/categories/${selectedCategory._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        fetchCategories();
        setDeleteDialogOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
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
            Back to Dashboard
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Blog Categories
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your blog categories
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                backgroundColor: '#4285f4',
                '&:hover': { backgroundColor: '#3367d6' }
              }}
            >
              New Category
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Categories Table */}
        <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ backgroundColor: darkMode ? '#303134' : '#f8f9fa' }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <CategoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No categories found
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setCreateDialogOpen(true)}
                        sx={{ mt: 2 }}
                      >
                        Create your first category
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category._id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">{category.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.slug}
                          size="small"
                          sx={{
                            backgroundColor: alpha('#4285f4', 0.1),
                            color: '#4285f4',
                            fontFamily: 'monospace'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {category.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {format(new Date(category.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/admin/blog/categories/${category._id}/edit`}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, category)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Create Category Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => !creating && setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Category</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Name *"
                value={newCategory.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setNewCategory({
                    ...newCategory,
                    name,
                    slug: generateSlug(name)
                  });
                }}
                fullWidth
                required
              />
              <TextField
                label="Slug *"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                fullWidth
                required
                helperText="URL-friendly version of the name"
              />
              <TextField
                label="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              variant="contained"
              disabled={creating || !newCategory.name || !newCategory.slug}
            >
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !deleting && setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Category</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedCategory?.name}"? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            component={Link}
            href={`/admin/blog/categories/${selectedCategory?._id}/edit`}
          >
            <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={() => {
            setDeleteDialogOpen(true);
            handleMenuClose();
          }}>
            <Delete fontSize="small" sx={{ mr: 1, color: '#ea4335' }} /> Delete
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
}