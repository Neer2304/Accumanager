// app/(pages)/tasks/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
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
  Tooltip,
  Snackbar,
  Badge,
  Stack,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  PlayArrow,
  Warning,
  CloudOff,
  CloudQueue,
  Sync,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { offlineStorage } from '@/utils/offlineStorage';

interface Task {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  projectId: string;
  projectName: string;
  assignedToName: string;
  estimatedHours: number;
  actualHours: number;
  createdAt: string;
  updatedAt?: string;
  isLocal?: boolean;
  isSynced?: boolean;
  syncAttempts?: number;
}

interface Project {
  _id: string;
  name: string;
}

// Professional Color Theme
const colorTheme = {
  primary: {
    main: '#0d9488',
    light: '#5eead4',
    dark: '#115e59',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #2563eb 100%)',
  },
  secondary: {
    main: '#f59e0b',
    light: '#fde68a',
    dark: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  success: {
    main: '#10b981',
    light: '#a7f3d0',
    dark: '#047857',
  },
  error: {
    main: '#f43f5e',
    light: '#fecdd3',
    dark: '#be123c',
  },
  warning: {
    main: '#f97316',
    light: '#fed7aa',
    dark: '#c2410c',
  },
  info: {
    main: '#0ea5e9',
    light: '#bae6fd',
    dark: '#0369a1',
  },
  background: {
    light: '#f8fafc',
    paper: '#ffffff',
    dark: '#1e293b',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    disabled: '#94a3b8',
    white: '#ffffff',
  }
};

// Network Status Component
function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkSyncStatus = async () => {
      const status = await offlineStorage.getSyncStatus();
      setSyncStatus(status);
    };

    checkSyncStatus();
    const interval = setInterval(checkSyncStatus, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    await offlineStorage.processSyncQueue();
    const status = await offlineStorage.getSyncStatus();
    setSyncStatus(status);
  };

  return (
    <Tooltip title={
      <Box sx={{ p: 1 }}>
        <Typography variant="body2">
          Status: {isOnline ? 'Online' : 'Offline'}
        </Typography>
        {syncStatus && (
          <>
            <Typography variant="caption">
              Pending sync: {syncStatus.pendingSyncCount}
            </Typography>
            <br />
            <Typography variant="caption">
              Queue: {syncStatus.queueLength}
            </Typography>
          </>
        )}
      </Box>
    }>
      <Badge 
        badgeContent={syncStatus?.pendingSyncCount || 0} 
        color="error"
        sx={{ 
          '& .MuiBadge-badge': {
            right: -3,
            top: 8,
          }
        }}
      >
        <Chip
          icon={isOnline ? <CloudQueue /> : <CloudOff />}
          label={isOnline ? 'Online' : 'Offline'}
          color={isOnline ? 'success' : 'default'}
          variant={isOnline ? 'filled' : 'outlined'}
          onClick={handleManualSync}
          deleteIcon={<Sync />}
          onDelete={handleManualSync}
          size="small"
          sx={{
            fontWeight: 'medium',
            '& .MuiChip-icon': {
              fontSize: 18,
            },
            bgcolor: isOnline ? alpha(colorTheme.success.main, 0.1) : undefined,
            color: isOnline ? colorTheme.success.main : undefined,
            borderColor: isOnline ? alpha(colorTheme.success.main, 0.3) : undefined,
          }}
        />
      </Badge>
    </Tooltip>
  );
}

export default function TasksPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'success' | 'error' | 'info' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    dueDate: '',
    projectId: '',
    assignedToName: '',
    estimatedHours: 0,
  });

  const fetchData = async () => {
    try {
      setError(null);
      
      if (!navigator.onLine) {
        const offlineTasks = await offlineStorage.getItem<Task[]>('tasks') || [];
        const offlineProjects = await offlineStorage.getItem<Project[]>('projects') || [];
        
        setTasks(offlineTasks);
        setProjects(offlineProjects);
        setLoading(false);
        return;
      }

      const [tasksResponse, projectsResponse] = await Promise.all([
        fetch('/api/tasks', { credentials: 'include' }),
        fetch('/api/projects', { credentials: 'include' })
      ]);

      if (!tasksResponse.ok || !projectsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const tasksData = await tasksResponse.json();
      const projectsData = await projectsResponse.json();

      const tasksWithSync = (tasksData.tasks || []).map((task: Task) => ({
        ...task,
        isSynced: true,
        isLocal: false,
        syncAttempts: 0
      }));

      const projectsWithSync = (projectsData.projects || []).map((project: Project) => ({
        ...project,
        isSynced: true,
        isLocal: false
      }));

      setTasks(tasksWithSync);
      setProjects(projectsWithSync);
      
      await offlineStorage.setItem('tasks', tasksWithSync);
      await offlineStorage.setItem('projects', projectsWithSync);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch data');
      }
      
      const offlineTasks = await offlineStorage.getItem<Task[]>('tasks') || [];
      const offlineProjects = await offlineStorage.getItem<Project[]>('projects') || [];
      
      setTasks(offlineTasks);
      setProjects(offlineProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      projectId: '',
      assignedToName: '',
      estimatedHours: 0,
    });
    setSelectedTask(null);
    setOpenDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      projectId: task.projectId,
      assignedToName: task.assignedToName,
      estimatedHours: task.estimatedHours,
    });
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
        projectName: projects.find(p => p._id === formData.projectId)?.name || 'Unknown Project'
      };

      if (!navigator.onLine) {
        // Save offline
        const result = await offlineStorage.addItem('tasks', taskData, { syncImmediately: false });
        if (result.success) {
          await fetchData();
          setOpenDialog(false);
          showSnackbar('Task saved offline. It will sync when you are back online.', 'info');
          return;
        }
      }

      // Online save
      const url = '/api/tasks';
      const method = selectedTask ? 'PUT' : 'POST';
      
      const payload = selectedTask ? {
        taskId: selectedTask._id,
        ...taskData,
      } : taskData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setOpenDialog(false);
        await fetchData();
        showSnackbar(`Task ${selectedTask ? 'updated' : 'created'} successfully!`, 'success');
      } else {
        throw new Error('Failed to save task');
      }
    } catch (err: unknown) {
      console.error('Error saving task:', err);
      
      // Fallback to offline storage
      if (!navigator.onLine || err instanceof Error) {
        const taskData = {
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
          projectName: projects.find(p => p._id === formData.projectId)?.name || 'Unknown Project'
        };
        
        const result = await offlineStorage.addItem('tasks', taskData, { syncImmediately: false });
        if (result.success) {
          showSnackbar('Task saved offline due to network error.', 'info');
          await fetchData();
          setOpenDialog(false);
        } else {
          showSnackbar('Failed to save task.', 'error');
        }
      } else {
        showSnackbar('Failed to save task.', 'error');
      }
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      if (!navigator.onLine) {
        // Delete offline
        await offlineStorage.deleteItem('tasks', task._id || task.id!);
        await fetchData();
        showSnackbar('Task deleted offline. Sync will happen when online.', 'info');
        return;
      }

      const response = await fetch(`/api/tasks?id=${task._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchData();
        showSnackbar('Task deleted successfully!', 'success');
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (err: unknown) {
      console.error('Error deleting task:', err);
      
      // Fallback to offline deletion
      await offlineStorage.deleteItem('tasks', task._id || task.id!);
      await fetchData();
      showSnackbar('Task deleted offline due to network error.', 'info');
    }
  };

  const handleUpdateStatus = async (task: Task, newStatus: Task['status']) => {
    try {
      if (!navigator.onLine) {
        // Update offline
        const updatedTask = { ...task, status: newStatus };
        const result = await offlineStorage.updateItem('tasks', task._id || task.id!, updatedTask);
        
        if (result.success) {
          await fetchData();
          showSnackbar('Task status updated offline.', 'info');
          return;
        } else {
          throw new Error('Failed to update offline');
        }
      }

      // Online update
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          taskId: task._id,
          status: newStatus
        }),
      });

      if (response.ok) {
        await fetchData();
        showSnackbar('Task status updated!', 'success');
      } else {
        throw new Error('Failed to update task status');
      }
    } catch (err: unknown) {
      console.error('Error updating task status:', err);
      
      // Fallback to offline update
      try {
        const updatedTask = { ...task, status: newStatus };
        await offlineStorage.updateItem('tasks', task._id || task.id!, updatedTask);
        await fetchData();
        showSnackbar('Task status updated offline due to network error.', 'info');
      } catch (offlineErr) {
        showSnackbar('Failed to update task status.', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return colorTheme.success.main;
      case 'in_progress': return colorTheme.primary.main;
      case 'in_review': return colorTheme.warning.main;
      case 'blocked': return colorTheme.error.main;
      case 'todo': return colorTheme.text.secondary;
      default: return colorTheme.text.secondary;
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in_progress': return <PlayArrow />;
      case 'in_review': return <Schedule />;
      case 'blocked': return <Warning />;
      case 'todo': return <Schedule />;
      default: return <Schedule />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return colorTheme.error.main;
      case 'high': return colorTheme.warning.main;
      case 'medium': return colorTheme.info.main;
      case 'low': return colorTheme.success.main;
      default: return colorTheme.text.secondary;
    }
  };

  const getStatusOptions = (currentStatus: Task['status']) => {
    const allStatuses: Task['status'][] = ['todo', 'in_progress', 'in_review', 'completed', 'blocked'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  // Task Card Component
  function TaskCard({ task }: { task: Task }) {
    const statusOptions = getStatusOptions(task.status);

    return (
      <Card sx={{ 
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${task.isLocal 
          ? alpha(colorTheme.warning.main, 0.3) 
          : alpha(colorTheme.text.disabled, 0.1)}`,
        background: colorTheme.background.paper,
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px ${alpha(task.isLocal ? colorTheme.warning.main : colorTheme.primary.main, 0.15)}`,
        },
        position: 'relative'
      }}>
        {/* Offline Indicator */}
        {task.isLocal && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: colorTheme.warning.main,
              boxShadow: `0 0 8px ${colorTheme.warning.main}`,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 },
              }
            }}
          />
        )}

        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              flex: 1,
              color: colorTheme.text.primary,
              fontWeight: 600,
              pr: 1
            }}>
              {task.title}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                setMenuAnchor(e.currentTarget);
                setSelectedTask(task);
              }}
              sx={{
                color: colorTheme.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(colorTheme.primary.main, 0.1),
                  color: colorTheme.primary.main,
                }
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>

          <Typography variant="body2" color={colorTheme.text.secondary} sx={{ mb: 2, minHeight: 40 }}>
            {task.description || 'No description provided'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={getStatusIcon(task.status)}
              label={task.status.replace('_', ' ')}
              size="small"
              sx={{
                bgcolor: alpha(getStatusColor(task.status), 0.1),
                color: getStatusColor(task.status),
                fontWeight: 600,
                borderRadius: 1.5,
                border: `1px solid ${alpha(getStatusColor(task.status), 0.2)}`,
              }}
            />
            <Chip
              label={task.priority}
              variant="outlined"
              size="small"
              sx={{
                color: getPriorityColor(task.priority),
                borderColor: alpha(getPriorityColor(task.priority), 0.3),
                fontWeight: 500,
                borderRadius: 1.5,
              }}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: alpha(colorTheme.background.light, 0.5),
            p: 1.5,
            borderRadius: 2,
            mb: 2
          }}>
            <Typography variant="caption" color={colorTheme.text.secondary} fontWeight="medium">
              {task.projectName}
            </Typography>
            {task.dueDate && (
              <Typography variant="caption" color={colorTheme.text.secondary}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            )}
          </Box>

          {/* Quick Status Actions */}
          <Box sx={{ 
            display: 'flex', 
            gap: 0.5, 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {statusOptions.map(status => (
              <Tooltip key={status} title={`Mark as ${status.replace('_', ' ')}`}>
                <Chip
                  label={status.charAt(0).toUpperCase()}
                  size="small"
                  variant="outlined"
                  onClick={() => handleUpdateStatus(task, status)}
                  sx={{ 
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    width: 32,
                    height: 32,
                    color: getStatusColor(status),
                    borderColor: alpha(getStatusColor(status), 0.3),
                    '&:hover': {
                      backgroundColor: alpha(getStatusColor(status), 0.1),
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s',
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <MainLayout title="Tasks">
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 400 
        }}>
          <CircularProgress sx={{ color: colorTheme.primary.main }} />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Tasks">
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4,
          gap: 2
        }}>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <NetworkStatus />
              <Box>
                <Typography variant="h4" gutterBottom sx={{ color: colorTheme.text.primary }}>
                  Task Management
                </Typography>
                <Typography variant="body1" color={colorTheme.text.secondary}>
                  Manage and track all your project tasks {!navigator.onLine && '(Offline Mode)'}
                </Typography>
              </Box>
            </Stack>
            
            {!navigator.onLine && (
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 1,
                  maxWidth: 400,
                  bgcolor: alpha(colorTheme.info.main, 0.1),
                  color: colorTheme.info.main,
                  border: `1px solid ${alpha(colorTheme.info.main, 0.2)}`,
                }}
              >
                You are currently offline. Changes will be synced when you reconnect.
              </Alert>
            )}
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateTask}
            size="large"
            sx={{
              background: colorTheme.primary.gradient,
              boxShadow: `0 4px 15px ${alpha(colorTheme.primary.main, 0.3)}`,
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold',
              '&:hover': {
                background: `linear-gradient(135deg, ${colorTheme.primary.dark} 0%, ${colorTheme.primary.main} 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${alpha(colorTheme.primary.main, 0.4)}`,
              },
              transition: 'all 0.3s',
            }}
          >
            New Task
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              bgcolor: alpha(colorTheme.error.main, 0.1),
              color: colorTheme.error.main,
              border: `1px solid ${alpha(colorTheme.error.main, 0.2)}`,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <Paper sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 3,
            background: colorTheme.background.gradient,
            border: `1px solid ${alpha(colorTheme.text.disabled, 0.1)}`,
          }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%',
              background: colorTheme.primary.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 32,
              mb: 3,
              mx: 'auto',
            }}>
              ✓
            </Box>
            <Typography variant="h5" color={colorTheme.text.primary} gutterBottom sx={{ fontWeight: 600 }}>
              No Tasks Yet
            </Typography>
            <Typography variant="body1" color={colorTheme.text.secondary} sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              Create your first task to start managing your projects
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleCreateTask}
              sx={{
                background: colorTheme.primary.gradient,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
              }}
            >
              Create Your First Task
            </Button>
          </Paper>
        ) : (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}>
            {tasks.map((task) => (
              <TaskCard key={task._id || task.id} task={task} />
            ))}
          </Box>
        )}

        {/* Task Dialog - FIXED VISIBILITY */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: colorTheme.background.paper,
              border: `1px solid ${alpha(colorTheme.primary.main, 0.2)}`,
              boxShadow: `0 20px 60px ${alpha(colorTheme.primary.dark, 0.2)}`,
            }
          }}
        >
          <DialogTitle sx={{ 
            background: colorTheme.primary.gradient, 
            color: 'white',
            py: 2.5,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative elements */}
            <Box sx={{ 
              position: 'absolute', 
              top: -20, 
              right: -20, 
              width: 100, 
              height: 100,
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
            }} />
            <Typography variant="h5" fontWeight="bold" sx={{ position: 'relative', zIndex: 1 }}>
              {selectedTask ? 'Edit Task' : 'Create New Task'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, position: 'relative', zIndex: 1 }}>
              {selectedTask ? 'Update task details' : 'Fill in task information'}
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3, bgcolor: colorTheme.background.light }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3,
                bgcolor: 'transparent',
                marginTop: 3
              }}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: alpha(colorTheme.text.secondary, 0.3),
                      },
                      '&:hover fieldset': {
                        borderColor: colorTheme.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colorTheme.primary.main,
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colorTheme.text.secondary,
                      '&.Mui-focused': {
                        color: colorTheme.primary.main,
                      },
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: alpha(colorTheme.text.secondary, 0.3),
                      },
                      '&:hover fieldset': {
                        borderColor: colorTheme.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colorTheme.primary.main,
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colorTheme.text.secondary,
                      '&.Mui-focused': {
                        color: colorTheme.primary.main,
                      },
                    },
                  }}
                />

                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2
                }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ 
                      color: colorTheme.text.secondary,
                      '&.Mui-focused': {
                        color: colorTheme.primary.main,
                      },
                    }}>
                      Status
                    </InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                      sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(colorTheme.text.secondary, 0.3),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: colorTheme.primary.main,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: colorTheme.primary.main,
                          borderWidth: 2,
                        },
                      }}
                    >
                      <MenuItem value="todo" sx={{ color: colorTheme.text.primary }}>To Do</MenuItem>
                      <MenuItem value="in_progress" sx={{ color: colorTheme.text.primary }}>In Progress</MenuItem>
                      <MenuItem value="in_review" sx={{ color: colorTheme.text.primary }}>In Review</MenuItem>
                      <MenuItem value="completed" sx={{ color: colorTheme.text.primary }}>Completed</MenuItem>
                      <MenuItem value="blocked" sx={{ color: colorTheme.text.primary }}>Blocked</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ 
                      color: colorTheme.text.secondary,
                      '&.Mui-focused': {
                        color: colorTheme.primary.main,
                      },
                    }}>
                      Priority
                    </InputLabel>
                    <Select
                      value={formData.priority}
                      label="Priority"
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                      sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(colorTheme.text.secondary, 0.3),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: colorTheme.primary.main,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: colorTheme.primary.main,
                          borderWidth: 2,
                        },
                      }}
                    >
                      <MenuItem value="low" sx={{ color: colorTheme.text.primary }}>Low</MenuItem>
                      <MenuItem value="medium" sx={{ color: colorTheme.text.primary }}>Medium</MenuItem>
                      <MenuItem value="high" sx={{ color: colorTheme.text.primary }}>High</MenuItem>
                      <MenuItem value="urgent" sx={{ color: colorTheme.text.primary }}>Urgent</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2
                }}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel sx={{ 
                      color: colorTheme.text.secondary,
                      '&.Mui-focused': {
                        color: colorTheme.primary.main,
                      },
                    }}>
                      Project *
                    </InputLabel>
                    <Select
                      value={formData.projectId}
                      label="Project *"
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      required
                      sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(colorTheme.text.secondary, 0.3),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: colorTheme.primary.main,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: colorTheme.primary.main,
                          borderWidth: 2,
                        },
                      }}
                    >
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <MenuItem key={project._id} value={project._id} sx={{ color: colorTheme.text.primary }}>
                            {project.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled sx={{ color: colorTheme.text.secondary }}>
                          No projects available
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  {projects.length === 0 && (
                    <Typography variant="caption" color={colorTheme.error.main} sx={{ mt: 1, display: 'block' }}>
                      Please create a project first
                    </Typography>
                  )}

                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    InputLabelProps={{ 
                      shrink: true,
                      sx: {
                        color: colorTheme.text.secondary,
                        '&.Mui-focused': {
                          color: colorTheme.primary.main,
                        },
                      }
                    }}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: alpha(colorTheme.text.secondary, 0.3),
                        },
                        '&:hover fieldset': {
                          borderColor: colorTheme.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colorTheme.primary.main,
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2
                }}>
                  <TextField
                    fullWidth
                    label="Assigned To"
                    value={formData.assignedToName}
                    onChange={(e) => setFormData({ ...formData, assignedToName: e.target.value })}
                    placeholder="Team member name"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: alpha(colorTheme.text.secondary, 0.3),
                        },
                        '&:hover fieldset': {
                          borderColor: colorTheme.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colorTheme.primary.main,
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: colorTheme.text.secondary,
                        '&.Mui-focused': {
                          color: colorTheme.primary.main,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Estimated Hours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
                    inputProps={{ min: 0 }}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: alpha(colorTheme.text.secondary, 0.3),
                        },
                        '&:hover fieldset': {
                          borderColor: colorTheme.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colorTheme.primary.main,
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: colorTheme.text.secondary,
                        '&.Mui-focused': {
                          color: colorTheme.primary.main,
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </form>
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 3, 
            gap: 1,
            bgcolor: colorTheme.background.light,
            borderTop: `1px solid ${alpha(colorTheme.text.disabled, 0.1)}`,
          }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ 
                borderRadius: 2,
                color: colorTheme.text.secondary,
                borderColor: alpha(colorTheme.text.secondary, 0.3),
                '&:hover': {
                  borderColor: colorTheme.text.primary,
                  color: colorTheme.text.primary,
                }
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={!formData.projectId || !formData.title}
              onClick={handleSubmit}
              sx={{ 
                borderRadius: 2,
                px: 4,
                background: colorTheme.primary.gradient,
                fontWeight: 'bold',
                '&:hover': {
                  background: `linear-gradient(135deg, ${colorTheme.primary.dark} 0%, ${colorTheme.primary.main} 100%)`,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 6px 20px ${alpha(colorTheme.primary.main, 0.4)}`,
                },
                transition: 'all 0.3s',
                '&.Mui-disabled': {
                  background: alpha(colorTheme.text.disabled, 0.3),
                  color: alpha(colorTheme.text.disabled, 0.7),
                }
              }}
            >
              {selectedTask ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Context Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 180,
            }
          }}
        >
          <MenuItem 
            onClick={() => { 
              if (selectedTask) handleEditTask(selectedTask);
              setMenuAnchor(null);
            }}
            sx={{
              '&:hover': {
                backgroundColor: alpha(colorTheme.primary.main, 0.1),
              }
            }}
          >
            <Edit sx={{ mr: 1, fontSize: 20 }} />
            Edit Task
          </MenuItem>
          <MenuItem 
            onClick={() => { 
              if (selectedTask) handleDeleteTask(selectedTask);
              setMenuAnchor(null);
            }} 
            sx={{ 
              color: colorTheme.error.main,
              '&:hover': {
                backgroundColor: alpha(colorTheme.error.main, 0.1),
              }
            }}
          >
            <Delete sx={{ mr: 1, fontSize: 20 }} />
            Delete Task
          </MenuItem>
        </Menu>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
}