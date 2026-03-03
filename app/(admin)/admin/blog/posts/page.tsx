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

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    page: 1
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
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

  // ─── Design tokens ────────────────────────────────────────────────────────
  const bg          = darkMode ? '#202124' : '#f4f6fa';
  const surface     = darkMode ? '#1a1d27' : '#ffffff';
  const surfaceHigh = darkMode ? '#20242f' : '#f8fafc';
  const border      = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)';
  const borderHov   = darkMode ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.18)';
  const ink         = darkMode ? '#e2e8f0' : '#0f172a';
  const inkSub      = darkMode ? '#94a3b8' : '#64748b';
  const inkMuted    = darkMode ? '#475569' : '#94a3b8';
  const blue        = '#3b82f6';
  const green       = '#22c55e';
  const amber       = '#f59e0b';
  const red         = '#ef4444';

  const cardBase = {
    borderRadius: '16px',
    backgroundColor: surface,
    border: `1px solid ${border}`,
    boxShadow: darkMode
      ? '0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25)'
      : '0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)',
    overflow: 'hidden',
  };

  const inputBase = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      fontSize: '0.875rem',
      backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.02)',
      transition: 'all 0.15s ease',
      '& fieldset': { borderColor: border, transition: 'border-color 0.15s ease' },
      '&:hover fieldset': { borderColor: borderHov },
      '&.Mui-focused fieldset': { borderColor: blue, borderWidth: '1.5px' },
    },
    '& input, & textarea': { color: ink },
    '& input::placeholder, & textarea::placeholder': { color: inkMuted, opacity: 1 },
  };

  const publishedCount = posts.filter(p => p.published).length;
  const draftCount     = posts.filter(p => !p.published).length;
  const totalViews     = posts.reduce((s, p) => s + (p.views || 0), 0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: bg, py: { xs: 3, md: 5 } }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        body, .MuiTypography-root, .MuiButton-root, .MuiTableCell-root, .MuiMenuItem-root {
          font-family: 'DM Sans', system-ui, sans-serif !important;
        }
      `}</style>

      <Container maxWidth="xl">

        {/* ── Back ─────────────────────────────────────────────────────── */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack sx={{ fontSize: '15px !important' }} />}
            onClick={() => router.back()}
            sx={{
              color: inkSub, fontSize: '0.82rem', fontWeight: 500,
              px: 0, minWidth: 0, letterSpacing: 0,
              '&:hover': { background: 'transparent', color: blue },
            }}
          >
            Back
          </Button>
        </Box>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <Box sx={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', gap: 2, mb: 4, flexWrap: 'wrap',
        }}>
          <Box>
            <Typography sx={{
              fontSize: '1.6rem', fontWeight: 700, color: ink,
              letterSpacing: '-0.04em', lineHeight: 1.2,
            }}>
              Blog Posts
            </Typography>
            <Typography sx={{ mt: 0.5, color: inkSub, fontSize: '0.875rem' }}>
              Manage all your blog posts
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add sx={{ fontSize: '17px !important' }} />}
            component={Link}
            href="/admin/blog/posts/create"
            sx={{
              borderRadius: '10px',
              background: blue,
              fontSize: '0.875rem', fontWeight: 600,
              px: 2.5, py: 1.1,
              letterSpacing: '-0.01em',
              boxShadow: `0 1px 3px ${alpha(blue, 0.3)}, 0 4px 12px ${alpha(blue, 0.2)}`,
              '&:hover': {
                background: '#2563eb',
                boxShadow: `0 2px 6px ${alpha(blue, 0.4)}, 0 8px 20px ${alpha(blue, 0.25)}`,
              },
            }}
          >
            New Post
          </Button>
        </Box>

        {/* ── Stat pills ───────────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3.5, flexWrap: 'wrap' }}>
          {[
            { label: 'Total',     value: pagination.total,            color: blue,   bg: alpha(blue, 0.1) },
            { label: 'Published', value: publishedCount,              color: green,  bg: alpha(green, 0.1) },
            { label: 'Drafts',    value: draftCount,                  color: amber,  bg: alpha(amber, 0.1) },
            { label: 'Views',     value: totalViews.toLocaleString(), color: inkSub, bg: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)' },
          ].map(s => (
            <Box key={s.label} sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              px: 2, py: 1.25,
              borderRadius: '12px',
              backgroundColor: surface,
              border: `1px solid ${border}`,
              boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 3px rgba(15,23,42,0.05)',
            }}>
              <Box sx={{
                width: 8, height: 8, borderRadius: '50%',
                background: s.color, flexShrink: 0,
                boxShadow: `0 0 0 3px ${s.bg}`,
              }} />
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: ink, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: inkMuted, textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1 }}>
                  {s.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ── Filters ──────────────────────────────────────────────────── */}
        <Card sx={{ ...cardBase, mb: 2.5 }} elevation={0}>
          <CardContent sx={{ p: 2 }}>
            <form onSubmit={handleSearch}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
                <TextField
                  fullWidth
                  placeholder="Search posts…"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 17, color: inkMuted }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...inputBase, flex: 2 }}
                />

                <FormControl size="small" sx={{ minWidth: 140, flexShrink: 0 }}>
                  <InputLabel sx={{ fontSize: '0.875rem', color: inkSub }}>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                    sx={{
                      borderRadius: '10px', fontSize: '0.875rem',
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.02)',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: border },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: borderHov },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: blue, borderWidth: '1.5px' },
                      '& .MuiSelect-select': { color: ink },
                    }}
                  >
                    <MenuItem value="all"       sx={{ fontSize: '0.875rem' }}>All</MenuItem>
                    <MenuItem value="published" sx={{ fontSize: '0.875rem' }}>Published</MenuItem>
                    <MenuItem value="draft"     sx={{ fontSize: '0.875rem' }}>Draft</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Search sx={{ fontSize: '16px !important' }} />}
                  size="small"
                  sx={{
                    flexShrink: 0, borderRadius: '10px', px: 3, py: 1.1,
                    fontSize: '0.875rem', fontWeight: 600, letterSpacing: '-0.01em',
                    background: blue, boxShadow: 'none',
                    '&:hover': { background: '#2563eb', boxShadow: 'none' },
                  }}
                >
                  Search
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* ── Error ────────────────────────────────────────────────────── */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              mb: 2.5, borderRadius: '12px',
              border: `1px solid ${alpha(red, 0.25)}`,
              backgroundColor: darkMode ? alpha(red, 0.1) : alpha(red, 0.05),
              color: darkMode ? '#fca5a5' : '#991b1b',
              '& .MuiAlert-icon': { color: red },
            }}
          >
            {error}
          </Alert>
        )}

        {/* ── Table ────────────────────────────────────────────────────── */}
        <Card sx={cardBase} elevation={0}>
          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
            <Table>

              <TableHead>
                <TableRow sx={{ backgroundColor: surfaceHigh }}>
                  {['Post', 'Category', 'Status', 'Views', 'Likes', 'Published', 'Actions'].map((h, i) => (
                    <TableCell
                      key={h}
                      align={h === 'Actions' ? 'right' : 'left'}
                      sx={{
                        py: 1.5, px: i === 0 ? 3 : 2,
                        fontSize: '0.7rem', fontWeight: 700,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: inkMuted,
                        borderBottom: `1px solid ${border}`,
                        backgroundColor: surfaceHigh,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>

                {/* Loading */}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 12, border: 'none' }}>
                      <CircularProgress size={26} thickness={3} sx={{ color: blue }} />
                    </TableCell>
                  </TableRow>
                )}

                {/* Empty */}
                {!loading && posts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 12, border: 'none' }}>
                      <Box sx={{
                        width: 56, height: 56, borderRadius: '16px', margin: '0 auto 14px',
                        background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Article sx={{ fontSize: 26, color: inkMuted }} />
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.925rem', color: inkSub, mb: 0.5 }}>
                        No posts found
                      </Typography>
                      <Typography sx={{ fontSize: '0.825rem', color: inkMuted, mb: 3 }}>
                        Create your first post to get started
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add sx={{ fontSize: '16px !important' }} />}
                        component={Link}
                        href="/admin/blog/posts/create"
                        size="small"
                        sx={{
                          borderRadius: '10px', px: 2.5, py: 1,
                          fontSize: '0.825rem', fontWeight: 600,
                          background: blue, boxShadow: 'none',
                          '&:hover': { background: '#2563eb', boxShadow: 'none' },
                        }}
                      >
                        Create your first post
                      </Button>
                    </TableCell>
                  </TableRow>
                )}

                {/* Rows */}
                {!loading && posts.map((post) => (
                  <TableRow
                    key={post.id}
                    sx={{
                      borderBottom: `1px solid ${border}`,
                      transition: 'background-color 0.12s ease',
                      '&:hover': {
                        backgroundColor: darkMode
                          ? 'rgba(255,255,255,0.025)'
                          : 'rgba(59,130,246,0.02)',
                      },
                      '&:last-child td': { borderBottom: 'none' },
                    }}
                  >
                    {/* Post */}
                    <TableCell sx={{ py: 1.75, px: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                        {post.coverImage ? (
                          <Avatar
                            src={post.coverImage}
                            variant="rounded"
                            sx={{
                              width: 42, height: 42, borderRadius: '10px',
                              flexShrink: 0, border: `1px solid ${border}`,
                            }}
                          />
                        ) : (
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 42, height: 42, borderRadius: '10px', flexShrink: 0,
                              bgcolor: alpha(blue, 0.12), color: blue,
                            }}
                          >
                            <Article sx={{ fontSize: 19 }} />
                          </Avatar>
                        )}
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{
                            fontWeight: 600, fontSize: '0.875rem', color: ink,
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', maxWidth: 300,
                          }}>
                            {post.title}
                          </Typography>
                          <Typography sx={{
                            fontSize: '0.75rem', color: inkMuted, mt: 0.25,
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', maxWidth: 300,
                          }}>
                            {post.excerpt?.substring(0, 60)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Category */}
                    <TableCell sx={{ py: 1.75, px: 2 }}>
                      <Chip
                        label={post.category?.name || 'Uncategorized'}
                        size="small"
                        sx={{
                          borderRadius: '6px', height: 22,
                          fontSize: '0.72rem', fontWeight: 600,
                          backgroundColor: alpha(blue, 0.1),
                          color: blue,
                          border: `1px solid ${alpha(blue, 0.2)}`,
                        }}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell sx={{ py: 1.75, px: 2 }}>
                      <Chip
                        icon={post.published
                          ? <PublishedWithChanges sx={{ fontSize: '12px !important', ml: '5px !important' }} />
                          : <Drafts              sx={{ fontSize: '12px !important', ml: '5px !important' }} />
                        }
                        label={post.published ? 'Published' : 'Draft'}
                        size="small"
                        sx={{
                          borderRadius: '6px', height: 22,
                          fontSize: '0.72rem', fontWeight: 600,
                          backgroundColor: post.published ? alpha(green, 0.1) : alpha(amber, 0.1),
                          color:            post.published ? green             : amber,
                          border: `1px solid ${post.published ? alpha(green, 0.22) : alpha(amber, 0.22)}`,
                        }}
                      />
                    </TableCell>

                    {/* Views */}
                    <TableCell sx={{ py: 1.75, px: 2, fontSize: '0.875rem', fontWeight: 500, color: inkSub }}>
                      {post.views?.toLocaleString() || 0}
                    </TableCell>

                    {/* Likes */}
                    <TableCell sx={{ py: 1.75, px: 2, fontSize: '0.875rem', fontWeight: 500, color: inkSub }}>
                      {post.likes || 0}
                    </TableCell>

                    {/* Published date */}
                    <TableCell sx={{ py: 1.75, px: 2, fontSize: '0.82rem', color: inkMuted, whiteSpace: 'nowrap' }}>
                      {post.publishedAt ? format(new Date(post.publishedAt), 'MMM dd, yyyy') : '—'}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ py: 1.75, px: 2 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title={post.published ? 'Unpublish' : 'Publish'} arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleTogglePublish(post)}
                            sx={{
                              width: 30, height: 30, borderRadius: '8px',
                              color: post.published ? green : inkMuted,
                              '&:hover': {
                                backgroundColor: post.published ? alpha(green, 0.1) : alpha(blue, 0.08),
                                color: post.published ? '#16a34a' : blue,
                              },
                            }}
                          >
                            {post.published
                              ? <VisibilityOff sx={{ fontSize: 16 }} />
                              : <Visibility    sx={{ fontSize: 16 }} />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit" arrow>
                          <IconButton
                            size="small"
                            component={Link}
                            href={`/admin/blog/posts/${post.id}/edit`}
                            sx={{
                              width: 30, height: 30, borderRadius: '8px', color: inkMuted,
                              '&:hover': { backgroundColor: alpha(blue, 0.08), color: blue },
                            }}
                          >
                            <Edit sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="More options" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, post)}
                            sx={{
                              width: 30, height: 30, borderRadius: '8px', color: inkMuted,
                              '&:hover': {
                                backgroundColor: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.05)',
                                color: ink,
                              },
                            }}
                          >
                            <MoreVert sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{
              px: 3, py: 2,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: `1px solid ${border}`,
            }}>
              <Typography sx={{ fontSize: '0.78rem', color: inkMuted }}>
                Showing {((filters.page - 1) * pagination.limit) + 1}–{Math.min(filters.page * pagination.limit, pagination.total)} of {pagination.total} posts
              </Typography>
              <Pagination
                count={pagination.totalPages}
                page={filters.page}
                onChange={(e, page) => setFilters({ ...filters, page })}
                color="primary"
                size="small"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '8px', fontSize: '0.82rem', color: inkSub,
                    border: `1px solid transparent`,
                    '&:hover': { backgroundColor: alpha(blue, 0.08), borderColor: alpha(blue, 0.2) },
                    '&.Mui-selected': {
                      backgroundColor: blue, color: '#fff', fontWeight: 700, border: 'none',
                      '&:hover': { backgroundColor: '#2563eb' },
                    },
                  },
                }}
              />
            </Box>
          )}
        </Card>

        {/* ── Context menu ─────────────────────────────────────────────── */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 0.75, borderRadius: '12px',
              backgroundColor: surface,
              border: `1px solid ${border}`,
              boxShadow: darkMode
                ? '0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)'
                : '0 4px 24px rgba(15,23,42,0.12), 0 1px 4px rgba(15,23,42,0.06)',
              minWidth: 168, p: 0.5,
              '& .MuiMenuItem-root': {
                borderRadius: '8px', fontSize: '0.875rem',
                px: 1.5, py: 1, gap: 1.5,
                transition: 'background-color 0.12s ease',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.04)',
                },
              },
            },
          }}
        >
          <MenuItem
            component={Link}
            href={`/admin/blog/posts/${selectedPost?.id}/edit`}
            sx={{ color: ink }}
          >
            <Edit sx={{ fontSize: 15, color: inkMuted }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: red }}>
            <Delete sx={{ fontSize: 15 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* ── Delete dialog ─────────────────────────────────────────────── */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            elevation: 0,
            sx: {
              borderRadius: '18px',
              backgroundColor: surface,
              border: `1px solid ${border}`,
              boxShadow: darkMode
                ? '0 24px 80px rgba(0,0,0,0.7)'
                : '0 24px 80px rgba(15,23,42,0.14)',
              minWidth: { xs: 320, sm: 400 }, p: 0.5,
            },
          }}
        >
          <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
                backgroundColor: alpha(red, 0.1),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Delete sx={{ fontSize: 18, color: red }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: ink, letterSpacing: '-0.02em' }}>
                Delete Post
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 3, py: 1 }}>
            <Typography sx={{ fontSize: '0.875rem', color: inkSub, lineHeight: 1.7 }}>
              Are you sure you want to delete{' '}
              <Box component="span" sx={{ fontWeight: 600, color: ink }}>
                "{selectedPost?.title}"
              </Box>
              ? This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              size="small"
              sx={{
                borderRadius: '10px', px: 2.5, py: 0.9,
                fontSize: '0.875rem', fontWeight: 600,
                color: inkSub, border: `1px solid ${border}`,
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
                  borderColor: borderHov,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              size="small"
              sx={{
                borderRadius: '10px', px: 2.5, py: 0.9,
                fontSize: '0.875rem', fontWeight: 600,
                backgroundColor: red, color: '#fff', boxShadow: 'none',
                '&:hover': { backgroundColor: '#dc2626', boxShadow: 'none' },
                '&.Mui-disabled': { backgroundColor: alpha(red, 0.4), color: 'rgba(255,255,255,0.6)' },
              }}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
}