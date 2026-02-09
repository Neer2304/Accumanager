"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Avatar,
  Typography,
  Button,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Forum as ForumIcon,
  CheckCircle as VerifiedIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface UserCardProps {
  user: {
    _id: string;
    username: string;
    avatar?: string;
    bio?: string;
    communityStats: {
      totalPosts: number;
      followerCount: number;
    };
    userId: {
      name: string;
      shopName?: string;
    };
    isVerified?: boolean;
  };
  isFollowing?: boolean;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onViewProfile: (userId: string) => void;
  onMessage?: (userId: string) => void;
}

export default function UserCard({
  user,
  isFollowing = false,
  onFollow,
  onUnfollow,
  onViewProfile,
  onMessage,
}: UserCardProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (following) {
        await onUnfollow(user._id);
      } else {
        await onFollow(user._id);
      }
      setFollowing(!following);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      borderRadius: 2,
    }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={user.avatar}
            sx={{ 
              width: 60, 
              height: 60,
              border: `2px solid ${darkMode ? '#202124' : '#ffffff'}`,
            }}
          >
            {user.userId.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                {user.userId.name}
              </Typography>
              {user.isVerified && (
                <VerifiedIcon fontSize="small" sx={{ color: '#4285f4' }} />
              )}
            </Box>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              @{user.username}
            </Typography>
          </Box>
        </Box>

        {user.userId.shopName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BusinessIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {user.userId.shopName}
            </Typography>
          </Box>
        )}

        {user.bio && (
          <Typography variant="body2" sx={{ 
            mb: 2,
            color: darkMode ? '#e8eaed' : '#202124',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }} noWrap>
            {user.bio}
          </Typography>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {user.communityStats.totalPosts}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Posts
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {user.communityStats.followerCount}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Followers
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          size="small"
          variant={following ? "outlined" : "contained"}
          onClick={handleFollowToggle}
          disabled={loading}
          fullWidth
          sx={{
            ...(following ? {
              borderColor: darkMode ? '#5f6368' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                borderColor: '#4285f4',
                backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
              },
            } : {
              backgroundColor: '#4285f4',
              '&:hover': {
                backgroundColor: '#3367d6',
              },
              '&.Mui-disabled': {
                backgroundColor: darkMode ? '#303134' : '#f1f3f4',
                color: darkMode ? '#5f6368' : '#bdc1c6',
              },
            }),
          }}
        >
          {loading ? '...' : following ? 'Following' : 'Follow'}
        </Button>
        <IconButton
          size="small"
          onClick={() => onViewProfile(user._id)}
          sx={{
            border: '1px solid',
            borderColor: darkMode ? '#5f6368' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
            },
          }}
        >
          <PersonIcon />
        </IconButton>
        {onMessage && (
          <IconButton
            size="small"
            onClick={() => onMessage(user._id)}
            sx={{
              border: '1px solid',
              borderColor: darkMode ? '#5f6368' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
              },
            }}
          >
            <MessageIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
}