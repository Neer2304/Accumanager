// app/community/post/[id]/page.tsx
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
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/utils/dateUtils';
import { useCommunity } from '@/hooks/useCommunity';

interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  createdAt: string;
  isSolution?: boolean;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
    role: string;
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
}

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const theme = useTheme();
  const [commentText, setCommentText] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Use the useCommunity hook
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
        
        // Fetch the post using the hook
        await fetchPost(id);
        
        // Get current user ID from localStorage or cookies
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
    if (!hookPost || !hookPost._id) return;
    
    try {
      console.log('❤️ Handling like for post:', hookPost._id);
      await toggleLike(hookPost._id);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleBookmark = async () => {
    if (!hookPost || !hookPost._id) return;
    
    try {
      console.log('🔖 Handling bookmark for post:', hookPost._id);
      await toggleBookmark(hookPost._id);
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!hookPost || !commentText.trim()) return;
    
    try {
      console.log('💬 Submitting comment for post:', hookPost._id);
      await addComment(hookPost._id, commentText.trim());
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleMarkAsSolution = async (commentId: string) => {
    if (!hookPost || !hookPost._id) return;
    
    try {
      console.log('✅ Marking comment as solution:', commentId);
      await markAsSolution(hookPost._id, commentId);
    } catch (error) {
      console.error('Failed to mark as solution:', error);
    }
  };

  const handleShare = () => {
    if (!hookPost) return;
    
    const url = `${window.location.origin}/community/post/${hookPost._id}`;
    if (navigator.share) {
      navigator.share({
        title: hookPost.title,
        text: hookPost.content.substring(0, 100),
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !hookPost) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Post not found'}
        </Alert>
        <Button
          component={Link}
          href="/community"
          startIcon={<ArrowBackIcon />}
        >
          Back to Community
        </Button>
      </Container>
    );
  }

  // Cast hookPost to the Post interface
  const post = hookPost as unknown as Post;
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;
  const isBookmarked = currentUserId 
    ? (post as any).bookmarks?.includes(currentUserId) || false
    : false;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        component={Link}
        href="/community"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Community
      </Button>

      {/* Post Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          {/* Category & Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={post.category}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
              }}
            />
            {post.isPinned && (
              <Chip label="Pinned" size="small" color="warning" />
            )}
            {post.isSolved && (
              <Chip
                label="Solved"
                size="small"
                color="success"
                icon={<CheckCircleIcon />}
              />
            )}
          </Box>

          {/* Title */}
          <Typography variant="h4" fontWeight={700}>
            {post.title}
          </Typography>

          {/* Author Info & Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={post.author.avatar}>
                {post.author.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {post.author.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Posted {formatDate(post.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<VisibilityIcon />}
                label={`${post.views} views`}
                size="small"
                variant="outlined"
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
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
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
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Paper>

          {/* Actions Bar */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                onClick={handleLike}
                disabled={loading}
                sx={{
                  color: isLiked ? '#f44336' : 'inherit',
                  minWidth: 'auto',
                }}
              >
                {post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}
              </Button>

              <Button
                startIcon={<CommentIcon />}
                sx={{ minWidth: 'auto' }}
              >
                {post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}
              </Button>

              <Button
                startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={handleBookmark}
                disabled={loading}
                sx={{
                  color: isBookmarked ? '#2196f3' : 'inherit',
                  minWidth: 'auto',
                }}
              >
                Bookmark
              </Button>

              <Button
                startIcon={<ShareIcon />}
                onClick={handleShare}
                sx={{ ml: 'auto', minWidth: 'auto' }}
              >
                Share
              </Button>
            </Box>
          </Paper>

          {/* Comments Section */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
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
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || loading}
                >
                  {loading ? 'Posting...' : 'Post Comment'}
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Comments List */}
            {post.comments.length === 0 ? (
              <Alert severity="info">
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
                      borderLeft: comment.isSolution ? '4px solid #4caf50' : undefined,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {comment.user.name.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {comment.user.name}
                        </Typography>
                        {comment.isSolution && (
                          <Chip
                            label="Solution"
                            size="small"
                            color="success"
                            icon={<CheckCircleIcon />}
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {comment.content}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!post.isSolved && currentUserId === post.author._id && (
                        <Button
                          size="small"
                          onClick={() => handleMarkAsSolution(comment._id)}
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
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Author
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar src={post.author.avatar} sx={{ width: 48, height: 48 }}>
                {post.author.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {post.author.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.author.role}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href={`/community/profile/${post.author._id}`}
            >
              View Profile
            </Button>
          </Paper>

          {/* Post Info */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Post Information
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  {formatDate(post.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  {formatDate(post.updatedAt)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Views
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  {post.views}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  {post.isSolved ? 'Solved' : 'Open'}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}