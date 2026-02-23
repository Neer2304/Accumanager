// app/admin/blog/posts/page.tsx
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
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Pagination,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Tooltip,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
  Article,
  ThumbUp,
  CalendarToday,
  Refresh,
  ArrowBack,
  PublishedWithChanges,
  Drafts,
  Image as ImageIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function AdminPostsPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    page: 1
  });

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [filters.page, filters.status, filters.category]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const res = await fetch(`/api/admin/blog/posts?${params}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchPosts();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, post: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/blog/posts/${selectedPost.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        fetchPosts();
        setDeleteDialogOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (post: any) => {
    try {
      const res = await fetch(`/api/admin/blog/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published })
      });
      const data = await res.json();

      if (data.success) {
        fetchPosts();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update post');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Blog Posts
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage all your blog posts
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              component={Link}
              href="/admin/blog/posts/create"
              sx={{
                backgroundColor: '#4285f4',
                '&:hover': { backgroundColor: '#3367d6' }
              }}
            >
              New Post
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3, borderRadius: '12px' }}>
          <CardContent>
            <form onSubmit={handleSearch}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  placeholder="Search posts..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    )
                  }}
                  sx={{ flex: 2 }}
                />
                
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Search />}
                  sx={{ px: 4 }}
                >
                  Search
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Posts Table */}
        <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ backgroundColor: darkMode ? '#303134' : '#f8f9fa' }}>
                <TableRow>
                  <TableCell>Post</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Likes</TableCell>
                  <TableCell>Published</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Article sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No posts found
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        component={Link}
                        href="/admin/blog/posts/create"
                        sx={{ mt: 2 }}
                      >
                        Create your first post
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {post.coverImage ? (
                            <Avatar
                              src={post.coverImage}
                              variant="rounded"
                              sx={{ width: 48, height: 48 }}
                            />
                          ) : (
                            <Avatar
                              variant="rounded"
                              sx={{ width: 48, height: 48, bgcolor: '#4285f4' }}
                            >
                              <Article />
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {post.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {post.excerpt?.substring(0, 60)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={post.category?.name || 'Uncategorized'}
                          size="small"
                          sx={{
                            backgroundColor: alpha('#4285f4', 0.1),
                            color: '#4285f4'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={post.published ? <PublishedWithChanges /> : <Drafts />}
                          label={post.published ? 'Published' : 'Draft'}
                          size="small"
                          sx={{
                            backgroundColor: post.published 
                              ? alpha('#34a853', 0.1)
                              : alpha('#fbbc04', 0.1),
                            color: post.published ? '#34a853' : '#fbbc04'
                          }}
                        />
                      </TableCell>
                      <TableCell>{post.views?.toLocaleString() || 0}</TableCell>
                      <TableCell>{post.likes || 0}</TableCell>
                      <TableCell>
                        {post.publishedAt ? format(new Date(post.publishedAt), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleTogglePublish(post)}
                          title={post.published ? 'Unpublish' : 'Publish'}
                        >
                          {post.published ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/admin/blog/posts/${post.id}/edit`}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, post)}
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={pagination.totalPages}
                page={filters.page}
                onChange={(e, page) => setFilters({ ...filters, page })}
                color="primary"
              />
            </Box>
          )}
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            component={Link}
            href={`/admin/blog/posts/${selectedPost?.id}/edit`}
          >
            <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <Delete fontSize="small" sx={{ mr: 1, color: '#ea4335' }} /> Delete
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Post</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDelete}
              color="error"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}