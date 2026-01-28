// app/community/bookmarks/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  alpha,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useCommunity } from '@/hooks/useCommunity';
import { PostType } from '@/types/community';

export default function BookmarksPage() {
  const { toggleBookmark, loading, error } = useCommunity();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostType[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // Custom function to fetch bookmarks since it doesn't exist in useCommunity
  const fetchUserBookmarks = async () => {
    try {
      const response = await fetch('/api/community/bookmarks', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        return data.data || [];
      } else {
        throw new Error(data.message || 'Failed to fetch bookmarks');
      }
    } catch (err) {
      console.error('Fetch bookmarks error:', err);
      throw err;
    }
  };

  // Fetch bookmarked posts
  const loadBookmarks = async () => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      const posts = await fetchUserBookmarks();
      setBookmarkedPosts(posts || []);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
      setLocalError(err instanceof Error ? err.message : 'Failed to load bookmarks');
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  // Handle remove bookmark
  const handleRemoveBookmark = async (postId: string) => {
    try {
      await toggleBookmark(postId);
      // Remove from local state
      setBookmarkedPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
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
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
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

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/community"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Community
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <BookmarkIcon sx={{ 
            fontSize: { xs: 40, md: 48 }, 
            color: 'primary.main' 
          }} />
          <Box>
            <Typography variant="h4" fontWeight={800}>
              My Bookmarks
            </Typography>
            <Typography color="text.secondary" variant="body1">
              Posts you've saved for later
            </Typography>
          </Box>
        </Box>

        {/* Stats - Replaced Grid with flexbox */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 3,
          bgcolor: alpha('#1976d2', 0.05),
          border: '1px solid',
          borderColor: alpha('#1976d2', 0.1),
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 2,
          }}>
            <Box sx={{ 
              flex: '1 1 120px', 
              minWidth: 120,
              textAlign: 'center',
              p: 1
            }}>
              <Typography variant="h4" fontWeight={800} color="primary">
                {bookmarkedPosts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Bookmarks
              </Typography>
            </Box>
            <Box sx={{ 
              flex: '1 1 120px', 
              minWidth: 120,
              textAlign: 'center',
              p: 1
            }}>
              <Typography variant="h4" fontWeight={800} color="secondary">
                {bookmarkedPosts.filter(p => p.isSolved).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Solved Posts
              </Typography>
            </Box>
            <Box sx={{ 
              flex: '1 1 120px', 
              minWidth: 120,
              textAlign: 'center',
              p: 1
            }}>
              <Typography variant="h4" fontWeight={800} color="success.main">
                {bookmarkedPosts.reduce((acc, post) => acc + (post.likeCount || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Likes
              </Typography>
            </Box>
            <Box sx={{ 
              flex: '1 1 120px', 
              minWidth: 120,
              textAlign: 'center',
              p: 1
            }}>
              <Typography variant="h4" fontWeight={800} color="info.main">
                {bookmarkedPosts.reduce((acc, post) => acc + (post.commentCount || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Comments
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Loading State */}
      {(loading || localLoading) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {(error || localError) && !loading && !localLoading && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error || localError}
        </Alert>
      )}

      {/* No Bookmarks State */}
      {!loading && !localLoading && bookmarkedPosts.length === 0 && (
        <Paper sx={{ 
          p: 8, 
          textAlign: 'center', 
          borderRadius: 3,
          bgcolor: alpha('#000', 0.02),
        }}>
          <BookmarkBorderIcon sx={{ 
            fontSize: 80, 
            color: 'text.disabled', 
            mb: 2, 
            opacity: 0.5 
          }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            No bookmarks yet
          </Typography>
          <Typography color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
            When you find posts you want to save for later, click the bookmark icon to add them here.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/community"
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
          >
            Explore Community
          </Button>
        </Paper>
      )}

      {/* Bookmarks Grid */}
      {!loading && !localLoading && bookmarkedPosts.length > 0 && (
        <Box>
          {/* Results Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha('#1976d2', 0.05),
          }}>
            <Typography variant="body1" fontWeight={600}>
              <span style={{ color: 'primary.main' }}>{bookmarkedPosts.length}</span> bookmarked posts
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (confirm('Clear all bookmarks? This action cannot be undone.')) {
                  // TODO: Implement bulk bookmark removal
                  setBookmarkedPosts([]);
                }
              }}
              disabled={bookmarkedPosts.length === 0}
            >
              Clear All
            </Button>
          </Box>

          {/* Posts List - Replaced Grid with flexbox */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {bookmarkedPosts.map((post) => (
              <Card
                key={post._id}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    borderColor: 'primary.light',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 2,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(post.createdAt)} • {post.author?.role || 'Member'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {post.category && (
                        <Chip
                          label={post.category}
                          size="small"
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
                          sx={{ borderRadius: 1 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Title and Content */}
                  <Typography 
                    variant="h6" 
                    fontWeight={700} 
                    gutterBottom
                    component={Link}
                    href={`/community/post/${post._id}`}
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                    }}
                  >
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
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.6,
                    }}
                  >
                    {post.excerpt || post.content?.substring(0, 300)}
                    {post.content && post.content.length > 300 && '...'}
                  </Typography>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                      {post.tags.slice(0, 3).map((tag, index) => (
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
                      {post.tags.length > 3 && (
                        <Chip
                          label={`+${post.tags.length - 3}`}
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
                        <BookmarkIcon fontSize="small" color="primary" />
                        <Typography variant="body2" fontWeight={500}>
                          {post.bookmarkCount || 0}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveBookmark(post._id)}
                        color="error"
                        title="Remove bookmark"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        component={Link}
                        href={`/community/post/${post._id}`}
                        title="View post"
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Empty state after clearing */}
          {bookmarkedPosts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BookmarkIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                All bookmarks cleared
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your bookmarks list is now empty
              </Typography>
              <Button
                variant="outlined"
                component={Link}
                href="/community"
              >
                Browse Community
              </Button>
            </Box>
          )}

          {/* Load More (if paginated) */}
          {bookmarkedPosts.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={loadBookmarks}
                disabled={loading}
                sx={{ borderRadius: 2, px: 4 }}
              >
                {loading ? 'Loading...' : 'Refresh Bookmarks'}
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Tips Section - Replaced Grid with flexbox */}
      {!loading && !localLoading && bookmarkedPosts.length > 0 && (
        <Paper sx={{ 
          p: 3, 
          mt: 4, 
          borderRadius: 3,
          bgcolor: alpha('#4caf50', 0.05),
          border: '1px solid',
          borderColor: alpha('#4caf50', 0.1),
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <BookmarkIcon color="success" />
            <Typography variant="h6" fontWeight={600}>
              Tips for Managing Bookmarks
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'space-between'
          }}>
            <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                📌 Organize by Category
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bookmark posts by categories like "Tutorials", "Questions", or "Inspiration" for easy reference.
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                🔄 Review Regularly
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Periodically review your bookmarks and remove posts you no longer need to keep your list relevant.
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                💬 Engage with Bookmarks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revisit bookmarked posts to add comments, ask follow-up questions, or share with others.
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
}