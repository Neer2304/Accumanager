// components/googlecommunity/components/BookmarkCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { PostType } from '@/types/community';
import { formatDate, getCategoryColor } from '../utils/helpers';

interface BookmarkCardProps {
  post: PostType;
  onRemove: (postId: string) => void;
  darkMode: boolean;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ post, onRemove, darkMode }) => {
  return (
    <Card
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
                  backgroundColor: alpha(getCategoryColor(post.category, darkMode), 0.1),
                  color: getCategoryColor(post.category, darkMode),
                  borderColor: alpha(getCategoryColor(post.category, darkMode), 0.3),
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
              onClick={() => onRemove(post._id)}
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
  );
};