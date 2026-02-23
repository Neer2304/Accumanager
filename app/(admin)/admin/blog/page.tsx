// app/admin/blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  Article,
  Category,
  TrendingUp,
  Visibility,
  Add,
  Edit,
  Delete,
  MoreVert,
  PublishedWithChanges,
  Drafts,
  BarChart,
  People,
  ThumbUp,
  CalendarToday,
  Link as LinkIcon,
  Refresh
} from '@mui/icons-material';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminBlogDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [stats, setStats] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch posts
      const postsRes = await fetch('/api/admin/blog/posts?limit=5');
      const postsData = await postsRes.json();
      
      // Fetch categories
      const categoriesRes = await fetch('/api/admin/blog/categories');
      const categoriesData = await categoriesRes.json();

      if (postsData.success && categoriesData.success) {
        const posts = postsData.data.posts || [];
        setRecentPosts(posts);
        
        setStats({
          totalPosts: postsData.data.pagination?.total || 0,
          publishedPosts: posts.filter((p: any) => p.published).length,
          draftPosts: posts.filter((p: any) => !p.published).length,
          totalCategories: categoriesData.data.length,
          totalViews: posts.reduce((sum: number, p: any) => sum + (p.views || 0), 0),
          totalLikes: posts.reduce((sum: number, p: any) => sum + (p.likes || 0), 0)
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      icon: <Article />,
      color: '#4285f4',
      bgColor: alpha('#4285f4', 0.1)
    },
    {
      title: 'Published',
      value: stats?.publishedPosts || 0,
      icon: <PublishedWithChanges />,
      color: '#34a853',
      bgColor: alpha('#34a853', 0.1)
    },
    {
      title: 'Drafts',
      value: stats?.draftPosts || 0,
      icon: <Drafts />,
      color: '#fbbc04',
      bgColor: alpha('#fbbc04', 0.1)
    },
    {
      title: 'Categories',
      value: stats?.totalCategories || 0,
      icon: <Category />,
      color: '#ea4335',
      bgColor: alpha('#ea4335', 0.1)
    },
    {
      title: 'Total Views',
      value: stats?.totalViews?.toLocaleString() || '0',
      icon: <Visibility />,
      color: '#8ab4f8',
      bgColor: alpha('#8ab4f8', 0.1)
    },
    {
      title: 'Total Likes',
      value: stats?.totalLikes?.toLocaleString() || '0',
      icon: <ThumbUp />,
      color: '#34a853',
      bgColor: alpha('#34a853', 0.1)
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          pb: 2,
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Blog Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your blog posts, categories, and analytics
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchDashboardData}
            >
              Refresh
            </Button>
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
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: stat.bgColor,
                      color: stat.color
                    }}>
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Posts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Posts
                  </Typography>
                  <Button
                    component={Link}
                    href="/admin/blog/posts"
                    size="small"
                  >
                    View All
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Views</TableCell>
                        <TableCell>Likes</TableCell>
                        <TableCell>Published</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentPosts.map((post) => (
                        <TableRow key={post.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {post.coverImage ? (
                                <Avatar src={post.coverImage} variant="rounded" sx={{ width: 40, height: 40 }} />
                              ) : (
                                <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: '#4285f4' }}>
                                  <Article fontSize="small" />
                                </Avatar>
                              )}
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {post.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {post.category?.name}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
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
                              component={Link}
                              href={`/admin/blog/posts/${post.id}/edit`}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ 
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Add />}
                      component={Link}
                      href="/admin/blog/posts/create"
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Create New Post
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Category />}
                      component={Link}
                      href="/admin/blog/categories"
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Manage Categories
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Visibility />}
                      component={Link}
                      href="/blog"
                      target="_blank"
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      View Public Blog
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ 
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Blog Tips
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: alpha('#4285f4', 0.1), color: '#4285f4' }}>
                        1
                      </Avatar>
                      <Typography variant="body2">
                        Use engaging titles to attract readers
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: alpha('#34a853', 0.1), color: '#34a853' }}>
                        2
                      </Avatar>
                      <Typography variant="body2">
                        Add featured images to every post
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: alpha('#fbbc04', 0.1), color: '#fbbc04' }}>
                        3
                      </Avatar>
                      <Typography variant="body2">
                        Use categories to organize content
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: alpha('#ea4335', 0.1), color: '#ea4335' }}>
                        4
                      </Avatar>
                      <Typography variant="body2">
                        Write meta descriptions for SEO
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}