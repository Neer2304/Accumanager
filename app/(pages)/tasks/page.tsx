"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar,
  Stack,
  Container,
  Tab,
  Tabs,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Dashboard,
  Timeline,
  Category,
  Flag,
  CheckCircle,
  PlayArrow,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { offlineStorage } from '@/utils/offlineStorage';
import { TasksHeader } from '@/components/tasks/TasksHeader';
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

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
      }));

      const projectsWithSync = (projectsData.projects || []).map((project: Project) => ({
        ...project,
        isSynced: true,
        isLocal: false,
      }));

      setTasks(tasksWithSync);
      setProjects(projectsWithSync);
      
      await offlineStorage.setItem('tasks', tasksWithSync);
      await offlineStorage.setItem('projects', projectsWithSync);

    } catch (err: unknown) {
      setError('Failed to fetch data');
      const offlineTasks = await offlineStorage.getItem<Task[]>('tasks') || [];
      const offlineProjects = await offlineStorage.getItem<Project[]>('projects') || [];
      setTasks(offlineTasks);
      setProjects(offlineProjects);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/subscription/status', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSubscriptionStatus(data.data);
      }
    } catch (err) {
      // Handle error
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchSubscriptionStatus();
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
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
        projectName: projects.find(p => p._id === formData.projectId)?.name || 'Unknown Project'
      };

      if (!navigator.onLine) {
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
      // Fallback to offline storage
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
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      if (!navigator.onLine) {
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
      await offlineStorage.deleteItem('tasks', task._id || task.id!);
      await fetchData();
      showSnackbar('Task deleted offline due to network error.', 'info');
    }
  };

  const handleUpdateStatus = async (task: Task, newStatus: Task['status']) => {
    try {
      if (!navigator.onLine) {
        const updatedTask = { ...task, status: newStatus };
        const result = await offlineStorage.updateItem('tasks', task._id || task.id!, updatedTask);
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
      await offlineStorage.updateItem('tasks', task._id || task.id!, updatedTask);
      await fetchData();
      showSnackbar('Task status updated offline due to network error.', 'info');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  if (loading) {
    return (
      <MainLayout title="Tasks">
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Tasks">
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header */}
          <TasksHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onStatusFilterChange={setFilterStatus}
            onCreateTask={handleCreateTask}
            totalTasks={tasks.length}
            isOnline={isOnline}
            isTrial={subscriptionStatus?.status === 'trial'}
          />

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Stats Cards */}
          <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            "& > *": {
              flex: "1 1 200px",
              minWidth: { xs: "100%", sm: "200px" },
            },
          }}>
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Tasks</Typography>
            </Card>
            
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h3" fontWeight="bold" color="info.main" gutterBottom>
                {stats.inProgress}
              </Typography>
              <Typography variant="body2" color="text.secondary">In Progress</Typography>
            </Card>
            
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h3" fontWeight="bold" color="success.main" gutterBottom>
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
            </Card>
            
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h3" fontWeight="bold" color="error.main" gutterBottom>
                {stats.overdue}
              </Typography>
              <Typography variant="body2" color="text.secondary">Overdue</Typography>
            </Card>
          </Box>

          {/* Tabs */}
          <Paper sx={{ borderRadius: "12px", mb: 3, overflow: "hidden" }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  minHeight: 48,
                },
                bgcolor: "background.paper",
              }}
            >
              <Tab
                label={`All Tasks (${filteredTasks.length})`}
                icon={<Dashboard fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label={`To Do (${stats.todo})`}
                icon={<PlayArrow fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label={`In Progress (${stats.inProgress})`}
                icon={<Timeline fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label={`Completed (${stats.completed})`}
                icon={<CheckCircle fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label={`Overdue (${stats.overdue})`}
                icon={<Flag fontSize="small" color="error" />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
              <Dashboard sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Tasks Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first task to get started'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateTask}
              >
                Create Task
              </Button>
            </Paper>
          ) : (
            <Box sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                lg: 'repeat(3, 1fr)' 
              },
            }}>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id || task.id}
                  task={task}
                  onMenuClick={(e) => {
                    setMenuAnchor(e.currentTarget);
                    setSelectedTask(task);
                  }}
                  onStatusChange={handleUpdateStatus}
                />
              ))}
            </Box>
          )}

          {/* Task Dialog */}
          <TaskDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            selectedTask={selectedTask}
            isOnline={isOnline}
            projects={projects}
          />

          {/* Context Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={() => { 
              if (selectedTask) handleEditTask(selectedTask);
              setMenuAnchor(null);
            }}>
              <Edit sx={{ mr: 1 }} fontSize="small" /> Edit
            </MenuItem>
            <MenuItem onClick={() => { 
              if (selectedTask) handleDeleteTask(selectedTask);
              setMenuAnchor(null);
            }} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1 }} fontSize="small" /> Delete
            </MenuItem>
          </Menu>

          {/* Snackbar */}
          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={4000} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </MainLayout>
  );
}