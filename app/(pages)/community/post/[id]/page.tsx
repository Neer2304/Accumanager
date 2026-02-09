// app/(pages)/community/post/[id]/page.tsx - UPDATED WITH GOOGLE DESIGN
"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Avatar,
  IconButton,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon,
  Tag as TagIcon,
  Home as HomeIcon,
  Flag as FlagIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/utils/dateUtils';
import { useCommunity } from '@/hooks/useCommunity';

interface Comment {
  _id: string;
  user?: {
    _id: string;
    name?: string;
    avatar?: string;
    role?: string;
  };
  content: string;
  createdAt: string;
  isSolution?: boolean;
  likes?: string[];
  likeCount?: number;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author?: {
    _id: string;
    name?: string;
    avatar?: string;
    role?: string;
    isVerified?: boolean;
  };
  category: string;
  tags: string[];
  likes: string[];
  likeCount: number;
  comments: Comment[];
  commentCount: number;
  views: number;
  isPinned: boolean;
  isSolved: boolean;
  solutionCommentId?: string;
  createdAt: string;
  updatedAt: string;
  bookmarks?: string[];
}

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [commentText, setCommentText] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const {
    post: hookPost,
    loading,
    error,
    fetchPost,
    toggleLike,
    addComment,
    toggleBookmark,
    markAsSolution,
    setError,
  } = useCommunity();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;
        console.log('🔄 Fetching post with ID:', id);
        
        await fetchPost(id);
        
        const token = document.cookie.match(/auth_token=([^;]+)/)?.[1];
        if (token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              setCurrentUserId(payload.userId);
            }
          } catch (e) {
            console.error('Failed to decode token:', e);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, [params, fetchPost]);

  const handleLike = async () => {
    if (!hookPost || !hookPost._id || actionLoading) return;
    
    setActionLoading(true);
    try {
      await toggleLike(hookPost._id);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!hookPost || !hookPost._id || actionLoading) return;
    
    setActionLoading(true);
    try {
      await toggleBookmark(hookPost._id);
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!hookPost || !commentText.trim() || actionLoading) return;
    
    setActionLoading(true);
    try {
      await addComment(hookPost._id, commentText.trim());
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsSolution = async (commentId: string) => {
    if (!hookPost || !hookPost._id || actionLoading) return;
    
    setActionLoading(true);
    try {
      await markAsSolution(hookPost._id, commentId);
    } catch (error) {
      console.error('Failed to mark as solution:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    if (!hookPost) return;
    
    const url = `${window.location.origin}/community/post/${hookPost._id}`;
    if (navigator.share) {
      navigator.share({
        title: hookPost.title,
        text: hookPost.content?.substring(0, 100) || '',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CircularProgress sx={{ color: '#4285f4' }} />
      </Box>
    );
  }

  if (error || !hookPost) {
    return (
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff', 
        minHeight: '100vh',
        py: 4,
      }}>
        <Container maxWidth="lg">
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              bgcolor: darkMode ? '#3c1e1e' : '#fdecea',
            }}
          >
            {error || 'Post not found'}
          </Alert>
          <Button
            component={Link}
            href="/community"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#4285f4',
              '&:hover': {
                backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
              },
            }}
          >
            Back to Community
          </Button>
        </Container>
      </Box>
    );
  }

  const post = hookPost as unknown as Post;
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;
  const isBookmarked = currentUserId 
    ? (post as any).bookmarks?.includes(currentUserId) || false
    : false;

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff', 
      minHeight: '100vh',
      py: 4,
    }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink
            component={Link}
            href="/dashboard"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': { color: darkMode ? '#8ab4f8' : '#4285f4' },
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
            Dashboard
          </MuiLink>
          <MuiLink
            component={Link}
            href="/community"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': { color: darkMode ? '#8ab4f8' : '#4285f4' },
            }}
          >
            Community
          </MuiLink>
          <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Post
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          component={Link}
          href="/community"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            mb: 3,
            color: '#4285f4',
            '&:hover': {
              backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
            },
          }}
        >
          Back to Community
        </Button>

        {/* Post Header */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Stack spacing={2}>
            {/* Category & Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={post.category}
                size="small"
                sx={{
                  bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
                  color: '#4285f4',
                  fontWeight: 600,
                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                }}
                variant="outlined"
              />
              {post.isPinned && (
                <Chip 
                  label="Pinned" 
                  size="small" 
                  sx={{
                    bgcolor: '#fbbc04',
                    color: '#202124',
                    fontWeight: 500,
                  }}
                />
              )}
              {post.isSolved && (
                <Chip
                  label="Solved"
                  size="small"
                  icon={<CheckCircleIcon />}
                  sx={{
                    bgcolor: '#34a853',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>

            {/* Title */}
            <Typography variant="h4" fontWeight={700} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {post.title}
            </Typography>

            {/* Author Info & Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={post.author?.avatar} sx={{ 
                  border: `2px solid ${darkMode ? '#202124' : '#ffffff'}`,
                }}>
                  {post.author?.name?.charAt(0) || 'A'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {post.author?.name || 'Unknown Author'}
                    {post.author?.isVerified && (
                      <CheckCircleIcon 
                        sx={{ 
                          color: '#4285f4', 
                          ml: 0.5,
                          fontSize: 16,
                          verticalAlign: 'middle',
                        }} 
                      />
                    )}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Posted {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={<VisibilityIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />}
                  label={`${post.views} views`}
                  size="small"
                  variant="outlined"
                  sx={{
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </Paper>

        {/* Post Content & Actions */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {/* Post Content */}
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Typography
                variant="body1"
                sx={{ 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: 1.8,
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              >
                {post.content}
              </Typography>

              {/* Tags */}
              {post.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 3 }}>
                  {post.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      icon={<TagIcon fontSize="small" />}
                      variant="outlined"
                      sx={{
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                        color: darkMode ? '#e8eaed' : '#202124',
                        borderColor: darkMode ? '#5f6368' : '#dadce0',
                      }}
                    />
                  ))}
                </Box>
              )}
            </Paper>

            {/* Actions Bar */}
            <Paper sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {/* Like Button - Blue only when liked */}
                <Tooltip title={isLiked ? "Unlike" : "Like"}>
                  <Button
                    startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                    onClick={handleLike}
                    disabled={actionLoading}
                    sx={{
                      color: isLiked ? '#4285f4' : (darkMode ? '#9aa0a6' : '#5f6368'),
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: isLiked ? alpha('#4285f4', darkMode ? 0.1 : 0.05) : undefined,
                      },
                    }}
                  >
                    {post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}
                  </Button>
                </Tooltip>

                {/* Comments Button */}
                <Button
                  startIcon={<CommentIcon />}
                  sx={{ 
                    minWidth: 'auto',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  {post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}
                </Button>

                {/* Bookmark Button - Blue only when bookmarked */}
                <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark"}>
                  <Button
                    startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    onClick={handleBookmark}
                    disabled={actionLoading}
                    sx={{
                      color: isBookmarked ? '#4285f4' : (darkMode ? '#9aa0a6' : '#5f6368'),
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: isBookmarked ? alpha('#4285f4', darkMode ? 0.1 : 0.05) : undefined,
                      },
                    }}
                  >
                    Bookmark
                  </Button>
                </Tooltip>

                {/* Share Button */}
                <Button
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                  sx={{ 
                    ml: 'auto', 
                    minWidth: 'auto',
                    color: '#4285f4',
                    '&:hover': {
                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    },
                  }}
                >
                  Share
                </Button>
              </Box>
            </Paper>

            {/* Comments Section */}
            <Paper sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Comments ({post.commentCount})
              </Typography>

              {/* Add Comment */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  sx={{ mb: 1 }}
                  InputProps={{
                    sx: { 
                      color: darkMode ? '#e8eaed' : '#202124',
                      '& fieldset': {
                        borderColor: darkMode ? '#3c4043' : '#dadce0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4285f4',
                      },
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={actionLoading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : <SendIcon />}
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || actionLoading}
                    sx={{
                      backgroundColor: '#4285f4',
                      '&:hover': {
                        backgroundColor: '#3367d6',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: darkMode ? '#303134' : '#f1f3f4',
                        color: darkMode ? '#5f6368' : '#bdc1c6',
                      },
                    }}
                  >
                    {actionLoading ? 'Posting...' : 'Post Comment'}
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ 
                my: 3, 
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              }} />

              {/* Comments List */}
              {post.comments.length === 0 ? (
                <Alert 
                  severity="info"
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  }}
                >
                  No comments yet. Be the first to comment!
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {post.comments.map((comment) => (
                    <Paper
                      key={comment._id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        borderLeft: comment.isSolution ? '4px solid #34a853' : undefined,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32,
                            border: `1px solid ${darkMode ? '#202124' : '#ffffff'}`,
                          }}>
                            {comment.user?.name?.charAt(0) || 'U'}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {comment.user?.name || 'Unknown User'}
                          </Typography>
                          {comment.isSolution && (
                            <Chip
                              label="Solution"
                              size="small"
                              sx={{
                                bgcolor: '#34a853',
                                color: 'white',
                                fontWeight: 500,
                              }}
                              icon={<CheckCircleIcon sx={{ color: 'white' }} />}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ 
                        mb: 1,
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}>
                        {comment.content}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!post.isSolved && currentUserId === post.author?._id && (
                          <Button
                            size="small"
                            onClick={() => handleMarkAsSolution(comment._id)}
                            sx={{
                              color: '#4285f4',
                              '&:hover': {
                                backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                              },
                            }}
                          >
                            Mark as Solution
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: { xs: '100%', lg: 300 } }}>
            {/* Author Card */}
            <Paper sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Author
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={post.author?.avatar} sx={{ 
                  width: 48, 
                  height: 48,
                  border: `2px solid ${darkMode ? '#202124' : '#ffffff'}`,
                }}>
                  {post.author?.name?.charAt(0) || 'A'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {post.author?.name || 'Unknown Author'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {post.author?.role || 'User'}
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href={`/community/profile/${post.author?._id}`}
                disabled={!post.author?._id}
                sx={{
                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: '#4285f4',
                    backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                  },
                }}
              >
                View Profile
              </Button>
            </Paper>

            {/* Post Info */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 2,
              bgcolor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Post Information
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Created
                  </Typography>
                  <Typography variant="caption" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {formatDate(post.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Last Updated
                  </Typography>
                  <Typography variant="caption" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {formatDate(post.updatedAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Views
                  </Typography>
                  <Typography variant="caption" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {post.views}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Status
                  </Typography>
                  <Typography variant="caption" fontWeight={500} sx={{ 
                    color: post.isSolved ? '#34a853' : (darkMode ? '#e8eaed' : '#202124'),
                  }}>
                    {post.isSolved ? 'Solved' : 'Open'}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}