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
  useTheme,
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
  Groups as GroupsIcon,
  TrendingUp as TrendingIcon,
  Forum as ForumIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useCommunity } from '@/hooks/useCommunity';
import { PostType } from '@/types/community';

export default function BookmarksPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
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
      case 'questions': return '#4285f4';
      case 'announcements': return '#9c27b0';
      case 'feedback': return '#00bcd4';
      case 'ideas': return '#34a853';
      case 'help': return '#f57c00';
      default: return darkMode ? '#5f6368' : '#5f6368';
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
          <Button
            component={Link}
            href="/community"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              mb: 3,
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
              },
            }}
          >
            Back to Community
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
            }}>
              <BookmarkIcon sx={{ 
                fontSize: { xs: 32, md: 40 }, 
                color: '#4285f4',
              }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                My Bookmarks
              </Typography>
              <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} variant="body1">
                Posts you've saved for later
              </Typography>
            </Box>
          </Box>

          {/* Stats - Replaced Grid with flexbox */}
          <Paper sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 3,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
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
                <Typography variant="h4" fontWeight={500} color="#4285f4">
                  {bookmarkedPosts.length}
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Total Bookmarks
                </Typography>
              </Box>
              <Box sx={{ 
                flex: '1 1 120px', 
                minWidth: 120,
                textAlign: 'center',
                p: 1
              }}>
                <Typography variant="h4" fontWeight={500} color="#9c27b0">
                  {bookmarkedPosts.filter(p => p.isSolved).length}
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Solved Posts
                </Typography>
              </Box>
              <Box sx={{ 
                flex: '1 1 120px', 
                minWidth: 120,
                textAlign: 'center',
                p: 1
              }}>
                <Typography variant="h4" fontWeight={500} color="#34a853">
                  {bookmarkedPosts.reduce((acc, post) => acc + (post.likeCount || 0), 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Total Likes
                </Typography>
              </Box>
              <Box sx={{ 
                flex: '1 1 120px', 
                minWidth: 120,
                textAlign: 'center',
                p: 1
              }}>
                <Typography variant="h4" fontWeight={500} color="#00bcd4">
                  {bookmarkedPosts.reduce((acc, post) => acc + (post.commentCount || 0), 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Total Comments
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Loading State */}
        {(loading || localLoading) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        )}

        {/* Error State */}
        {(error || localError) && !loading && !localLoading && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? '#3c1e1e' : '#fdecea',
            }}
          >
            {error || localError}
          </Alert>
        )}

        {/* No Bookmarks State */}
        {!loading && !localLoading && bookmarkedPosts.length === 0 && (
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 3,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <BookmarkBorderIcon sx={{ 
              fontSize: 80, 
              color: darkMode ? '#5f6368' : '#9aa0a6', 
              mb: 2, 
              opacity: 0.5 
            }} />
            <Typography variant="h5" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              No bookmarks yet
            </Typography>
            <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph>
              When you find posts you want to save for later, click the bookmark icon to add them here.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/community"
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
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Typography variant="body1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                <span style={{ color: '#4285f4' }}>{bookmarkedPosts.length}</span> bookmarked posts
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  if (confirm('Clear all bookmarks? This action cannot be undone.')) {
                    // TODO: Implement bulk bookmark removal
                    setBookmarkedPosts([]);
                  }
                }}
                disabled={bookmarkedPosts.length === 0}
                sx={{
                  color: '#ea4335',
                  borderColor: '#ea4335',
                  '&:hover': {
                    backgroundColor: alpha('#ea4335', darkMode ? 0.1 : 0.05),
                    borderColor: '#ea4335',
                  },
                }}
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
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode 
                        ? '0 8px 25px rgba(0,0,0,0.3)' 
                        : '0 8px 25px rgba(0,0,0,0.1)',
                      borderColor: '#4285f4',
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimeIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
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
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      gutterBottom
                      component={Link}
                      href={`/community/post/${post._id}`}
                      sx={{
                        color: darkMode ? '#e8eaed' : '#202124',
                        textDecoration: 'none',
                        '&:hover': {
                          color: '#4285f4',
                        },
                        display: 'block',
                      }}
                    >
                      {post.title}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.6,
                        color: darkMode ? '#9aa0a6' : '#5f6368',
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
                              borderColor: darkMode ? '#3c4043' : '#dadce0',
                              color: darkMode ? '#9aa0a6' : '#5f6368',
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
                          <BookmarkIcon fontSize="small" sx={{ color: '#4285f4' }} />
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {post.bookmarkCount || 0}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveBookmark(post._id)}
                          sx={{ 
                            color: '#ea4335',
                            '&:hover': {
                              backgroundColor: alpha('#ea4335', darkMode ? 0.1 : 0.05),
                            },
                          }}
                          title="Remove bookmark"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/community/post/${post._id}`}
                          sx={{
                            color: '#4285f4',
                            '&:hover': {
                              backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                            },
                          }}
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
                <BookmarkIcon sx={{ fontSize: 64, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }} gutterBottom>
                  All bookmarks cleared
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}>
                  Your bookmarks list is now empty
                </Typography>
                <Button
                  variant="outlined"
                  component={Link}
                  href="/community"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: '#4285f4',
                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    },
                  }}
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
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <BookmarkIcon sx={{ color: '#4285f4' }} />
              <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Tips for Managing Bookmarks
              </Typography>
            </Box>
            <Divider sx={{ my: 2, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'space-between'
            }}>
              <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  📌 Organize by Category
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Bookmark posts by categories like "Tutorials", "Questions", or "Inspiration" for easy reference.
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  🔄 Review Regularly
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Periodically review your bookmarks and remove posts you no longer need to keep your list relevant.
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  💬 Engage with Bookmarks
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Revisit bookmarked posts to add comments, ask follow-up questions, or share with others.
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
