"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Stack,
  Tooltip,
  alpha,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ChatBubbleOutline as CommentIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  AccessTime as TimeIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/formatUtils';
import { useTheme } from '@mui/material/styles';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    excerpt?: string;
    author: {
      _id: string;
      name: string;
      avatar?: string;
      role?: string;
    };
    category?: string;
    tags?: string[];
    likeCount: number;
    commentCount: number;
    views: number;
    createdAt: string;
    updatedAt?: string;
    isPinned?: boolean;
    isSolved?: boolean;
    attachments?: any[];
  };
  showActions?: boolean;
  onViewPost?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  compact?: boolean;
}

export default function PostCard({
  post,
  showActions = true,
  onViewPost,
  onLike,
  onBookmark,
  onComment,
  onShare,
  onEdit,
  onDelete,
  compact = false,
}: PostCardProps) {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleLike = async () => {
    if (onLike) {
      await onLike(post._id);
    } else {
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
      
      try {
        const response = await fetch(`/api/community/posts/${post._id}/like`, {
          method: liked ? 'DELETE' : 'POST',
          credentials: 'include',
        });
        
        if (!response.ok) {
          setLiked(!liked);
          setLikeCount(prev => liked ? prev + 1 : prev - 1);
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
        setLiked(!liked);
        setLikeCount(prev => liked ? prev + 1 : prev - 1);
      }
    }
  };

  const handleBookmark = async () => {
    if (onBookmark) {
      await onBookmark(post._id);
    } else {
      setBookmarked(!bookmarked);
      
      try {
        await fetch(`/api/community/posts/${post._id}/bookmark`, {
          method: bookmarked ? 'DELETE' : 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Failed to toggle bookmark:', error);
        setBookmarked(!bookmarked);
      }
    }
  };

  const handleViewPost = () => {
    if (onViewPost) {
      onViewPost(post._id);
    } else {
      router.push(`/community/post/${post._id}`);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleShare = () => {
    handleMenuClose();
    if (onShare) {
      onShare(post._id);
    } else {
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: `${window.location.origin}/community/post/${post._id}`,
        });
      } else {
        navigator.clipboard.writeText(
          `${window.location.origin}/community/post/${post._id}`
        ).then(() => {
          alert('Link copied to clipboard!');
        });
      }
    }
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) {
      onEdit(post._id);
    }
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (onDelete) {
      onDelete(post._id);
    } else {
      if (confirm('Are you sure you want to delete this post?')) {
        try {
          const response = await fetch(`/api/community/posts/${post._id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (response.ok) {
            window.location.reload();
          }
        } catch (error) {
          console.error('Failed to delete post:', error);
        }
      }
    }
  };

  const handleViewAuthorProfile = () => {
    router.push(`/community/profile/${post.author._id}`);
  };

  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '#ea4335';
      case 'moderator': return '#4285f4';
      case 'expert': return '#34a853';
      default: return darkMode ? '#9aa0a6' : '#5f6368';
    }
  };

  const getRoleBgColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return alpha('#ea4335', darkMode ? 0.2 : 0.1);
      case 'moderator': return alpha('#4285f4', darkMode ? 0.2 : 0.1);
      case 'expert': return alpha('#34a853', darkMode ? 0.2 : 0.1);
      default: return alpha(darkMode ? '#9aa0a6' : '#5f6368', darkMode ? 0.2 : 0.1);
    }
  };

  return (
    <Card 
      sx={{ 
        mb: compact ? 1 : 2,
        borderRadius: 2,
        border: post.isPinned ? '2px solid' : '1px solid',
        borderColor: post.isPinned ? '#fbbc04' : (darkMode ? '#3c4043' : '#dadce0'),
        bgcolor: darkMode ? '#303134' : '#ffffff',
        position: 'relative',
        '&:hover': {
          boxShadow: darkMode ? 0 : 2,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
        },
      }}
    >
      {post.isPinned && (
        <Chip
          label="Pinned"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
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
          sx={{
            position: 'absolute',
            top: 12,
            right: post.isPinned ? 80 : 12,
            zIndex: 1,
            bgcolor: '#34a853',
            color: 'white',
            fontWeight: 500,
          }}
        />
      )}
      
      <CardHeader
        avatar={
          <Tooltip title={`View ${post.author.name}'s profile`}>
            <IconButton 
              onClick={handleViewAuthorProfile}
              sx={{ p: 0 }}
            >
              <Avatar
                src={post.author.avatar}
                sx={{
                  bgcolor: '#4285f4',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s',
                  },
                }}
              >
                {post.author.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {post.category && !compact && (
              <Chip
                label={post.category}
                size="small"
                sx={{
                  bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
                  color: '#4285f4',
                  fontWeight: 500,
                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                }}
              />
            )}
            
            <IconButton
              aria-label="settings"
              onClick={handleMenuClick}
              size="small"
              sx={{
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  minWidth: 150,
                  bgcolor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                },
              }}
            >
              <MenuItem onClick={handleShare}>
                <ShareIcon fontSize="small" sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Share
                </Typography>
              </MenuItem>
              {onEdit && (
                <MenuItem onClick={handleEdit}>
                  <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Edit
                  </Typography>
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem onClick={handleDelete} sx={{ color: '#ea4335' }}>
                  Delete
                </MenuItem>
              )}
            </Menu>
          </Box>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="subtitle1" 
              fontWeight={600}
              sx={{ 
                cursor: 'pointer',
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  color: '#4285f4',
                },
              }}
              onClick={handleViewAuthorProfile}
            >
              {post.author.name}
            </Typography>
            {post.author.role && (
              <Chip
                label={post.author.role}
                size="small"
                sx={{
                  bgcolor: getRoleBgColor(post.author.role),
                  color: getRoleColor(post.author.role),
                  fontSize: '0.7rem',
                  height: 20,
                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                }}
              />
            )}
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
            <TimeIcon fontSize="inherit" sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {formatDate(post.createdAt)}
            </Typography>
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>•</Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Updated {formatDate(post.updatedAt)}
                </Typography>
              </>
            )}
            {!compact && (
              <>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>•</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <VisibilityIcon fontSize="inherit" sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {post.views.toLocaleString()} views
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        }
        sx={{ 
          pb: compact ? 0 : 1,
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
          },
        }}
      />

      <CardContent sx={{ pb: compact ? 1 : 2, pt: compact ? 0 : 1 }}>
        <Typography 
          variant={compact ? "subtitle1" : "h6"} 
          fontWeight={600}
          gutterBottom
          sx={{
            cursor: 'pointer',
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              color: '#4285f4',
            },
          }}
          onClick={handleViewPost}
        >
          {post.title}
        </Typography>
        
        {!compact && post.excerpt && (
          <Typography 
            variant="body2" 
            sx={{
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}
            onClick={handleViewPost}
          >
            {post.excerpt}
          </Typography>
        )}

        {post.tags && post.tags.length > 0 && !compact && (
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
            {post.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                icon={<TagIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                  '& .MuiChip-icon': {
                    fontSize: 14,
                  },
                }}
              />
            ))}
            {post.tags.length > 3 && (
              <Chip
                label={`+${post.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                }}
              />
            )}
          </Stack>
        )}
      </CardContent>

      {showActions && (
        <>
          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
          <CardActions sx={{ px: 2, py: compact ? 0.5 : 1 }}>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              <Tooltip title={liked ? "Unlike" : "Like"}>
                <Button
                  size="small"
                  startIcon={liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  onClick={handleLike}
                  sx={{
                    color: liked ? '#ea4335' : (darkMode ? '#9aa0a6' : '#5f6368'),
                    minWidth: 'auto',
                    px: 1,
                    '&:hover': {
                      backgroundColor: alpha('#ea4335', darkMode ? 0.1 : 0.05),
                    },
                  }}
                >
                  {likeCount > 0 && (
                    <Typography variant="body2" sx={{ ml: 0.5, color: darkMode ? '#e8eaed' : '#202124' }}>
                      {likeCount}
                    </Typography>
                  )}
                </Button>
              </Tooltip>

              <Tooltip title="Comment">
                <Button
                  size="small"
                  startIcon={<CommentIcon />}
                  onClick={() => {
                    if (onComment) {
                      onComment(post._id);
                    } else {
                      handleViewPost();
                    }
                  }}
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    minWidth: 'auto',
                    px: 1,
                    '&:hover': {
                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    },
                  }}
                >
                  {post.commentCount > 0 && (
                    <Typography variant="body2" sx={{ ml: 0.5, color: darkMode ? '#e8eaed' : '#202124' }}>
                      {post.commentCount}
                    </Typography>
                  )}
                </Button>
              </Tooltip>

              <Tooltip title={bookmarked ? "Remove bookmark" : "Bookmark"}>
                <IconButton
                  size="small"
                  onClick={handleBookmark}
                  sx={{
                    color: bookmarked ? '#4285f4' : (darkMode ? '#9aa0a6' : '#5f6368'),
                    '&:hover': {
                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    },
                  }}
                >
                  {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Share">
                <IconButton
                  size="small"
                  onClick={handleShare}
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    '&:hover': {
                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    },
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>

              {!compact && (
                <Button
                  size="small"
                  onClick={handleViewPost}
                  sx={{ 
                    ml: 'auto',
                    color: '#4285f4',
                    '&:hover': {
                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                    },
                  }}
                >
                  Read More
                </Button>
              )}
            </Box>
          </CardActions>
        </>
      )}
    </Card>
  );
}