// app/community/discussions/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  alpha,
  useTheme,
  IconButton,
  InputBase,
  Drawer,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Forum as ForumIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Person as PersonIcon,
  Send as SendIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  TrendingUp as TrendingIcon,
  Whatshot as HotIcon,
  NewReleases as NewIcon,
  CheckCircle as SolvedIcon,
  MoreVert as MoreIcon,
  Whatshot,
  ChatBubbleOutline,
} from '@mui/icons-material';
import Link from 'next/link';
import { useCommunity } from '@/hooks/useCommunity';
import { PostType } from '@/types/community';

export default function DiscussionsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const { posts, fetchPosts, loading, error, stats } = useCommunity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  const categories = [
    { id: 'all', label: 'All', icon: <ForumIcon sx={{ fontSize: 16 }} /> },
    { id: 'questions', label: 'Questions', icon: <PersonIcon sx={{ fontSize: 16 }} /> },
    { id: 'ideas', label: 'Ideas', icon: <Whatshot sx={{ fontSize: 16 }} /> },
    { id: 'help', label: 'Help', icon: <ChatBubbleOutline sx={{ fontSize: 16 }} /> },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest', icon: <NewIcon sx={{ fontSize: 16 }} /> },
    { id: 'popular', label: 'Popular', icon: <TrendingIcon sx={{ fontSize: 16 }} /> },
  ];

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    let result = [...posts];

    if (selectedCategory !== 'all') {
      result = result.filter(post => 
        post.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.author?.name?.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      result.sort((a, b) => ((b.likeCount || 0) + (b.commentCount || 0)) - ((a.likeCount || 0) + (a.commentCount || 0)));
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'questions': return '#4285f4';
      case 'ideas': return '#34a853';
      case 'help': return '#f57c00';
      default: return darkMode ? '#5f6368' : '#5f6368';
    }
  };

  const FilterContent = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
        <Typography fontWeight={600}>Filters</Typography>
        <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1, display: 'block' }}>Sort by</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {sortOptions.map((option) => (
          <Chip
            key={option.id}
            label={option.label}
            icon={option.icon}
            size="small"
            onClick={() => setSortBy(option.id as any)}
            sx={{
              bgcolor: sortBy === option.id ? '#4285f4' : 'transparent',
              color: sortBy === option.id ? '#fff' : (darkMode ? '#e8eaed' : '#202124'),
              border: `1px solid ${sortBy === option.id ? '#4285f4' : (darkMode ? '#3c4043' : '#dadce0')}`,
            }}
          />
        ))}
      </Stack>

      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1, display: 'block' }}>Category</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.label}
            icon={category.icon}
            size="small"
            onClick={() => setSelectedCategory(category.id)}
            sx={{
              bgcolor: selectedCategory === category.id ? '#4285f4' : 'transparent',
              color: selectedCategory === category.id ? '#fff' : (darkMode ? '#e8eaed' : '#202124'),
              border: `1px solid ${selectedCategory === category.id ? '#4285f4' : (darkMode ? '#3c4043' : '#dadce0')}`,
            }}
          />
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? '#202124' : '#f8f9fa' }}>
      {/* Sticky Header */}
      <Box sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: darkMode ? '#202124' : '#ffffff',
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        py: 2,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => window.history.back()} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              <ArrowBackIcon />
            </IconButton>
            
            <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Discussions
            </Typography>
            
            <Box sx={{ flex: 1, maxWidth: { xs: '100%', sm: 300 }, ml: 'auto' }}>
              <Paper sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: 2, bgcolor: darkMode ? '#303134' : '#f8f9fa' }}>
                <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 18 }} />
                <InputBase
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
                />
              </Paper>
            </Box>

            <Button
              variant="contained"
              component={Link}
              href="/community/create"
              startIcon={<SendIcon />}
              size="small"
              sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#4285f4', whiteSpace: 'nowrap' }}
            >
              New Post
            </Button>

            <IconButton onClick={() => setMobileFilterOpen(true)} sx={{ display: { xs: 'flex', md: 'none' } }}>
              <FilterIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Desktop Filters */}
        <Paper sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Sort:</Typography>
            {sortOptions.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                size="small"
                onClick={() => setSortBy(option.id as any)}
                sx={{
                  bgcolor: sortBy === option.id ? '#4285f4' : 'transparent',
                  color: sortBy === option.id ? '#fff' : (darkMode ? '#e8eaed' : '#202124'),
                }}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Filter:</Typography>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.label}
                size="small"
                onClick={() => setSelectedCategory(category.id)}
                sx={{
                  bgcolor: selectedCategory === category.id ? '#4285f4' : 'transparent',
                  color: selectedCategory === category.id ? '#fff' : (darkMode ? '#e8eaed' : '#202124'),
                }}
              />
            ))}
          </Stack>
        </Paper>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        )}

        {/* Error */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPosts.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <ForumIcon sx={{ fontSize: 60, color: darkMode ? '#5f6368' : '#9aa0a6', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" gutterBottom>No discussions found</Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}>
              {searchQuery ? 'Try a different search term' : 'Be the first to start a discussion'}
            </Typography>
            <Button component={Link} href="/community/create" variant="contained" startIcon={<SendIcon />}>
              Start Discussion
            </Button>
          </Paper>
        )}

        {/* Discussions List */}
        {!loading && filteredPosts.length > 0 && (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {filteredPosts.length} {filteredPosts.length === 1 ? 'discussion' : 'discussions'}
              </Typography>
              {selectedCategory !== 'all' && (
                <Chip label={selectedCategory} size="small" onDelete={() => setSelectedCategory('all')} />
              )}
              {searchQuery && (
                <Chip label={`Search: ${searchQuery}`} size="small" onDelete={() => setSearchQuery('')} />
              )}
            </Box>

            <Stack spacing={2}>
              {filteredPosts.map((post) => (
                <Card 
                  key={post._id}
                  component={Link}
                  href={`/community/post/${post._id}`}
                  sx={{ 
                    textDecoration: 'none',
                    borderRadius: 2,
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    transition: 'all 0.2s',
                    bgcolor: darkMode ? '#202124' : '#ffffff',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                      borderColor: '#4285f4',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
                      <Avatar src={post.author?.avatar} sx={{ width: 36, height: 36, bgcolor: '#4285f4' }}>
                        {post.author?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {post.author?.name || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            • {formatDate(post.createdAt)}
                          </Typography>
                          {post.category && (
                            <Chip 
                              label={post.category} 
                              size="small" 
                              sx={{ 
                                height: 20, 
                                fontSize: '0.65rem',
                                bgcolor: alpha(getCategoryColor(post.category), 0.1),
                                color: getCategoryColor(post.category),
                              }} 
                            />
                          )}
                          {post.isSolved && (
                            <Chip 
                              label="Solved" 
                              size="small" 
                              icon={<SolvedIcon sx={{ fontSize: 12 }} />}
                              sx={{ height: 20, fontSize: '0.65rem', bgcolor: alpha('#34a853', 0.1), color: '#34a853' }} 
                            />
                          )}
                        </Box>
                        <Typography variant="body1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 0.5 }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.excerpt || post.content?.substring(0, 150)}...
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 1, borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FavoriteIcon sx={{ fontSize: 14, color: '#ea4335' }} />
                        <Typography variant="caption">{post.likeCount || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CommentIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="caption">{post.commentCount || 0}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer anchor="bottom" open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)}>
        <FilterContent />
      </Drawer>
    </Box>
  );
}