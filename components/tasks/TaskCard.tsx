import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Stack,
  Tooltip,
  Avatar,
  alpha,
  useTheme,
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
} from '@mui/icons-material';

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
  onMenuClick: (e: React.MouseEvent<HTMLElement>, task: Task) => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onMenuClick, onStatusChange }) => {
  const theme = useTheme();
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const daysLeft = task.dueDate
    ? Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      completed: '#10b981',
      in_progress: '#0d9488',
      in_review: '#f59e0b',
      blocked: '#f43f5e',
      todo: '#64748b',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in_progress': return <PlayArrow />;
      case 'in_review': return <Schedule />;
      case 'blocked': return <Warning />;
      default: return <Schedule />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      urgent: '#f43f5e',
      high: '#f97316',
      medium: '#0ea5e9',
      low: '#10b981',
    };
    return colors[priority];
  };

  const statusOptions: Task['status'][] = ['todo', 'in_progress', 'in_review', 'completed', 'blocked'];

  return (
    <Card sx={{
      borderRadius: 3,
      boxShadow: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: '0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      },
      border: task.isLocal ? '2px dashed #ff9800' : 'none',
      borderLeft: `4px solid ${getStatusColor(task.status)}`,
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2 }}>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              {task.description || 'No description'}
            </Typography>
          </Box>
          <IconButton
            onClick={(e) => onMenuClick(e, task)}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              },
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* Status and Priority Chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
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
        </Stack>

        {/* Task Info */}
        <Box sx={{
          bgcolor: alpha(theme.palette.background.default, 0.5),
          p: 1.5,
          borderRadius: 2,
          mb: 2,
        }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Folder fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                {task.projectName}
              </Typography>
            </Box>
            
            {task.assignedToName && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                <Typography variant="caption" color="text.secondary">
                  {task.assignedToName}
                </Typography>
              </Box>
            )}
            
            {task.dueDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                <Typography variant="caption" color={isOverdue ? 'error.main' : 'text.secondary'}>
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
};