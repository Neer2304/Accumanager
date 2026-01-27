// app/(dashboard)/community/activity/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  ThumbUp as LikeIcon,
  Bookmark as BookmarkIcon,
  ChatBubbleOutline as CommentIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Forum as ForumIcon,
  Whatshot as TrendingIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  CheckCircle as CheckIcon,
  PushPin as PinIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useCommunity } from "@/hooks/useCommunity";
import { formatDate, formatRelativeTime } from "@/utils/dateUtils";

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
  commentContent?: string; // For commented posts
  commentDate?: string; // For commented posts
}

interface ActivityStats {
  totalLikes: number;
  totalBookmarks: number;
  totalComments: number;
  totalPosts: number;
  recentActivity: UserActivity[];
}

export default function ActivityPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<ActivityStats | null>(null);
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([]);
  
  const tabs = [
    { label: "All Activity", value: "all", icon: <HistoryIcon /> },
    { label: "Liked Posts", value: "liked", icon: <LikeIcon /> },
    { label: "Bookmarks", value: "bookmarked", icon: <BookmarkIcon /> },
    { label: "My Comments", value: "commented", icon: <CommentIcon /> },
    { label: "My Posts", value: "created", icon: <ForumIcon /> },
  ];

  // Fetch user activity
  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/community/activity', {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activity: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setActivityData(data.data);
        setFilteredActivities(data.data.recentActivity || []);
      } else {
        throw new Error(data.message || "Failed to fetch activity");
      }
    } catch (err) {
      console.error("Fetch activity error:", err);
      setError(err instanceof Error ? err.message : "Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on selected tab
  const filterActivities = (type: string) => {
    if (!activityData?.recentActivity) return;
    
    if (type === 'all') {
      setFilteredActivities(activityData.recentActivity);
    } else {
      const filtered = activityData.recentActivity.filter(
        activity => activity.type === type
      );
      setFilteredActivities(filtered);
    }
  };

  useEffect(() => {
    fetchUserActivity();
  }, []);

  useEffect(() => {
    const currentTab = tabs[activeTab]?.value || 'all';
    filterActivities(currentTab);
  }, [activeTab, activityData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    window.history.back();
  };

  // Activity Item Component
  const ActivityItem = ({ activity }: { activity: UserActivity }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case 'liked': return <LikeIcon sx={{ color: "#f44336" }} />;
        case 'bookmarked': return <BookmarkIcon sx={{ color: "#2196f3" }} />;
        case 'commented': return <CommentIcon sx={{ color: "#4caf50" }} />;
        case 'created': return <ForumIcon sx={{ color: theme.palette.primary.main }} />;
        default: return <HistoryIcon />;
      }
    };

    const getActivityText = () => {
      switch (activity.type) {
        case 'liked': return "liked this post";
        case 'bookmarked': return "bookmarked this post";
        case 'commented': return "commented on this post";
        case 'created': return "created this post";
        default: return "interacted with this post";
      }
    };

    const getActivityColor = () => {
      switch (activity.type) {
        case 'liked': return "#f44336";
        case 'bookmarked': return "#2196f3";
        case 'commented': return "#4caf50";
        case 'created': return theme.palette.primary.main;
        default: return theme.palette.text.secondary;
      }
    };

    return (
      <Card 
        sx={{ 
          mb: 2, 
          borderRadius: 2,
          borderLeft: `4px solid ${getActivityColor()}`,
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)',
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {/* Activity Icon */}
            <Box sx={{ 
              p: 1, 
              borderRadius: 2,
              bgcolor: alpha(getActivityColor(), 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
            }}>
              {getActivityIcon()}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {activity.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <Box component="span" sx={{ color: getActivityColor(), fontWeight: 500 }}>
                      You {getActivityText()}
                    </Box>
                    {' '}• {formatRelativeTime(activity.type === 'commented' ? activity.commentDate || activity.updatedAt : activity.updatedAt)}
                  </Typography>
                </Box>
                
                {/* Category Chip */}
                <Chip 
                  label={activity.category}
                  size="small"
                  sx={{ 
                    textTransform: 'capitalize',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                />
              </Box>

              {/* Comment content if available */}
              {activity.type === 'commented' && activity.commentContent && (
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    my: 1.5, 
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Your comment:
                  </Typography>
                  <Typography variant="body2">
                    {activity.commentContent}
                  </Typography>
                </Paper>
              )}

              {/* Excerpt for posts */}
              {activity.excerpt && activity.type !== 'commented' && (
                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                  {activity.excerpt}
                </Typography>
              )}

              {/* Stats */}
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LikeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {activity.likeCount || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CommentIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {activity.commentCount || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ViewIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {activity.views || 0}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout title="My Activity">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            size="small"
            variant="outlined"
          >
            Back to Community
          </Button>

          {/* Page Title */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                📊 My Activity
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track your engagement in the community
              </Typography>
            </Box>
          </Box>

          {/* Stats Cards */}
          {activityData && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 4 
            }}>
              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: alpha('#f44336', 0.1) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2,
                    bgcolor: '#f44336',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <LikeIcon sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="#f44336">
                      {activityData.totalLikes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Posts Liked
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: alpha('#2196f3', 0.1) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2,
                    bgcolor: '#2196f3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <BookmarkIcon sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="#2196f3">
                      {activityData.totalBookmarks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bookmarks
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: alpha('#4caf50', 0.1) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2,
                    bgcolor: '#4caf50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CommentIcon sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="#4caf50">
                      {activityData.totalComments}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Comments
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2,
                    bgcolor: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <ForumIcon sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color={theme.palette.primary.main}>
                      {activityData.totalPosts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      My Posts
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            sx={{
              bgcolor: 'background.paper',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minHeight: 60,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                sx={{
                  color: activeTab === index ? theme.palette.primary.main : 'text.secondary',
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Activity List */}
        <Box>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Loading your activity...
              </Typography>
            </Box>
          ) : filteredActivities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No activity found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {activeTab === 0 
                  ? "You haven't interacted with the community yet"
                  : `You haven't ${tabs[activeTab].value} any posts yet`}
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/community"
                startIcon={<ForumIcon />}
              >
                Explore Community
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                {activeTab === 0 ? 'Recent Activity' : `${tabs[activeTab].label}`}
                <Chip 
                  label={filteredActivities.length} 
                  size="small" 
                  color="primary"
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              <Stack spacing={2}>
                {filteredActivities.map((activity) => (
                  <ActivityItem key={`${activity._id}-${activity.type}`} activity={activity} />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Container>
    </MainLayout>
  );
}