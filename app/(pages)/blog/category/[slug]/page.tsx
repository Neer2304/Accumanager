// app/blog/category/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  CalendarToday,
  Person,
  ArrowForward,
  Category as CategoryIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { format } from 'date-fns';

export default function CategoryPage() {
  const params = useParams();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const categorySlug = params.slug as string;
  
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    fetchPosts();
  }, [categorySlug, pagination.page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        category: categorySlug
      });

      const res = await fetch(`/api/blog/posts?${params}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
        
        // Get category info from first post
        if (data.data.posts.length > 0) {
          setCategory(data.data.posts[0].category);
        }
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      py: 6
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Chip
            icon={<CategoryIcon />}
            label={category?.name || 'Loading...'}
            sx={{
              backgroundColor: alpha('#4285f4', 0.1),
              color: '#4285f4',
              mb: 2,
              px: 2,
              py: 1,
              fontSize: '1rem'
            }}
          />
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}
          >
            {category?.name || 'Category'}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {category?.description || `Browse all articles in ${category?.name || 'this category'}`}
          </Typography>
        </Box>

        {/* Posts Grid */}
        <Grid container spacing={3}>
          {loading ? (
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
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No posts found in this category
                </Typography>
                <Button
                  component={Link}
                  href="/blog"
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Browse All Posts
                </Button>
              </Paper>
            </Grid>
          ) : (
            posts.map((post) => (
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
                    endIcon={<ArrowForward />}
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
              page={pagination.page}
              onChange={(e, page) => setPagination({ ...pagination, page })}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}