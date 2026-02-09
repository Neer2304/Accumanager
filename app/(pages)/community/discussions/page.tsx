// app/community/discussions/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Forum as ForumIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Person as PersonIcon,
  Send as SendIcon,
  TrendingUp as TrendingIcon,
  Whatshot as HotIcon,
  NewReleases as NewIcon,
  CheckCircle as SolvedIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useCommunity } from '@/hooks/useCommunity';
import { PostType } from '@/types/community';
import { 
  ChatBubbleOutline, 
  Whatshot, 
  HelpOutline 
} from '@mui/icons-material';

export default function DiscussionsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const { posts, fetchPosts, loading, error, stats } = useCommunity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All', icon: <ForumIcon fontSize="small" /> },
    { id: 'questions', label: 'Questions', icon: <PersonIcon fontSize="small" /> },
    { id: 'announcements', label: 'Announcements', icon: <NewIcon fontSize="small" /> },
    { id: 'feedback', label: 'Feedback', icon: <ChatBubbleOutline fontSize="small" /> },
    { id: 'ideas', label: 'Ideas', icon: <Whatshot fontSize="small" /> },
    { id: 'help', label: 'Help', icon: <HelpOutline fontSize="small" /> },
  ];

  // Sort options
  const sortOptions = [
    { id: 'newest', label: 'Newest', icon: <NewIcon fontSize="small" /> },
    { id: 'popular', label: 'Most Popular', icon: <TrendingIcon fontSize="small" /> },
    { id: 'trending', label: 'Trending', icon: <Whatshot fontSize="small" /> },
  ];

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter and sort posts
  useEffect(() => {
    let result = posts;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(post => 
        post.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        post.author?.name?.toLowerCase().includes(query)
      );
    }

    // Sort posts
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'popular':
        result.sort((a, b) => 
          ((b.likeCount || 0) + (b.commentCount || 0)) - 
          ((a.likeCount || 0) + (a.commentCount || 0))
        );
        break;
      case 'trending':
        result.sort((a, b) => {
          const aScore = (a.likeCount || 0) * 2 + (a.commentCount || 0);
          const bScore = (b.likeCount || 0) * 2 + (b.commentCount || 0);
          return bScore - aScore;
        });
        break;
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedCategory, sortBy]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'questions': return '#4285f4';
      case 'announcements': return '#9c27b0';
      case 'feedback': return '#00bcd4';
      case 'ideas': return '#34a853';
      case 'help': return '#f57c00';
      default: return darkMode ? '#5f6368' : '#5f6368';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'questions': return <PersonIcon fontSize="small" sx={{ color: '#4285f4' }} />;
      case 'announcements': return <NewIcon fontSize="small" sx={{ color: '#9c27b0' }} />;
      case 'feedback': return <ChatBubbleOutline fontSize="small" sx={{ color: '#00bcd4' }} />;
      case 'ideas': return <Whatshot fontSize="small" sx={{ color: '#34a853' }} />;
      case 'help': return <HelpOutline fontSize="small" sx={{ color: '#f57c00' }} />;
      default: return <ForumIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />;
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff', 
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
              }}>
                <ForumIcon sx={{ 
                  fontSize: { xs: 32, md: 40 }, 
                  color: '#4285f4' 
                }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Discussions
                </Typography>
                <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} variant="body2">
                  Join conversations and share knowledge
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              component={Link}
              href="/community/create"
              startIcon={<SendIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                backgroundColor: '#4285f4',
                '&:hover': {
                  backgroundColor: '#3367d6',
                },
              }}
            >
              New Post
            </Button>
          </Box>

          {/* Quick Stats */}
          {stats && (
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 3,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
              <Paper sx={{ 
                p: 2, 
                minWidth: 100,
                borderRadius: 2,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Typography variant="h5" fontWeight={500} color="#4285f4" align="center">
                  {stats.totalPosts || posts.length}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} align="center">
                  Discussions
                </Typography>
              </Paper>
              <Paper sx={{ 
                p: 2, 
                minWidth: 100,
                borderRadius: 2,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Typography variant="h5" fontWeight={500} color="#9c27b0" align="center">
                  {stats.totalComments || posts.reduce((acc, post) => acc + (post.commentCount || 0), 0)}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} align="center">
                  Comments
                </Typography>
              </Paper>
              <Paper sx={{ 
                p: 2, 
                minWidth: 100,
                borderRadius: 2,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Typography variant="h5" fontWeight={500} color="#00bcd4" align="center">
                  {stats.totalLikes || posts.reduce((acc, post) => acc + (post.likeCount || 0), 0)}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} align="center">
                  Likes
                </Typography>
              </Paper>
              <Paper sx={{ 
                p: 2, 
                minWidth: 100,
                borderRadius: 2,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Typography variant="h5" fontWeight={500} color="#34a853" align="center">
                  {posts.filter(p => p.isSolved).length}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} align="center">
                  Solved
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Search Bar */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          bgcolor: darkMode ? '#303134' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <TextField
            fullWidth
            placeholder="Search discussions, topics, or users..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                bgcolor: darkMode ? '#202124' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4285f4',
                },
              }
            }}
            sx={{ mb: 2 }}
          />

          {/* Sort and Filter Row */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mr: 1 }}>
              Sort by:
            </Typography>
            {sortOptions.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                icon={option.icon}
                clickable
                size="small"
                sx={{
                  borderRadius: 1,
                  backgroundColor: sortBy === option.id 
                    ? alpha('#4285f4', darkMode ? 0.2 : 0.1)
                    : 'transparent',
                  color: sortBy === option.id 
                    ? '#4285f4' 
                    : darkMode ? '#e8eaed' : '#202124',
                  border: `1px solid ${sortBy === option.id ? '#4285f4' : darkMode ? '#3c4043' : '#dadce0'}`,
                  '&:hover': {
                    backgroundColor: alpha('#4285f4', darkMode ? 0.15 : 0.05),
                  },
                }}
                onClick={() => setSortBy(option.id as any)}
              />
            ))}
            <Box sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mr: 1 }}>
              Filter:
            </Typography>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.label}
                icon={category.icon}
                clickable
                size="small"
                sx={{
                  borderRadius: 1,
                  backgroundColor: selectedCategory === category.id 
                    ? alpha('#4285f4', darkMode ? 0.2 : 0.1)
                    : 'transparent',
                  color: selectedCategory === category.id 
                    ? '#4285f4' 
                    : darkMode ? '#e8eaed' : '#202124',
                  border: `1px solid ${selectedCategory === category.id ? '#4285f4' : darkMode ? '#3c4043' : '#dadce0'}`,
                  '&:hover': {
                    backgroundColor: alpha('#4285f4', darkMode ? 0.15 : 0.05),
                  },
                }}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </Box>
        </Paper>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? '#3c1e1e' : '#fdecea',
            }}
          >
            {error}
          </Alert>
        )}

        {/* No Posts State */}
        {!loading && !error && filteredPosts.length === 0 && (
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 3,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <ForumIcon sx={{ fontSize: 80, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              No discussions yet
            </Typography>
            <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
              {searchQuery || selectedCategory !== 'all'
                ? 'No discussions match your search criteria. Try adjusting your filters.'
                : 'Be the first to start a discussion and help build our community!'}
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/community/create"
              startIcon={<SendIcon />}
              sx={{ 
                borderRadius: 2, 
                px: 4, 
                py: 1.5,
                backgroundColor: '#4285f4',
                '&:hover': {
                  backgroundColor: '#3367d6',
                },
              }}
            >
              Start First Discussion
            </Button>
          </Paper>
        )}

        {/* Discussions List */}
        {!loading && filteredPosts.length > 0 && (
          <Box>
            {/* Results Count */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Typography variant="body1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                <span style={{ color: '#4285f4' }}>{filteredPosts.length}</span> discussions found
                {searchQuery && ` for "${searchQuery}"`}
              </Typography>
              {selectedCategory !== 'all' && (
                <Chip
                  label={`Category: ${selectedCategory}`}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    backgroundColor: alpha('#4285f4', 0.1),
                    color: '#4285f4',
                    borderColor: alpha('#4285f4', 0.3),
                  }}
                />
              )}
            </Box>

            {/* Posts List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredPosts.map((post) => (
                <Card 
                  key={post._id}
                  component={Link}
                  href={`/community/post/${post._id}`}
                  sx={{
                    textDecoration: 'none',
                    borderRadius: 3,
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    transition: 'all 0.2s ease',
                    bgcolor: post.isSolved 
                      ? alpha('#34a853', darkMode ? 0.1 : 0.05)
                      : darkMode ? '#202124' : '#ffffff',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode 
                        ? '0 8px 25px rgba(0,0,0,0.3)' 
                        : '0 8px 25px rgba(0,0,0,0.1)',
                      borderColor: '#4285f4',
                    },
                    '&::before': post.isSolved ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      bgcolor: '#34a853',
                    } : {},
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Avatar
                          src={post.author?.avatar}
                          sx={{ 
                            width: 40, 
                            height: 40,
                            border: '2px solid',
                            borderColor: darkMode ? '#303134' : '#ffffff',
                            bgcolor: darkMode ? '#5f6368' : '#4285f4',
                          }}
                        >
                          {post.author?.name?.charAt(0) || <PersonIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {post.author?.name || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {formatDate(post.createdAt)} • {post.author?.role || 'Member'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {post.category && (
                          <Chip
                            label={post.category}
                            size="small"
                            icon={getCategoryIcon(post.category)}
                            sx={{
                              borderRadius: 1,
                              backgroundColor: alpha(getCategoryColor(post.category), 0.1),
                              color: getCategoryColor(post.category),
                              borderColor: alpha(getCategoryColor(post.category), 0.3),
                            }}
                          />
                        )}
                        {post.isSolved && (
                          <Chip
                            label="Solved"
                            size="small"
                            icon={<SolvedIcon />}
                            sx={{
                              borderRadius: 1,
                              backgroundColor: alpha('#34a853', 0.1),
                              color: '#34a853',
                              borderColor: alpha('#34a853', 0.3),
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Title and Content */}
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ 
                      lineHeight: 1.3,
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}>
                      {post.title}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.6,
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      }}
                    >
                      {post.excerpt || post.content?.substring(0, 250)}
                      {post.content && post.content.length > 250 && '...'}
                    </Typography>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        {post.tags.slice(0, 4).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              fontSize: '0.7rem', 
                              borderRadius: 1,
                              borderColor: darkMode ? '#3c4043' : '#dadce0',
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                            }}
                          />
                        ))}
                        {post.tags.length > 4 && (
                          <Chip
                            label={`+${post.tags.length - 4}`}
                            size="small"
                            sx={{ 
                              fontSize: '0.7rem',
                              borderRadius: 1,
                              backgroundColor: alpha('#4285f4', 0.1),
                              color: '#4285f4',
                            }}
                          />
                        )}
                      </Box>
                    )}

                    {/* Stats and Actions */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FavoriteIcon fontSize="small" sx={{ color: '#ea4335' }} />
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {post.likeCount || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CommentIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {post.commentCount || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BookmarkBorderIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {post.bookmarkCount || 0}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Last activity: {formatDate(post.lastActivityAt || post.createdAt)}
                        </Typography>
                        {(post.commentCount || 0) > 0 && (
                          <Box sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: '#4285f4',
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                          }}>
                            Active
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Load More (if needed) */}
            {filteredPosts.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => fetchPosts({ page: 2 })}
                  sx={{ 
                    borderRadius: 2, 
                    px: 4,
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: '#4285f4',
                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    },
                  }}
                >
                  Load More Discussions
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}