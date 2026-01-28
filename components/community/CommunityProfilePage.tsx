// components/community/CommunityProfilePage.tsx - UPDATED WITH ACTIVITY API
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
  Card,
  CardContent,
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
  Comment as CommentIcon,
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
import FollowDialog from './FollowDialog';

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
  isFollowing?: boolean;
}

interface ActivityPost {
  _id: string;
  title: string;
  excerpt?: string;
  category?: string;
  likeCount: number;
  commentCount: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  type: 'liked' | 'bookmarked' | 'created' | 'commented';
  commentContent?: string;
  commentDate?: string;
}

export default function CommunityProfilePage() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [activities, setActivities] = useState<ActivityPost[]>([]);
  const [activityStats, setActivityStats] = useState({
    totalLikes: 0,
    totalBookmarks: 0,
    totalComments: 0,
    totalPosts: 0,
  });
  const [statsLoading, setStatsLoading] = useState({
    followers: false,
    following: false,
    activity: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [followDialogOpen, setFollowDialogOpen] = useState(false);
  const [followDialogType, setFollowDialogType] = useState<'followers' | 'following'>('followers');

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
        `/api/community/profile/${profile.username}/connections?type=followers&limit=12`,
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
        `/api/community/profile/${profile.username}/connections?type=following&limit=12`,
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

  // Fetch all activity data using the activity API
  const fetchActivityData = async () => {
    setStatsLoading(prev => ({ ...prev, activity: true }));
    try {
      const response = await fetch('/api/community/activity', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setActivities(data.data.recentActivity || []);
          setActivityStats({
            totalLikes: data.data.totalLikes || 0,
            totalBookmarks: data.data.totalBookmarks || 0,
            totalComments: data.data.totalComments || 0,
            totalPosts: data.data.totalPosts || 0,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch activity data:', error);
    } finally {
      setStatsLoading(prev => ({ ...prev, activity: false }));
    }
  };

  // Filter activities by type
  const getActivitiesByType = (type: 'liked' | 'bookmarked' | 'created' | 'commented') => {
    return activities.filter(activity => activity.type === type);
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
        case 3: // Posts tab - we'll show created posts from activity data
          // No need to fetch separately, we already have activity data
          break;
        case 4: // Likes tab
          // No need to fetch separately, we already have activity data
          break;
        case 5: // Bookmarks tab
          // No need to fetch separately, we already have activity data
          break;
      }
    }
  }, [tabValue, profile]);

  // Initial load - fetch profile and activity data
  useEffect(() => {
    fetchProfile();
    fetchActivityData();
  }, [fetchProfile]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileUpdate = (updatedProfile: CommunityProfile) => {
    setProfile(updatedProfile);
  };

  const handleFollowUser = async (username: string) => {
    try {
      const response = await fetch(`/api/community/profile/${username}/follow`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh followers list
          fetchFollowers();
        }
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollowUser = async (username: string) => {
    try {
      const response = await fetch(`/api/community/profile/${username}/follow`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh followers list
          fetchFollowers();
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
        // Refresh activity data
        fetchActivityData();
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
        // Refresh activity data
        fetchActivityData();
      }
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    }
  };

  const handleOpenFollowDialog = (type: 'followers' | 'following') => {
    setFollowDialogType(type);
    setFollowDialogOpen(true);
  };

  // Get activity icon and label
  const getActivityInfo = (type: string) => {
    switch (type) {
      case 'liked':
        return { icon: <ThumbUpIcon color="error" />, label: 'Liked' };
      case 'bookmarked':
        return { icon: <BookmarkIcon color="primary" />, label: 'Bookmarked' };
      case 'created':
        return { icon: <ForumIcon color="success" />, label: 'Created' };
      case 'commented':
        return { icon: <CommentIcon color="info" />, label: 'Commented on' };
      default:
        return { icon: <ForumIcon />, label: 'Posted' };
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
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
                </Box>

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
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {profile.badges.map((badge, index) => (
                        <Chip
                          key={index}
                          label={badge}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Expert Categories */}
                {profile.expertInCategories && profile.expertInCategories.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Expert In
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {profile.expertInCategories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
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
              </Box>
            </Box>

            {/* Stats Bar - Make follower/following counts clickable */}
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
                {/* Followers - Clickable */}
                <Box 
                  sx={{ 
                    flex: 1, 
                    minWidth: '120px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => handleOpenFollowDialog('followers')}
                >
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    color="primary"
                    sx={{
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {formatNumber(profile.followerCount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Followers
                  </Typography>
                </Box>
                
                {/* Following - Clickable */}
                <Box 
                  sx={{ 
                    flex: 1, 
                    minWidth: '120px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => handleOpenFollowDialog('following')}
                >
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    color="primary"
                    sx={{
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {formatNumber(profile.followingCount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Following
                  </Typography>
                </Box>
                
                {/* Posts */}
                <Box sx={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {formatNumber(activityStats.totalPosts || profile.communityStats.totalPosts)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posts
                  </Typography>
                </Box>
                
                {/* Likes */}
                <Box sx={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {formatNumber(activityStats.totalLikes || profile.communityStats.totalLikesGiven)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Likes Given
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
                  label={`Posts (${formatNumber(activityStats.totalPosts || profile.communityStats.totalPosts)})`} 
                />
                <Tab 
                  icon={<ThumbUpIcon />} 
                  iconPosition="start"
                  label={`Likes (${formatNumber(activityStats.totalLikes || profile.communityStats.totalLikesGiven)})`} 
                />
                <Tab 
                  icon={<BookmarkIcon />} 
                  iconPosition="start"
                  label={`Bookmarks (${formatNumber(activityStats.totalBookmarks || profile.communityStats.totalBookmarks)})`} 
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
                            You have created {activityStats.totalPosts || profile.communityStats.totalPosts} posts and made {profile.communityStats.totalComments} comments in the community.
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
                            You've given {activityStats.totalLikes || profile.communityStats.totalLikesGiven} likes and received {profile.communityStats.totalLikesReceived} likes.
                          </Typography>
                          <Typography variant="body2">
                            Engagement score: {profile.communityStats.engagementScore}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>

                    {/* Recent Activity Preview */}
                    {activities.length > 0 && (
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Recent Activity
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {activities.slice(0, 5).map((activity, index) => {
                              const { icon, label } = getActivityInfo(activity.type);
                              return (
                                <Box key={index} sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 2,
                                  p: 1,
                                  borderRadius: 1,
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}>
                                  {icon}
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500}>
                                      {label}: {activity.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(activity.lastActivityAt, true)}
                                    </Typography>
                                  </Box>
                                  <Button 
                                    size="small" 
                                    onClick={() => router.push(`/community/post/${activity._id}`)}
                                  >
                                    View
                                  </Button>
                                </Box>
                              );
                            })}
                          </Box>
                        </CardContent>
                      </Card>
                    )}

                    {/* Subscription Info */}
                    {profile.userId.subscription && (
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Subscription Status
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                              label={profile.userId.subscription.plan.toUpperCase()}
                              color={
                                profile.userId.subscription.plan === 'premium' ? 'primary' : 
                                profile.userId.subscription.plan === 'pro' ? 'success' : 'default'
                              }
                              variant="outlined"
                            />
                            <Typography variant="body2" color="text.secondary">
                              Status: {profile.userId.subscription.status}
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
                              onViewProfile={(username) => router.push(`/community/profile/${user.username}`)}
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
                              onViewProfile={(username) => router.push(`/community/profile/${user.username}`)}
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
                      Your Posts ({formatNumber(activityStats.totalPosts || profile.communityStats.totalPosts)})
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => router.push('/community/create')}
                    >
                      Create New Post
                    </Button>
                  </Box>
                  
                  {statsLoading.activity ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : getActivitiesByType('created').length === 0 ? (
                    <Alert severity="info">
                      You haven't created any posts yet.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {getActivitiesByType('created').map((post) => (
                        <Box key={post._id}>
                          <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <ForumIcon color="success" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {post.title}
                                </Typography>
                                <Chip 
                                  label="Created" 
                                  size="small" 
                                  color="success" 
                                  variant="outlined"
                                  sx={{ ml: 'auto' }}
                                />
                              </Box>
                              {post.excerpt && (
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {post.excerpt}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    👍 {post.likeCount}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    💬 {post.commentCount}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    👁️ {post.views}
                                  </Typography>
                                </Box>
                                <Button 
                                  size="small" 
                                  onClick={() => router.push(`/community/post/${post._id}`)}
                                >
                                  View Post
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
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
                      Liked Posts ({formatNumber(activityStats.totalLikes || profile.communityStats.totalLikesGiven)})
                    </Typography>
                  </Box>
                  
                  {statsLoading.activity ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : getActivitiesByType('liked').length === 0 ? (
                    <Alert severity="info">
                      You haven't liked any posts yet.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {getActivitiesByType('liked').map((post) => (
                        <Box key={post._id}>
                          <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <ThumbUpIcon color="error" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {post.title}
                                </Typography>
                                <Chip 
                                  label="Liked" 
                                  size="small" 
                                  color="error" 
                                  variant="outlined"
                                  sx={{ ml: 'auto' }}
                                />
                              </Box>
                              {post.excerpt && (
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {post.excerpt}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    👍 {post.likeCount}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    💬 {post.commentCount}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    👁️ {post.views}
                                  </Typography>
                                </Box>
                                <Button 
                                  size="small" 
                                  onClick={() => router.push(`/community/post/${post._id}`)}
                                >
                                  View Post
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
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
                      Bookmarked Posts ({formatNumber(activityStats.totalBookmarks || profile.communityStats.totalBookmarks)})
                    </Typography>
                  </Box>
                  
                  {statsLoading.activity ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : getActivitiesByType('bookmarked').length === 0 ? (
                    <Alert severity="info">
                      You haven't bookmarked any posts yet.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {getActivitiesByType('bookmarked').map((post) => (
                        <Box key={post._id}>
                          <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <BookmarkIcon color="primary" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {post.title}
                                </Typography>
                                <Chip 
                                  label="Bookmarked" 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                  sx={{ ml: 'auto' }}
                                />
                              </Box>
                              {post.excerpt && (
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {post.excerpt}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    👍 {post.likeCount}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    💬 {post.commentCount}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    👁️ {post.views}
                                  </Typography>
                                </Box>
                                <Button 
                                  size="small" 
                                  onClick={() => router.push(`/community/post/${post._id}`)}
                                >
                                  View Post
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
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

      {/* Follow Dialog */}
      <FollowDialog
        open={followDialogOpen}
        onClose={() => setFollowDialogOpen(false)}
        profileId={profile.username}
        type={followDialogType}
        title={`@${profile.username}'s ${followDialogType}`}
      />
    </>
  );
}