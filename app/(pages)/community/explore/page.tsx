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
  PersonAddOutlined as PersonAddOutlinedIcon,
  ArrowBack as ArrowBackIcon,
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
    _id: string;
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
  const darkMode = theme.palette.mode === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [following, setFollowing] = useState<string[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);

  // Get current user profile to filter out own profile
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/community/profile', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCurrentUserProfile(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [tabValue, currentUserProfile]);

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
          // Filter out current user's profile
          let filteredUsers = data.data || [];
          if (currentUserProfile) {
            filteredUsers = filteredUsers.filter((user: User) => 
              user.userId?._id !== currentUserProfile.userId?._id && 
              user._id !== currentUserProfile._id
            );
          }
          
          // Filter out users who are already following
          const followingUsers = filteredUsers.filter((user: User) => user.isFollowing);
          setFollowing(followingUsers.map((user: User) => user._id));
          
          setUsers(filteredUsers);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (user: User) => {
    try {
      const response = await fetch(`/api/community/profile/${user.username}/follow`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(users.map(u => 
            u._id === user._id 
              ? { 
                  ...u, 
                  isFollowing: true, 
                  communityStats: { 
                    ...u.communityStats, 
                    followerCount: u.communityStats.followerCount + 1 
                  }
                } 
              : u
          ));
          setFollowing([...following, user._id]);
        }
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollow = async (user: User) => {
    try {
      const response = await fetch(`/api/community/profile/${user.username}/follow`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(users.map(u => 
            u._id === user._id 
              ? { 
                  ...u, 
                  isFollowing: false, 
                  communityStats: { 
                    ...u.communityStats, 
                    followerCount: u.communityStats.followerCount - 1 
                  }
                } 
              : u
          ));
          setFollowing(following.filter(id => id !== user._id));
        }
      }
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userId?.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff', 
      minHeight: '100vh',
      py: 4,
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
              <PeopleIcon sx={{ 
                fontSize: { xs: 32, md: 40 }, 
                color: '#4285f4' 
              }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Explore Community
              </Typography>
              <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph>
                Discover and connect with other community members
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Search & Tabs */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          bgcolor: darkMode ? '#303134' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3, 
            flexWrap: 'wrap', 
            gap: 2 
          }}>
            <TextField
              placeholder="Search users by name, username, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  bgcolor: darkMode ? '#202124' : '#ffffff',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4285f4',
                  },
                }
              }}
              sx={{ flex: 1, minWidth: 300 }}
              size="small"
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={`${filteredUsers.length} Users`} 
                size="small" 
                sx={{
                  backgroundColor: alpha('#4285f4', 0.1),
                  color: '#4285f4',
                  borderColor: alpha('#4285f4', 0.3),
                }}
              />
              <Chip 
                label={`${following.length} Following`} 
                size="small" 
                sx={{
                  backgroundColor: alpha('#34a853', 0.1),
                  color: '#34a853',
                  borderColor: alpha('#34a853', 0.3),
                }}
              />
            </Box>
          </Box>

          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ 
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&.Mui-selected': {
                  color: '#4285f4',
                },
              },
            }}
          >
            <Tab icon={<PeopleIcon />} label="All Users" />
            <Tab icon={<TrendingIcon />} label="Popular" />
            <Tab icon={<NewIcon />} label="New Members" />
          </Tabs>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              bgcolor: darkMode ? '#3c1e1e' : '#fdecea',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Content */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#4285f4' }} />
            <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 2 }}>
              Loading users...
            </Typography>
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 3,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <PeopleIcon sx={{ fontSize: 60, color: darkMode ? '#5f6368' : '#9aa0a6', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }} gutterBottom>
              No users found
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {searchQuery ? 'Try a different search term' : 'No users to display'}
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: { xs: 'center', sm: 'flex-start' }
          }}>
            {filteredUsers.map((user) => (
              <Box 
                key={user._id}
                sx={{ 
                  width: { 
                    xs: '100%', 
                    sm: 'calc(50% - 12px)', 
                    md: 'calc(33.333% - 16px)',
                    lg: 'calc(25% - 18px)'
                  },
                  minWidth: { xs: '100%', sm: '280px' },
                  maxWidth: { xs: '100%', md: '400px' }
                }}
              >
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  bgcolor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: darkMode 
                      ? '0 8px 25px rgba(0,0,0,0.3)' 
                      : '0 8px 25px rgba(0,0,0,0.1)',
                    borderColor: '#4285f4',
                  }
                }}>
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    {/* User Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={user.avatar}
                        sx={{ 
                          width: 60, 
                          height: 60,
                          bgcolor: darkMode ? '#5f6368' : '#4285f4',
                          border: '2px solid',
                          borderColor: darkMode ? '#303134' : '#ffffff',
                        }}
                      >
                        {user.userId?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {user.userId?.name || 'Unknown User'}
                          </Typography>
                          {user.isVerified && (
                            <VerifiedIcon fontSize="small" sx={{ color: '#4285f4' }} />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          @{user.username}
                        </Typography>
                        {user.userId?.role && user.userId.role !== 'user' && (
                          <Chip
                            label={user.userId.role}
                            size="small"
                            sx={{ 
                              mt: 0.5,
                              backgroundColor: alpha('#4285f4', 0.1),
                              color: '#4285f4',
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Bio */}
                    {user.bio && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                        }}
                      >
                        {user.bio}
                      </Typography>
                    )}

                    {/* Shop Name */}
                    {user.userId?.shopName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <BusinessIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {user.userId.shopName}
                        </Typography>
                      </Box>
                    )}

                    {/* Stats */}
                    <Stack direction="row" spacing={2} sx={{ mt: 'auto', pt: 2, borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {user.communityStats?.totalPosts || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Posts
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {user.communityStats?.followerCount || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Followers
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>

                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                  <CardActions sx={{ p: 2 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%' }}>
                      <Button
                        size="small"
                        variant={user.isFollowing ? "outlined" : "contained"}
                        fullWidth
                        startIcon={user.isFollowing ? undefined : <PersonAddOutlinedIcon />}
                        onClick={() => user.isFollowing ? handleUnfollow(user) : handleFollow(user)}
                        sx={{
                          backgroundColor: user.isFollowing ? 'transparent' : '#4285f4',
                          color: user.isFollowing ? '#4285f4' : '#ffffff',
                          borderColor: user.isFollowing ? '#4285f4' : 'transparent',
                          '&:hover': {
                            backgroundColor: user.isFollowing 
                              ? alpha('#4285f4', darkMode ? 0.1 : 0.05)
                              : '#3367d6',
                          },
                        }}
                      >
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        component={Link}
                        href={`/community/profile/${user.username}`}
                        sx={{
                          borderColor: darkMode ? '#3c4043' : '#dadce0',
                          color: darkMode ? '#e8eaed' : '#202124',
                          '&:hover': {
                            borderColor: '#4285f4',
                            backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                          },
                        }}
                      >
                        View Profile
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        {/* Stats & Info Section */}
        {!loading && filteredUsers.length > 0 && (
          <Paper sx={{ 
            p: 3, 
            mt: 4, 
            borderRadius: 3,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  📊 Community Insights
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Total users discovered
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {filteredUsers.length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Users you're following
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#34a853' }}>
                      {following.length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Verified members
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {filteredUsers.filter(u => u.isVerified).length}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              
              <Divider orientation="vertical" flexItem sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  💡 Tips for Connecting
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  • Follow users with similar interests to see their posts in your feed<br/>
                  • Engage with their content to build relationships<br/>
                  • Send direct messages to start meaningful conversations
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
}