// app/blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Pagination,
  Skeleton,
  useTheme,
  alpha,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import {
  Search,
  CalendarToday,
  Person,
  ArrowForward,
  Category as CategoryIcon,
  TrendingUp,
  Visibility
} from '@mui/icons-material';
import Link from 'next/link';
import { format } from 'date-fns';

export default function BlogPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1
  });
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    page: 1
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [filters.page, filters.category, filters.search]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/blog/category');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const res = await fetch(`/api/blog/posts?${params}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      py: 6
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(45deg, #4285f4, #34a853)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            AccuManage Blog
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Insights, tutorials, and updates to help you manage your business better
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
          }}
        >
          <form onSubmit={handleSearch}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                placeholder="Search articles..."
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
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.slug}>
                      {cat.name} ({cat.count})
                    </MenuItem>
                  ))}
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
        </Paper>

        {/* Featured Post */}
        {!loading && posts.length > 0 && posts[0]?.featured && (
          <Card 
            elevation={0}
            sx={{ 
              mb: 4, 
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  height="300"
                  image={posts[0].coverImage || '/images/blog-placeholder.jpg'}
                  alt={posts[0].title}
                  sx={{ objectFit: 'cover', height: '100%' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent sx={{ p: 4 }}>
                  <Chip
                    label="Featured"
                    size="small"
                    sx={{
                      backgroundColor: alpha('#fbbc04', 0.1),
                      color: '#fbbc04',
                      mb: 2
                    }}
                  />
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {posts[0].title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {posts[0].excerpt}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(posts[0].publishedAt), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Person fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {posts[0].author?.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Visibility fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {posts[0].views} views
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    component={Link}
                    href={`/blog/${posts[0].slug}`}
                    endIcon={<ArrowForward />}
                    variant="contained"
                  >
                    Read More
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <Grid container spacing={3}>
          {loading ? (
            // Loading Skeletons
            [...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ borderRadius: '12px' }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                    <Skeleton width="80%" />
                    <Skeleton width="100%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : posts.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No posts found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            </Grid>
          ) : (
            posts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card 
                  elevation={0}
                  sx={{ 
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {post.coverImage && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={post.coverImage}
                      alt={post.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={post.category?.name}
                        size="small"
                        sx={{
                          backgroundColor: alpha('#4285f4', 0.1),
                          color: '#4285f4'
                        }}
                      />
                      {post.featured && (
                        <Chip
                          label="Featured"
                          size="small"
                          sx={{
                            backgroundColor: alpha('#fbbc04', 0.1),
                            color: '#fbbc04'
                          }}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {post.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {post.excerpt?.substring(0, 100)}...
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={post.author?.avatar}
                          sx={{ width: 24, height: 24 }}
                        >
                          {post.author?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {post.author?.name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {post.readTime} min read
                      </Typography>
                    </Stack>
                  </CardContent>
                  <Button
                    component={Link}
                    href={`/blog/${post.slug}`}
                    sx={{ m: 2, mt: 0 }}
                  >
                    Read More
                  </Button>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={pagination.totalPages}
              page={filters.page}
              onChange={(e, page) => setFilters({ ...filters, page })}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}