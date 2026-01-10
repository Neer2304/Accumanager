// app/projects/[id]/page.tsx - UPDATED
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Tooltip,
  Divider,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link as MuiLink,
  Fab,
  Snackbar,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  MoreVert,
  CalendarToday,
  AttachMoney,
  People,
  Category,
  TrendingUp,
  CheckCircle,
  AccessTime,
  Pause,
  Error as ErrorIcon,
  Dashboard,
  Task,
  Chat,
  AttachFile,
  Timeline,
  Comment,
  Add,
  ArrowForward,
  Share,
  Download,
  Print,
  Notifications,
  Visibility,
  VisibilityOff,
  Lock,
  LockOpen,
  Archive,
  Unarchive,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { offlineStorage } from '@/utils/offlineStorage';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  startDate: string;
  deadline: string;
  budget: number;
  actualCost: number;
  clientId?: string;
  clientName: string;
  category: 'sales' | 'marketing' | 'development' | 'internal' | 'client' | 'other';
  teamMembers: string[];
  tags: string[];
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  createdAt: string;
  updatedAt: string;
  notes?: string[];
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: string;
  }[];
}

interface ProjectTask {
  _id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'in_review' | 'completed' | 'blocked' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  progress: number;
  assignedToName?: string;
}

interface ProjectComment {
  _id: string;
  text: string;
  type: 'comment' | 'update' | 'milestone' | 'issue';
  userName: string;
  userAvatar?: string;
  createdAt: string;
  projectId: string;
}

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Online/Offline Detection
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      showSnackbar('You are back online — syncing changes...', 'success');
    };
    const goOffline = () => {
      setIsOnline(false);
      showSnackbar('Offline mode — changes will sync when online', 'warning');
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Fetch project details
  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isOnline) {
        const localProjects = await offlineStorage.getItem<Project[]>('projects') || [];
        const localProject = localProjects.find(p => p._id === projectId);
        if (localProject) {
          setProject(localProject);
          showSnackbar('Loaded project from offline storage', 'info');
        } else {
          setError('Project not found in offline storage');
        }
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Project not found');
        }
        throw new Error('Failed to fetch project details');
      }

      const data = await response.json();
      if (data.success) {
        setProject(data.project);
        
        // Fetch related data
        await fetchProjectTasks(projectId);
        await fetchProjectComments(projectId);
      } else {
        throw new Error(data.error || 'Failed to load project');
      }
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.message || 'Failed to load project details');
      
      // Try offline storage
      if (!isOnline) {
        const localProjects = await offlineStorage.getItem<Project[]>('projects') || [];
        const localProject = localProjects.find(p => p._id === projectId);
        if (localProject) {
          setProject(localProject);
          setError(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch project tasks
  const fetchProjectTasks = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}/tasks`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTasks(data.tasks || []);
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Fetch project comments
  const fetchProjectComments = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}/comments`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setComments(data.comments || []);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  // Handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEditProject = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showSnackbar('Project deleted successfully', 'success');
          router.push('/projects');
        } else {
          throw new Error(data.error || 'Failed to delete project');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to delete project', 'error');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleUpdateProject = async (updatedData: Partial<Project>) => {
    if (!project) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project._id,
          ...updatedData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProject({ ...project, ...updatedData });
          showSnackbar('Project updated successfully', 'success');
          setEditDialogOpen(false);
          return true;
        } else {
          throw new Error(data.error || 'Failed to update project');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to update project', 'error');
      return false;
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !project) return;

    try {
      const response = await fetch(`/api/projects/${project._id}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: commentText,
          type: 'comment',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setComments([data.comment, ...comments]);
          setCommentText('');
          showSnackbar('Comment added successfully', 'success');
        } else {
          throw new Error(data.error || 'Failed to add comment');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to add comment', 'error');
    }
  };

  const handleStatusChange = async (newStatus: Project['status']) => {
    await handleUpdateProject({ status: newStatus });
  };

  const handleAddTask = async (taskData: any) => {
    if (!project) return;

    try {
      const response = await fetch(`/api/projects/${project._id}/tasks`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchProjectTasks(project._id);
          showSnackbar('Task added successfully', 'success');
          setTaskDialogOpen(false);
          return true;
        } else {
          throw new Error(data.error || 'Failed to add task');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add task');
      }
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to add task', 'error');
      return false;
    }
  };

  // Helper functions
  const getStatusColor = (status: Project['status']) => {
    const colors: Record<Project['status'], any> = {
      active: 'success',
      planning: 'info',
      paused: 'warning',
      completed: 'primary',
      delayed: 'error',
      cancelled: 'default',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Project['status']) => {
    const icons = {
      active: <TrendingUp />,
      planning: <AccessTime />,
      paused: <Pause />,
      completed: <CheckCircle />,
      delayed: <ErrorIcon />,
      cancelled: <ErrorIcon />,
    };
    return icons[status];
  };

  const getPriorityColor = (priority: Project['priority']) => {
    const colors: Record<Project['priority'], any> = {
      urgent: 'error',
      high: 'warning',
      medium: 'info',
      low: 'success',
    };
    return colors[priority];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTimeProgress = () => {
    if (!project) return 0;
    
    const start = new Date(project.startDate).getTime();
    const end = new Date(project.deadline).getTime();
    const now = Date.now();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const calculateBudgetUsage = () => {
    if (!project || project.budget === 0) return 0;
    return Math.round((project.actualCost / project.budget) * 100);
  };

  const getTaskStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      completed: 'success',
      in_progress: 'info',
      not_started: 'default',
      blocked: 'error',
      cancelled: 'default',
      in_review: 'warning',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <MainLayout title="Loading Project...">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
          <CircularProgress size={60} />
        </Box>
      </MainLayout>
    );
  }

  if (error || !project) {
    return (
      <MainLayout title="Project Not Found">
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
          <Paper sx={{ p: 8, borderRadius: 4, boxShadow: 6 }}>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
            <Typography variant="h4" fontWeight="bold" color="error" gutterBottom>
              {error || 'Project Not Found'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
              The project you're looking for doesn't exist or you don't have permission to view it.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/projects')}
            >
              Back to Projects
            </Button>
          </Paper>
        </Box>
      </MainLayout>
    );
  }

  const daysLeft = getDaysRemaining(project.deadline);
  const isOverdue = daysLeft < 0;
  const timeProgress = calculateTimeProgress();
  const budgetUsage = calculateBudgetUsage();

  return (
    <MainLayout title={project.name}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink component={Link} href="/dashboard" color="inherit" underline="hover">
            Dashboard
          </MuiLink>
          <MuiLink component={Link} href="/projects" color="inherit" underline="hover">
            Projects
          </MuiLink>
          <Typography color="text.primary">{project.name}</Typography>
        </Breadcrumbs>

        {/* Header Section */}
        <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h3" fontWeight="bold">
                  {project.name}
                </Typography>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
              </Box>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {project.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Chip
                  icon={getStatusIcon(project.status)}
                  label={project.status.toUpperCase()}
                  color={getStatusColor(project.status) as any}
                  size="medium"
                />
                <Chip
                  label={`${project.priority.toUpperCase()} PRIORITY`}
                  color={getPriorityColor(project.priority) as any}
                  variant="outlined"
                  size="medium"
                />
                <Chip
                  icon={<Category />}
                  label={project.category.toUpperCase()}
                  variant="outlined"
                  size="medium"
                />
                <Chip
                  icon={<AttachMoney />}
                  label={`Budget: $${project.budget.toLocaleString()}`}
                  size="medium"
                />
              </Box>
            </Box>
            
            <Stack spacing={2} alignItems="flex-end">
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditProject}
              >
                Edit Project
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Stats Cards - Fixed without Grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          {/* Progress Card */}
          <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <CardContent>
              <Stack alignItems="center" spacing={1}>
                <Typography variant="h2" fontWeight="bold" color="primary.main">
                  {project.progress}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overall Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{ width: '100%', height: 8, borderRadius: 4 }}
                />
              </Stack>
            </CardContent>
          </Card>
          
          {/* Days Remaining Card */}
          <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <CardContent>
              <Stack alignItems="center" spacing={1}>
                <Typography variant="h2" fontWeight="bold" color={isOverdue ? 'error.main' : 'warning.main'}>
                  {isOverdue ? `+${Math.abs(daysLeft)}` : daysLeft}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isOverdue ? 'Days Overdue' : 'Days Remaining'}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={timeProgress}
                  color={isOverdue ? 'error' : 'warning'}
                  sx={{ width: '100%', height: 8, borderRadius: 4 }}
                />
              </Stack>
            </CardContent>
          </Card>
          
          {/* Budget Card */}
          <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <CardContent>
              <Stack alignItems="center" spacing={1}>
                <Typography variant="h2" fontWeight="bold" color={budgetUsage > 100 ? 'error.main' : 'success.main'}>
                  {budgetUsage}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Budget Used
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    ${project.actualCost.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    / ${project.budget.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          
          {/* Tasks Card */}
          <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <CardContent>
              <Stack alignItems="center" spacing={1}>
                <Typography variant="h2" fontWeight="bold" color="info.main">
                  {tasks.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Chip label={`${project.completedTasks} Done`} size="small" color="success" />
                  <Chip label={`${project.inProgressTasks} In Progress`} size="small" color="warning" />
                  <Chip label={`${project.blockedTasks} Blocked`} size="small" color="error" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs Section */}
        <Paper elevation={2} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<Dashboard />} label="Overview" />
            <Tab icon={<Task />} label={`Tasks (${tasks.length})`} />
            <Tab icon={<People />} label="Team" />
            <Tab icon={<Timeline />} label="Timeline" />
            <Tab icon={<Chat />} label={`Discussion (${comments.length})`} />
            <Tab icon={<AttachFile />} label="Files" />
          </Tabs>

          <Box sx={{ p: 4 }}>
            {/* Overview Tab */}
            {tabValue === 0 && (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Project Details
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        <Box sx={{ flex: '1 1 200px' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Start Date
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(project.startDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '1 1 200px' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Deadline
                          </Typography>
                          <Typography variant="body1" color={isOverdue ? 'error.main' : 'inherit'}>
                            {formatDate(project.deadline)} {isOverdue && '(Overdue)'}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '1 1 200px' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Client
                          </Typography>
                          <Typography variant="body1">
                            {project.clientName || 'No client specified'}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '1 1 200px' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Category
                          </Typography>
                          <Typography variant="body1">
                            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tags
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {project.tags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" variant="outlined" />
                          ))}
                          {project.tags.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                              No tags added
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  {/* Quick Actions */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Quick Actions
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => setTaskDialogOpen(true)}
                        >
                          Add Task
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Share />}
                        >
                          Share Project
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Download />}
                        >
                          Export Report
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Print />}
                        >
                          Print Details
                        </Button>
                      </Box>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Change Status
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(['planning', 'active', 'paused', 'completed', 'cancelled'] as Project['status'][]).map((status) => (
                          <Button
                            key={status}
                            variant={project.status === status ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => handleStatusChange(status)}
                            disabled={project.status === status}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ width: { xs: '100%', md: '33%' } }}>
                  {/* Team Members */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                          Team Members
                        </Typography>
                        <IconButton size="small">
                          <Add />
                        </IconButton>
                      </Box>
                      
                      {project.teamMembers.length > 0 ? (
                        <AvatarGroup max={6} sx={{ justifyContent: 'flex-start', mb: 2 }}>
                          {project.teamMembers.map((member, index) => (
                            <Tooltip key={index} title={member}>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {member.charAt(0).toUpperCase()}
                              </Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          No team members assigned
                        </Typography>
                      )}
                      
                      <Button variant="outlined" fullWidth>
                        Manage Team
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Activity */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Recent Activity
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {comments.slice(0, 5).map((comment, index) => (
                          <ListItem key={comment._id} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main' }}>
                                {comment.userName.charAt(0).toUpperCase()}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={comment.userName}
                              secondary={
                                <>
                                  <Typography variant="body2" color="text.secondary">
                                    {comment.text}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                        
                        {comments.length === 0 && (
                          <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                            No recent activity
                          </Typography>
                        )}
                      </List>
                      
                      <Button
                        variant="text"
                        fullWidth
                        onClick={() => setTabValue(4)}
                      >
                        View All Activity
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}

            {/* Tasks Tab */}
            {tabValue === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Project Tasks
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setTaskDialogOpen(true)}
                  >
                    Add New Task
                  </Button>
                </Box>
                
                {tasks.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tasks.map((task) => (
                      <Card key={task._id}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {task.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {task.description}
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                <Chip 
                                  label={task.status.replace('_', ' ').toUpperCase()} 
                                  size="small" 
                                  color={getTaskStatusColor(task.status) as any}
                                />
                                <Chip label={task.priority} size="small" variant="outlined" />
                                {task.dueDate && (
                                  <Typography variant="caption" color="text.secondary">
                                    Due: {formatDate(task.dueDate)}
                                  </Typography>
                                )}
                                {task.assignedToName && (
                                  <Typography variant="caption" color="text.secondary">
                                    Assigned to: {task.assignedToName}
                                  </Typography>
                                )}
                              </Box>
                              {task.progress > 0 && (
                                <Box sx={{ mt: 1, width: '100%', maxWidth: 200 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={task.progress} 
                                    sx={{ height: 6, borderRadius: 3 }}
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {task.progress}% complete
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <IconButton size="small">
                              <MoreVert />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
                    <Task sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No tasks yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                      Add your first task to get started
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setTaskDialogOpen(true)}
                    >
                      Create First Task
                    </Button>
                  </Paper>
                )}
              </Box>
            )}

            {/* Discussion Tab */}
            {tabValue === 4 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Project Discussion
                </Typography>
                
                {/* Add Comment */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Add a comment or update..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={() => setCommentText('')}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                    >
                      Post Comment
                    </Button>
                  </Box>
                </Paper>
                
                {/* Comments List */}
                {comments.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {comments.map((comment) => (
                      <Paper key={comment._id} sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {comment.userName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {comment.userName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(comment.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                            <Typography variant="body2" paragraph>
                              {comment.text}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button size="small">Reply</Button>
                              <Button size="small">Like</Button>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
                    <Chat sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No discussions yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start the conversation by posting a comment
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}
          </Box>
        </Paper>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
          }}
          onClick={() => setTaskDialogOpen(true)}
        >
          <Add />
        </Fab>

        {/* Dialogs & Menus */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEditProject}>
            <Edit sx={{ mr: 1 }} fontSize="small" /> Edit Project
          </MenuItem>
          <MenuItem onClick={() => setTabValue(1)}>
            <Task sx={{ mr: 1 }} fontSize="small" /> View Tasks
          </MenuItem>
          <MenuItem onClick={() => setTabValue(4)}>
            <Chat sx={{ mr: 1 }} fontSize="small" /> View Discussions
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} fontSize="small" /> Delete Project
          </MenuItem>
        </Menu>

        {/* Edit Project Dialog */}
        <EditProjectDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          project={project}
          onSave={handleUpdateProject}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{project.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteProject} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Task Dialog */}
        <AddTaskDialog
          open={taskDialogOpen}
          onClose={() => setTaskDialogOpen(false)}
          onSave={handleAddTask}
          projectName={project.name}
        />

        {/* Snackbar */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
}

// Edit Project Dialog Component
const EditProjectDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (data: Partial<Project>) => Promise<boolean>;
}> = ({ open, onClose, project, onSave }) => {
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate.split('T')[0],
        deadline: project.deadline.split('T')[0],
        budget: project.budget,
        clientName: project.clientName,
        category: project.category,
        tags: project.tags,
        teamMembers: project.teamMembers,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setLoading(true);
    const success = await onSave(formData);
    setLoading(false);
    
    if (success) {
      onClose();
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Edit Project
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Project Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            
            <TextField
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <FormControl sx={{ flex: '1 1 200px' }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || 'planning'}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="delayed">Delayed</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ flex: '1 1 200px' }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority || 'medium'}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Project['priority'] })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <TextField
                label="Start Date"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: '1 1 200px' }}
                required
              />
              
              <TextField
                label="Deadline"
                type="date"
                value={formData.deadline || ''}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: '1 1 200px' }}
                required
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <TextField
                label="Budget ($)"
                type="number"
                value={formData.budget || 0}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                sx={{ flex: '1 1 200px' }}
              />
              
              <FormControl sx={{ flex: '1 1 200px' }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category || 'other'}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Project['category'] })}
                >
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="development">Development</MenuItem>
                  <MenuItem value="internal">Internal</MenuItem>
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label="Client Name"
              value={formData.clientName || ''}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              fullWidth
            />
            
            <TextField
              label="Team Members (comma-separated)"
              value={Array.isArray(formData.teamMembers) ? formData.teamMembers.join(', ') : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                teamMembers: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) 
              })}
              placeholder="John Doe, Jane Smith"
              fullWidth
            />
            
            <TextField
              label="Tags (comma-separated)"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) 
              })}
              placeholder="urgent, web, redesign"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Update Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Add Task Dialog Component
const AddTaskDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: (taskData: any) => Promise<boolean>;
  projectName: string;
}> = ({ open, onClose, onSave, projectName }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not_started' as const,
    priority: 'medium' as const,
    dueDate: '',
    estimatedHours: 0,
    assignedToName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSave(formData);
    setLoading(false);
    
    if (success) {
      setFormData({
        title: '',
        description: '',
        status: 'not_started',
        priority: 'medium',
        dueDate: '',
        estimatedHours: 0,
        assignedToName: '',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Add New Task to {projectName}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <FormControl sx={{ flex: '1 1 200px' }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <MenuItem value="not_started">Not Started</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="in_review">In Review</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ flex: '1 1 200px' }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            
            <TextField
              label="Estimated Hours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) })}
              fullWidth
            />
            
            <TextField
              label="Assigned To (Name)"
              value={formData.assignedToName}
              onChange={(e) => setFormData({ ...formData, assignedToName: e.target.value })}
              fullWidth
              placeholder="Enter team member name"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !formData.title.trim()}>
            {loading ? <CircularProgress size={24} /> : 'Add Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};