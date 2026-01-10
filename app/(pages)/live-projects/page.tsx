"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  AvatarGroup,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import {
  Task,
  TrendingUp,
  Schedule,
  Warning,
  CheckCircle,
  PlayArrow,
  Pause,
  Stop,
  Person,
  MoreVert,
  Refresh,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { projectsApi } from '@/lib/api/projects';

interface LiveProject {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'active' | 'paused' | 'completed' | 'delayed';
  team: string[];
  deadline: string;
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
  };
  lastUpdate: string;
  velocity: number;
  userId: string;
}

interface ProjectUpdate {
  id: string;
  projectId: string;
  projectName: string;
  type: 'progress' | 'task_complete' | 'task_blocked' | 'milestone' | 'delay';
  description: string;
  timestamp: string;
  user: string;
}

export default function LiveProjectsPage() {
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch projects
      const projectsResponse = await projectsApi.getAll();
      
      if (projectsResponse.success && projectsResponse.projects) {
        const liveProjects: LiveProject[] = projectsResponse.projects.map((project: any) => ({
          id: project._id || project.id,
          name: project.name || project.title || 'Unnamed Project',
          description: project.description || 'No description available',
          progress: project.progress || 0,
          status: mapProjectStatus(project.status),
          team: project.teamMembers || [project.owner] || ['You'],
          deadline: project.deadline || project.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          tasks: {
            total: project.totalTasks || 0,
            completed: project.completedTasks || 0,
            inProgress: project.inProgressTasks || 0,
            blocked: project.blockedTasks || 0
          },
          lastUpdate: project.updatedAt || project.lastUpdated || new Date().toISOString(),
          velocity: calculateVelocity(project),
          userId: project.userId
        }));
        
        setProjects(liveProjects);
      } else {
        throw new Error(projectsResponse.error || 'Failed to fetch projects');
      }

      // Fetch updates
      try {
        const updatesResponse = await projectsApi.getUpdates(10);
        if (updatesResponse.updates) {
          setUpdates(updatesResponse.updates.map((update: any) => ({
            id: update._id || update.id,
            projectId: update.projectId,
            projectName: update.projectName || 'Project',
            type: mapUpdateType(update.type),
            description: update.description || update.message || 'Project updated',
            timestamp: update.timestamp || update.createdAt || new Date().toISOString(),
            user: update.user || update.userName || 'Team Member'
          })));
        }
      } catch (updatesError) {
        console.error('Error fetching updates:', updatesError);
        // Continue even if updates fail
      }

    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate project velocity
  const calculateVelocity = (project: any): number => {
    if (project.createdAt && project.completedTasks) {
      const created = new Date(project.createdAt);
      const now = new Date();
      const days = Math.max(1, (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return (project.completedTasks || 0) / days;
    }
    return Math.random() * 2 + 0.5;
  };

  // Map project status
  const mapProjectStatus = (status: string): LiveProject['status'] => {
    const statusMap: Record<string, LiveProject['status']> = {
      'active': 'active',
      'in-progress': 'active',
      'progress': 'active',
      'paused': 'paused',
      'on-hold': 'paused',
      'completed': 'completed',
      'done': 'completed',
      'finished': 'completed',
      'delayed': 'delayed',
      'behind': 'delayed',
      'overdue': 'delayed'
    };
    return statusMap[status?.toLowerCase()] || 'active';
  };

  // Map update type
  const mapUpdateType = (type: string): ProjectUpdate['type'] => {
    const typeMap: Record<string, ProjectUpdate['type']> = {
      'task_complete': 'task_complete',
      'task_completed': 'task_complete',
      'task_blocked': 'task_blocked',
      'blocked': 'task_blocked',
      'progress': 'progress',
      'milestone': 'milestone',
      'delay': 'delay',
      'deadline': 'delay'
    };
    return typeMap[type?.toLowerCase()] || 'progress';
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  // Calculate days remaining
  const calculateDaysRemaining = (deadline: string) => {
    try {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diff = deadlineDate.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    } catch {
      return 30; // Default fallback
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: LiveProject['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'primary';
      case 'delayed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: LiveProject['status']) => {
    switch (status) {
      case 'active': return <PlayArrow fontSize="small" />;
      case 'paused': return <Pause fontSize="small" />;
      case 'completed': return <CheckCircle fontSize="small" />;
      case 'delayed': return <Warning fontSize="small" />;
      default: return <MoreVert fontSize="small" />;
    }
  };

  const refreshData = () => {
    setLoading(true);
    fetchData();
  };

  if (loading) {
    return (
      <MainLayout title="Live Projects">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading your projects...
            </Typography>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Live Projects">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        
        {/* Header */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                🚀 Live Project Tracker
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Real-time monitoring of project progress and team performance
              </Typography>
            </Box>
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={refreshData} 
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }
                }} 
                disabled={loading}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => setError(null)}
              >
                <MoreVert />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {/* Stats Overview */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 4
        }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {projects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Projects</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {projects.reduce((acc, proj) => acc + (proj.tasks?.completed || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Tasks Completed</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {projects.filter(p => p.status === 'delayed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Delayed Projects</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {projects.length > 0 
                  ? Math.round(projects.reduce((acc, proj) => acc + proj.progress, 0) / projects.length) 
                  : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">Avg Progress</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Projects List */}
          <Box sx={{ flex: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3 
            }}>
              <Typography variant="h5">
                Your Projects ({projects.length})
              </Typography>
              <Chip 
                label={autoRefresh ? "Auto Refresh ON" : "Auto Refresh OFF"} 
                color={autoRefresh ? "success" : "default"}
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? "filled" : "outlined"}
                size="small"
              />
            </Box>

            {projects.length === 0 ? (
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Projects Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first project to start tracking progress
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {projects.map((project) => (
                  <Card key={project.id} sx={{ borderRadius: 2, '&:hover': { boxShadow: 6 } }}>
                    <CardContent>
                      {/* Project Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start', 
                        mb: 2 
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {project.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {project.description}
                          </Typography>
                        </Box>
                        <Chip
                          icon={getStatusIcon(project.status)}
                          label={project.status.toUpperCase()}
                          color={getStatusColor(project.status)}
                          variant="outlined"
                          size="small"
                          sx={{ ml: 2 }}
                        />
                      </Box>

                      {/* Progress Bar */}
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: 1 
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {project.progress.toFixed(0)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          color={
                            project.progress > 80 ? "success" :
                            project.progress > 50 ? "warning" : "primary"
                          }
                          sx={{ 
                            height: 8, 
                            borderRadius: 4 
                          }}
                        />
                      </Box>

                      {/* Task Breakdown */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 3,
                        gap: 2
                      }}>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="h6" color="success.main">
                            {project.tasks?.completed || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Done
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="h6" color="warning.main">
                            {project.tasks?.inProgress || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            In Progress
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="h6" color="error.main">
                            {project.tasks?.blocked || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Blocked
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="h6" color="text.secondary">
                            {project.tasks?.total || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total
                          </Typography>
                        </Box>
                      </Box>

                      {/* Footer */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2 
                        }}>
                          <AvatarGroup max={3}>
                            {(project.team || []).map((member, index) => (
                              <Tooltip key={index} title={member}>
                                <Avatar sx={{ width: 30, height: 30, fontSize: 14 }}>
                                  {member.charAt(0).toUpperCase()}
                                </Avatar>
                              </Tooltip>
                            ))}
                          </AvatarGroup>
                          <Typography variant="caption" color="text.secondary">
                            Velocity: {project.velocity.toFixed(1)} tasks/day
                          </Typography>
                        </Box>
                        
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {calculateDaysRemaining(project.deadline)} days remaining
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Updated: {formatTime(project.lastUpdate)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>

          {/* Right Sidebar */}
          <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: 350 } }}>
            {/* Recent Updates */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1 
                }}>
                  <TrendingUp fontSize="small" />
                  Recent Updates
                </Typography>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {updates.length === 0 ? (
                    <ListItem>
                      <ListItemText
                        primary="No recent updates"
                        secondary="Project updates will appear here"
                        primaryTypographyProps={{ color: 'text.secondary' }}
                      />
                    </ListItem>
                  ) : (
                    updates.map((update) => (
                      <ListItem key={update.id} divider sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {update.type === 'task_complete' && <CheckCircle color="success" fontSize="small" />}
                          {update.type === 'task_blocked' && <Warning color="error" fontSize="small" />}
                          {update.type === 'progress' && <TrendingUp color="primary" fontSize="small" />}
                          {update.type === 'milestone' && <Task color="info" fontSize="small" />}
                          {update.type === 'delay' && <Schedule color="warning" fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                              {update.description}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" display="block" color="text.secondary">
                                {update.projectName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {update.user} • {formatTime(update.timestamp)}
                              </Typography>
                            </Box>
                          }
                          primaryTypographyProps={{ variant: 'body2' }}
                          sx={{ ml: 1 }}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Project Progress Summary */}
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Progress Summary
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {projects.map(project => (
                    <Box key={project.id}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 0.5
                      }}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: '60%' }}>
                          {project.name}
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                          {project.progress.toFixed(0)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{ 
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: 
                            project.progress > 80 ? 'success.light' :
                            project.progress > 50 ? 'warning.light' : 'primary.light'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
}