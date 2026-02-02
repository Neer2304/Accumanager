// components/dashboard/TeamPerformanceDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  AvatarGroup,
  Button,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Person,
  Task,
  Assessment,
  Timeline,
  MoreVert,
  Star,
  StarBorder,
  EmojiEvents,
  AccessTime,
  CheckCircle,
  Error,
  Group,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface TeamMemberPerformance {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  performance: number;
  tasksCompleted: number;
  projectsInvolved: number;
  efficiency: number;
  lastActive: string;
  workload: number;
  trends: {
    daily: Array<{ date: string; score: number }>;
    weekly: Array<{ week: string; tasks: number }>;
  };
  strengths: string[];
  areasForImprovement: string[];
}

export default function TeamPerformanceDashboard() {
  const [teamData, setTeamData] = useState<TeamMemberPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    fetchTeamPerformance();
  }, [timeRange]);

  const fetchTeamPerformance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/team/performance?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setTeamData(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch team performance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  // Calculate team averages
  const teamAverages = teamData.length > 0 ? {
    performance: Math.round(teamData.reduce((sum, m) => sum + m.performance, 0) / teamData.length),
    efficiency: Math.round(teamData.reduce((sum, m) => sum + m.efficiency, 0) / teamData.length),
    workload: Math.round(teamData.reduce((sum, m) => sum + m.workload, 0) / teamData.length),
    tasksCompleted: teamData.reduce((sum, m) => sum + m.tasksCompleted, 0),
  } : null;

  // Prepare chart data
  const performanceChartData = teamData.map(member => ({
    name: member.name.split(' ')[0],
    performance: member.performance,
    efficiency: member.efficiency,
    workload: member.workload,
  }));

  const trendData = teamData.length > 0 ? teamData[0].trends.daily : [];

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Team Performance
                  </Typography>
                  <Typography variant="h4">
                    {teamAverages?.performance || 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Average Score
                  </Typography>
                </Box>
                <EmojiEvents color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={teamAverages?.performance || 0} 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Efficiency
                  </Typography>
                  <Typography variant="h4">
                    {teamAverages?.efficiency || 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Task Completion Rate
                  </Typography>
                </Box>
                <Timeline color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Completed Tasks
                  </Typography>
                  <Typography variant="h4">
                    {teamAverages?.tasksCompleted || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    This {timeRange}
                  </Typography>
                </Box>
                <CheckCircle color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Workload
                  </Typography>
                  <Typography variant="h4">
                    {teamAverages?.workload || 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Average Capacity
                  </Typography>
                </Box>
                <AccessTime color="warning" sx={{ fontSize: 40 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={teamAverages?.workload || 0} 
                sx={{ mt: 2 }}
                color={teamAverages?.workload || 0 > 80 ? 'warning' : 'primary'}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Team Performance Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="performance" fill="#8884d8" name="Performance Score" />
                  <Bar dataKey="efficiency" fill="#82ca9d" name="Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Team Member List */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Team Member Performance
            </Typography>
            <Box>
              <Button 
                size="small" 
                onClick={() => setTimeRange('week')}
                variant={timeRange === 'week' ? 'contained' : 'outlined'}
                sx={{ mr: 1 }}
              >
                Week
              </Button>
              <Button 
                size="small" 
                onClick={() => setTimeRange('month')}
                variant={timeRange === 'month' ? 'contained' : 'outlined'}
                sx={{ mr: 1 }}
              >
                Month
              </Button>
              <Button 
                size="small" 
                onClick={() => setTimeRange('quarter')}
                variant={timeRange === 'quarter' ? 'contained' : 'outlined'}
              >
                Quarter
              </Button>
            </Box>
          </Box>

          <List>
            {teamData.map((member) => (
              <React.Fragment key={member.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={member.avatar}>
                      {member.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {member.name}
                        </Typography>
                        <Chip 
                          label={member.role} 
                          size="small" 
                          sx={{ ml: 2 }}
                        />
                        <Chip 
                          label={member.department} 
                          size="small" 
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box display="flex" alignItems="center" mt={1}>
                          <Typography variant="body2" color="textSecondary" sx={{ mr: 3 }}>
                            <TrendingUp sx={{ fontSize: 14, mr: 0.5, color: member.performance >= 80 ? 'success.main' : 'warning.main' }} />
                            Performance: {member.performance}%
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mr: 3 }}>
                            <Task sx={{ fontSize: 14, mr: 0.5 }} />
                            Tasks: {member.tasksCompleted}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <AccessTime sx={{ fontSize: 14, mr: 0.5 }} />
                            Workload: {member.workload}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={member.performance} 
                          sx={{ mt: 1, width: '80%' }}
                          color={member.performance >= 80 ? 'success' : member.performance >= 60 ? 'primary' : 'warning'}
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <MoreVert />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}