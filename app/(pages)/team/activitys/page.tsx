"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  LinearProgress,
  Alert as MuiAlert,
  IconButton,
  Tooltip,
  Container,
  alpha,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Badge as MuiBadge,
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
  Home as HomeIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';

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
  const darkMode = theme.palette.mode === 'dark';
  
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
      case 'active': return '#34a853'; // Green
      case 'away': return '#fbbc04';   // Yellow
      case 'offline': return darkMode ? '#9aa0a6' : '#5f6368'; // Grey
      default: return darkMode ? '#9aa0a6' : '#5f6368';
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
    
    // FIX: Use consistent date format to avoid hydration mismatch
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  // Team Statistics
  const totalTeamMembers = teamMembers.length;
  const activeMembers = teamMembers.filter(m => m.status === 'active').length;
  const totalProjects = Array.from(new Set(teamMembers.flatMap(m => m.currentProjects))).length;
  const totalTasks = teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0);
  const avgPerformance = Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length);

  return (
    <MainLayout title="Team Activity">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Team Activity
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant="h4" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              👥 Team Activity Dashboard
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Monitor team performance, track progress, and stay updated with real-time activities
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <Chip
              icon={<Group />}
              label={`${totalTeamMembers} Team Members`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                borderColor: alpha('#4285f4', 0.3),
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            />
            <Chip
              icon={<CheckCircle />}
              label={`${activeMembers} Active Now`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                borderColor: alpha('#34a853', 0.3),
                color: darkMode ? '#81c995' : '#34a853',
              }}
            />
            <Chip
              icon={<Assignment />}
              label={`${totalProjects} Active Projects`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.08),
                borderColor: alpha('#ea4335', 0.3),
                color: darkMode ? '#f28b82' : '#ea4335',
              }}
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Under Development Banner */}
          <Alert 
            severity="info"
            title="🚀 Team Activity Dashboard - Under Development"
            message="This feature is currently being built. You're viewing a preview with mock data."
            action={
              <Button
                variant="outlined"
                endIcon={<Rocket />}
                sx={{
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
                size="small"
              >
                Coming Soon
              </Button>
            }
            sx={{ mb: 3 }}
          />

          {/* Quick Stats */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
            {[
              { 
                title: 'Team Performance', 
                value: `${avgPerformance}%`, 
                icon: '📈', 
                color: '#34a853',
                description: 'Average performance score' 
              },
              { 
                title: 'Tasks Completed', 
                value: totalTasks, 
                icon: '✅', 
                color: '#4285f4',
                description: 'Total tasks completed' 
              },
              { 
                title: 'Active Projects', 
                value: totalProjects, 
                icon: '📂', 
                color: '#ea4335',
                description: 'Projects in progress' 
              },
              { 
                title: 'Active Members', 
                value: `${activeMembers}/${totalTeamMembers}`, 
                icon: '👥', 
                color: '#fbbc04',
                description: 'Currently active' 
              },
            ].map((stat, index) => (
              <Card 
                key={`stat-${index}`}
                hover
                sx={{ 
                  flex: '1 1 calc(25% - 12px)', 
                  minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 12px)' },
                  p: { xs: 1.5, sm: 2, md: 3 }, 
                  borderRadius: '16px', 
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  background: darkMode 
                    ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                    : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)', 
                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368', 
                          fontWeight: 400,
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          display: 'block',
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant="h4"
                        sx={{ 
                          color: stat.color, 
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: { xs: 0.75, sm: 1 }, 
                      borderRadius: '10px', 
                      backgroundColor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      display: 'block',
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Main Layout with Sidebar */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Left Column - Team Members */}
            <Box sx={{ flex: { xs: '1', lg: '0.6' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Team Members Card */}
              <Card
                title="👥 Team Members"
                subtitle="Track team availability and performance"
                hover
                sx={{
                  flex: 1,
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label="Auto Refresh"
                      size="small"
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      color={autoRefresh ? 'primary' : 'default'}
                      variant={autoRefresh ? 'filled' : 'outlined'}
                    />
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                }
              >
                <Stack spacing={2} sx={{ flex: 1, overflow: 'auto' }}>
                  {teamMembers.map((member) => (
                    <Card
                      key={member.id}
                      hover
                      sx={{
                        p: 2,
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#4285f4',
                          boxShadow: `0 4px 12px ${alpha('#4285f4', 0.15)}`,
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
                              bgcolor: '#4285f4',
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
                              sx={{
                                backgroundColor: member.performance > 90 
                                  ? alpha('#34a853', darkMode ? 0.2 : 0.1)
                                  : member.performance > 80 
                                  ? alpha('#fbbc04', darkMode ? 0.2 : 0.1)
                                  : alpha('#ea4335', darkMode ? 0.2 : 0.1),
                                borderColor: member.performance > 90 
                                  ? '#34a853'
                                  : member.performance > 80 
                                  ? '#fbbc04'
                                  : '#ea4335',
                                color: member.performance > 90 
                                  ? '#34a853'
                                  : member.performance > 80 
                                  ? '#fbbc04'
                                  : '#ea4335',
                                fontWeight: 600,
                              }}
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
                                sx={{
                                  height: 24,
                                  fontSize: '0.75rem',
                                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                                  color: darkMode ? '#e8eaed' : '#202124',
                                }}
                              />
                            ))}
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Task fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
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
                    </Card>
                  ))}
                </Stack>
                
                <Button
                  fullWidth
                  startIcon={<Add />}
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  Add New Team Member
                </Button>
              </Card>
            </Box>

            {/* Right Column - Activities & Additional Info */}
            <Box sx={{ flex: { xs: '1', lg: '0.4' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Recent Activities Card */}
              <Card
                title="📝 Recent Activities"
                subtitle="Latest team updates and actions"
                hover
                sx={{
                  flex: 1,
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
                action={
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
                }
              >
                <Stack spacing={2} sx={{ flex: 1, overflow: 'auto', pr: 1 }}>
                  {recentActivities.map((activity) => (
                    <Card
                      key={activity.id}
                      hover
                      sx={{
                        p: 2,
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha('#4285f4', 0.1),
                            color: '#4285f4',
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
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                                    color: darkMode ? '#e8eaed' : '#202124',
                                  }}
                                />
                              )}
                              {activity.taskName && (
                                <Chip
                                  label={activity.taskName}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    backgroundColor: alpha('#4285f4', 0.1),
                                    borderColor: '#4285f4',
                                    color: '#4285f4',
                                  }}
                                />
                              )}
                            </Box>
                          )}
                          
                          {activity.metadata?.points && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                              <Star fontSize="small" sx={{ color: '#fbbc04' }} />
                              <Typography variant="caption" color="text.secondary">
                                +{activity.metadata.points} points
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
                
                <Button
                  fullWidth
                  startIcon={<Notifications />}
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  View All Activities
                </Button>
              </Card>

              {/* Projects Overview Card */}
              <Card
                title="📊 Projects Overview"
                subtitle="Current project progress"
                hover
                sx={{
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
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
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: darkMode ? '#3c4043' : '#dadce0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#34a853',
                        },
                      }}
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
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: darkMode ? '#3c4043' : '#dadce0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#4285f4',
                        },
                      }}
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
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: darkMode ? '#3c4043' : '#dadce0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#fbbc04',
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Card>

              {/* Upcoming Meetings Card */}
              <Card
                title="🎯 Upcoming Meetings"
                subtitle="Schedule and team meetings"
                hover
                sx={{
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#4285f4' }}>
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
                    <Chip
                      label="4"
                      size="small"
                      sx={{
                        backgroundColor: alpha('#4285f4', 0.1),
                        borderColor: '#4285f4',
                        color: '#4285f4',
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#34a853' }}>
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
                    <Chip
                      label="6"
                      size="small"
                      sx={{
                        backgroundColor: alpha('#34a853', 0.1),
                        borderColor: '#34a853',
                        color: '#34a853',
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#fbbc04' }}>
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
                    <Chip
                      label="All"
                      size="small"
                      sx={{
                        backgroundColor: alpha('#fbbc04', 0.1),
                        borderColor: '#fbbc04',
                        color: '#fbbc04',
                      }}
                    />
                  </Box>
                </Stack>
              </Card>
            </Box>
          </Box>

          {/* Feature Preview Banner */}
          <Card
            hover
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mt: 4,
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${darkMode ? '#1e3a5f' : '#1a73e8'} 0%, ${darkMode ? '#0d3064' : '#0d47a1'} 100%)`,
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Construction sx={{ fontSize: 48, mb: 2, opacity: 0.8 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              More Features Coming Soon!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              We're working on advanced analytics, real-time collaboration tools, automated reports, 
              and AI-powered insights to make team management even better.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip
                icon={<EmojiEvents />}
                label="Performance Analytics"
                sx={{
                  backgroundColor: alpha('#fff', 0.2),
                  color: 'white',
                  borderColor: alpha('#fff', 0.3),
                }}
              />
              <Chip
                icon={<CalendarToday />}
                label="Schedule Planning"
                sx={{
                  backgroundColor: alpha('#fff', 0.2),
                  color: 'white',
                  borderColor: alpha('#fff', 0.3),
                }}
              />
              <Chip
                icon={<TrendingUp />}
                label="Progress Tracking"
                sx={{
                  backgroundColor: alpha('#fff', 0.2),
                  color: 'white',
                  borderColor: alpha('#fff', 0.3),
                }}
              />
              <Chip
                icon={<Videocam />}
                label="Team Meetings"
                sx={{
                  backgroundColor: alpha('#fff', 0.2),
                  color: 'white',
                  borderColor: alpha('#fff', 0.3),
                }}
              />
            </Box>
          </Card>
        </Container>
      </Box>
    </MainLayout>
  );
}