"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  LinearProgress,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  TextField,
  Divider,
  Stack,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  RadioButtonUnchecked,
  AccessTime,
  CalendarToday,
  Person,
  Chat,
  Add,
  Send,
  DoneAll,
  Timer,
} from '@mui/icons-material';

interface ChecklistItem {
  _id: string;
  description: string;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: Date;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'blocked' | 'review' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
  checklist: ChecklistItem[];
  totalChecklistItems: number;
  completedChecklistItems: number;
  assignedTo: {
    _id: string;
    name: string;
  };
  updates: Array<{
    description: string;
    progress: number;
    hoursWorked: number;
    completedItems?: string[];
    createdAt: string;
  }>;
}

interface TaskViewDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdateChecklist: (taskId: string, itemId: string, isCompleted: boolean) => Promise<void>;
  employeeName?: string;
}

export const TaskViewDialog: React.FC<TaskViewDialogProps> = ({
  open,
  onClose,
  task,
  onUpdateChecklist,
  employeeName,
}) => {
  const theme = useTheme();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  if (!task) return null;

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'assigned': return 'warning';
      case 'blocked': return 'error';
      case 'review': return 'secondary';
      case 'on_hold': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const handleChecklistToggle = async (itemId: string, currentStatus: boolean) => {
    try {
      setSelectedItemId(itemId);
      await onUpdateChecklist(task._id, itemId, !currentStatus);
    } finally {
      setSelectedItemId(null);
    }
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {task.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              <Chip
                label={task.status.replace('_', ' ')}
                color={getStatusColor(task.status)}
                size="small"
              />
              <Chip
                label={task.priority}
                color={getPriorityColor(task.priority)}
                size="small"
                variant="outlined"
              />
              {isOverdue && (
                <Chip
                  label="Overdue"
                  color="error"
                  size="small"
                  icon={<AccessTime />}
                />
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Task Description */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="body1" paragraph>
              {task.description}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mt: 1 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <Person fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Assigned to: <strong>{task.assignedTo.name}</strong>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <CalendarToday fontSize="small" color="action" />
                <Typography 
                  variant="body2" 
                  color={isOverdue ? 'error.main' : 'text.secondary'}
                  fontWeight={isOverdue ? 'bold' : 'normal'}
                >
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <Timer fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Hours: {task.actualHours}/{task.estimatedHours}h
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Progress Bar */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Overall Progress
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                {task.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={task.progress}
              sx={{ height: 8, borderRadius: 4, mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip
                icon={<DoneAll />}
                label={`${task.completedChecklistItems}/${task.totalChecklistItems} items completed`}
                color={task.progress === 100 ? 'success' : 'primary'}
                variant="outlined"
                size="small"
              />
              {task.progress === 100 && (
                <Chip
                  label="Task Completed"
                  color="success"
                  size="small"
                  icon={<CheckCircle />}
                />
              )}
            </Box>
          </Paper>

          {/* CHECKLIST SECTION */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle /> Task Checklist
            </Typography>
            
            {task.checklist && task.checklist.length > 0 ? (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {task.checklist.map((item) => (
                  <ListItem
                    key={item._id}
                    sx={{
                      border: '1px solid',
                      borderColor: item.isCompleted ? alpha(theme.palette.success.main, 0.3) : 'divider',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: item.isCompleted ? alpha(theme.palette.success.main, 0.05) : 'background.paper',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: item.isCompleted ? theme.palette.success.main : theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                    button
                    onClick={() => handleChecklistToggle(item._id, item.isCompleted)}
                    disabled={selectedItemId === item._id}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={item.isCompleted}
                        icon={<RadioButtonUnchecked />}
                        checkedIcon={<CheckCircle sx={{ color: theme.palette.success.main }} />}
                        disabled={selectedItemId === item._id}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: item.isCompleted ? 'line-through' : 'none',
                            color: item.isCompleted ? 'text.secondary' : 'text.primary',
                          }}
                        >
                          {item.description}
                        </Typography>
                      }
                      secondary={
                        item.isCompleted && item.completedBy && (
                          <Typography variant="caption" color="success.main">
                            Completed by {item.completedBy} on {formatDate(item.completedAt)}
                          </Typography>
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover' }}>
                <CheckCircle sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No checklist items
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This task doesn't have specific items to complete
                </Typography>
              </Paper>
            )}
          </Paper>

          {/* Recent Updates */}
          {task.updates && task.updates.length > 0 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chat /> Recent Updates
              </Typography>
              <Stack spacing={2}>
                {task.updates.slice(-5).reverse().map((update, index) => (
                  <Paper key={index} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="body2" paragraph>
                      {update.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Progress: {update.progress}% • Hours: +{update.hoursWorked}h
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {employeeName && task.status !== 'completed' && (
          <Button
            variant="contained"
            onClick={() => {
              // Add quick completion button
              if (window.confirm('Mark all checklist items as completed?')) {
                // Handle bulk completion
                task.checklist.forEach(item => {
                  if (!item.isCompleted) {
                    onUpdateChecklist(task._id, item._id, true);
                  }
                });
              }
            }}
            startIcon={<DoneAll />}
          >
            Mark All Complete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};