// components/community/UserProfileDialog.tsx - UPDATED VERSION
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Avatar,
  Typography,
  Chip,
  Stack,
  Divider,
  Button,
  IconButton,
  Paper,
  alpha,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Forum as ForumIcon,
  ThumbUp as LikeIcon,
  Bookmark as BookmarkIcon,
  People as PeopleIcon,
  CheckCircle as VerifiedIcon,
  Link as LinkIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
} from "@mui/icons-material";
import { formatDate } from "@/utils/dateUtils";

interface UserProfile {
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
  isFollowing?: boolean;
}

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  loading?: boolean;
  user?: UserProfile | null;
}

export default function UserProfileDialog({
  open,
  onClose,
  userId,
  loading = false,
  user,
}: UserProfileDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing || false);
  const [followerCount, setFollowerCount] = useState(user?.followerCount || 0);

  useEffect(() => {
    if (user) {
      setIsFollowing(user.isFollowing || false);
      setFollowerCount(user.followerCount || 0);
    }
  }, [user]);

  const handleFollowToggle = async () => {
    if (!user) return;
    
    setFollowLoading(true);
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const response = await fetch(`/api/community/profile/${user.userId._id}/follow`, {
        method,
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsFollowing(!isFollowing);
        setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const renderSocialLinks = () => {
    if (!user?.socialLinks) return null;
    
    const { twitter, linkedin, instagram, facebook } = user.socialLinks;
    const links = [];
    
    if (twitter) links.push({ icon: <TwitterIcon />, url: twitter });
    if (linkedin) links.push({ icon: <LinkedInIcon />, url: linkedin });
    if (instagram) links.push({ icon: <InstagramIcon />, url: instagram });
    if (facebook) links.push({ icon: <FacebookIcon />, url: facebook });
    
    if (links.length === 0) return null;
    
    return (
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        {links.map((link, index) => (
          <Tooltip key={index} title={link.url}>
            <IconButton
              size="small"
              onClick={() => window.open(link.url, '_blank')}
              sx={{ color: 'text.secondary' }}
            >
              {link.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">User Profile</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : user ? (
          <Box>
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    user.verificationBadge && (
                      <VerifiedIcon sx={{ color: '#1DA1F2', fontSize: 20 }} />
                    )
                  }
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      fontSize: 40,
                      border: '3px solid white',
                      boxShadow: 2,
                    }}
                    src={user.avatar}
                  >
                    {user.userId.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
                
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h5" fontWeight={600}>
                      {user.userId.name}
                    </Typography>
                    {user.isVerified && (
                      <Chip
                        label="Verified"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={`@${user.username}`}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  
                  {user.userId.shopName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {user.userId.shopName}
                      </Typography>
                    </Box>
                  )}
                  
                  {user.bio && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {user.bio}
                    </Typography>
                  )}
                  
                  {/* Follow Stats */}
                  <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{followerCount}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Followers
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{user.followingCount}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Following
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{user.communityStats?.totalPosts || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Posts
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={isFollowing ? "outlined" : "contained"}
                      size="small"
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                    >
                      {followLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EmailIcon />}
                    >
                      Message
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Details Section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {user.location && (
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Location
                      </Typography>
                    </Box>
                    <Typography variant="body2">{user.location}</Typography>
                  </Paper>
                </Grid>
              )}
              
              {user.website && (
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <LinkIcon fontSize="small" color="action" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Website
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'primary.main',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(user.website, '_blank')}
                    >
                      {user.website}
                    </Typography>
                  </Paper>
                </Grid>
              )}
              
              {user.userId.subscription && (
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Subscription
                    </Typography>
                    <Chip
                      label={user.userId.subscription.plan}
                      size="small"
                      color={
                        user.userId.subscription.plan === 'premium' ? 'primary' : 
                        user.userId.subscription.plan === 'pro' ? 'success' : 'default'
                      }
                    />
                  </Paper>
                </Grid>
              )}
              
              <Grid item xs={6}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Member Since
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(user.communityStats?.joinDate || user.userId._id.toString())}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Social Links */}
            {renderSocialLinks()}

            <Divider sx={{ my: 3 }} />

            {/* Community Stats */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Community Activity
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <ForumIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                    <Typography variant="h6">{user.communityStats?.totalPosts || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posts
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <ForumIcon sx={{ color: 'success.main', mb: 0.5 }} />
                    <Typography variant="h6">{user.communityStats?.totalComments || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Comments
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <LikeIcon sx={{ color: '#f44336', mb: 0.5 }} />
                    <Typography variant="h6">{user.communityStats?.totalLikesGiven || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Likes Given
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <BookmarkIcon sx={{ color: '#2196f3', mb: 0.5 }} />
                    <Typography variant="h6">{user.communityStats?.totalBookmarks || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Bookmarks
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Expert Categories */}
            {user.expertInCategories && user.expertInCategories.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Expert In
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {user.expertInCategories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Badges
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {user.badges.map((badge, index) => (
                    <Tooltip key={index} title={badge}>
                      <Chip
                        label={badge}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <PersonIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              User not found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The user profile could not be loaded.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}