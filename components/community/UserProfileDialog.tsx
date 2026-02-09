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
  Divider,
  Button,
  IconButton,
  Paper,
  CircularProgress,
  Badge,
  Tooltip,
  alpha,
  Stack,
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
  Message as MessageIcon,
} from "@mui/icons-material";
import { formatDate } from "@/utils/dateUtils";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
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
      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
        {links.map((link, index) => (
          <Tooltip key={index} title={link.url}>
            <IconButton
              size="small"
              onClick={() => window.open(link.url, '_blank')}
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                '&:hover': {
                  bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                },
              }}
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
          borderRadius: 2,
          maxHeight: '90vh',
          m: { xs: 1, sm: 2 },
          width: { xs: 'calc(100% - 16px)', sm: 'auto' },
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        },
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        borderBottom: 1,
        borderColor: darkMode ? '#3c4043' : '#dadce0',
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            User Profile
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': {
                backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ 
        p: { xs: 2, sm: 3 },
        bgcolor: darkMode ? '#202124' : '#ffffff',
      }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        ) : user ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 3, 
              alignItems: { xs: 'center', sm: 'flex-start' } 
            }}>
              <Box sx={{ position: 'relative' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    user.verificationBadge && (
                      <VerifiedIcon sx={{ 
                        color: '#4285f4', 
                        fontSize: 20,
                        bgcolor: darkMode ? '#202124' : '#ffffff',
                        borderRadius: '50%',
                      }} />
                    )
                  }
                >
                  <Avatar
                    sx={{
                      width: { xs: 80, sm: 100 },
                      height: { xs: 80, sm: 100 },
                      fontSize: { xs: 32, sm: 40 },
                      border: '3px solid',
                      borderColor: darkMode ? '#202124' : '#ffffff',
                      boxShadow: 2,
                    }}
                    src={user.avatar}
                  >
                    {user.userId.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              </Box>
              
              <Box sx={{ flex: 1, width: '100%', textAlign: { xs: 'center', sm: 'left' } }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  gap: 1, 
                  mb: 1 
                }}>
                  <Typography variant="h5" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {user.userId.name}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', sm: 'flex-start' } 
                  }}>
                    {user.isVerified && (
                      <Chip
                        label="Verified"
                        size="small"
                        sx={{
                          bgcolor: darkMode ? '#303134' : '#f1f3f4',
                          color: '#4285f4',
                          borderColor: darkMode ? '#5f6368' : '#dadce0',
                        }}
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={`@${user.username}`}
                      size="small"
                      sx={{
                        bgcolor: darkMode ? '#303134' : '#f1f3f4',
                        color: darkMode ? '#e8eaed' : '#202124',
                        borderColor: darkMode ? '#5f6368' : '#dadce0',
                      }}
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                {user.userId.shopName && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 1,
                    justifyContent: { xs: 'center', sm: 'flex-start' } 
                  }}>
                    <BusinessIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      {user.userId.shopName}
                    </Typography>
                  </Box>
                )}
                
                {user.bio && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2, 
                      textAlign: { xs: 'center', sm: 'left' },
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  >
                    {user.bio}
                  </Typography>
                )}
                
                {/* Follow Stats */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  mb: 2,
                  justifyContent: { xs: 'center', sm: 'flex-start' } 
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {followerCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Followers
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {user.followingCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Following
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {user.communityStats?.totalPosts || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Posts
                    </Typography>
                  </Box>
                </Box>
                
                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  flexWrap: 'wrap'
                }}>
                  <Button
                    variant={isFollowing ? "outlined" : "contained"}
                    size="small"
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    sx={{ 
                      minWidth: 100,
                      ...(isFollowing ? {
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
                      }),
                    }}
                  >
                    {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EmailIcon />}
                    sx={{
                      borderColor: darkMode ? '#5f6368' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: '#4285f4',
                        backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                      },
                    }}
                  >
                    Message
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Details Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              flexWrap: 'wrap'
            }}>
              {user.location && (
                <Paper sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  flex: 1,
                  minWidth: { xs: '100%', sm: 'calc(50% - 8px)' },
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <LocationIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    <Typography variant="subtitle2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Location
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {user.location}
                  </Typography>
                </Paper>
              )}
              
              {user.website && (
                <Paper sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  flex: 1,
                  minWidth: { xs: '100%', sm: 'calc(50% - 8px)' },
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <LinkIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    <Typography variant="subtitle2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Website
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#4285f4',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      wordBreak: 'break-word',
                      '&:hover': {
                        textDecoration: 'none',
                      },
                    }}
                    onClick={() => window.open(user.website, '_blank')}
                  >
                    {user.website}
                  </Typography>
                </Paper>
              )}
              
              {user.userId.subscription && (
                <Paper sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  flex: 1,
                  minWidth: { xs: '100%', sm: 'calc(50% - 8px)' },
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Subscription
                  </Typography>
                  <Chip
                    label={user.userId.subscription.plan}
                    size="small"
                    sx={{
                      bgcolor: user.userId.subscription.plan === 'premium' ? '#fbbc04' : 
                               user.userId.subscription.plan === 'pro' ? '#34a853' : 
                               darkMode ? '#303134' : '#f1f3f4',
                      color: user.userId.subscription.plan === 'premium' ? '#202124' : 
                             user.userId.subscription.plan === 'pro' ? 'white' : 
                             darkMode ? '#e8eaed' : '#202124',
                      borderColor: darkMode ? '#5f6368' : '#dadce0',
                    }}
                    variant="outlined"
                  />
                </Paper>
              )}
              
              <Paper sx={{ 
                p: 2, 
                borderRadius: 2,
                flex: 1,
                minWidth: { xs: '100%', sm: 'calc(50% - 8px)' },
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Member Since
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {formatDate(user.communityStats?.joinDate || user.userId._id.toString())}
                </Typography>
              </Paper>
            </Box>

            {/* Social Links */}
            {renderSocialLinks()}

            <Divider sx={{ 
              my: 2, 
              borderColor: darkMode ? '#3c4043' : '#dadce0',
            }} />

            {/* Community Stats */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Community Activity
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}>
                <Paper sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  textAlign: 'center',
                  flex: '1 1 calc(50% - 8px)',
                  minWidth: { xs: 'calc(50% - 8px)', sm: '120px' },
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
                    margin: '0 auto 8px',
                  }}>
                    <ForumIcon sx={{ fontSize: 16, color: '#4285f4' }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {user.communityStats?.totalPosts || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Posts
                  </Typography>
                </Paper>
                
                <Paper sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  textAlign: 'center',
                  flex: '1 1 calc(50% - 8px)',
                  minWidth: { xs: 'calc(50% - 8px)', sm: '120px' },
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: alpha('#34a853', darkMode ? 0.2 : 0.1),
                    margin: '0 auto 8px',
                  }}>
                    <ForumIcon sx={{ fontSize: 16, color: '#34a853' }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {user.communityStats?.totalComments || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Comments
                  </Typography>
                </Paper>
                
                <Paper sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  textAlign: 'center',
                  flex: '1 1 calc(50% - 8px)',
                  minWidth: { xs: 'calc(50% - 8px)', sm: '120px' },
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: alpha('#ea4335', darkMode ? 0.2 : 0.1),
                    margin: '0 auto 8px',
                  }}>
                    <LikeIcon sx={{ fontSize: 16, color: '#ea4335' }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {user.communityStats?.totalLikesGiven || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Likes Given
                  </Typography>
                </Paper>
                
                <Paper sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  textAlign: 'center',
                  flex: '1 1 calc(50% - 8px)',
                  minWidth: { xs: 'calc(50% - 8px)', sm: '120px' },
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
                    margin: '0 auto 8px',
                  }}>
                    <BookmarkIcon sx={{ fontSize: 16, color: '#4285f4' }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {user.communityStats?.totalBookmarks || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Bookmarks
                  </Typography>
                </Paper>
              </Box>
            </Box>

            {/* Expert Categories */}
            {user.expertInCategories && user.expertInCategories.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Expert In
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  {user.expertInCategories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      size="small"
                      variant="outlined"
                      sx={{
                        bgcolor: darkMode ? '#303134' : '#f1f3f4',
                        color: '#4285f4',
                        borderColor: darkMode ? '#5f6368' : '#dadce0',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Badges
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  {user.badges.map((badge, index) => (
                    <Tooltip key={index} title={badge}>
                      <Chip
                        label={badge}
                        size="small"
                        sx={{
                          bgcolor: darkMode ? '#303134' : '#f1f3f4',
                          color: darkMode ? '#fbbc04' : '#f57c00',
                          borderColor: darkMode ? '#5f6368' : '#dadce0',
                        }}
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
            <PersonIcon sx={{ 
              fontSize: 60, 
              color: darkMode ? '#9aa0a6' : '#5f6368', 
              opacity: 0.5, 
              mb: 2 
            }} />
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }} gutterBottom>
              User not found
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              The user profile could not be loaded.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}