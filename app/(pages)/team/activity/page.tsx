// app/team/activity/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button as MuiButton,
  IconButton,
  Tooltip,
  Container,
  alpha,
  useTheme,
  useMediaQuery,
  Stack,
  LinearProgress,
  CircularProgress,
  CardContent,
} from '@mui/material';
import {
  Refresh,
  Add,
  Groups,
  TrendingUp,
  Task,
  Computer,
  Person,
  Construction,
  Rocket,
  Notifications,
  Download,
  Share,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { TeamActivityService } from '@/services/teamActivityService';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { ActivityCard } from '@/components/team/ActivityCard';
import { Card2 } from '@/components/ui/card2';
import { Button2 } from '@/components/ui/button2';
import { Alert2 } from '@/components/ui/alert2';
import { SkeletonCard, MessageListSkeleton } from '@/components/ui/skeleton2';
import { TeamMember, Activity } from '@/types/teamActivity';

// Mock data - replace with actual API calls
const mockTeamMembers: TeamMember[] = [
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
];

const mockActivities: Activity[] = [
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
];

export default function TeamActivityPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [recentActivities, setRecentActivities] = useState<Activity[]>(mockActivities);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchTeamData = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API calls
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation:
      // const members = await TeamActivityService.fetchTeamMembers();
      // const activities = await TeamActivityService.fetchRecentActivities();
      
      setTeamMembers(mockTeamMembers);
      setRecentActivities(mockActivities);
    } catch (err) {
      setError('Failed to load team data. Please try again.');
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchTeamData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleAddMember = async () => {
    try {
      setLoading(true);
      
      // Mock adding a new member
      const newMember: TeamMember = {
        id: String(Date.now()),
        name: 'New Team Member',
        email: 'new@example.com',
        role: 'Team Member',
        currentProjects: ['Onboarding'],
        lastActive: new Date().toISOString(),
        status: 'active',
        avatar: '',
        performance: 85,
        tasksCompleted: 0,
      };
      
      setTeamMembers(prev => [newMember, ...prev]);
      
      // Log the activity
      await TeamActivityService.logActivity({
        userId: 'system',
        type: 'team_member',
        action: 'added',
        description: 'New team member added',
        metadata: {
          newMemberName: newMember.name,
          newMemberRole: newMember.role,
        },
      });
      
      setSuccess('New team member added successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberClick = (member: TeamMember) => {
    // Navigate to member detail page or open modal
    console.log('Member clicked:', member);
  };

  const handleRefresh = () => {
    fetchTeamData();
  };

  // Calculate statistics
  const statistics = {
    totalTeamMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    totalProjects: Array.from(new Set(teamMembers.flatMap(m => m.currentProjects))).length,
    totalTasks: teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0),
    avgPerformance: Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length) || 0,
  };

  if (loading && teamMembers.length === 0) {
    return (
      <MainLayout title="Team Activity">
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SkeletonCard height={150} />
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)' },
              gap: 2 
            }}>
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} height={100} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <SkeletonCard height={400} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <SkeletonCard height={400} />
              </Box>
            </Box>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Team Activity">
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        {/* Development Banner */}
        <Alert2
          severity="info"
          title="🚀 Team Activity Dashboard - Under Development"
          message="This feature is currently being built. Real data integration will be available soon."
          icon={<Construction />}
          action={
            <Button2
              variant="outlined"
              size="small"
              iconRight={<Rocket />}
              sx={{ color: 'inherit', borderColor: 'currentColor' }}
            >
              Coming Soon
            </Button2>
          }
          sx={{ mb: 3 }}
        />

        {/* Error Alert */}
        {error && (
          <Alert2
            severity="error"
            message={error}
            dismissible
            onDismiss={() => setError(null)}
            sx={{ mb: 3 }}
          />
        )}

        {/* Success Alert */}
        {success && (
          <Alert2
            severity="success"
            message={success}
            dismissible
            onDismiss={() => setSuccess(null)}
            sx={{ mb: 3 }}
          />
        )}

        {/* Header Section */}
        <Card2
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
            <Groups sx={{ fontSize: 200 }} />
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                  Team Activity Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                  Monitor your team&apos;s performance and track progress in real-time
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title="Refresh Data">
                  <IconButton
                    onClick={handleRefresh}
                    disabled={loading}
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      color: 'white',
                      '&:hover': { bgcolor: alpha('#fff', 0.3) },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : <Refresh />}
                  </IconButton>
                </Tooltip>
                <Button2
                  variant="contained"
                  iconLeft={<Add />}
                  onClick={handleAddMember}
                  disabled={loading}
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
                </Button2>
              </Box>
            </Box>

            {/* Statistics Chips */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<Groups />}
                label={`${statistics.totalTeamMembers} Team Members`}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  border: `1px solid ${alpha('#fff', 0.3)}`,
                }}
              />
              <Chip
                icon={<Person />}
                label={`${statistics.activeMembers} Active Now`}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  border: `1px solid ${alpha('#fff', 0.3)}`,
                }}
              />
              <Chip
                icon={<Computer />}
                label={`${statistics.totalProjects} Active Projects`}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  border: `1px solid ${alpha('#fff', 0.3)}`,
                }}
              />
            </Box>
          </Box>
        </Card2>

        {/* Stats Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          {[
            { 
              title: 'Team Performance', 
              value: `${statistics.avgPerformance}%`, 
              icon: <TrendingUp />, 
              color: '#34a853',
              description: 'Average performance score' 
            },
            { 
              title: 'Tasks Completed', 
              value: statistics.totalTasks, 
              icon: <Task />, 
              color: '#4285f4',
              description: 'Total tasks completed' 
            },
            { 
              title: 'Active Projects', 
              value: statistics.totalProjects, 
              icon: <Computer />, 
              color: '#ea4335',
              description: 'Projects in progress' 
            },
            { 
              title: 'Active Members', 
              value: `${statistics.activeMembers}/${statistics.totalTeamMembers}`, 
              icon: <Person />, 
              color: '#fbbc04',
              description: 'Currently active' 
            },
          ].map((stat, index) => (
            <Card2 
              key={index}
            //   hover
              sx={{ 
                p: 3,
                borderRadius: 2,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                background: theme.palette.mode === 'dark' 
                  ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                  : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: alpha(stat.color, 0.1),
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </Card2>
          ))}
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Left Column - Team Members */}
          <Box sx={{ flex: 1 }}>
            <Card2>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Team Members
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={autoRefresh ? 'Auto On' : 'Auto Off'}
                      size="small"
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      color={autoRefresh ? 'primary' : 'default'}
                    />
                  </Box>
                </Box>
                
                {loading ? (
                  <MessageListSkeleton count={3} />
                ) : (
                  <Stack spacing={2}>
                    {teamMembers.map((member) => (
                      <TeamMemberCard
                        key={member.id}
                        member={member}
                        onClick={handleMemberClick}
                      />
                    ))}
                  </Stack>
                )}
                
                <Button2
                  fullWidth
                  iconLeft={<Add />}
                  onClick={handleAddMember}
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  Add New Team Member
                </Button2>
              </CardContent>
            </Card2>
          </Box>

          {/* Right Column - Activities */}
          <Box sx={{ flex: 1 }}>
            <Card2>
              <CardContent sx={{ p: 3 }}>
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
                
                {loading ? (
                  <MessageListSkeleton count={3} />
                ) : (
                  <Stack spacing={2}>
                    {recentActivities.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </Stack>
                )}
                
                <Button2
                  fullWidth
                  iconLeft={<Notifications />}
                  sx={{ mt: 3 }}
                >
                  View All Activities
                </Button2>
              </CardContent>
            </Card2>

            {/* Projects Overview */}
            <Card2 sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Projects Overview
                </Typography>
                <Stack spacing={2}>
                  {['E-commerce Platform', 'Mobile App', 'Dashboard Redesign'].map((project, index) => {
                    const progress = [75, 45, 90][index];
                    return (
                      <Box key={project}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {project}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: theme.palette.mode === 'dark' ? '#3c4043' : '#dadce0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: progress > 70 ? '#34a853' : progress > 40 ? '#4285f4' : '#fbbc04',
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card2>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
}