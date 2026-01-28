// app/community/explore/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
  NewReleases as NewIcon,
  CheckCircle as VerifiedIcon,
  Business as BusinessIcon,
  Forum as ForumIcon,
  ThumbUp as LikeIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
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
    role: string;
  };
  isVerified?: boolean;
  expertInCategories?: string[];
  isFollowing?: boolean;
}

export default function ExplorePage() {
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [tabValue]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      let url = '/api/community/explore';
      if (tabValue === 1) {
        url += '?sort=popular';
      } else if (tabValue === 2) {
        url += '?sort=new';
      }
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data || []);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch(`/api/community/profile/${userId}/follow`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(users.map(user => 
            user._id === userId 
              ? { ...user, isFollowing: true, communityStats: { 
                  ...user.communityStats, 
                  followerCount: user.communityStats.followerCount + 1 
                }} 
              : user
          ));
          setFollowing([...following, userId]);
        }
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      const response = await fetch(`/api/community/profile/${userId}/follow`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(users.map(user => 
            user._id === userId 
              ? { ...user, isFollowing: false, communityStats: { 
                  ...user.communityStats, 
                  followerCount: user.communityStats.followerCount - 1 
                }} 
              : user
          ));
          setFollowing(following.filter(id => id !== userId));
        }
      }
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userId.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          👥 Explore Community
        </Typography>
        <Typography color="text.secondary" paragraph>
          Discover and connect with other community members
        </Typography>
      </Box>

      {/* Search & Tabs */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Search users by name, username, or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 300 }}
            size="small"
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={`${users.length} Users`} size="small" />
            <Chip 
              label={`${following.length} Following`} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PeopleIcon />} label="All Users" />
          <Tab icon={<TrendingIcon />} label="Popular" />
          <Tab icon={<NewIcon />} label="New Members" />
        </Tabs>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Loading users...
          </Typography>
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PeopleIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Try a different search term' : 'No users to display'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  {/* User Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                      src={user.avatar}
                      sx={{ width: 60, height: 60 }}
                    >
                      {user.userId.name.charAt(0)}
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
                      {user.userId.role !== 'user' && (
                        <Chip
                          label={user.userId.role}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Bio */}
                  {user.bio && (
                    <Typography variant="body2" sx={{ mb: 2 }} noWrap>
                      {user.bio}
                    </Typography>
                  )}

                  {/* Shop Name */}
                  {user.userId.shopName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {user.userId.shopName}
                      </Typography>
                    </Box>
                  )}

                  {/* Stats */}
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

                <Divider />

                <CardActions sx={{ p: 2 }}>
                  <Button
                    size="small"
                    variant={user.isFollowing ? "outlined" : "contained"}
                    fullWidth
                    startIcon={user.isFollowing ? undefined : <PersonAddIcon />}
                    onClick={() => user.isFollowing ? handleUnfollow(user._id) : handleFollow(user._id)}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    component={Link}
                    href={`/community/profile/${user.username}`}
                  >
                    View Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}