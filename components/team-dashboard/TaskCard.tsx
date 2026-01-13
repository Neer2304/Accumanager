"use client";

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Task as TaskIcon,
  AccessTime,
  CalendarToday,
  Person,
} from '@mui/icons-material';

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    description: string;
    status: 'assigned' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate: string;
    progress: number;
    projectName?: string;
    assignedTo?: {
      name: string;
    };
  };
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const theme = useTheme();

  const getStatusColor = (status: TaskCardProps['task']['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'assigned': return 'warning';
      case 'rejected': return 'error';
      case 'on_hold': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: TaskCardProps['task']['priority']) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card 
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        borderRadius: 2,
        transition: 'all 0.3s',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[2],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TaskIcon fontSize="small" color="primary" />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ flex: 1 }}>
              {task.title}
            </Typography>
          </Box>
          <Chip
            label={task.status.replace('_', ' ')}
            size="small"
            color={getStatusColor(task.status)}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description?.substring(0, 100)}...
        </Typography>

        {task.assignedTo && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Person fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {task.assignedTo.name}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" fontWeight="bold">
              {task.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={task.progress}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize="small" color="action" />
            <Typography 
              variant="caption" 
              color={isOverdue ? 'error.main' : 'text.secondary'}
              fontWeight={isOverdue ? 'bold' : 'normal'}
            >
              Due: {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue && ' (Overdue)'}
            </Typography>
          </Box>
          <Chip
            label={task.priority}
            size="small"
            color={getPriorityColor(task.priority)}
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};