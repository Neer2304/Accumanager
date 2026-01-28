// components/community/UserCard.tsx
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
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Forum as ForumIcon,
  CheckCircle as VerifiedIcon,
  Message as MessageIcon,
} from '@mui/icons-material';

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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={user.avatar}
            sx={{ width: 60, height: 60 }}
          >
            {user.userId.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.userId.name}
              </Typography>
              {user.isVerified && (
                <VerifiedIcon fontSize="small" color="primary" />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
        </Box>

        {user.userId.shopName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BusinessIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {user.userId.shopName}
            </Typography>
          </Box>
        )}

        {user.bio && (
          <Typography variant="body2" sx={{ mb: 2 }} noWrap>
            {user.bio}
          </Typography>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">{user.communityStats.totalPosts}</Typography>
            <Typography variant="caption" color="text.secondary">
              Posts
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">{user.communityStats.followerCount}</Typography>
            <Typography variant="caption" color="text.secondary">
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
        >
          {loading ? '...' : following ? 'Following' : 'Follow'}
        </Button>
        <IconButton
          size="small"
          onClick={() => onViewProfile(user.userId._id)}
        >
          <PersonIcon />
        </IconButton>
        {onMessage && (
          <IconButton
            size="small"
            onClick={() => onMessage(user.userId._id)}
          >
            <MessageIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
}