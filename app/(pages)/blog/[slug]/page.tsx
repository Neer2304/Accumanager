// app/blog/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Chip,
  Avatar,
  Button,
  Divider,
  Stack,
  Skeleton,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Grid,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Visibility,
  ThumbUp,
  Share,
  Facebook,
  Twitter,
  LinkedIn,
  Link as LinkIcon,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import Link from 'next/link';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export default function SingleBlogPostPage() {
  const params = useParams();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const slug = params.slug as string;
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog/${slug}`);
      const data = await res.json();

      if (data.success) {
        setPost(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        py: 6
      }}>
        <Container maxWidth="md">
          <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={30} width="60%" sx={{ mb: 4 }} />
          <Skeleton variant="rectangular" height={400} sx={{ mb: 4 }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} width="80%" />
        </Container>
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        py: 6
      }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              {error || 'Post not found'}
            </Typography>
            <Button
              component={Link}
              href="/blog"
              startIcon={<ArrowBack />}
              sx={{ mt: 2 }}
            >
              Back to Blog
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      py: 6
    }}>
      <Container maxWidth="md">
        {/* Back Button */}
        <Button
          component={Link}
          href="/blog"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
        >
          Back to Blog
        </Button>

        {/* Category */}
        <Chip
          label={post.category?.name}
          sx={{
            backgroundColor: alpha('#4285f4', 0.1),
            color: '#4285f4',
            mb: 2
          }}
        />

        {/* Title */}
        <Typography 
          variant="h2" 
          fontWeight="bold" 
          gutterBottom
          sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
        >
          {post.title}
        </Typography>

        {/* Author Info */}
        <Stack 
          direction="row" 
          spacing={3} 
          sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={post.author?.avatar}>
              {post.author?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {post.author?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {post.author?.role}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {post.views} views
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThumbUp fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {post.likes} likes
            </Typography>
          </Box>
        </Stack>

        {/* Cover Image */}
        {post.coverImage && (
          <Box sx={{ mb: 4 }}>
            <img
              src={post.coverImage}
              alt={post.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '12px'
              }}
            />
          </Box>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
            {post.tags.map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        )}

        {/* Content */}
        <Box 
          className="blog-content"
          sx={{ 
            mb: 6,
            '& h1': { fontSize: '2rem', fontWeight: 'bold', mt: 4, mb: 2 },
            '& h2': { fontSize: '1.75rem', fontWeight: 'bold', mt: 3, mb: 2 },
            '& h3': { fontSize: '1.5rem', fontWeight: 'bold', mt: 3, mb: 2 },
            '& p': { fontSize: '1.1rem', lineHeight: 1.8, mb: 2 },
            '& ul, & ol': { mb: 2, pl: 3 },
            '& li': { fontSize: '1.1rem', lineHeight: 1.8, mb: 1 },
            '& img': { maxWidth: '100%', height: 'auto', borderRadius: '8px', my: 2 },
            '& blockquote': {
              borderLeft: `4px solid ${darkMode ? '#8ab4f8' : '#4285f4'}`,
              pl: 2,
              py: 1,
              my: 2,
              backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
              borderRadius: '0 8px 8px 0'
            },
            '& pre': {
              backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
              p: 2,
              borderRadius: '8px',
              overflow: 'auto'
            },
            '& code': {
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }
          }}
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </Box>

        {/* Share Buttons */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#303134' : '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Share this article
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Share on Facebook">
              <IconButton 
                onClick={() => handleShare('facebook')}
                sx={{ color: '#1877f2' }}
              >
                <Facebook />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share on Twitter">
              <IconButton 
                onClick={() => handleShare('twitter')}
                sx={{ color: '#1da1f2' }}
              >
                <Twitter />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share on LinkedIn">
              <IconButton 
                onClick={() => handleShare('linkedin')}
                sx={{ color: '#0a66c2' }}
              >
                <LinkedIn />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy link">
              <IconButton 
                onClick={() => handleShare('copy')}
                sx={{ color: 'text.secondary' }}
              >
                <LinkIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Related Articles
            </Typography>
            <Grid container spacing={3}>
              {post.relatedPosts.map((related: any) => (
                <Grid item xs={12} sm={6} md={4} key={related.id}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    {related.coverImage && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={related.coverImage}
                        alt={related.title}
                      />
                    )}
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {related.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {related.excerpt?.substring(0, 60)}...
                      </Typography>
                      <Button
                        component={Link}
                        href={`/blog/${related.slug}`}
                        size="small"
                        endIcon={<ArrowForward />}
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}