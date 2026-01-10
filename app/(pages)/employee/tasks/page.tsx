// app/(pages)/employee/tasks/page.tsx - SUPER RESPONSIVE
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  alpha,
  Avatar,
  Divider,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Assignment,
  Update,
  AccessTime,
  TrendingUp,
  AttachFile,
  Schedule,
  Person,
  FilterList,
  Sort,
  Menu as MenuIcon,
  ArrowBack,
  CheckCircle,
  Pending,
  HourglassEmpty,
  Cancel,
  PlayCircle,
  Star,
  StarBorder,
  MoreVert,
  CalendarMonth,
  Numbers,
  Folder,
  Add,
  Close,
  Download,
  Upload,
  Delete,
  Share,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

interface EmployeeTask {
  _id: string;
  title: string;
  description: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  category: string;
  projectName: string;
  assignedAt: string;
  updates: any[];
}

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<EmployeeTask | null>(null);
  const [updateForm, setUpdateForm] = useState({
    progress: 0,
    hoursWorked: 0,
    description: '',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterPriority, setFilterPriority] = useState('all');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const fetchEmployeeTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tasks/employee/current');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeTasks();
  }, []);

  const handleUpdateTask = async () => {
    try {
      if (!selectedTask) return;

      const response = await fetch('/api/tasks/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: selectedTask._id,
          progress: updateForm.progress,
          hoursWorked: updateForm.hoursWorked,
          description: updateForm.description,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update task');
      }

      setUpdateDialogOpen(false);
      setSelectedTask(null);
      setUpdateForm({ progress: 0, hoursWorked: 0, description: '' });
      fetchEmployeeTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const getStatusColor = (status: EmployeeTask['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'assigned': return 'warning';
      case 'rejected': return 'error';
      case 'on_hold': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: EmployeeTask['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in_progress': return <PlayCircle />;
      case 'assigned': return <Pending />;
      case 'rejected': return <Cancel />;
      case 'on_hold': return <HourglassEmpty />;
      default: return <Pending />;
    }
  };

  const getPriorityColor = (priority: EmployeeTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      if (selectedTab === 0) return true; // All
      if (selectedTab === 1) return task.status === 'assigned';
      if (selectedTab === 2) return task.status === 'in_progress';
      if (selectedTab === 3) return task.status === 'completed';
      return true;
    })
    .filter(task => {
      if (filterPriority === 'all') return true;
      return task.priority === filterPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  // Stats calculation
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
  };

  // Mobile Navigation Drawer
  const MobileFilters = () => (
    <Drawer
      anchor="right"
      open={showMobileFilters}
      onClose={() => setShowMobileFilters(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 320,
          p: 2,
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          Filters & Sort
        </Typography>
        <IconButton onClick={() => setShowMobileFilters(false)} size="small">
          <Close />
        </IconButton>
      </Box>
      <List>
        <ListItem>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={filterPriority}
              label="Priority"
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem>
          <ListItemText
            primary="Task Stats"
            secondary={
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Total</Typography>
                  <Typography variant="caption" fontWeight="bold">{stats.total}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Completed</Typography>
                  <Typography variant="caption" fontWeight="bold" color="success.main">{stats.completed}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Overdue</Typography>
                  <Typography variant="caption" fontWeight="bold" color="error.main">{stats.overdue}</Typography>
                </Box>
              </Box>
            }
          />
        </ListItem>
      </List>
    </Drawer>
  );

  if (loading) {
    return (
      <MainLayout title="My Tasks">
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={isMobile ? 40 : 60} />
          <Typography variant="h6" color="text.secondary">
            Loading your tasks...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="My Tasks">
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 3 },
        minHeight: '100vh',
      }}>
        {/* Mobile Filters Drawer */}
        <MobileFilters />

        {/* Header */}
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3,
          borderRadius: 2,
          background: isMobile ? 'transparent' : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          boxShadow: isMobile ? 'none' : theme.shadows[1],
          border: isMobile ? `1px solid ${theme.palette.divider}` : 'none',
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 }
          }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Assignment sx={{ 
                  fontSize: isMobile ? 24 : 32,
                  color: 'primary.main'
                }} />
                <Typography variant={isMobile ? "h5" : "h4"} component="h1" fontWeight="bold">
                  My Tasks
                </Typography>
                <Badge 
                  badgeContent={stats.total} 
                  color="primary"
                  sx={{ ml: 1 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Track and update your assigned tasks
              </Typography>
              
              {/* Quick Stats - Mobile */}
              {isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  mt: 2,
                  flexWrap: 'wrap'
                }}>
                  <Chip 
                    icon={<CheckCircle fontSize="small" />}
                    label={`${stats.completed} Done`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<PlayCircle fontSize="small" />}
                    label={`${stats.inProgress} Active`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<Schedule fontSize="small" />}
                    label={`${stats.overdue} Overdue`}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              width: { xs: '100%', sm: 'auto' }
            }}>
              {isMobile && (
                <IconButton
                  onClick={() => setShowMobileFilters(true)}
                  size="small"
                  sx={{ 
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <FilterList />
                </IconButton>
              )}
              
              <Button
                variant="contained"
                startIcon={<Update />}
                onClick={fetchEmployeeTasks}
                size={isMobile ? "medium" : "large"}
                fullWidth={isMobile}
                sx={{ 
                  minHeight: isMobile ? 44 : 48,
                  whiteSpace: 'nowrap',
                  flex: { xs: 1, sm: 'none' }
                }}
              >
                {isMobile ? 'Refresh' : 'Refresh Tasks'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
            action={
              <Button color="inherit" size="small" onClick={fetchEmployeeTasks}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Desktop Stats Cards */}
        {!isMobile && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            mb: 3,
            flexWrap: 'wrap'
          }}>
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              flex: 1,
              minWidth: { xs: '100%', sm: '180px' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Tasks
              </Typography>
            </Paper>
            
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              flex: 1,
              minWidth: { xs: '100%', sm: '180px' },
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
                {stats.completed}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Completed
              </Typography>
            </Paper>
            
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              flex: 1,
              minWidth: { xs: '100%', sm: '180px' },
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
                {stats.inProgress}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                In Progress
              </Typography>
            </Paper>
            
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              flex: 1,
              minWidth: { xs: '100%', sm: '180px' },
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
                {stats.overdue}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Overdue
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Tabs with Filter Controls */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2
          }}>
            <Box sx={{ width: '100%', overflow: 'auto' }}>
              <Tabs 
                value={selectedTab} 
                onChange={(e, v) => setSelectedTab(v)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{ 
                  minHeight: 48,
                  '& .MuiTab-root': {
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                    minHeight: 48,
                    minWidth: { xs: 100, sm: 'auto' }
                  }
                }}
              >
                <Tab label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    All
                    <Chip 
                      label={stats.total} 
                      size="small" 
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                } />
                <Tab label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Assigned
                    <Chip 
                      label={stats.assigned} 
                      size="small" 
                      color="warning"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                } />
                <Tab label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    In Progress
                    <Chip 
                      label={stats.inProgress} 
                      size="small" 
                      color="info"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                } />
                <Tab label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Completed
                    <Chip 
                      label={stats.completed} 
                      size="small" 
                      color="success"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                } />
              </Tabs>
            </Box>
            
            {/* Desktop Filters */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="dueDate">Due Date</MenuItem>
                    <MenuItem value="priority">Priority</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filterPriority}
                    label="Priority"
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        </Box>

        {/* Tasks Grid */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: { xs: 2, sm: 3 },
          mb: 3
        }}>
          {filteredTasks.map((task) => {
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
            
            return (
              <Card 
                key={task._id} 
                sx={{ 
                  height: '100%',
                  border: isOverdue ? `2px solid ${theme.palette.error.main}` : `1px solid ${theme.palette.divider}`,
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease',
                  }
                }}
              >
                {isOverdue && (
                  <Chip
                    label="OVERDUE"
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: 10,
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                    }}
                  />
                )}
                
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  {/* Task Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    mb: 2,
                    gap: 1
                  }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant={isMobile ? "subtitle1" : "h6"} 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{ 
                          wordBreak: 'break-word',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                        <Chip
                          size="small"
                          icon={getStatusIcon(task.status)}
                          label={task.status.replace('_', ' ')}
                          color={getStatusColor(task.status)}
                          sx={{ height: 24 }}
                        />
                        <Chip
                          size="small"
                          label={task.priority}
                          variant="outlined"
                          color={getPriorityColor(task.priority)}
                          sx={{ height: 24 }}
                        />
                      </Box>
                    </Box>
                    
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedTask(task);
                        setUpdateForm({
                          progress: task.progress,
                          hoursWorked: 0,
                          description: ''
                        });
                        setUpdateDialogOpen(true);
                      }}
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                        }
                      }}
                    >
                      <TrendingUp fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      wordBreak: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {task.description || 'No description provided'}
                  </Typography>

                  {/* Project Info */}
                  {task.projectName && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5, 
                      mb: 2,
                      p: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 1
                    }}>
                      <Folder fontSize="small" color="primary" />
                      <Typography variant="caption" color="primary" fontWeight="medium">
                        {task.projectName}
                      </Typography>
                    </Box>
                  )}

                  {/* Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium">Progress</Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        {task.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    />
                  </Box>

                  {/* Details Grid */}
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1,
                    mt: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="caption" noWrap>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="caption">
                        {task.actualHours}h / {task.estimatedHours}h
                      </Typography>
                    </Box>
                  </Box>

                  {/* Last Update */}
                  {task.updates && task.updates.length > 0 && (
                    <Box sx={{ 
                      mt: 2, 
                      pt: 2, 
                      borderTop: 1, 
                      borderColor: 'divider' 
                    }}>
                      <Typography variant="caption" color="text.secondary">
                        Updated: {new Date(task.updates[task.updates.length - 1].createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: { xs: 6, sm: 8 },
            px: 2
          }}>
            <Assignment sx={{ 
              fontSize: { xs: 48, sm: 64 }, 
              color: 'text.secondary', 
              mb: 2,
              opacity: 0.5 
            }} />
            <Typography variant={isMobile ? "h6" : "h5"} color="text.secondary" gutterBottom>
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
              You don't have any {selectedTab === 1 ? 'assigned' : selectedTab === 2 ? 'in progress' : selectedTab === 3 ? 'completed' : ''} tasks at the moment.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={fetchEmployeeTasks}
              size={isMobile ? "medium" : "large"}
            >
              Refresh Tasks
            </Button>
          </Box>
        )}
      </Box>

      {/* Update Task Dialog */}
      <Dialog 
        open={updateDialogOpen} 
        onClose={() => setUpdateDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          p: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
              Update Task Progress
            </Typography>
            {isMobile && (
              <IconButton onClick={() => setUpdateDialogOpen(false)} size="small">
                <ArrowBack />
              </IconButton>
            )}
          </Box>
          {selectedTask && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedTask.title}
            </Typography>
          )}
        </DialogTitle>
        
        {selectedTask && (
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateTask(); }}>
            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Current Progress */}
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Current Progress: {selectedTask.progress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={selectedTask.progress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>

                {/* New Progress */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Update Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Slider
                      value={updateForm.progress}
                      onChange={(e, value) => setUpdateForm({...updateForm, progress: value as number})}
                      min={0}
                      max={100}
                      step={5}
                      sx={{ flex: 1 }}
                    />
                    <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ minWidth: 60 }}>
                      {updateForm.progress}%
                    </Typography>
                  </Box>
                </Box>

                {/* Hours Worked */}
                <TextField
                  label="Hours Worked Today"
                  type="number"
                  value={updateForm.hoursWorked}
                  onChange={(e) => setUpdateForm({...updateForm, hoursWorked: Number(e.target.value) || 0})}
                  helperText="Enter hours spent on this task today"
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    endAdornment: <Typography variant="caption">hours</Typography>
                  }}
                />

                {/* Update Description */}
                <TextField
                  label="Update Description"
                  multiline
                  rows={isMobile ? 3 : 4}
                  value={updateForm.description}
                  onChange={(e) => setUpdateForm({...updateForm, description: e.target.value})}
                  helperText="Describe what you worked on today"
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  required
                />

                {/* Attachments */}
                <Box>
                  <Button
                    startIcon={<AttachFile />}
                    size={isMobile ? "small" : "medium"}
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      // Handle file attachment
                    }}
                  >
                    Attach Files (Optional)
                  </Button>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ 
              p: { xs: 2, sm: 3 },
              borderTop: `1px solid ${theme.palette.divider}`
            }}>
              {!isMobile && (
                <Button onClick={() => setUpdateDialogOpen(false)}>
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth={isMobile}
                size={isMobile ? "large" : "medium"}
                disabled={!updateForm.description.trim()}
                startIcon={<Update />}
              >
                Submit Update
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </MainLayout>
  );
}