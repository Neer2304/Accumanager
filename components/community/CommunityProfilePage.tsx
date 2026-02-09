"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
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
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  Stack,
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
  Home as HomeIcon,
  Tag as TagIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate, formatNumber } from '@/utils/formatUtils';
import CommunityProfileDialog from './CommunityProfileDialog';
import FollowDialog from './FollowDialog';
import { useTheme } from '@mui/material/styles';
import UserCard from './UserCard';
import PostCard from './PostCard';

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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
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

  const getActivitiesByType = (type: 'liked' | 'bookmarked' | 'created' | 'commented') => {
    return activities.filter(activity => activity.type === type);
  };

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
        case 4:
        case 5:
          break;
      }
    }
  }, [tabValue, profile]);

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

  const getActivityInfo = (type: string) => {
    switch (type) {
      case 'liked':
        return { icon: <ThumbUpIcon sx={{ color: '#ea4335' }} />, label: 'Liked' };
      case 'bookmarked':
        return { icon: <BookmarkIcon sx={{ color: '#4285f4' }} />, label: 'Bookmarked' };
      case 'created':
        return { icon: <ForumIcon sx={{ color: '#34a853' }} />, label: 'Created' };
      case 'commented':
        return { icon: <CommentIcon sx={{ color: '#fbbc04' }} />, label: 'Commented on' };
      default:
        return { icon: <ForumIcon />, label: 'Posted' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CircularProgress sx={{ color: '#4285f4' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            bgcolor: darkMode ? '#3c1e1e' : '#fdecea',
          }}
          action={
            <Button color="inherit" size="small" onClick={fetchProfile}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
          }}
        >
          No profile found. Please create your community profile.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => setEditDialogOpen(true)}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#4285f4',
            '&:hover': {
              backgroundColor: '#3367d6',
            },
          }}
        >
          Create Profile
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff', 
        minHeight: '100vh',
        py: 4,
      }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&:hover': { color: darkMode ? '#8ab4f8' : '#4285f4' },
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
              Dashboard
            </MuiLink>
            <MuiLink
              component={Link}
              href="/community"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&:hover': { color: darkMode ? '#8ab4f8' : '#4285f4' },
              }}
            >
              Community
            </MuiLink>
            <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Profile
            </Typography>
          </Breadcrumbs>

          <Paper 
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              mb: 3,
              position: 'relative',
              bgcolor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box
              sx={{
                height: 200,
                backgroundColor: darkMode ? '#303134' : alpha('#4285f4', 0.1),
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
                  left: { xs: 20, md: 40 },
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    profile.verificationBadge && (
                      <VerifiedIcon sx={{ 
                        color: '#4285f4', 
                        fontSize: 28,
                        bgcolor: darkMode ? '#202124' : 'white',
                        borderRadius: '50%',
                        p: 0.5,
                      }} />
                    )
                  }
                >
                  <Avatar
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: { xs: 100, sm: 120 },
                      fontSize: 48,
                      border: '4px solid',
                      borderColor: darkMode ? '#202124' : 'white',
                      boxShadow: 3,
                    }}
                    src={profile.avatar}
                  >
                    {profile.userId.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
                
                <Box sx={{ 
                  mb: 2, 
                  color: 'white', 
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  textAlign: { xs: 'center', sm: 'left' },
                }}>
                  <Typography variant="h4" fontWeight={600} gutterBottom>
                    {profile.userId.name}
                    {profile.isVerified && (
                      <VerifiedIcon 
                        sx={{ 
                          color: '#4285f4', 
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

            <Box sx={{ pt: 8, px: { xs: 2, sm: 4 }, pb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
              }}>
                <Box sx={{ flex: 1, width: '100%' }}>
                  {profile.bio && (
                    <Typography 
                      variant="body1" 
                      paragraph 
                      sx={{ 
                        maxWidth: 800,
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    >
                      {profile.bio}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    {profile.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {profile.location}
                        </Typography>
                      </Box>
                    )}
                    
                    {profile.userId.shopName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {profile.userId.shopName}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Joined {formatDate(profile.communityStats.joinDate)}
                      </Typography>
                    </Box>
                    
                    {profile.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinkIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4285f4',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'none',
                            },
                          }}
                          onClick={() => window.open(profile.website, '_blank')}
                        >
                          Website
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {profile.socialLinks && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                      {profile.socialLinks.twitter && (
                        <Tooltip title="Twitter">
                          <IconButton
                            size="small"
                            onClick={() => window.open(profile.socialLinks!.twitter, '_blank')}
                            sx={{ 
                              color: '#1DA1F2',
                              bgcolor: darkMode ? '#303134' : '#f8f9fa',
                              '&:hover': {
                                bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                              },
                            }}
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
                            sx={{ 
                              color: '#0077B5',
                              bgcolor: darkMode ? '#303134' : '#f8f9fa',
                              '&:hover': {
                                bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                              },
                            }}
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
                            sx={{ 
                              color: '#E4405F',
                              bgcolor: darkMode ? '#303134' : '#f8f9fa',
                              '&:hover': {
                                bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                              },
                            }}
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
                            sx={{ 
                              color: '#1877F2',
                              bgcolor: darkMode ? '#303134' : '#f8f9fa',
                              '&:hover': {
                                bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                              },
                            }}
                          >
                            <FacebookIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}

                  {profile.badges && profile.badges.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        Badges
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {profile.badges.map((badge, index) => (
                          <Chip
                            key={index}
                            label={badge}
                            size="small"
                            sx={{
                              bgcolor: darkMode ? '#303134' : '#f1f3f4',
                              color: darkMode ? '#8ab4f8' : '#4285f4',
                              borderColor: darkMode ? '#5f6368' : '#dadce0',
                            }}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {profile.expertInCategories && profile.expertInCategories.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        Expert In
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {profile.expertInCategories.map((category, index) => (
                          <Chip
                            key={index}
                            label={category}
                            size="small"
                            sx={{
                              bgcolor: darkMode ? '#303134' : '#f1f3f4',
                              color: darkMode ? '#8ab4f8' : '#4285f4',
                              borderColor: darkMode ? '#5f6368' : '#dadce0',
                            }}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditDialogOpen(true)}
                    sx={{
                      borderColor: darkMode ? '#5f6368' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: '#4285f4',
                        backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                  <IconButton
                    sx={{
                      border: '1px solid',
                      borderColor: darkMode ? '#5f6368' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: '#4285f4',
                        backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                      },
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Box>
              </Box>

              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: '1px solid',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  mt: 3,
                }}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
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
                      sx={{
                        color: '#4285f4',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {formatNumber(profile.followerCount)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Followers
                    </Typography>
                  </Box>
                  
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
                      sx={{
                        color: '#4285f4',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {formatNumber(profile.followingCount)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Following
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: '#4285f4' }}>
                      {formatNumber(activityStats.totalPosts || profile.communityStats.totalPosts)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Posts
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: '#4285f4' }}>
                      {formatNumber(activityStats.totalLikes || profile.communityStats.totalLikesGiven)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Likes Given
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Paper>

          <Paper sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Box sx={{ borderBottom: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    textTransform: 'none',
                    minHeight: 56,
                    '&.Mui-selected': {
                      color: '#4285f4',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#4285f4',
                  },
                }}
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

            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 3 }}>
                    Community Activity Overview
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                      <Card sx={{ 
                        flex: 1, 
                        minWidth: '300px',
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
                            }}>
                              <ForumIcon sx={{ fontSize: 20, color: '#4285f4' }} />
                            </Box>
                            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              Post Activity
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph>
                            You have created {activityStats.totalPosts || profile.communityStats.totalPosts} posts and made {profile.communityStats.totalComments} comments in the community.
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Last active: {formatDate(profile.communityStats.lastActive, true)}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card sx={{ 
                        flex: 1, 
                        minWidth: '300px',
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: alpha('#34a853', darkMode ? 0.2 : 0.1),
                            }}>
                              <ThumbUpIcon sx={{ fontSize: 20, color: '#34a853' }} />
                            </Box>
                            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              Engagement
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph>
                            You've given {activityStats.totalLikes || profile.communityStats.totalLikesGiven} likes and received {profile.communityStats.totalLikesReceived} likes.
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Engagement score: {profile.communityStats.engagementScore}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>

                    {activities.length > 0 && (
                      <Card sx={{ 
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            Recent Activity
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {activities.slice(0, 5).map((activity, index) => {
                              const { icon, label } = getActivityInfo(activity.type);
                              return (
                                <Box 
                                  key={index} 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 2,
                                    p: 1.5,
                                    borderRadius: 1,
                                    bgcolor: darkMode ? '#202124' : 'white',
                                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                                    transition: 'all 0.2s',
                                    '&:hover': { 
                                      bgcolor: darkMode ? '#3c4043' : '#f8f9fa',
                                      cursor: 'pointer',
                                    }
                                  }}
                                  onClick={() => router.push(`/community/post/${activity._id}`)}
                                >
                                  {icon}
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                      {label}: {activity.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                      {formatDate(activity.lastActivityAt, true)}
                                    </Typography>
                                  </Box>
                                  <Button 
                                    size="small"
                                    sx={{
                                      color: '#4285f4',
                                      textTransform: 'none',
                                      '&:hover': {
                                        backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                                      },
                                    }}
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

                    {profile.userId.subscription && (
                      <Card sx={{ 
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            Subscription Status
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                              label={profile.userId.subscription.plan.toUpperCase()}
                              sx={{
                                bgcolor: profile.userId.subscription.plan === 'premium' ? '#fbbc04' : 
                                         profile.userId.subscription.plan === 'pro' ? '#34a853' : 
                                         darkMode ? '#5f6368' : '#f1f3f4',
                                color: profile.userId.subscription.plan === 'premium' ? '#202124' : 
                                       profile.userId.subscription.plan === 'pro' ? 'white' : 
                                       darkMode ? '#e8eaed' : '#5f6368',
                                fontWeight: 500,
                              }}
                            />
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
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
                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
                            <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          </InputAdornment>
                        ),
                        sx: { color: darkMode ? '#e8eaed' : '#202124' }
                      }}
                      sx={{ 
                        width: { xs: '100%', sm: '300px' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#4285f4',
                          },
                        },
                      }}
                    />
                  </Box>
                  
                  {statsLoading.followers ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress sx={{ color: '#4285f4' }} />
                    </Box>
                  ) : followers.length === 0 ? (
                    <Alert 
                      severity="info"
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      }}
                    >
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
                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
                            <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          </InputAdornment>
                        ),
                        sx: { color: darkMode ? '#e8eaed' : '#202124' }
                      }}
                      sx={{ 
                        width: { xs: '100%', sm: '300px' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#4285f4',
                          },
                        },
                      }}
                    />
                  </Box>
                  
                  {statsLoading.following ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress sx={{ color: '#4285f4' }} />
                    </Box>
                  ) : following.length === 0 ? (
                    <Alert 
                      severity="info"
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      }}
                    >
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
                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Your Posts ({formatNumber(activityStats.totalPosts || profile.communityStats.totalPosts)})
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => router.push('/community/create')}
                      sx={{
                        backgroundColor: '#4285f4',
                        '&:hover': {
                          backgroundColor: '#3367d6',
                        },
                      }}
                    >
                      Create New Post
                    </Button>
                  </Box>
                  
                  {statsLoading.activity ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress sx={{ color: '#4285f4' }} />
                    </Box>
                  ) : getActivitiesByType('created').length === 0 ? (
                    <Alert 
                      severity="info"
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      }}
                    >
                      You haven't created any posts yet.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {getActivitiesByType('created').map((post) => (
                        <Box key={post._id}>
                          <Card sx={{ 
                            borderRadius: 2,
                            bgcolor: darkMode ? '#303134' : '#f8f9fa',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: alpha('#34a853', darkMode ? 0.2 : 0.1),
                                }}>
                                  <ForumIcon sx={{ fontSize: 16, color: '#34a853' }} />
                                </Box>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                  {post.title}
                                </Typography>
                                <Chip 
                                  label="Created" 
                                  size="small" 
                                  sx={{
                                    ml: 'auto',
                                    bgcolor: darkMode ? '#303134' : '#f1f3f4',
                                    color: '#34a853',
                                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                                  }}
                                  variant="outlined"
                                />
                              </Box>
                              {post.excerpt && (
                                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph>
                                  {post.excerpt}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    👍 {post.likeCount}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    💬 {post.commentCount}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    <VisibilityIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                                    {post.views}
                                  </Typography>
                                </Box>
                                <Button 
                                  size="small" 
                                  onClick={() => router.push(`/community/post/${post._id}`)}
                                  sx={{
                                    color: '#4285f4',
                                    textTransform: 'none',
                                    '&:hover': {
                                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                                    },
                                  }}
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
                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Liked Posts ({formatNumber(activityStats.totalLikes || profile.communityStats.totalLikesGiven)})
                    </Typography>
                  </Box>
                  
                  {statsLoading.activity ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress sx={{ color: '#4285f4' }} />
                    </Box>
                  ) : getActivitiesByType('liked').length === 0 ? (
                    <Alert 
                      severity="info"
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      }}
                    >
                      You haven't liked any posts yet.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {getActivitiesByType('liked').map((post) => (
                        <Box key={post._id}>
                          <Card sx={{ 
                            borderRadius: 2,
                            bgcolor: darkMode ? '#303134' : '#f8f9fa',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: alpha('#ea4335', darkMode ? 0.2 : 0.1),
                                }}>
                                  <ThumbUpIcon sx={{ fontSize: 16, color: '#ea4335' }} />
                                </Box>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                  {post.title}
                                </Typography>
                                <Chip 
                                  label="Liked" 
                                  size="small" 
                                  sx={{
                                    ml: 'auto',
                                    bgcolor: darkMode ? '#303134' : '#f1f3f4',
                                    color: '#ea4335',
                                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                                  }}
                                  variant="outlined"
                                />
                              </Box>
                              {post.excerpt && (
                                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph>
                                  {post.excerpt}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    👍 {post.likeCount}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    💬 {post.commentCount}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    <VisibilityIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                                    {post.views}
                                  </Typography>
                                </Box>
                                <Button 
                                  size="small" 
                                  onClick={() => router.push(`/community/post/${post._id}`)}
                                  sx={{
                                    color: '#4285f4',
                                    textTransform: 'none',
                                    '&:hover': {
                                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                                    },
                                  }}
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
                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Bookmarked Posts ({formatNumber(activityStats.totalBookmarks || profile.communityStats.totalBookmarks)})
                    </Typography>
                  </Box>
                  
                  {statsLoading.activity ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress sx={{ color: '#4285f4' }} />
                    </Box>
                  ) : getActivitiesByType('bookmarked').length === 0 ? (
                    <Alert 
                      severity="info"
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      }}
                    >
                      You haven't bookmarked any posts yet.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {getActivitiesByType('bookmarked').map((post) => (
                        <Box key={post._id}>
                          <Card sx={{ 
                            borderRadius: 2,
                            bgcolor: darkMode ? '#303134' : '#f8f9fa',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
                                }}>
                                  <BookmarkIcon sx={{ fontSize: 16, color: '#4285f4' }} />
                                </Box>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                  {post.title}
                                </Typography>
                                <Chip 
                                  label="Bookmarked" 
                                  size="small" 
                                  sx={{
                                    ml: 'auto',
                                    bgcolor: darkMode ? '#303134' : '#f1f3f4',
                                    color: '#4285f4',
                                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                                  }}
                                  variant="outlined"
                                />
                              </Box>
                              {post.excerpt && (
                                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph>
                                  {post.excerpt}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    👍 {post.likeCount}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    💬 {post.commentCount}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    <VisibilityIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                                    {post.views}
                                  </Typography>
                                </Box>
                                <Button 
                                  size="small" 
                                  onClick={() => router.push(`/community/post/${post._id}`)}
                                  sx={{
                                    color: '#4285f4',
                                    textTransform: 'none',
                                    '&:hover': {
                                      backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                                    },
                                  }}
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
        </Container>
      </Box>

      <CommunityProfileDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        profile={profile}
        onUpdate={handleProfileUpdate}
      />

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