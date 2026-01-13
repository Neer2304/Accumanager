"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Container,
  alpha,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Badge as MuiBadge,
  AvatarGroup,
} from '@mui/material';
import {
  Person,
  AccessTime,
  TrendingUp,
  Computer,
  Phone,
  Videocam,
  Coffee,
  Task,
  CheckCircle,
  Refresh,
  Add,
  Rocket,
  Construction,
  CalendarToday,
  Group,
  Assignment,
  Notifications,
  Download,
  Share,
  MoreVert,
  Star,
  StarBorder,
  EmojiEvents,
  Circle,
  FiberManualRecord,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

// Mock data for demonstration
const mockTeamMembers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Lead Developer',
    currentProjects: ['E-commerce Platform', 'Mobile App'],
    lastActive: new Date().toISOString(),
    status: 'active',
    avatar: '/avatars/1.jpg',
    performance: 95,
    tasksCompleted: 42,
  },
  {
    id: '2',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    role: 'UI/UX Designer',
    currentProjects: ['Mobile App', 'Dashboard Redesign'],
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    status: 'away',
    avatar: '/avatars/2.jpg',
    performance: 88,
    tasksCompleted: 28,
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'Project Manager',
    currentProjects: ['E-commerce Platform'],
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    status: 'offline',
    avatar: '/avatars/3.jpg',
    performance: 92,
    tasksCompleted: 35,
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    role: 'Frontend Developer',
    currentProjects: ['Dashboard Redesign'],
    lastActive: new Date().toISOString(),
    status: 'active',
    avatar: '/avatars/4.jpg',
    performance: 90,
    tasksCompleted: 31,
  },
];

const mockActivities = [
  {
    id: '1',
    userId: '1',
    userName: 'Alex Johnson',
    type: 'task_update',
    description: 'Completed payment gateway integration',
    projectName: 'E-commerce Platform',
    taskName: 'Payment Integration',
    timestamp: new Date().toISOString(),
    metadata: { points: 5 },
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Miller',
    type: 'project_update',
    description: 'Submitted mobile app wireframes',
    projectName: 'Mobile App',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    metadata: { points: 3 },
  },
  {
    id: '3',
    userId: '3',
    userName: 'Michael Chen',
    type: 'status_change',
    description: 'Updated project timeline',
    projectName: 'E-commerce Platform',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    metadata: { points: 2 },
  },
  {
    id: '4',
    userId: '4',
    userName: 'Emma Wilson',
    type: 'login',
    description: 'Started working on dashboard components',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    metadata: { points: 1 },
  },
  {
    id: '5',
    userId: '1',
    userName: 'Alex Johnson',
    type: 'meeting',
    description: 'Attended sprint planning meeting',
    projectName: 'Mobile App',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    metadata: { points: 4 },
  },
];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  currentProjects: string[];
  lastActive: string;
  status: 'active' | 'away' | 'offline';
  avatar: string;
  performance: number;
  tasksCompleted: number;
}

interface Activity {
  id: string;
  userId: string;
  userName: string;
  type: string;
  description: string;
  projectName?: string;
  taskName?: string;
  timestamp: string;
  metadata?: {
    points: number;
  };
}

export default function TeamActivityPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [recentActivities, setRecentActivities] = useState<Activity[]>(mockActivities);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'away': return theme.palette.warning.main;
      case 'offline': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_update': return <Task color="primary" />;
      case 'project_update': return <TrendingUp color="info" />;
      case 'status_change': return <Person color="secondary" />;
      case 'login': return <CheckCircle color="success" />;
      case 'meeting': return <Videocam color="action" />;
      default: return <Person />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Team Statistics
  const totalTeamMembers = teamMembers.length;
  const activeMembers = teamMembers.filter(m => m.status === 'active').length;
  const totalProjects = Array.from(new Set(teamMembers.flatMap(m => m.currentProjects))).length;
  const totalTasks = teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0);
  const avgPerformance = Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length);

  return (
    <MainLayout title="Team Activity">
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        {/* Under Development Banner */}
        <Alert 
          severity="info" 
          icon={<Construction />}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.1),
          }}
          action={
            <Button 
              color="inherit" 
              size="small"
              endIcon={<Rocket />}
              sx={{ fontWeight: 600 }}
            >
              Coming Soon
            </Button>
          }
        >
          <Typography variant="subtitle1" fontWeight="bold">
            🚀 Team Activity Dashboard - Under Development
          </Typography>
          <Typography variant="body2">
            This feature is currently being built. You&apos;re viewing a preview with mock data.
          </Typography>
        </Alert>

        {/* Header Section */}
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
            <Group sx={{ fontSize: 200 }} />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h3" component="h1" fontWeight="bold">
                  Team Activity Dashboard
                </Typography>
                <Chip
                  label="Preview"
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                Monitor your team&apos;s performance, track progress, and stay updated with real-time activities
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<Group />}
                  label={`${totalTeamMembers} Team Members`}
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    border: `1px solid ${alpha('#fff', 0.3)}`,
                  }}
                />
                <Chip
                  icon={<CheckCircle />}
                  label={`${activeMembers} Active Now`}
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    border: `1px solid ${alpha('#fff', 0.3)}`,
                  }}
                />
                <Chip
                  icon={<Assignment />}
                  label={`${totalProjects} Active Projects`}
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    border: `1px solid ${alpha('#fff', 0.3)}`,
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={refreshData}
                  disabled={loading}
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    '&:hover': { bgcolor: alpha('#fff', 0.3) },
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.9),
                  },
                }}
              >
                Add Member
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Main Layout with Sidebar */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Left Column - Team Members */}
          <Box sx={{ flex: { xs: '1', lg: '0.6' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Stats Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr', lg: '1fr 1fr' },
              gap: 2 
            }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                    }}>
                      <TrendingUp />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {avgPerformance}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Team Performance
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }}>
                      <Task />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {totalTasks}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasks Completed
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                    }}>
                      <Computer />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {totalProjects}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Projects
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                    }}>
                      <Person />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {activeMembers}/{totalTeamMembers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Members
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Team Members Card */}
            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Team Members
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Auto Refresh">
                      <Chip
                        label="Auto Refresh"
                        size="small"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        color={autoRefresh ? 'primary' : 'default'}
                        variant={autoRefresh ? 'filled' : 'outlined'}
                      />
                    </Tooltip>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
                
                <Stack spacing={2} sx={{ flex: 1, overflow: 'auto' }}>
                  {teamMembers.map((member) => (
                    <Paper
                      key={member.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          boxShadow: theme.shadows[2],
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <MuiBadge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <FiberManualRecord 
                              sx={{ 
                                fontSize: 12,
                                color: getStatusColor(member.status),
                                bgcolor: 'white',
                                borderRadius: '50%',
                              }}
                            />
                          }
                        >
                          <Avatar
                            src={member.avatar}
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: theme.palette.primary.main,
                            }}
                          >
                            {member.name.charAt(0)}
                          </Avatar>
                        </MuiBadge>
                        
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {member.name}
                            </Typography>
                            <Chip
                              label={`${member.performance}%`}
                              size="small"
                              color={member.performance > 90 ? 'success' : member.performance > 80 ? 'warning' : 'error'}
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {member.role}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {member.currentProjects.map((project, idx) => (
                              <Chip
                                key={idx}
                                label={project}
                                size="small"
                                variant="outlined"
                                sx={{ height: 24, fontSize: '0.75rem' }}
                              />
                            ))}
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Task fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {member.tasksCompleted} tasks
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(member.lastActive)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
                
                <Button
                  fullWidth
                  startIcon={<Add />}
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  Add New Team Member
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Activities & Additional Info */}
          <Box sx={{ flex: { xs: '1', lg: '0.4' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Recent Activities Card */}
            <Card sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Recent Activities
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Export">
                      <IconButton size="small">
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton size="small">
                        <Share />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Stack spacing={2} sx={{ flex: 1, overflow: 'auto', pr: 1 }}>
                  {recentActivities.map((activity) => (
                    <Paper
                      key={activity.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getActivityIcon(activity.type)}
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {activity.userName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(activity.timestamp)}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {activity.description}
                          </Typography>
                          
                          {(activity.projectName || activity.taskName) && (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {activity.projectName && (
                                <Chip
                                  label={activity.projectName}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                              {activity.taskName && (
                                <Chip
                                  label={activity.taskName}
                                  size="small"
                                  color="primary"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          )}
                          
                          {activity.metadata?.points && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                              <Star fontSize="small" sx={{ color: theme.palette.warning.main }} />
                              <Typography variant="caption" color="text.secondary">
                                +{activity.metadata.points} points
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
                
                <Button
                  fullWidth
                  startIcon={<Notifications />}
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  View All Activities
                </Button>
              </CardContent>
            </Card>

            {/* Projects Overview Card */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Projects Overview
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium">
                        E-commerce Platform
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        75%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Mobile App
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        45%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={45}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Dashboard Redesign
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        90%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={90}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Upcoming Meetings Card */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Upcoming Meetings
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <Videocam />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Sprint Planning
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Today, 2:00 PM
                      </Typography>
                    </Box>
                    <Chip label="4" size="small" />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                      <Group />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Client Review
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Tomorrow, 10:00 AM
                      </Typography>
                    </Box>
                    <Chip label="6" size="small" />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                      <Task />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Project Retrospective
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Friday, 3:30 PM
                      </Typography>
                    </Box>
                    <Chip label="All" size="small" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Feature Preview Banner */}
        <Paper
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Construction sx={{ fontSize: 48, mb: 2, opacity: 0.8 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            More Features Coming Soon!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            We&apos;re working on advanced analytics, real-time collaboration tools, automated reports, 
            and AI-powered insights to make team management even better.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip
              icon={<EmojiEvents />}
              label="Performance Analytics"
              sx={{ bgcolor: alpha('#fff', 0.2), color: 'white' }}
            />
            <Chip
              icon={<CalendarToday />}
              label="Schedule Planning"
              sx={{ bgcolor: alpha('#fff', 0.2), color: 'white' }}
            />
            <Chip
              icon={<TrendingUp />}
              label="Progress Tracking"
              sx={{ bgcolor: alpha('#fff', 0.2), color: 'white' }}
            />
            <Chip
              icon={<Videocam />}
              label="Team Meetings"
              sx={{ bgcolor: alpha('#fff', 0.2), color: 'white' }}
            />
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
}