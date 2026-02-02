'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Timeline as TimelineIcon,
  Groups as GroupsIcon,
  Task as TaskIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useRouter } from 'next/navigation';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'away' | 'offline' | 'on_leave';
  performance: number;
  tasksCompleted: number;
  joinDate: string;
  lastActive: string;
  avatar?: string;
}

interface TeamProject {
  _id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  progress: number;
  dueDate: string;
  teamLead: string;
  teamMembers: number;
}

interface TeamActivity {
  _id: string;
  type: string;
  description: string;
  teamMemberName: string;
  teamMemberAvatar?: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalProjects: number;
  activeProjects: number;
  avgPerformance: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export default function TeamDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    totalProjects: 0,
    activeProjects: 0,
    avgPerformance: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamProjects, setTeamProjects] = useState<TeamProject[]>([]);
  const [recentActivities, setRecentActivities] = useState<TeamActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team/dashboard');
      const data = await response.json();

      if (data.success) {
        setStats(data.data.stats);
        setTeamMembers(data.data.teamMembers);
        setTeamProjects(data.data.teamProjects);
        setRecentActivities(data.data.recentActivities);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      active: { color: 'success', icon: <CheckCircleIcon fontSize="small" />, label: 'Active' },
      away: { color: 'warning', icon: <WarningIcon fontSize="small" />, label: 'Away' },
      offline: { color: 'default', icon: <PeopleIcon fontSize="small" />, label: 'Offline' },
      on_leave: { color: 'info', icon: <CalendarIcon fontSize="small" />, label: 'On Leave' },
    }[status] || { color: 'default', icon: null, label: status };

    return (
      <Chip
        // icon={config.icon}
        label={config.label}
        color={config.color as any}
        size="small"
        variant="outlined"
      />
    );
  };

  // Project status badge
  const ProjectStatusBadge = ({ status }: { status: string }) => {
    const config = {
      planning: { color: 'info', label: 'Planning' },
      active: { color: 'success', label: 'Active' },
      on_hold: { color: 'warning', label: 'On Hold' },
      completed: { color: 'primary', label: 'Completed' },
      cancelled: { color: 'error', label: 'Cancelled' },
    }[status] || { color: 'default', label: status };

    return (
      <Chip
        label={config.label}
        color={config.color as any}
        size="small"
      />
    );
  };

  // Performance indicator
  const PerformanceIndicator = ({ performance }: { performance: number }) => {
    const getColor = () => {
      if (performance >= 90) return 'success';
      if (performance >= 80) return 'warning';
      if (performance >= 70) return 'info';
      return 'error';
    };

    return (
      <Box sx={{ minWidth: 120 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <LinearProgress 
            variant="determinate" 
            value={performance} 
            color={getColor()}
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {performance}%
          </Typography>
        </Box>
      </Box>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircleIcon fontSize="small" color="success" />;
      case 'project_created':
        return <WorkIcon fontSize="small" color="primary" />;
      case 'member_joined':
        return <PeopleIcon fontSize="small" color="info" />;
      case 'milestone_achieved':
        return <StarIcon fontSize="small" color="warning" />;
      case 'deadline_approaching':
        return <WarningIcon fontSize="small" color="error" />;
      default:
        return <TimelineIcon fontSize="small" color="action" />;
    }
  };

  // Get priority chip
  const getPriorityChip = (priority: string) => {
    const config = {
      high: { color: 'error', label: 'High' },
      medium: { color: 'warning', label: 'Medium' },
      low: { color: 'success', label: 'Low' },
    }[priority] || { color: 'default', label: priority };

    return (
      <Chip
        label={config.label}
        size="small"
        color={config.color as any}
        variant="outlined"
      />
    );
  };

  if (loading) {
    return (
      <MainLayout title="Team Dashboard">
        <Container sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Loading dashboard...</Typography>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Team Dashboard">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.push('/dashboard')}
            sx={{ mb: 2 }}
            size="small"
          >
            Back to Main Dashboard
          </Button>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Team Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your team, track projects, and monitor performance
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchDashboardData}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                component={Link}
                href="/team/members/add"
                startIcon={<AddIcon />}
              >
                Add Team Member
              </Button>
            </Stack>
          </Box>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Team Members
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.totalMembers}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      {stats.activeMembers} active
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PeopleIcon />
                  </Avatar>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.activeMembers / stats.totalMembers) * 100} 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Active Projects
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.activeProjects}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      out of {stats.totalProjects} total
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <WorkIcon />
                  </Avatar>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.activeProjects / stats.totalProjects) * 100} 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Avg. Performance
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.avgPerformance}%
                    </Typography>
                    <Typography variant="caption" color={stats.avgPerformance >= 80 ? 'success.main' : 'warning.main'}>
                      {stats.avgPerformance >= 80 ? 'Excellent' : 'Needs Improvement'}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <TrendingUpIcon />
                  </Avatar>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.avgPerformance} 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Tasks Completed
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.completedTasks}
                    </Typography>
                    <Typography variant="caption" color="error.main">
                      {stats.overdueTasks} overdue
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <AssignmentIcon />
                  </Avatar>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100} 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Main Content Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<GroupsIcon />} label="Team Members" />
            <Tab icon={<WorkIcon />} label="Projects" />
            <Tab icon={<TimelineIcon />} label="Activities" />
            <Tab icon={<AnalyticsIcon />} label="Analytics" />
          </Tabs>
        </Paper>

        {/* Tab Content - Team Members */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
            {/* Team Members List */}
            <Card sx={{ flex: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Team Members ({teamMembers.length})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: 200 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Department</InputLabel>
                      <Select label="Department" defaultValue="all">
                        <MenuItem value="all">All Departments</MenuItem>
                        <MenuItem value="engineering">Engineering</MenuItem>
                        <MenuItem value="design">Design</MenuItem>
                        <MenuItem value="marketing">Marketing</MenuItem>
                        <MenuItem value="sales">Sales</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Member</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Performance</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member._id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar 
                                src={member.avatar} 
                                sx={{ bgcolor: 'primary.main' }}
                              >
                                {member.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={500}>
                                  {member.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {member.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{member.role}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {member.department}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={member.status} />
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                              Last active: {formatTimeAgo(member.lastActive)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <PerformanceIndicator performance={member.performance} />
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="View Profile">
                                <IconButton
                                  size="small"
                                  component={Link}
                                  href={`/team/members/${member._id}`}
                                >
                                  <PeopleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Assign Task">
                                <IconButton size="small">
                                  <AssignmentIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {teamMembers.length} of {stats.totalMembers} members
                  </Typography>
                  <Button
                    component={Link}
                    href="/team/members"
                    endIcon={<MoreVertIcon />}
                  >
                    View All
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions & Stats */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddIcon />
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      href="/team/members/add"
                      startIcon={<PeopleIcon />}
                    >
                      Add Team Member
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      component={Link}
                      href="/team/projects/add"
                      startIcon={<WorkIcon />}
                    >
                      Create Project
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      component={Link}
                      href="/team/tasks/add"
                      startIcon={<AssignmentIcon />}
                    >
                      Assign Task
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      component={Link}
                      href="/team/activities"
                      startIcon={<TimelineIcon />}
                    >
                      View Activities
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AnalyticsIcon />
                    Performance Overview
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">High Performers</Typography>
                        <Typography variant="body2" color="success.main" fontWeight={500}>
                          {teamMembers.filter(m => m.performance >= 90).length}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(teamMembers.filter(m => m.performance >= 90).length / teamMembers.length) * 100} 
                        color="success"
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Average Performers</Typography>
                        <Typography variant="body2" color="warning.main" fontWeight={500}>
                          {teamMembers.filter(m => m.performance >= 70 && m.performance < 90).length}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(teamMembers.filter(m => m.performance >= 70 && m.performance < 90).length / teamMembers.length) * 100} 
                        color="warning"
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Needs Improvement</Typography>
                        <Typography variant="body2" color="error.main" fontWeight={500}>
                          {teamMembers.filter(m => m.performance < 70).length}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(teamMembers.filter(m => m.performance < 70).length / teamMembers.length) * 100} 
                        color="error"
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* Tab Content - Projects */}
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
            {/* Projects List */}
            <Card sx={{ flex: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Team Projects ({teamProjects.length})
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    href="/team/projects/add"
                    startIcon={<AddIcon />}
                  >
                    New Project
                  </Button>
                </Box>

                <Stack spacing={2}>
                  {teamProjects.map((project) => (
                    <Paper 
                      key={project._id} 
                      variant="outlined" 
                      sx={{ p: 2, '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {project.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {project.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <ProjectStatusBadge status={project.status} />
                            <Typography variant="caption" color="text.secondary">
                              Due: {formatDate(project.dueDate)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Members: {project.teamMembers}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Lead: {project.teamLead}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={project.progress} 
                          sx={{ flex: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {project.progress}%
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    {teamProjects.filter(p => p.status === 'active').length} active projects
                  </Typography>
                  <Button
                    component={Link}
                    href="/team/projects"
                    endIcon={<MoreVertIcon />}
                  >
                    View All Projects
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon />
                    Project Status
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Active</Typography>
                        <Typography variant="body2" color="success.main" fontWeight={500}>
                          {teamProjects.filter(p => p.status === 'active').length}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(teamProjects.filter(p => p.status === 'active').length / teamProjects.length) * 100} 
                        color="success"
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Planning</Typography>
                        <Typography variant="body2" color="info.main" fontWeight={500}>
                          {teamProjects.filter(p => p.status === 'planning').length}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(teamProjects.filter(p => p.status === 'planning').length / teamProjects.length) * 100} 
                        color="info"
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">On Hold</Typography>
                        <Typography variant="body2" color="warning.main" fontWeight={500}>
                          {teamProjects.filter(p => p.status === 'on_hold').length}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(teamProjects.filter(p => p.status === 'on_hold').length / teamProjects.length) * 100} 
                        color="warning"
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon />
                    Upcoming Deadlines
                  </Typography>
                  <Stack spacing={2}>
                    {teamProjects
                      .filter(p => p.status === 'active')
                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                      .slice(0, 3)
                      .map(project => (
                        <Paper key={project._id} variant="outlined" sx={{ p: 1.5 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {project.name}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Due: {formatDate(project.dueDate)}
                            </Typography>
                            <Chip
                              label={`${project.progress}%`}
                              size="small"
                              color={project.progress >= 80 ? 'success' : 'warning'}
                            />
                          </Box>
                        </Paper>
                      ))}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* Tab Content - Activities */}
        {activeTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
            {/* Recent Activities */}
            <Card sx={{ flex: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Recent Activities
                  </Typography>
                  <Button
                    variant="outlined"
                    component={Link}
                    href="/team/activities"
                    startIcon={<TimelineIcon />}
                  >
                    View All Activities
                  </Button>
                </Box>

                <Stack spacing={2}>
                  {recentActivities.map((activity) => (
                    <Paper key={activity._id} variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ mt: 0.5 }}>
                          {getActivityIcon(activity.type)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" gutterBottom>
                            {activity.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                {activity.teamMemberName.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="caption" color="text.secondary">
                                {activity.teamMemberName}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getPriorityChip(activity.priority)}
                              <Typography variant="caption" color="text.secondary">
                                {formatTimeAgo(activity.timestamp)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationsIcon />
                    Activity Summary
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Today's Activities
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {recentActivities.filter(a => {
                          const activityDate = new Date(a.timestamp);
                          const today = new Date();
                          return activityDate.toDateString() === today.toDateString();
                        }).length}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        This Week
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {recentActivities.filter(a => {
                          const activityDate = new Date(a.timestamp);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return activityDate >= weekAgo;
                        }).length}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon />
                    Top Performers
                  </Typography>
                  <Stack spacing={2}>
                    {teamMembers
                      .sort((a, b) => b.performance - a.performance)
                      .slice(0, 3)
                      .map((member, index) => (
                        <Paper key={member._id} variant="outlined" sx={{ p: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              src={member.avatar}
                              sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight={500}>
                                {member.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {member.role}
                              </Typography>
                            </Box>
                            <Chip
                              label={`${member.performance}%`}
                              size="small"
                              color="success"
                            />
                          </Box>
                        </Paper>
                      ))}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* Tab Content - Analytics */}
        {activeTab === 3 && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
            {/* Analytics Overview */}
            <Card sx={{ flex: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <AnalyticsIcon />
                  Team Analytics
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                  <Paper variant="outlined" sx={{ p: 3, flex: 1, textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight={700}>
                      {stats.avgPerformance}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Team Performance
                    </Typography>
                    <Typography variant="caption" color={stats.avgPerformance >= 80 ? 'success.main' : 'warning.main'}>
                      {stats.avgPerformance >= 80 ? '+5% from last month' : '-2% from last month'}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 3, flex: 1, textAlign: 'center' }}>
                    <AssignmentIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight={700}>
                      {stats.completedTasks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasks Completed
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      +15% from last month
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 3, flex: 1, textAlign: 'center' }}>
                    <GroupsIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight={700}>
                      {teamMembers.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Team Members
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      +2 from last month
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Department Performance
                  </Typography>
                  <Stack spacing={2}>
                    {['Engineering', 'Design', 'Marketing', 'Sales'].map(dept => {
                      const deptMembers = teamMembers.filter(m => m.department.toLowerCase() === dept.toLowerCase());
                      const avgPerformance = deptMembers.length > 0 
                        ? Math.round(deptMembers.reduce((acc, m) => acc + m.performance, 0) / deptMembers.length)
                        : 0;
                      
                      return (
                        <Box key={dept}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">{dept}</Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {avgPerformance}% ({deptMembers.length} members)
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={avgPerformance} 
                            color={avgPerformance >= 80 ? 'success' : avgPerformance >= 70 ? 'warning' : 'error'}
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            {/* Export & Reports */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DownloadIcon />
                    Export Reports
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                    >
                      Team Performance Report
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                    >
                      Project Progress Report
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                    >
                      Activity Log Report
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                    >
                      Department Analytics
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon />
                    Upcoming Events
                  </Typography>
                  <Stack spacing={2}>
                    <Paper variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Team Meeting
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Every Monday, 10:00 AM
                      </Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Project Review
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Friday, 2:00 PM
                      </Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Performance Review
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        End of Month
                      </Typography>
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* Quick Links Footer */}
        <Paper variant="outlined" sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/team/members"
              startIcon={<PeopleIcon />}
              variant="text"
            >
              All Team Members
            </Button>
            <Button
              component={Link}
              href="/team/projects"
              startIcon={<WorkIcon />}
              variant="text"
            >
              All Projects
            </Button>
            <Button
              component={Link}
              href="/team/tasks"
              startIcon={<AssignmentIcon />}
              variant="text"
            >
              All Tasks
            </Button>
            <Button
              component={Link}
              href="/team/activities"
              startIcon={<TimelineIcon />}
              variant="text"
            >
              All Activities
            </Button>
            <Button
              component={Link}
              href="/team/reports"
              startIcon={<AnalyticsIcon />}
              variant="text"
            >
              Reports
            </Button>
            <Button
              component={Link}
              href="/team/settings"
              startIcon={<MoreVertIcon />}
              variant="text"
            >
              Team Settings
            </Button>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
}