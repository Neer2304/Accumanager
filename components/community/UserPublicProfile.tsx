// components/community/UserPublicProfile.tsx
"use client";

import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
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
  Email as EmailIcon,
  Message as MessageIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { formatDate, formatNumber } from '@/utils/formatUtils';
import UserCard from './UserCard';
import PostCard from './PostCard';

interface CommunityProfile {
  _id: string;
  userId: string | {
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
  isVerified?: boolean;
  verificationBadge?: boolean;
  expertInCategories?: string[];
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
  badges?: string[];
  preferences: {
    privateProfile: boolean;
    allowMessages: string;
  };
  isFollowing?: boolean;
}

interface UserPublicProfileProps {
  profile: CommunityProfile;
  username: string;
}

export default function UserPublicProfile({ profile, username }: UserPublicProfileProps) {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState({
    posts: false,
    follow: false,
    followers: false,
    following: false,
  });
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing || false);
  const [followerCount, setFollowerCount] = useState(profile.followerCount || 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  // Safely extract user information
  const getUserInfo = () => {
    if (!profile) return { _id: '', name: '', email: '', role: '', shopName: '', subscription: null };
    
    if (typeof profile.userId === 'string') {
      return {
        _id: profile.userId,
        name: profile.username || 'User',
        email: '',
        role: '',
        shopName: '',
        subscription: null,
      };
    }
    
    return profile.userId;
  };

  const userInfo = getUserInfo();

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!profile) return;
    
    setLoading(prev => ({ ...prev, posts: true }));
    try {
      const userId = typeof profile.userId === 'string' ? profile.userId : profile.userId._id;
      const response = await fetch(
        `/api/community/posts/user/${userId}?limit=10`,
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
      setLoading(prev => ({ ...prev, posts: false }));
    }
  };

  // Fetch followers
  const fetchFollowers = async () => {
    if (!profile) return;
    
    setLoading(prev => ({ ...prev, followers: true }));
    try {
      const userId = typeof profile.userId === 'string' ? profile.userId : profile.userId._id;
      const response = await fetch(
        `/api/community/profile/${userId}/connections?type=followers&limit=20`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFollowers(data.data?.users || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    } finally {
      setLoading(prev => ({ ...prev, followers: false }));
    }
  };

  // Fetch following
  const fetchFollowing = async () => {
    if (!profile) return;
    
    setLoading(prev => ({ ...prev, following: true }));
    try {
      const userId = typeof profile.userId === 'string' ? profile.userId : profile.userId._id;
      const response = await fetch(
        `/api/community/profile/${userId}/connections?type=following&limit=20`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFollowing(data.data?.users || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch following:', error);
    } finally {
      setLoading(prev => ({ ...prev, following: false }));
    }
  };

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (loading.follow) return;
    
    setLoading(prev => ({ ...prev, follow: true }));
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const targetUserId = typeof profile.userId === 'string' ? profile.userId : profile.userId._id;
      
      const response = await fetch(`/api/community/profile/${targetUserId}/follow`, {
        method,
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsFollowing(!isFollowing);
          setFollowerCount(data.data?.followerCount || (isFollowing ? followerCount - 1 : followerCount + 1));
        }
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setLoading(prev => ({ ...prev, follow: false }));
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageContent.trim() || sendingMessage) return;
    
    setSendingMessage(true);
    try {
      // Here you would typically call your message API
      console.log('Sending message:', messageContent);
      // await fetch('/api/messages', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     recipientId: profile.userId,
      //     content: messageContent,
      //   }),
      //   credentials: 'include',
      // });
      
      alert('Message sent successfully!');
      setMessageContent('');
      setMessageDialogOpen(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (!profile) return;
    
    switch (tabValue) {
      case 1: // Followers
        fetchFollowers();
        break;
      case 2: // Following
        fetchFollowing();
        break;
      case 3: // Posts
        fetchUserPosts();
        break;
    }
  }, [tabValue, profile]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Check message permissions
  const canMessage = () => {
    if (!profile.preferences) return false;
    if (profile.preferences.allowMessages === 'none') return false;
    if (profile.preferences.allowMessages === 'followers' && !isFollowing) return false;
    return true;
  };

  // Handle follow user
  const handleFollowUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/community/profile/${userId}/follow`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Refresh followers list
        fetchFollowers();
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  // Handle unfollow user
  const handleUnfollowUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/community/profile/${userId}/follow`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Refresh followers list
        fetchFollowers();
      }
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  // If no profile, show error
  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          User profile not found
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

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
                  {userInfo.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              
              <Box sx={{ mb: 2, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {userInfo.name}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: 1, minWidth: '300px' }}>
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
                  
                  {userInfo.shopName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {userInfo.shopName}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Joined {formatDate(profile.communityStats?.joinDate || profile._id)}
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
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Button
                  variant={isFollowing ? "outlined" : "contained"}
                  onClick={handleFollowToggle}
                  disabled={loading.follow}
                  startIcon={loading.follow ? <CircularProgress size={20} /> : undefined}
                >
                  {loading.follow ? '...' : isFollowing ? 'Following' : 'Follow'}
                </Button>
                
                {canMessage() && (
                  <Button
                    variant="outlined"
                    startIcon={<MessageIcon />}
                    onClick={() => setMessageDialogOpen(true)}
                  >
                    Message
                  </Button>
                )}
                
                {userInfo.email && (
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    onClick={() => window.location.href = `mailto:${userInfo.email}`}
                  >
                    Email
                  </Button>
                )}
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
                mt: 3,
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {formatNumber(followerCount)}
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
                    {formatNumber(profile.communityStats?.totalPosts || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posts
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {formatNumber(profile.communityStats?.engagementScore || 0)}
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
                  label={`Followers (${formatNumber(followerCount)})`} 
                />
                <Tab 
                  icon={<PeopleIcon />} 
                  iconPosition="start"
                  label={`Following (${formatNumber(profile.followingCount)})`} 
                />
                <Tab 
                  icon={<ForumIcon />} 
                  iconPosition="start"
                  label={`Posts (${formatNumber(profile.communityStats?.totalPosts || 0)})`} 
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
                            {userInfo.name} has created {profile.communityStats?.totalPosts || 0} posts and made {profile.communityStats?.totalComments || 0} comments in the community.
                          </Typography>
                          <Typography variant="body2">
                            Last active: {formatDate(profile.communityStats?.lastActive || profile._id, true)}
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
                            {userInfo.name} has given {profile.communityStats?.totalLikesGiven || 0} likes and received {profile.communityStats?.totalLikesReceived || 0} likes.
                          </Typography>
                          <Typography variant="body2">
                            Engagement score: {profile.communityStats?.engagementScore || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                    
                    {/* Subscription Info */}
                    {userInfo.subscription && (
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Subscription Status
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                              label={userInfo.subscription.plan.toUpperCase()}
                              color={
                                userInfo.subscription.plan === 'premium' ? 'primary' : 
                                userInfo.subscription.plan === 'pro' ? 'success' : 'default'
                              }
                              variant="outlined"
                            />
                            <Typography variant="body2" color="text.secondary">
                              Status: {userInfo.subscription.status}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6">
                      Followers ({formatNumber(followerCount)})
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
                  
                  {loading.followers ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : followers.length === 0 ? (
                    <Alert severity="info">
                      No followers yet.
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
                  
                  {loading.following ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : following.length === 0 ? (
                    <Alert severity="info">
                      Not following anyone yet.
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
                      Posts ({formatNumber(profile.communityStats?.totalPosts || userPosts.length)})
                    </Typography>
                  </Box>
                  
                  {loading.posts ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : userPosts.length === 0 ? (
                    <Alert severity="info">
                      {userInfo.name} hasn't created any posts yet.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {userPosts.map((post) => (
                        <Box key={post._id}>
                          <PostCard
                            post={{
                              _id: post._id,
                              title: post.title,
                              excerpt: post.excerpt,
                              author: post.author,
                              category: post.category,
                              tags: post.tags,
                              likeCount: post.likeCount,
                              commentCount: post.commentCount,
                              views: post.views,
                              createdAt: post.createdAt,
                              updatedAt: post.updatedAt,
                              isPinned: post.isPinned,
                              isSolved: post.isSolved,
                              attachments: post.attachments
                            }}
                            showActions={true}
                            onViewPost={(postId) => router.push(`/community/post/${postId}`)}
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

      {/* Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Message to {userInfo.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message here..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={!messageContent.trim() || sendingMessage}
            startIcon={sendingMessage ? <CircularProgress size={20} /> : undefined}
          >
            {sendingMessage ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}