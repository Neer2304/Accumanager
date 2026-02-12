'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  alpha,
  Avatar,
  Badge,
  CircularProgress,
  Alert,
  Menu,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Task,
  Assignment,
  Phone,
  Email,
  MeetingRoom,
  Payment,
  LocalShipping,
  Description,
  MoreVert,
  CheckCircle,
  Cancel,
  Schedule,
  Flag,
  Person,
  CalendarToday,
  Refresh,
  Add,
  Edit,
  Delete,
  Warning,
  PriorityHigh
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { format, formatDistanceToNow } from 'date-fns';
import { FollowUpTask } from '@/types/crm';
import { useAuth } from '@/hooks/useAuth';

interface FollowUpTasksProps {
  customerId?: string;
  assignedTo?: string;
}

export default function FollowUpTasks({ customerId, assignedTo }: FollowUpTasksProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FollowUpTask | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('pending');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<FollowUpTask | null>(null);
  
  const [formData, setFormData] = useState({
    taskType: 'call' as FollowUpTask['taskType'],
    priority: 'medium' as FollowUpTask['priority'],
    title: '',
    description: '',
    dueDate: '',
    assignedTo: user?.id || '',
    reminder: true
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      let url = '/api/customers/tasks';
      const params = new URLSearchParams();
      
      if (customerId) params.append('customerId', customerId);
      if (assignedTo) params.append('assignedTo', assignedTo);
      if (filter !== 'all') params.append('status', filter);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setTasks(data.tasks || []);
      } else {
        throw new Error(data.message || 'Failed to load tasks');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [customerId, assignedTo, filter]);

  // Save task
  const handleSave = async () => {
    try {
      const url = editingTask
        ? `/api/customers/tasks/${editingTask._id}`
        : '/api/customers/tasks';
      
      const method = editingTask ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customerId,
          status: 'pending'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchTasks();
        setDialogOpen(false);
        resetForm();
      } else {
        throw new Error(data.message || 'Failed to save task');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId: string, status: 'pending' | 'completed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/customers/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchTasks();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete task
  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const response = await fetch(`/api/customers/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchTasks();
        setMenuAnchor(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      taskType: 'call',
      priority: 'medium',
      title: '',
      description: '',
      dueDate: '',
      assignedTo: user?.id || '',
      reminder: true
    });
    setEditingTask(null);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone />;
      case 'email': return <Email />;
      case 'meeting': return <MeetingRoom />;
      case 'payment': return <Payment />;
      case 'delivery': return <LocalShipping />;
      case 'quote': return <Description />;
      default: return <Assignment />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ea4335';
      case 'medium': return '#fbbc04';
      case 'low': return '#34a853';
      default: return '#5f6368';
    }
  };

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'completed') return '#34a853';
    if (status === 'cancelled') return '#5f6368';
    if (status === 'overdue' || (status === 'pending' && new Date(dueDate) < new Date())) {
      return '#ea4335';
    }
    return '#fbbc04';
  };

  // Check for overdue tasks
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  // Group tasks by due date
  const todayTasks = tasks.filter(t => 
    t.status === 'pending' && 
    format(new Date(t.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );
  
  const overdueTasks = tasks.filter(t => 
    t.status === 'pending' && new Date(t.dueDate) < new Date()
  );
  
  const upcomingTasks = tasks.filter(t => 
    t.status === 'pending' && 
    new Date(t.dueDate) > new Date() &&
    format(new Date(t.dueDate), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Paper sx={{
      p: 2,
      borderRadius: 2,
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Task sx={{ color: '#4285f4' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124' }}>
            Follow-up Tasks
          </Typography>
          {overdueTasks.length > 0 && (
            <Badge 
              badgeContent={overdueTasks.length} 
              color="error"
              sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}
            >
              <Warning sx={{ color: '#ea4335' }} />
            </Badge>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={fetchTasks}>
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="small"
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            sx={{
              borderRadius: '20px',
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
            }}
          >
            New Task
          </Button>
        </Box>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: darkMode ? '#3c4043' : '#dadce0', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {['pending', 'all', 'completed'].map((f) => (
            <Chip
              key={f}
              label={f.charAt(0).toUpperCase() + f.slice(1)}
              onClick={() => setFilter(f as any)}
              color={filter === f ? 'primary' : 'default'}
              variant={filter === f ? 'filled' : 'outlined'}
              sx={{
                textTransform: 'capitalize',
                backgroundColor: filter === f 
                  ? darkMode ? '#8ab4f8' : '#1a73e8'
                  : darkMode ? '#303134' : '#ffffff',
                color: filter === f 
                  ? darkMode ? '#202124' : '#ffffff'
                  : darkMode ? '#e8eaed' : '#202124',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Paper sx={{
          flex: 1,
          p: 1,
          borderRadius: 2,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Today
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124' }}>
            {todayTasks.length}
          </Typography>
        </Paper>
        <Paper sx={{
          flex: 1,
          p: 1,
          borderRadius: 2,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Overdue
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#ea4335' }}>
            {overdueTasks.length}
          </Typography>
        </Paper>
        <Paper sx={{
          flex: 1,
          p: 1,
          borderRadius: 2,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Upcoming
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#8ab4f8' : '#4285f4' }}>
            {upcomingTasks.length}
          </Typography>
        </Paper>
      </Box>

      {/* Task List */}
      <Box sx={{ 
        maxHeight: 400, 
        overflow: 'auto',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: darkMode ? '#3c4043' : '#f1f3f4' },
        '&::-webkit-scrollbar-thumb': { background: darkMode ? '#9aa0a6' : '#5f6368', borderRadius: '4px' }
      }}>
        {tasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Assignment sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', opacity: 0.5, mb: 1 }} />
            <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
              {filter === 'pending' ? 'No pending tasks' : 'No tasks found'}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {tasks.map((task) => {
              const overdue = !task.completedAt && new Date(task.dueDate) < new Date();
              const status = overdue ? 'overdue' : task.status;
              
              return (
                <Paper
                  key={task._id}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    border: `1px solid ${
                      status === 'overdue' 
                        ? alpha('#ea4335', 0.3)
                        : status === 'completed'
                        ? alpha('#34a853', 0.3)
                        : darkMode ? '#3c4043' : '#dadce0'
                    }`,
                    opacity: status === 'completed' ? 0.8 : 1,
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Checkbox
                      checked={status === 'completed'}
                      onChange={() => updateTaskStatus(
                        task._id, 
                        status === 'completed' ? 'pending' : 'completed'
                      )}
                      sx={{ 
                        p: 0.5,
                        color: status === 'completed' ? '#34a853' : darkMode ? '#9aa0a6' : '#5f6368',
                        '&.Mui-checked': {
                          color: '#34a853',
                        }
                      }}
                    />
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600,
                                color: darkMode ? '#e8eaed' : '#202124',
                                textDecoration: status === 'completed' ? 'line-through' : 'none'
                              }}
                            >
                              {task.title}
                            </Typography>
                            <Chip
                              icon={React.cloneElement(getTaskIcon(task.taskType), { sx: { fontSize: 12 } })}
                              label={task.taskType}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.6rem',
                                backgroundColor: alpha('#4285f4', 0.1),
                                color: '#4285f4',
                              }}
                            />
                          </Box>
                          
                          <Typography 
                            variant="caption" 
                            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 0.5 }}
                          >
                            {task.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 12, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: status === 'overdue' ? '#ea4335' : darkMode ? '#e8eaed' : '#202124',
                                  fontWeight: status === 'overdue' ? 600 : 400
                                }}
                              >
                                {format(new Date(task.dueDate), 'dd MMM yyyy, hh:mm a')}
                                {status === 'overdue' && ` • ${formatDistanceToNow(new Date(task.dueDate))} overdue`}
                              </Typography>
                            </Box>
                            
                            <Chip
                              icon={<Flag sx={{ fontSize: 12 }} />}
                              label={task.priority}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.6rem',
                                backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                                color: getPriorityColor(task.priority),
                              }}
                            />
                            
                            {task.customerName && (
                              <Chip
                                icon={<Person sx={{ fontSize: 12 }} />}
                                label={task.customerName}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.6rem',
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Chip
                            label={status}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.6rem',
                              backgroundColor: alpha(getStatusColor(status, task.dueDate), 0.1),
                              color: getStatusColor(status, task.dueDate),
                              textTransform: 'capitalize'
                            }}
                          />
                          
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              setSelectedTask(task);
                              setMenuAnchor(e.currentTarget);
                            }}
                          >
                            <MoreVert sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      {task.assignedToName && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block', 
                            mt: 0.5,
                            color: darkMode ? '#9aa0a6' : '#5f6368'
                          }}
                        >
                          Assigned to: {task.assignedToName}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Task Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => {
          if (selectedTask) {
            setEditingTask(selectedTask);
            setFormData({
              taskType: selectedTask.taskType,
              priority: selectedTask.priority,
              title: selectedTask.title,
              description: selectedTask.description,
              dueDate: selectedTask.dueDate.slice(0, 16),
              assignedTo: selectedTask.assignedTo,
              reminder: true
            });
            setDialogOpen(true);
            setMenuAnchor(null);
          }
        }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Task</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => {
          if (selectedTask) {
            updateTaskStatus(selectedTask._id, 'completed');
            setMenuAnchor(null);
          }
        }}>
          <ListItemIcon><CheckCircle fontSize="small" sx={{ color: '#34a853' }} /></ListItemIcon>
          <ListItemText>Mark Complete</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          if (selectedTask) {
            handleDelete(selectedTask._id);
          }
        }} sx={{ color: '#ea4335' }}>
          <ListItemIcon><Delete fontSize="small" sx={{ color: '#ea4335' }} /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Task Type</InputLabel>
              <Select
                value={formData.taskType}
                label="Task Type"
                onChange={(e) => setFormData({ ...formData, taskType: e.target.value as any })}
              >
                <MenuItem value="call">📞 Call</MenuItem>
                <MenuItem value="email">📧 Email</MenuItem>
                <MenuItem value="meeting">🎥 Meeting</MenuItem>
                <MenuItem value="payment">💰 Payment</MenuItem>
                <MenuItem value="delivery">🚚 Delivery</MenuItem>
                <MenuItem value="quote">📄 Quote</MenuItem>
                <MenuItem value="proposal">📋 Proposal</MenuItem>
                <MenuItem value="other">📌 Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <TextField
              fullWidth
              size="small"
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <MenuItem value="high">🔴 High</MenuItem>
                  <MenuItem value="medium">🟡 Medium</MenuItem>
                  <MenuItem value="low">🟢 Low</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                label="Due Date"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>

            <FormControl fullWidth size="small">
              <InputLabel>Assign To</InputLabel>
              <Select
                value={formData.assignedTo}
                label="Assign To"
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              >
                <MenuItem value={user?.id}>Myself</MenuItem>
                {/* Add other users here */}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.reminder}
                  onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                />
              }
              label="Set reminder 1 hour before"
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            disabled={!formData.title || !formData.dueDate}
            sx={{
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
            }}
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}