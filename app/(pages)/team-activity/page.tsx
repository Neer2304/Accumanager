// app/(pages)/team-activity/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Switch,
  Button,
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
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  currentProjects: string[];
  lastActive: string;
  status: 'active' | 'away' | 'offline';
}

interface TeamActivity {
  _id: string;
  userId: string;
  userName: string;
  type: 'task_update' | 'project_update' | 'status_change' | 'login' | 'logout';
  description: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskName?: string;
  timestamp: string;
  metadata: any;
}

export default function TeamActivityPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [recentActivities, setRecentActivities] = useState<TeamActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch team members from your users API
  const fetchTeamMembers = async () => {
    try {
      setError(null);
      const response = await fetch('/api/users/team');
      
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      const data = await response.json();
      setTeamMembers(data.teamMembers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team data');
    }
  };

  // Fetch recent team activities
  const fetchTeamActivities = async () => {
    try {
      const response = await fetch('/api/activities/team');
      if (response.ok) {
        const data = await response.json();
        setRecentActivities(data.activities || []);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchTeamMembers();
    fetchTeamActivities();
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTeamActivities();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshData = () => {
    setLoading(true);
    fetchTeamMembers();
    fetchTeamActivities();
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'away': return 'warning';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getActivityIcon = (type: TeamActivity['type']) => {
    switch (type) {
      case 'task_update': return <Task color="primary" />;
      case 'project_update': return <TrendingUp color="info" />;
      case 'status_change': return <Person color="secondary" />;
      case 'login': return <CheckCircle color="success" />;
      case 'logout': return <AccessTime color="disabled" />;
      default: return <Person />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <MainLayout title="Team Activity">
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Team Activity">
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                👥 Team Activity
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track your team's project progress and recent activities
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => window.open('/projects', '_self')}
              >
                Add Project
              </Button>
              <Tooltip title="Refresh data">
                <IconButton onClick={refreshData} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Team Members */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">
                    Team Members ({teamMembers.length})
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Auto Refresh</Typography>
                    <Switch
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      size="small"
                    />
                  </Box>
                </Box>
                
                {teamMembers.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No team members found
                  </Typography>
                ) : (
                  <List>
                    {teamMembers.map((member) => (
                      <ListItem key={member._id} divider>
                        <ListItemAvatar>
                          <Avatar src={member.avatar} sx={{ bgcolor: 'primary.main' }}>
                            {member.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {member.name}
                              </Typography>
                              <Chip
                                label={member.status}
                                size="small"
                                color={getStatusColor(member.status)}
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {member.role}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Last active: {formatDate(member.lastActive)}
                              </Typography>
                              {member.currentProjects.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Projects: {member.currentProjects.join(', ')}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Recent Activities
                </Typography>
                <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                  {recentActivities.length === 0 ? (
                    <ListItem>
                      <ListItemText
                        primary="No recent activities"
                        secondary="Team activities will appear here"
                      />
                    </ListItem>
                  ) : (
                    recentActivities.map((activity) => (
                      <ListItem key={activity._id} divider>
                        <ListItemAvatar>
                          {getActivityIcon(activity.type)}
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {activity.userName}
                              </Typography>
                              <Typography variant="body2">
                                {activity.description}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              {activity.projectName && (
                                <Typography variant="caption" display="block">
                                  Project: {activity.projectName}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {formatTime(activity.timestamp)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}