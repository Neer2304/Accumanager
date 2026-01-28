// components/community/CommunityProfilePage.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Tab,
  Tabs,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  CardActions,
  Stack,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Badge,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Forum as ForumIcon,
  ThumbUp as ThumbUpIcon,
  Bookmark as BookmarkIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Link as LinkIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  CheckCircle as VerifiedIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { formatDate, formatNumber } from '@/utils/formatUtils';
import CommunityProfileDialog from './CommunityProfileDialog';
import UserCard from './UserCard';
import PostCard from './PostCard';

// Export the interface so it can be imported elsewhere
export interface CommunityProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
    shopName?: string;
    subscription?: {
      plan: string;
      status: string;
    };
  };
  username: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  isVerified: boolean;
  verificationBadge: boolean;
  expertInCategories: string[];
  followers: string[];
  following: string[];
  followerCount: number;
  followingCount: number;
  communityStats: {
    totalPosts: number;
    totalComments: number;
    totalLikesReceived: number;
    totalLikesGiven: number;
    totalBookmarks: number;
    engagementScore: number;
    lastActive: Date;
    joinDate: Date;
  };
  badges: string[];
  preferences: {
    privateProfile: boolean;
    allowMessages: string;
  };
}

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
  };
}

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  likeCount: number;
  commentCount: number;
  views: number;
  createdAt: string;
  tags: string[];
}

export default function CommunityProfilePage() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [statsLoading, setStatsLoading] = useState({
    followers: false,
    following: false,
    posts: false,
    likes: false,
    bookmarks: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community/profile', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch followers
  const fetchFollowers = async () => {
    if (!profile) return;
    
    setStatsLoading(prev => ({ ...prev, followers: true }));
    try {
      const response = await fetch(
        `/api/community/profile/${profile.userId._id}/connections?type=followers&limit=12`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFollowers(data.data.users || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    } finally {
      setStatsLoading(prev => ({ ...prev, followers: false }));
    }
  };

  // Fetch following
  const fetchFollowing = async () => {
    if (!profile) return;
    
    setStatsLoading(prev => ({ ...prev, following: true }));
    try {
      const response = await fetch(
        `/api/community/profile/${profile.userId._id}/connections?type=following&limit=12`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFollowing(data.data.users || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch following:', error);
    } finally {
      setStatsLoading(prev => ({ ...prev, following: false }));
    }
  };

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!profile) return;
    
    setStatsLoading(prev => ({ ...prev, posts: true }));
    try {
      const response = await fetch(
        `/api/community/posts/user/${profile.userId._id}?limit=6`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserPosts(data.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    } finally {
      setStatsLoading(prev => ({ ...prev, posts: false }));
    }
  };

  // Fetch liked posts
  const fetchLikedPosts = async () => {
    if (!profile) return;
    
    setStatsLoading(prev => ({ ...prev, likes: true }));
    try {
      const response = await fetch(
        `/api/community/profile/${profile.userId._id}/likes?limit=6`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLikedPosts(data.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch liked posts:', error);
    } finally {
      setStatsLoading(prev => ({ ...prev, likes: false }));
    }
  };

  // Fetch bookmarked posts
  const fetchBookmarkedPosts = async () => {
    if (!profile) return;
    
    setStatsLoading(prev => ({ ...prev, bookmarks: true }));
    try {
      const response = await fetch(
        `/api/community/profile/${profile.userId._id}/bookmarks?limit=6`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBookmarkedPosts(data.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch bookmarked posts:', error);
    } finally {
      setStatsLoading(prev => ({ ...prev, bookmarks: false }));
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (profile) {
      switch (tabValue) {
        case 1:
          fetchFollowers();
          break;
        case 2:
          fetchFollowing();
          break;
        case 3:
          fetchUserPosts();
          break;
        case 4:
          fetchLikedPosts();
          break;
        case 5:
          fetchBookmarkedPosts();
          break;
      }
    }
  }, [tabValue, profile]);

  // Initial load
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileUpdate = (updatedProfile: CommunityProfile) => {
    setProfile(updatedProfile);
  };

  const handleFollowUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/community/profile/${userId}/follow`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update follower count
          if (profile) {
            setProfile({
              ...profile,
              followerCount: data.data.targetUser?.followerCount || profile.followerCount,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollowUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/community/profile/${userId}/follow`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update follower count
          if (profile) {
            setProfile({
              ...profile,
              followerCount: data.data.targetUser?.followerCount || profile.followerCount,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Refresh liked posts
        if (tabValue === 4) {
          fetchLikedPosts();
        }
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/bookmark`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Refresh bookmarked posts
        if (tabValue === 5) {
          fetchBookmarkedPosts();
        }
      }
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchProfile}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          No profile found. Please create your community profile.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => setEditDialogOpen(true)}
          startIcon={<AddIcon />}
        >
          Create Profile
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Profile Header */}
        <Paper 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            mb: 4,
            position: 'relative',
          }}
        >
          {/* Cover Image */}
          <Box
            sx={{
              height: 200,
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: -60,
                left: 40,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 3,
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  profile.verificationBadge && (
                    <VerifiedIcon sx={{ 
                      color: '#1DA1F2', 
                      fontSize: 28,
                      bgcolor: 'white',
                      borderRadius: '50%',
                      p: 0.5,
                    }} />
                  )
                }
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
                    border: '4px solid white',
                    boxShadow: 3,
                  }}
                  src={profile.avatar}
                >
                  {profile.userId.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              
              <Box sx={{ mb: 2, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {profile.userId.name}
                  {profile.isVerified && (
                    <VerifiedIcon 
                      sx={{ 
                        color: '#1DA1F2', 
                        ml: 1,
                        verticalAlign: 'middle',
                        fontSize: 28,
                      }} 
                    />
                  )}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  @{profile.username}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Profile Info */}
          <Box sx={{ pt: 8, px: 4, pb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                {/* Bio */}
                {profile.bio && (
                  <Typography variant="body1" paragraph sx={{ maxWidth: 800 }}>
                    {profile.bio}
                  </Typography>
                )}

                {/* Details */}
                <Stack direction="row" spacing={3} sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  {profile.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {profile.location}
                      </Typography>
                    </Box>
                  )}
                  
                  {profile.userId.shopName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {profile.userId.shopName}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Joined {formatDate(profile.communityStats.joinDate)}
                    </Typography>
                  </Box>
                  
                  {profile.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinkIcon fontSize="small" color="action" />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'primary.main',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                        onClick={() => window.open(profile.website, '_blank')}
                      >
                        Website
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {/* Social Links */}
                {profile.socialLinks && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    {profile.socialLinks.twitter && (
                      <Tooltip title="Twitter">
                        <IconButton
                          size="small"
                          onClick={() => window.open(profile.socialLinks!.twitter, '_blank')}
                          sx={{ color: '#1DA1F2' }}
                        >
                          <TwitterIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {profile.socialLinks.linkedin && (
                      <Tooltip title="LinkedIn">
                        <IconButton
                          size="small"
                          onClick={() => window.open(profile.socialLinks!.linkedin, '_blank')}
                          sx={{ color: '#0077B5' }}
                        >
                          <LinkedInIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {profile.socialLinks.instagram && (
                      <Tooltip title="Instagram">
                        <IconButton
                          size="small"
                          onClick={() => window.open(profile.socialLinks!.instagram, '_blank')}
                          sx={{ color: '#E4405F' }}
                        >
                          <InstagramIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {profile.socialLinks.facebook && (
                      <Tooltip title="Facebook">
                        <IconButton
                          size="small"
                          onClick={() => window.open(profile.socialLinks!.facebook, '_blank')}
                          sx={{ color: '#1877F2' }}
                        >
                          <FacebookIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                )}

                {/* Badges */}
                {profile.badges && profile.badges.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Badges
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {profile.badges.map((badge, index) => (
                        <Chip
                          key={index}
                          label={badge}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Expert Categories */}
                {profile.expertInCategories && profile.expertInCategories.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Expert In
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {profile.expertInCategories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                >
                  Edit Profile
                </Button>
                <IconButton>
                  <SettingsIcon />
                </IconButton>
              </Stack>
            </Box>

            {/* Stats Bar */}
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {formatNumber(profile.followerCount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Followers
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {formatNumber(profile.followingCount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Following
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {formatNumber(profile.communityStats.totalPosts)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posts
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {formatNumber(profile.communityStats.engagementScore)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Engagement Score
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab 
                  icon={<PeopleIcon />} 
                  iconPosition="start"
                  label="Overview" 
                />
                <Tab 
                  icon={<PeopleIcon />} 
                  iconPosition="start"
                  label={`Followers (${formatNumber(profile.followerCount)})`} 
                />
                <Tab 
                  icon={<PeopleIcon />} 
                  iconPosition="start"
                  label={`Following (${formatNumber(profile.followingCount)})`} 
                />
                <Tab 
                  icon={<ForumIcon />} 
                  iconPosition="start"
                  label={`Posts (${formatNumber(profile.communityStats.totalPosts)})`} 
                />
                <Tab 
                  icon={<ThumbUpIcon />} 
                  iconPosition="start"
                  label={`Likes (${formatNumber(profile.communityStats.totalLikesGiven)})`} 
                />
                <Tab 
                  icon={<BookmarkIcon />} 
                  iconPosition="start"
                  label={`Bookmarks (${formatNumber(profile.communityStats.totalBookmarks)})`} 
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Community Activity Overview
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Card sx={{ flex: 1, minWidth: '300px' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <ForumIcon color="primary" />
                            <Typography variant="h6">Post Activity</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            You have created {profile.communityStats.totalPosts} posts and made {profile.communityStats.totalComments} comments in the community.
                          </Typography>
                          <Typography variant="body2">
                            Last active: {formatDate(profile.communityStats.lastActive, true)}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card sx={{ flex: 1, minWidth: '300px' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <ThumbUpIcon color="primary" />
                            <Typography variant="h6">Engagement</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            You've given {profile.communityStats.totalLikesGiven} likes and received {profile.communityStats.totalLikesReceived} likes.
                          </Typography>
                          <Typography variant="body2">
                            Engagement score: {profile.communityStats.engagementScore}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6">
                      Followers ({formatNumber(profile.followerCount)})
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Search followers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: { xs: '100%', sm: '300px' } }}
                    />
                  </Box>
                  
                  {statsLoading.followers ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : followers.length === 0 ? (
                    <Alert severity="info">
                      You don't have any followers yet.
                    </Alert>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 3,
                    }}>
                      {followers
                        .filter(user => 
                          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.userId.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((user) => (
                          <Box key={user._id} sx={{ 
                            width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                            minWidth: '280px'
                          }}>
                            <UserCard
                              user={user}
                              onFollow={handleFollowUser}
                              onUnfollow={handleUnfollowUser}
                              onViewProfile={(userId) => router.push(`/community/profile/${user.username}`)}
                            />
                          </Box>
                        ))}
                    </Box>
                  )}
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6">
                      Following ({formatNumber(profile.followingCount)})
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Search following..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: { xs: '100%', sm: '300px' } }}
                    />
                  </Box>
                  
                  {statsLoading.following ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : following.length === 0 ? (
                    <Alert severity="info">
                      You're not following anyone yet.
                    </Alert>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 3,
                    }}>
                      {following
                        .filter(user => 
                          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.userId.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((user) => (
                          <Box key={user._id} sx={{ 
                            width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                            minWidth: '280px'
                          }}>
                            <UserCard
                              user={user}
                              isFollowing={true}
                              onFollow={handleFollowUser}
                              onUnfollow={handleUnfollowUser}
                              onViewProfile={(userId) => router.push(`/community/profile/${user.username}`)}
                            />
                          </Box>
                        ))}
                    </Box>
                  )}
                </Box>
              )}

              {tabValue === 3 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6">
                      Your Posts ({formatNumber(profile.communityStats.totalPosts)})
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => router.push('/community/create')}
                    >
                      Create New Post
                    </Button>
                  </Box>
                  
                  {statsLoading.posts ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : userPosts.length === 0 ? (
                    <Alert severity="info">
                      You haven't created any posts yet.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {userPosts.map((post) => (
                        <Box key={post._id}>
                          <PostCard
                            post={post}
                            showActions={true}
                            onViewPost={(postId) => router.push(`/community/post/${postId}`)}
                            onLike={handleLikePost}
                            onBookmark={handleBookmarkPost}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {tabValue === 4 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6">
                      Liked Posts ({formatNumber(profile.communityStats.totalLikesGiven)})
                    </Typography>
                  </Box>
                  
                  {statsLoading.likes ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : likedPosts.length === 0 ? (
                    <Alert severity="info">
                      You haven't liked any posts yet.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {likedPosts.map((post) => (
                        <Box key={post._id}>
                          <PostCard
                            post={post}
                            showActions={true}
                            onViewPost={(postId) => router.push(`/community/post/${postId}`)}
                            onLike={handleLikePost}
                            onBookmark={handleBookmarkPost}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {tabValue === 5 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6">
                      Bookmarked Posts ({formatNumber(profile.communityStats.totalBookmarks)})
                    </Typography>
                  </Box>
                  
                  {statsLoading.bookmarks ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : bookmarkedPosts.length === 0 ? (
                    <Alert severity="info">
                      You haven't bookmarked any posts yet.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {bookmarkedPosts.map((post) => (
                        <Box key={post._id}>
                          <PostCard
                            post={post}
                            showActions={true}
                            onViewPost={(postId) => router.push(`/community/post/${postId}`)}
                            onLike={handleLikePost}
                            onBookmark={handleBookmarkPost}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Edit Profile Dialog */}
      <CommunityProfileDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        profile={profile}
        onUpdate={handleProfileUpdate}
      />
    </>
  );
}