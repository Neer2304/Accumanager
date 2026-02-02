'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  OfflineBolt as OfflineIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useRouter, useParams } from 'next/navigation';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'away' | 'offline' | 'on_leave';
  performance: number;
  tasksCompleted: number;
  phone?: string;
  location?: string;
  skills?: string[];
  bio?: string;
  lastActive: string;
  joinDate: string;
  teamProjects: Array<{
    _id: string;
    name: string;
    status: string;
    progress: number;
  }>;
  teamTasks: Array<{
    _id: string;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
  }>;
}

export default function TeamMemberDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [assignProjectDialog, setAssignProjectDialog] = useState(false);
  const [assignTaskDialog, setAssignTaskDialog] = useState(false);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [loadingAssign, setLoadingAssign] = useState(false);

  // Fetch team member details
  const fetchTeamMember = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/team/members/${memberId}`);
      const data = await response.json();
      
      if (data.success) {
        setTeamMember(data.data);
      }
    } catch (error) {
      console.error('Error fetching team member:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available team projects
  const fetchAvailableProjects = async () => {
    try {
      const response = await fetch('/api/team/projects?status=active');
      const data = await response.json();
      
      if (data.success) {
        const assignedProjectIds = teamMember?.teamProjects?.map(p => p._id) || [];
        const available = data.projects.filter(
          (project: any) => !assignedProjectIds.includes(project._id)
        );
        setAvailableProjects(available);
      }
    } catch (error) {
      console.error('Error fetching team projects:', error);
    }
  };

  // Fetch available team tasks
  const fetchAvailableTasks = async () => {
    try {
      const response = await fetch('/api/team/tasks?status=todo,in_progress');
      const data = await response.json();
      
      if (data.success) {
        const assignedTaskIds = teamMember?.teamTasks?.map(t => t._id) || [];
        const available = data.tasks.filter(
          (task: any) => !assignedTaskIds.includes(task._id)
        );
        setAvailableTasks(available);
      }
    } catch (error) {
      console.error('Error fetching team tasks:', error);
    }
  };

  useEffect(() => {
    if (memberId) {
      fetchTeamMember();
    }
  }, [memberId]);

  useEffect(() => {
    if (teamMember) {
      fetchAvailableProjects();
      fetchAvailableTasks();
    }
  }, [teamMember]);

  // Assign project to team member
  const handleAssignProject = async () => {
    if (!selectedProjectId) return;
    
    try {
      setLoadingAssign(true);
      
      const response = await fetch(`/api/team/members/${memberId}/assign-team-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamProjectId: selectedProjectId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchTeamMember();
        setAssignProjectDialog(false);
        setSelectedProjectId('');
      }
    } catch (error) {
      console.error('Error assigning team project:', error);
    } finally {
      setLoadingAssign(false);
    }
  };

  // Assign task to team member
  const handleAssignTask = async () => {
    if (!selectedTaskId) return;
    
    try {
      setLoadingAssign(true);
      
      const response = await fetch(`/api/team/members/${memberId}/assign-team-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamTaskId: selectedTaskId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchTeamMember();
        setAssignTaskDialog(false);
        setSelectedTaskId('');
      }
    } catch (error) {
      console.error('Error assigning team task:', error);
    } finally {
      setLoadingAssign(false);
    }
  };

  // Remove project assignment
  const handleRemoveProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/team/members/${memberId}/remove-team-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamProjectId: projectId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchTeamMember();
      }
    } catch (error) {
      console.error('Error removing team project:', error);
    }
  };

  // Remove task assignment
  const handleRemoveTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/team/members/${memberId}/remove-team-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamTaskId: taskId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchTeamMember();
      }
    } catch (error) {
      console.error('Error removing team task:', error);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      active: { color: 'success', icon: <CheckCircleIcon />, label: 'Active' },
      away: { color: 'warning', icon: <WarningIcon />, label: 'Away' },
      offline: { color: 'default', icon: <OfflineIcon />, label: 'Offline' },
      on_leave: { color: 'info', icon: <CalendarIcon />, label: 'On Leave' },
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

  if (loading) {
    return (
      <MainLayout title="Team Member Details">
        <Container sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading team member details...</Typography>
        </Container>
      </MainLayout>
    );
  }

  if (!teamMember) {
    return (
      <MainLayout title="Not Found">
        <Container sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5">Team member not found</Typography>
          <Button
            component={Link}
            href="/team/members"
            sx={{ mt: 2 }}
            startIcon={<BackIcon />}
          >
            Back to Team Members
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`${teamMember.name} - Team Member`}>
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.push('/team/members')}
            sx={{ mb: 2 }}
            size="small"
          >
            Back to Team Members
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
              {teamMember.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {teamMember.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <StatusBadge status={teamMember.status} />
                <Chip
                  icon={<StarIcon />}
                  label={`${teamMember.performance}% Performance`}
                  color="warning"
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>

          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Overview" />
              <Tab label={`Projects (${teamMember.teamProjects?.length || 0})`} />
              <Tab label={`Tasks (${teamMember.teamTasks?.length || 0})`} />
            </Tabs>
          </Paper>
        </Box>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Left Column - Basic Info */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Basic Information</Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        <EmailIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 16 }} />
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {teamMember.email}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        <WorkIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 16 }} />
                        Role
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {teamMember.role}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        <BusinessIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 16 }} />
                        Department
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {teamMember.department}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        <CalendarIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 16 }} />
                        Joined
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {new Date(teamMember.joinDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    {teamMember.phone && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 16 }} />
                          Phone
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {teamMember.phone}
                        </Typography>
                      </Box>
                    )}
                    
                    {teamMember.location && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <LocationIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 16 }} />
                          Location
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {teamMember.location}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Skills */}
              {teamMember.skills && teamMember.skills.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CodeIcon />
                      Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {teamMember.skills.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Right Column - Stats */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Performance</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Current Performance</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {teamMember.performance}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={teamMember.performance} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', flex: 1 }}>
                      <Typography variant="h5" color="primary" fontWeight={700}>
                        {teamMember.teamProjects?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Team Projects
                      </Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', flex: 1 }}>
                      <Typography variant="h5" color="primary" fontWeight={700}>
                        {teamMember.teamTasks?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Team Tasks
                      </Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', flex: 1 }}>
                      <Typography variant="h5" color="success.main" fontWeight={700}>
                        {teamMember.tasksCompleted}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasks Completed
                      </Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', flex: 1 }}>
                      <Typography variant="h5" color="info.main" fontWeight={700}>
                        {Math.round(teamMember.performance / 20)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Grade
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>

              {/* Bio */}
              {teamMember.bio && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon />
                      Bio
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {teamMember.bio}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        )}

        {/* Projects Tab */}
        {tabValue === 1 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Team Projects
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAssignProjectDialog(true)}
                >
                  Assign Project
                </Button>
              </Box>

              {(!teamMember.teamProjects || teamMember.teamProjects.length === 0) ? (
                <Alert severity="info">
                  No team projects assigned yet.
                </Alert>
              ) : (
                <List>
                  {teamMember.teamProjects.map((project) => (
                    <ListItem
                      key={project._id}
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <WorkIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight={500}>
                            {project.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                            <Chip
                              label={project.status}
                              size="small"
                              color={project.status === 'completed' ? 'success' : 'primary'}
                            />
                            <Typography variant="caption" color="text.secondary">
                              Progress: {project.progress}%
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveProject(project._id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tasks Tab */}
        {tabValue === 2 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Team Tasks
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAssignTaskDialog(true)}
                >
                  Assign Task
                </Button>
              </Box>

              {(!teamMember.teamTasks || teamMember.teamTasks.length === 0) ? (
                <Alert severity="info">
                  No team tasks assigned yet.
                </Alert>
              ) : (
                <List>
                  {teamMember.teamTasks.map((task) => (
                    <ListItem
                      key={task._id}
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: task.priority === 'urgent' ? 'error.main' :
                                  task.priority === 'high' ? 'warning.main' :
                                  'primary.main' 
                        }}>
                          <AssignmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight={500}>
                            {task.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                            <Chip
                              label={task.status}
                              size="small"
                              color={task.status === 'completed' ? 'success' : 'primary'}
                            />
                            <Chip
                              label={task.priority}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveTask(task._id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Assign Project Dialog */}
      <Dialog open={assignProjectDialog} onClose={() => setAssignProjectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Team Project</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Project</InputLabel>
            <Select
              value={selectedProjectId}
              label="Select Project"
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {availableProjects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.name} ({project.status})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {availableProjects.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No team projects available for assignment.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignProjectDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAssignProject}
            variant="contained"
            disabled={!selectedProjectId || loadingAssign}
          >
            {loadingAssign ? <CircularProgress size={24} /> : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Task Dialog */}
      <Dialog open={assignTaskDialog} onClose={() => setAssignTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Team Task</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Task</InputLabel>
            <Select
              value={selectedTaskId}
              label="Select Task"
              onChange={(e) => setSelectedTaskId(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {availableTasks.map((task) => (
                <MenuItem key={task._id} value={task._id}>
                  {task.title} ({task.priority})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {availableTasks.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No team tasks available for assignment.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignTaskDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAssignTask}
            variant="contained"
            disabled={!selectedTaskId || loadingAssign}
          >
            {loadingAssign ? <CircularProgress size={24} /> : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}