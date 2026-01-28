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
      case 'questions': return 'primary';
      case 'announcements': return 'secondary';
      case 'feedback': return 'info';
      case 'ideas': return 'success';
      case 'help': return 'warning';
      default: return 'default';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'questions': return <PersonIcon fontSize="small" />;
      case 'announcements': return <NewIcon fontSize="small" />;
      case 'feedback': return <ChatBubbleOutline fontSize="small" />;
      case 'ideas': return <Whatshot fontSize="small" />;
      case 'help': return <HelpOutline fontSize="small" />;
      default: return <ForumIcon fontSize="small" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ForumIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Discussions
              </Typography>
              <Typography color="text.secondary" variant="body2">
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
              fontWeight: 600,
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
              bgcolor: alpha('#2196f3', 0.08),
              border: '1px solid',
              borderColor: alpha('#2196f3', 0.2),
            }}>
              <Typography variant="h5" fontWeight={800} color="primary" align="center">
                {stats.totalPosts || posts.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center">
                Discussions
              </Typography>
            </Paper>
            <Paper sx={{ 
              p: 2, 
              minWidth: 100,
              borderRadius: 2,
              bgcolor: alpha('#9c27b0', 0.08),
              border: '1px solid',
              borderColor: alpha('#9c27b0', 0.2),
            }}>
              <Typography variant="h5" fontWeight={800} color="secondary" align="center">
                {stats.totalComments || posts.reduce((acc, post) => acc + (post.commentCount || 0), 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center">
                Comments
              </Typography>
            </Paper>
            <Paper sx={{ 
              p: 2, 
              minWidth: 100,
              borderRadius: 2,
              bgcolor: alpha('#00bcd4', 0.08),
              border: '1px solid',
              borderColor: alpha('#00bcd4', 0.2),
            }}>
              <Typography variant="h5" fontWeight={800} color="info.main" align="center">
                {stats.totalLikes || posts.reduce((acc, post) => acc + (post.likeCount || 0), 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center">
                Likes
              </Typography>
            </Paper>
            <Paper sx={{ 
              p: 2, 
              minWidth: 100,
              borderRadius: 2,
              bgcolor: alpha('#4caf50', 0.08),
              border: '1px solid',
              borderColor: alpha('#4caf50', 0.2),
            }}>
              <Typography variant="h5" fontWeight={800} color="success.main" align="center">
                {posts.filter(p => p.isSolved).length}
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center">
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
        bgcolor: alpha('#000', 0.02),
        border: '1px solid',
        borderColor: 'divider',
      }}>
        <TextField
          fullWidth
          placeholder="Search discussions, topics, or users..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: 'background.paper',
            }
          }}
          sx={{ mb: 2 }}
        />

        {/* Sort and Filter Row */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Sort by:
          </Typography>
          {sortOptions.map((option) => (
            <Chip
              key={option.id}
              label={option.label}
              icon={option.icon}
              clickable
              size="small"
              color={sortBy === option.id ? 'primary' : 'default'}
              variant={sortBy === option.id ? 'filled' : 'outlined'}
              onClick={() => setSortBy(option.id as any)}
              sx={{ borderRadius: 1 }}
            />
          ))}
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Filter:
          </Typography>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.label}
              icon={category.icon}
              clickable
              size="small"
              color={selectedCategory === category.id ? 'primary' : 'default'}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              onClick={() => setSelectedCategory(category.id)}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* No Posts State */}
      {!loading && !error && filteredPosts.length === 0 && (
        <Paper sx={{ 
          p: 8, 
          textAlign: 'center', 
          borderRadius: 3,
          bgcolor: alpha('#000', 0.02),
        }}>
          <ForumIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            No discussions yet
          </Typography>
          <Typography color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
            {searchQuery || selectedCategory !== 'all'
              ? 'No discussions match your search criteria. Try adjusting your filters.'
              : 'Be the first to start a discussion and help build our community!'}
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/community/create"
            startIcon={<SendIcon />}
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
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
            bgcolor: alpha('#2196f3', 0.05),
          }}>
            <Typography variant="body1" fontWeight={600}>
              <span style={{ color: 'primary.main' }}>{filteredPosts.length}</span> discussions found
              {searchQuery && ` for "${searchQuery}"`}
            </Typography>
            {selectedCategory !== 'all' && (
              <Chip
                label={`Category: ${selectedCategory}`}
                size="small"
                color="primary"
                variant="outlined"
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
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  bgcolor: post.isSolved ? alpha('#4caf50', 0.03) : 'background.paper',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    borderColor: 'primary.light',
                  },
                  '&::before': post.isSolved ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: 'success.main',
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
                          borderColor: 'background.paper',
                          boxShadow: 1,
                        }}
                      >
                        {post.author?.name?.charAt(0) || <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {post.author?.name || 'Anonymous'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
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
                          color={getCategoryColor(post.category)}
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      )}
                      {post.isSolved && (
                        <Chip
                          label="Solved"
                          size="small"
                          color="success"
                          icon={<SolvedIcon />}
                          sx={{ borderRadius: 1 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Title and Content */}
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ lineHeight: 1.3 }}>
                    {post.title}
                  </Typography>

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.6,
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
                            borderColor: alpha('#000', 0.1),
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
                    borderColor: 'divider',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FavoriteIcon fontSize="small" sx={{ color: 'error.main' }} />
                        <Typography variant="body2" fontWeight={500}>
                          {post.likeCount || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CommentIcon fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight={500}>
                          {post.commentCount || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BookmarkBorderIcon fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight={500}>
                          {post.bookmarkCount || 0}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Last activity: {formatDate(post.lastActivityAt || post.createdAt)}
                      </Typography>
                      {(post.commentCount || 0) > 0 && (
                        <Box sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 'primary.main',
                          color: 'white',
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
                sx={{ borderRadius: 2, px: 4 }}
              >
                Load More Discussions
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}

// Add missing icon imports
