// app/tasks/page.tsx - COMPLETE FIXED VERSION
"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
  Pagination,
} from '@mui/material';
import { 
  Home as HomeIcon,
  Add,
  Search,
  FilterList,
  Dashboard,
  Timeline,
  CheckCircle,
  Flag,
  PlayArrow,
  Warning,
} from '@mui/icons-material';
import Link from 'next/link';

// Import our Google-themed components
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { Dialog } from '@/components/ui/Dialog';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';

// Import task components
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskDialog } from '@/components/tasks/TaskDialog';

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
  isLocal?: boolean;
  isSynced?: boolean;
}

interface Project {
  _id: string;
  name: string;
}

// Simple offline storage fallback
const simpleOfflineStorage = {
  getItem: async <T,>(key: string): Promise<T | null> => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  setItem: async <T,>(key: string, data: T): Promise<{ success: boolean }> => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return { success: false };
    }
  },

  addItem: async <T,>(key: string, data: T): Promise<{ success: boolean }> => {
    try {
      const existing = await simpleOfflineStorage.getItem<any[]>(key) || [];
      existing.push(data);
      localStorage.setItem(key, JSON.stringify(existing));
      return { success: true };
    } catch (error) {
      console.error('Error adding to localStorage:', error);
      return { success: false };
    }
  },

  updateItem: async <T extends { id: string }>(key: string, data: T): Promise<{ success: boolean }> => {
    try {
      const existing = await simpleOfflineStorage.getItem<T[]>(key) || [];
      const index = existing.findIndex(item => item.id === data.id || (item as any)._id === data.id);
      if (index !== -1) {
        existing[index] = { ...existing[index], ...data };
        localStorage.setItem(key, JSON.stringify(existing));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error updating localStorage:', error);
      return { success: false };
    }
  },

  deleteItem: async (key: string, id: string): Promise<{ success: boolean }> => {
    try {
      const existing = await simpleOfflineStorage.getItem<any[]>(key) || [];
      const filtered = existing.filter(item => (item.id !== id && item._id !== id));
      localStorage.setItem(key, JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      return { success: false };
    }
  },
};

export default function TasksPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'info' as 'success' | 'error' | 'info' | 'warning' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 9;

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

  // Fetch data
  const fetchData = async () => {
    try {
      setError(null);
      
      if (!navigator.onLine) {
        const offlineTasks = await simpleOfflineStorage.getItem<Task[]>('tasks') || [];
        const offlineProjects = await simpleOfflineStorage.getItem<Project[]>('projects') || [];
        
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
      }));

      const projectsWithSync = (projectsData.projects || []).map((project: Project) => ({
        ...project,
        isSynced: true,
        isLocal: false,
      }));

      setTasks(tasksWithSync);
      setProjects(projectsWithSync);
      
      await simpleOfflineStorage.setItem('tasks', tasksWithSync);
      await simpleOfflineStorage.setItem('projects', projectsWithSync);

    } catch (err: unknown) {
      setError('Failed to fetch data');
      const offlineTasks = await simpleOfflineStorage.getItem<Task[]>('tasks') || [];
      const offlineProjects = await simpleOfflineStorage.getItem<Project[]>('projects') || [];
      setTasks(offlineTasks);
      setProjects(offlineProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchData();
    };
    init();

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return task.title.toLowerCase().includes(searchLower) ||
             task.description.toLowerCase().includes(searchLower) ||
             task.projectName.toLowerCase().includes(searchLower) ||
             task.assignedToName.toLowerCase().includes(searchLower);
    }
    return filterStatus === 'all' || task.status === filterStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

  // Calculate stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    overdue: tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length,
  };

  const getStatusPercentage = (statusCount: number) => {
    return tasks.length > 0 ? Math.round((statusCount / tasks.length) * 100) : 0;
  };

  // Handlers
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
        id: selectedTask?._id || selectedTask?.id || Math.random().toString(36).substring(2, 9),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
        projectName: projects.find(p => p._id === formData.projectId)?.name || 'Unknown Project'
      };

      if (!navigator.onLine) {
        const result = await simpleOfflineStorage.addItem('tasks', taskData);
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
      // Fallback to offline storage
      const taskData = {
        ...formData,
        id: Math.random().toString(36).substring(2, 9),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
        projectName: projects.find(p => p._id === formData.projectId)?.name || 'Unknown Project'
      };
      
      const result = await simpleOfflineStorage.addItem('tasks', taskData);
      if (result.success) {
        showSnackbar('Task saved offline due to network error.', 'info');
        await fetchData();
        setOpenDialog(false);
      } else {
        showSnackbar('Failed to save task.', 'error');
      }
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      if (!navigator.onLine) {
        await simpleOfflineStorage.deleteItem('tasks', task._id || task.id!);
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
      await simpleOfflineStorage.deleteItem('tasks', task._id || task.id!);
      await fetchData();
      showSnackbar('Task deleted offline due to network error.', 'info');
    }
  };

  const handleUpdateStatus = async (task: Task, newStatus: Task['status']) => {
    try {
      if (!navigator.onLine) {
        const updatedTask = { ...task, status: newStatus };
        const result = await simpleOfflineStorage.updateItem('tasks', {
          ...updatedTask,
          id: task._id || task.id!,
        });
        if (result.success) {
          await fetchData();
          showSnackbar('Task status updated offline.', 'info');
          return;
        }
      }

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
      const updatedTask = { ...task, status: newStatus };
      await simpleOfflineStorage.updateItem('tasks', {
        ...updatedTask,
        id: task._id || task.id!,
      });
      await fetchData();
      showSnackbar('Task status updated offline due to network error.', 'info');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <MainLayout title="Task Management">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Loading tasks...
            </Typography>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Task Management">
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
            <MuiLink 
              component={Link} 
              href="/dashboard" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300, 
                "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } 
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </MuiLink>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Task Management
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Task Management
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
              Track, manage, and complete tasks efficiently
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error"
              title="Error"
              message={error}
              dismissible
              onDismiss={() => setError(null)}
              sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            />
          )}

          {/* Snackbar */}
          {snackbar.open && (
            <Alert
              severity={snackbar.severity}
              title=""
              message={snackbar.message}
              dismissible
              onDismiss={() => setSnackbar({ ...snackbar, open: false })}
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
              }}
            />
          )}

          {/* Header with Search and Stats */}
          <Card
            title="Task Management"
            subtitle={`${tasks.length} total tasks • ${filteredTasks.length} filtered`}
            action={
              <Button
                variant="contained"
                onClick={handleCreateTask}
                iconLeft={<Add />}
                size="medium"
                sx={{ 
                  backgroundColor: '#34a853',
                  '&:hover': { backgroundColor: '#2d9248' }
                }}
              >
                New Task
              </Button>
            }
            hover
            sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
              mt: 2,
            }}>
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search />}
                size="small"
                sx={{ flex: 1 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Select
                  size="small"
                  label="Status"
                  value={filterStatus}
                  onChange={(e: any) => setFilterStatus(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'todo', label: 'To Do' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'in_review', label: 'In Review' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'blocked', label: 'Blocked' },
                  ]}
                  sx={{ minWidth: 140 }}
                />

                <Button
                  variant="outlined"
                  size="medium"
                  iconLeft={<FilterList />}
                >
                  Filter
                </Button>
              </Box>
            </Box>
          </Card>

          {/* Stats Cards */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
            {[
              { 
                title: 'Total Tasks', 
                value: stats.total, 
                icon: <Dashboard />, 
                color: '#4285f4', 
                progress: 100,
                description: 'All tasks in system' 
              },
              { 
                title: 'To Do', 
                value: stats.todo, 
                icon: <PlayArrow />, 
                color: '#fbbc04', 
                progress: getStatusPercentage(stats.todo),
                description: 'Tasks pending' 
              },
              { 
                title: 'In Progress', 
                value: stats.inProgress, 
                icon: <Timeline />, 
                color: '#8ab4f8', 
                progress: getStatusPercentage(stats.inProgress),
                description: 'Active tasks' 
              },
              { 
                title: 'Completed', 
                value: stats.completed, 
                icon: <CheckCircle />, 
                color: '#34a853', 
                progress: getStatusPercentage(stats.completed),
                description: 'Finished tasks' 
              },
              { 
                title: 'Overdue', 
                value: stats.overdue, 
                icon: <Flag />, 
                color: '#ea4335', 
                progress: getStatusPercentage(stats.overdue),
                description: 'Past due tasks' 
              },
              { 
                title: 'Blocked', 
                value: stats.blocked, 
                icon: <Warning />, 
                color: '#9aa0a6', 
                progress: getStatusPercentage(stats.blocked),
                description: 'Blocked tasks' 
              },
            ].map((stat, index) => (
              <Card 
                key={`stat-${index}`}
                hover
                sx={{ 
                  flex: '1 1 calc(33.333% - 16px)', 
                  minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 16px)' },
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
                        variant={isMobile ? "h5" : "h4"}
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
                    }}>
                      {React.cloneElement(stat.icon, { 
                        sx: { 
                          fontSize: { xs: 20, sm: 24, md: 28 }, 
                          color: stat.color,
                        } 
                      })}
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
                  
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                        }}
                      >
                        Progress
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: stat.color,
                          fontWeight: 500,
                          fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                        }}
                      >
                        {stat.progress}%
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      position: 'relative', 
                      height: 6, 
                      backgroundColor: darkMode ? '#3c4043' : '#e0e0e0', 
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}>
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${stat.progress}%`,
                          backgroundColor: stat.color,
                          borderRadius: 3,
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Tabs */}
          <Card hover sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
            <Tabs
              tabs={[
                { label: `All Tasks (${filteredTasks.length})`, icon: <Dashboard />, count: filteredTasks.length },
                { label: `To Do (${stats.todo})`, icon: <PlayArrow />, count: stats.todo },
                { label: `In Progress (${stats.inProgress})`, icon: <Timeline />, count: stats.inProgress },
                { label: `Completed (${stats.completed})`, icon: <CheckCircle />, count: stats.completed },
                { label: `Overdue (${stats.overdue})`, icon: <Flag />, count: stats.overdue, badgeColor: 'error' },
              ]}
              value={activeTab}
              onChange={(e: any, newValue: number) => setActiveTab(newValue)}
              variant="scrollable"
            />
          </Card>

          {/* Tasks Grid */}
          <Box>
            {paginatedTasks.length === 0 ? (
              <Card 
                hover
                sx={{ 
                  p: { xs: 4, sm: 6 }, 
                  textAlign: 'center',
                  border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                }}
              >
                <Dashboard sx={{ 
                  fontSize: 60, 
                  mb: 2,
                  color: darkMode ? '#5f6368' : '#9aa0a6',
                }} />
                <Typography 
                  variant="h5" 
                  fontWeight={500}
                  gutterBottom
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  No Tasks Found
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3,
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first task to get started'}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleCreateTask}
                  iconLeft={<Add />}
                  size="medium"
                  sx={{ 
                    backgroundColor: '#4285f4',
                    '&:hover': { backgroundColor: '#3367d6' }
                  }}
                >
                  Create Task
                </Button>
              </Card>
            ) : (
              <>
                <Box sx={{
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    md: 'repeat(3, 1fr)' 
                  },
                  mb: 4,
                }}>
                  {paginatedTasks.map((task, index) => (
                    <TaskCard
                      key={`task-${task._id || task.id}-${index}`}
                      task={task}
                      darkMode={darkMode}
                      onEdit={() => handleEditTask(task)}
                      onDelete={() => handleDeleteTask(task)}
                      onStatusUpdate={(newStatus: Task['status']) => 
                        handleUpdateStatus(task, newStatus)
                      }
                      sx={{
                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                        '@keyframes fadeInUp': {
                          from: {
                            opacity: 0,
                            transform: 'translateY(20px)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    />
                  ))}
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 4,
                    pt: 3,
                    borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: darkMode ? '#e8eaed' : '#202124',
                          borderColor: darkMode ? '#3c4043' : '#dadce0',
                          '&.Mui-selected': {
                            backgroundColor: '#4285f4',
                            color: '#ffffff',
                            '&:hover': {
                              backgroundColor: '#3367d6',
                            },
                          },
                          '&:hover': {
                            backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Offline Indicator */}
          {!isOnline && (
            <Box sx={{ 
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}>
              <Alert
                severity="warning"
                title="Offline Mode"
                message="You are currently offline. Changes will sync when you reconnect."
                dismissible={false}
                sx={{
                  maxWidth: 300,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(251, 188, 4, 0.4)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(251, 188, 4, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(251, 188, 4, 0)' },
                  },
                }}
              />
            </Box>
          )}
        </Container>

        {/* Task Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title={selectedTask ? "Edit Task" : "Create New Task"}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ p: 3 }}>
              <Input
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                fullWidth
                sx={{ mb: 2 }}
              />

              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                  options={[
                    { value: 'todo', label: 'To Do' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'in_review', label: 'In Review' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'blocked', label: 'Blocked' },
                  ]}
                />

                <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e: any) => setFormData({ ...formData, priority: e.target.value })}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Input
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  fullWidth
                />

                <Select
                  label="Project"
                  value={formData.projectId}
                  onChange={(e: any) => setFormData({ ...formData, projectId: e.target.value })}
                  options={[
                    { value: '', label: 'Select Project' },
                    ...projects.map(project => ({
                      value: project._id,
                      label: project.name
                    }))
                  ]}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <Input
                  label="Assigned To"
                  value={formData.assignedToName}
                  onChange={(e) => setFormData({ ...formData, assignedToName: e.target.value })}
                  placeholder="Enter name"
                  fullWidth
                />

                <Input
                  label="Estimated Hours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                  fullWidth
                  inputProps={{ min: 0, step: 0.5 }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenDialog(false)}
                  size="medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  sx={{ 
                    backgroundColor: '#34a853',
                    '&:hover': { backgroundColor: '#2d9248' }
                  }}
                >
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </Button>
              </Box>
            </Box>
          </form>
        </Dialog>
      </Box>
    </MainLayout>
  );
}