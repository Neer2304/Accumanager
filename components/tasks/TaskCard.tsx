// components/tasks/TaskCard.tsx - Fixed version
"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  alpha,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert,
  CheckCircle,
  PlayArrow,
  Warning,
  Schedule,
  AccessTime,
  Person,
  Folder,
  Edit,
  Delete,
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';

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
  isLocal?: boolean;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const daysLeft = task.dueDate
    ? Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      completed: '#34a853',
      in_progress: '#0d9488',
      in_review: '#fbbc04',
      blocked: '#ea4335',
      todo: '#9aa0a6',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle fontSize="small" />;
      case 'in_progress': return <PlayArrow fontSize="small" />;
      case 'in_review': return <Schedule fontSize="small" />;
      case 'blocked': return <Warning fontSize="small" />;
      default: return <Schedule fontSize="small" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      urgent: '#ea4335',
      high: '#f97316',
      medium: '#0ea5e9',
      low: '#10b981',
    };
    return colors[priority];
  };

  const getProgressPercentage = () => {
    if (!task.estimatedHours || !task.actualHours) return 0;
    return Math.min(Math.round((task.actualHours / task.estimatedHours) * 100), 100);
  };

  const statusOptions: Task['status'][] = ['todo', 'in_progress', 'in_review', 'completed', 'blocked'];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    onDelete(task);
    handleMenuClose();
  };

  return (
    <Card
      hover
      sx={{
        borderLeft: `4px solid ${getStatusColor(task.status)}`,
        border: task.isLocal ? `2px dashed #fbbc04` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header with Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1, pr: 2 }}>
          <Typography variant="h6" fontWeight={500} gutterBottom sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            lineHeight: 1.3,
            fontSize: { xs: '1rem', sm: '1.125rem' },
          }}>
            {task.title}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            mb: 2,
            minHeight: 40,
            fontSize: '0.875rem',
          }}>
            {task.description || 'No description provided'}
          </Typography>
        </Box>
        <IconButton
          onClick={handleMenuClick}
          size="small"
          sx={{
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&:hover': {
              backgroundColor: alpha('#4285f4', 0.1),
              color: '#4285f4',
            },
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            boxShadow: darkMode 
              ? '0 4px 20px rgba(0,0,0,0.3)' 
              : '0 4px 20px rgba(0,0,0,0.1)',
            minWidth: 120,
          }
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <Edit fontSize="small" sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="body2">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: '#ea4335' }}>
          <Delete fontSize="small" sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="body2">Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Status and Priority Chips */}
      <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
        <Chip
          icon={getStatusIcon(task.status)}
          label={task.status.replace('_', ' ')}
          size="small"
          sx={{
            backgroundColor: alpha(getStatusColor(task.status), 0.1),
            color: getStatusColor(task.status),
            fontWeight: 500,
          }}
        />
        <Chip
          label={task.priority}
          size="small"
          variant="outlined"
          sx={{
            color: getPriorityColor(task.priority),
            borderColor: alpha(getPriorityColor(task.priority), 0.3),
            fontWeight: 500,
          }}
        />
      </Stack>

      {/* Task Info */}
      <Box sx={{
        backgroundColor: alpha(theme.palette.background.default, 0.5),
        p: 1.5,
        borderRadius: 2,
        mb: 2,
      }}>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Folder fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>
              {task.projectName}
            </Typography>
          </Box>
          
          {task.assignedToName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {task.assignedToName}
              </Typography>
            </Box>
          )}
          
          {task.dueDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime fontSize="small" sx={{ 
                color: isOverdue ? '#ea4335' : (darkMode ? '#9aa0a6' : '#5f6368'), 
                fontSize: 16 
              }} />
              <Typography variant="body2" sx={{ 
                color: isOverdue ? '#ea4335' : (darkMode ? '#9aa0a6' : '#5f6368'),
                fontWeight: isOverdue ? 500 : 400,
              }}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
                {daysLeft !== null && (
                  <Typography component="span" variant="caption" sx={{ ml: 1, fontWeight: 'bold' }}>
                    ({isOverdue ? 'Overdue' : `${daysLeft} days left`})
                  </Typography>
                )}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Progress Bar (if estimated hours exist) */}
      {task.estimatedHours > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500 }}>
              {task.actualHours || 0}h / {task.estimatedHours}h
            </Typography>
          </Box>
          <Box sx={{ 
            height: 6, 
            backgroundColor: darkMode ? '#3c4043' : '#e0e0e0', 
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <Box 
              sx={{ 
                height: '100%',
                width: `${getProgressPercentage()}%`,
                backgroundColor: getProgressPercentage() > 80 ? '#ea4335' : 
                                getProgressPercentage() > 60 ? '#fbbc04' : '#34a853',
                borderRadius: 3,
              }} 
            />
          </Box>
        </Box>
      )}

      {/* Quick Status Actions */}
      <Box sx={{
        display: 'flex',
        gap: 0.5,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {statusOptions
          .filter(status => status !== task.status)
          .map(status => (
            <Tooltip key={status} title={`Mark as ${status.replace('_', ' ')}`}>
              <Chip
                label={status.charAt(0).toUpperCase()}
                size="small"
                variant="outlined"
                onClick={() => onStatusChange(task, status)}
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  width: 28,
                  height: 28,
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
    </Card>
  );
};