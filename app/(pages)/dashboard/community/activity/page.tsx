// app/(dashboard)/community/activity/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress as MuiCircularProgress,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  ThumbUp as LikeIcon,
  Bookmark as BookmarkIcon,
  ChatBubbleOutline as CommentIcon,
  History as HistoryIcon,
  Forum as ForumIcon,
  TrendingUp,
  Timer,
  FilterList,
  Refresh,
} from "@mui/icons-material";
import Link from "next/link";

// Import Google-themed components
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from '@/components/ui/Select';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { ToggleButton } from '@/components/ui/ToggleButton';
import { Divider } from '@/components/ui/Divider';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';

interface UserActivity {
  _id: string;
  title: string;
  content?: string;
  excerpt?: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  category: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  likeCount?: number;
  commentCount?: number;
  views?: number;
  type: 'liked' | 'bookmarked' | 'commented' | 'created';
  commentContent?: string;
  commentDate?: string;
}

interface ActivityStats {
  totalLikes: number;
  totalBookmarks: number;
  totalComments: number;
  totalPosts: number;
  recentActivity: UserActivity[];
}

// Safe Fade component
const SafeFade = ({ children, ...props }: any) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <>{children}</>;
  }
  
  return (
    <div style={{ opacity: 1, transition: 'opacity 300ms' }}>
      {children}
    </div>
  );
};

export default function ActivityPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';
  
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<ActivityStats | null>(null);
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([]);
  const [visibleActivities, setVisibleActivities] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  const tabs = [
    { label: "All Activity", value: "all", icon: <HistoryIcon /> },
    { label: "Liked", value: "liked", icon: <LikeIcon /> },
    { label: "Bookmarks", value: "bookmarked", icon: <BookmarkIcon /> },
    { label: "Comments", value: "commented", icon: <CommentIcon /> },
    { label: "My Posts", value: "created", icon: <ForumIcon /> },
  ];

  // Fetch user activity with pagination
  const fetchUserActivity = async (limit?: number) => {
    try {
      if (!limit) setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (sortBy !== 'recent') params.append('sort', sortBy);
      
      const response = await fetch(`/api/community/activity?${params.toString()}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activity: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        if (limit) {
          // Append new activities for load more
          setActivityData(prev => ({
            ...data.data,
            recentActivity: [...(prev?.recentActivity || []), ...data.data.recentActivity]
          }));
        } else {
          setActivityData(data.data);
        }
      } else {
        throw new Error(data.message || "Failed to fetch activity");
      }
    } catch (err) {
      console.error("Fetch activity error:", err);
      setError(err instanceof Error ? err.message : "Failed to load activity");
    } finally {
      setLoading(false);
      if (limit) setLoadingMore(false);
    }
  };

  // Filter activities based on selected tab and search
  useEffect(() => {
    if (!activityData?.recentActivity) return;
    
    let filtered = [...activityData.recentActivity];
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(activity => activity.type === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchLower) ||
        activity.excerpt?.toLowerCase().includes(searchLower) ||
        activity.commentContent?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort activities
    filtered.sort((a, b) => {
      const dateA = a.type === 'commented' ? a.commentDate || a.updatedAt : a.updatedAt;
      const dateB = b.type === 'commented' ? b.commentDate || b.updatedAt : b.updatedAt;
      
      switch (sortBy) {
        case 'popular':
          return ((b.likeCount || 0) + (b.commentCount || 0)) - ((a.likeCount || 0) + (a.commentCount || 0));
        case 'oldest':
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        case 'recent':
        default:
          return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
    });
    
    setFilteredActivities(filtered);
  }, [activityData, activeTab, searchTerm, sortBy]);

  useEffect(() => {
    fetchUserActivity();
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setVisibleActivities(prev => prev + 5);
    // Simulate API call for more data
    setTimeout(() => {
      // In real implementation, you would fetch next page from API
      // For now, we'll just simulate loading
      setLoadingMore(false);
    }, 500);
  };

  const handleRefresh = () => {
    setVisibleActivities(5);
    fetchUserActivity();
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setVisibleActivities(5);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'liked': return <LikeIcon sx={{ color: "#d93025" }} />;
      case 'bookmarked': return <BookmarkIcon sx={{ color: "#1a73e8" }} />;
      case 'commented': return <CommentIcon sx={{ color: "#0d652d" }} />;
      case 'created': return <ForumIcon sx={{ color: "#9334e6" }} />;
      default: return <HistoryIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'liked': return "#d93025";
      case 'bookmarked': return "#1a73e8";
      case 'commented': return "#0d652d";
      case 'created': return "#9334e6";
      default: return "#5f6368";
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'liked': return "liked this post";
      case 'bookmarked': return "bookmarked this post";
      case 'commented': return "commented on this post";
      case 'created': return "created this post";
      default: return "interacted with this post";
    }
  };

  const displayedActivities = filteredActivities.slice(0, visibleActivities);
  const hasMoreActivities = visibleActivities < filteredActivities.length;
  const activeTabData = tabs.find(tab => tab.value === activeTab);

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? "#202124" : "#ffffff",
        color: darkMode ? "#e8eaed" : "#202124",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
          background: darkMode
            ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        }}
      >
        <SafeFade>
          <Breadcrumbs
            sx={{
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 400,
                "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
              }}
            >
              <HomeIcon
                sx={{
                  mr: 0.5,
                  fontSize: { xs: "16px", sm: "18px" },
                }}
              />
              Dashboard
            </MuiLink>
            <MuiLink
              component={Link}
              href="/community"
              sx={{
                textDecoration: "none",
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 400,
                "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
              }}
            >
              Community
            </MuiLink>
            <Typography
              color={darkMode ? "#e8eaed" : "#202124"}
              fontWeight={500}
            >
              My Activity
            </Typography>
          </Breadcrumbs>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              fontWeight={500}
              gutterBottom
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              My Activity
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 400,
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Track your engagement and contributions in the community
            </Typography>
          </Box>
        </SafeFade>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        {/* Error Alert */}
        <SafeFade>
          {error && (
            <Alert
              severity="error"
              title="Error"
              message={error}
              dismissible
              onDismiss={() => setError(null)}
              sx={{ mb: 3 }}
            />
          )}
        </SafeFade>

        {/* Stats Cards */}
        <SafeFade>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
            gap: 2, 
            mb: 4,
          }}>
            <Card sx={{ 
              p: 2.5, 
              textAlign: 'center',
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Typography variant="h4" fontWeight={700} color="#d93025">
                {activityData?.totalLikes || 0}
              </Typography>
              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                Posts Liked
              </Typography>
            </Card>
            
            <Card sx={{ 
              p: 2.5, 
              textAlign: 'center',
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Typography variant="h4" fontWeight={700} color="#1a73e8">
                {activityData?.totalBookmarks || 0}
              </Typography>
              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                Bookmarks
              </Typography>
            </Card>
            
            <Card sx={{ 
              p: 2.5, 
              textAlign: 'center',
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Typography variant="h4" fontWeight={700} color="#0d652d">
                {activityData?.totalComments || 0}
              </Typography>
              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                Comments
              </Typography>
            </Card>
            
            <Card sx={{ 
              p: 2.5, 
              textAlign: 'center',
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Typography variant="h4" fontWeight={700} color="#9334e6">
                {activityData?.totalPosts || 0}
              </Typography>
              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                My Posts
              </Typography>
            </Card>
          </Box>
        </SafeFade>

        {/* Filters Section */}
        <SafeFade>
          <Card
            title="Filter Activities"
            subtitle="Find specific activities by type or search"
            hover
            sx={{ mb: 4 }}
          >
            <Box sx={{ mb: 3 }}>
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<HistoryIcon />}
                size="medium"
                sx={{ flex: 1 }}
              />
            </Box>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              alignItems: { xs: 'stretch', sm: 'center' },
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color={darkMode ? "#e8eaed" : "#202124"} gutterBottom>
                  Activity Type
                </Typography>
                <ToggleButtonGroup
                  value={activeTab}
                  exclusive
                  onChange={(e, newTab) => newTab && handleTabChange(newTab)}
                  size="small"
                  fullWidth={isMobile}
                >
                  {tabs.map((tab) => (
                    <ToggleButton key={tab.value} value={tab.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {tab.icon}
                        <span>{tab.label}</span>
                      </Box>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color={darkMode ? "#e8eaed" : "#202124"} gutterBottom>
                  Sort By
                </Typography>
                <Select
                  size="small"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={[
                    { value: 'recent', label: 'Most Recent' },
                    { value: 'popular', label: 'Most Popular' },
                    { value: 'oldest', label: 'Oldest First' },
                  ]}
                  sx={{ minWidth: 140 }}
                />
              </Box>
              
              <Box>
                <Tooltip title="Refresh activities">
                  <IconButton
                    onClick={handleRefresh}
                    sx={{ 
                      color: darkMode ? "#e8eaed" : "#202124",
                      '&:hover': { bgcolor: darkMode ? '#3c4043' : '#f0f0f0' }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Card>
        </SafeFade>

        {/* Activities List */}
        <SafeFade>
          <Card
            title={activeTab === 'all' ? 'All Activities' : `${activeTabData?.label}`}
            subtitle={`Showing ${displayedActivities.length} of ${filteredActivities.length} activities`}
            hover={false}
            sx={{ mb: 3 }}
          >
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                p: 6,
                flexDirection: 'column',
                gap: 2
              }}>
                <MuiCircularProgress size={isMobile ? 40 : 60} sx={{ color: '#1a73e8' }} />
                <Typography variant="body1" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                  Loading your activities...
                </Typography>
              </Box>
            ) : displayedActivities.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                p: 4,
                color: darkMode ? "#9aa0a6" : "#5f6368"
              }}>
                <HistoryIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom sx={{ color: darkMode ? "#e8eaed" : "#202124" }}>
                  No activities found
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  {searchTerm 
                    ? 'Try a different search term'
                    : activeTab === 'all'
                      ? "You haven't interacted with the community yet"
                      : `You haven't ${activeTab} any posts yet`
                  }
                </Typography>
                {(searchTerm || activeTab !== 'all') && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearchTerm('');
                      setActiveTab('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {displayedActivities.map((activity, index) => {
                  const activityColor = getActivityColor(activity.type);
                  const activityDate = activity.type === 'commented' 
                    ? activity.commentDate || activity.updatedAt 
                    : activity.updatedAt;
                  
                  return (
                    <React.Fragment key={`${activity._id}-${activity.type}-${index}`}>
                      <Card
                        hover
                        sx={{
                          p: 2.5,
                          borderLeft: `4px solid ${activityColor}`,
                          bgcolor: darkMode ? '#303134' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: darkMode 
                              ? '0 4px 20px rgba(0,0,0,0.3)' 
                              : '0 4px 20px rgba(0,0,0,0.08)',
                          }
                        }}
                        onClick={() => {
                          // Navigate to the post
                          // router.push(`/community/posts/${activity._id}`);
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{ 
                                bgcolor: alpha(activityColor, 0.1), 
                                color: activityColor,
                                width: 40,
                                height: 40
                              }}
                            >
                              {getActivityIcon(activity.type)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600} color={darkMode ? "#e8eaed" : "#202124"}>
                                {activity.title}
                              </Typography>
                              <Typography variant="caption" color={activityColor} sx={{ display: 'block', mt: 0.5 }}>
                                You {getActivityText(activity.type)} • {formatRelativeTime(activityDate)}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={activity.category}
                            size="small"
                            sx={{
                              bgcolor: alpha('#1a73e8', 0.1),
                              color: '#1a73e8',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 20,
                              textTransform: 'capitalize'
                            }}
                          />
                        </Box>

                        {/* Comment content if available */}
                        {activity.type === 'commented' && activity.commentContent && (
                          <Box sx={{ 
                            my: 2, 
                            p: 2,
                            borderRadius: 1,
                            bgcolor: darkMode ? '#0d3064' : '#e8f0fe',
                            borderLeft: '3px solid #1a73e8'
                          }}>
                            <Typography variant="body2" color={darkMode ? "#8ab4f8" : "#1a73e8"} sx={{ mb: 0.5, fontWeight: 500 }}>
                              Your comment:
                            </Typography>
                            <Typography variant="body2" color={darkMode ? "#e8eaed" : "#202124"}>
                              {activity.commentContent}
                            </Typography>
                          </Box>
                        )}

                        {/* Excerpt for posts */}
                        {activity.excerpt && activity.type !== 'commented' && (
                          <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"} sx={{ mb: 2, lineHeight: 1.6 }}>
                            {activity.excerpt}
                          </Typography>
                        )}

                        {/* Stats */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 2,
                          borderTop: darkMode ? '1px solid #3c4043' : '1px solid #f0f0f0'
                        }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Tooltip title="Likes">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LikeIcon sx={{ fontSize: 14, color: darkMode ? "#9aa0a6" : "#5f6368" }} />
                                <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                                  {activity.likeCount || 0}
                                </Typography>
                              </Box>
                            </Tooltip>
                            <Tooltip title="Comments">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CommentIcon sx={{ fontSize: 14, color: darkMode ? "#9aa0a6" : "#5f6368" }} />
                                <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                                  {activity.commentCount || 0}
                                </Typography>
                              </Box>
                            </Tooltip>
                            <Tooltip title="Views">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Timer sx={{ fontSize: 14, color: darkMode ? "#9aa0a6" : "#5f6368" }} />
                                <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                                  {activity.views || 0}
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Box>
                          
                          <Badge
                            badgeContent={activity.type.toUpperCase()}
                            color={
                              activity.type === 'liked' ? 'error' :
                              activity.type === 'bookmarked' ? 'primary' :
                              activity.type === 'commented' ? 'success' :
                              'secondary'
                            }
                            // size="small"
                          />
                        </Box>
                      </Card>
                      {index < displayedActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}

                {/* Load More Button */}
                {hasMoreActivities && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 3,
                    mb: 2 
                  }}>
                    <Button
                      variant="outlined"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      size="medium"
                      sx={{
                        minWidth: 200,
                        borderColor: darkMode ? '#5f6368' : '#dadce0',
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          bgcolor: darkMode ? 'rgba(138, 180, 248, 0.04)' : 'rgba(26, 115, 232, 0.04)',
                        }
                      }}
                    >
                      {loadingMore ? (
                        <>
                          <MuiCircularProgress size={16} sx={{ mr: 1 }} />
                          Loading...
                        </>
                      ) : (
                        `Load More (${filteredActivities.length - visibleActivities} remaining)`
                      )}
                    </Button>
                  </Box>
                )}

                {/* Show when all activities are loaded */}
                {!hasMoreActivities && filteredActivities.length > 5 && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    mt: 3, 
                    p: 2,
                    borderRadius: 1,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  }}>
                    <Typography 
                      variant="body2" 
                      color={darkMode ? "#9aa0a6" : "#5f6368"}
                    >
                      You've viewed all {filteredActivities.length} activities
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Card>
        </SafeFade>
      </Box>
    </Box>
  );
}