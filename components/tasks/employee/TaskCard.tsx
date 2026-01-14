import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  Folder,
  Schedule,
  AccessTime,
} from '@mui/icons-material';
import { EmployeeTask } from './types';
import {
  getStatusColor,
  getPriorityColor,
  isTaskOverdue,
  formatTaskDate,
  getStatusIcon,
} from '../shared/utils';

interface TaskCardProps {
  task: EmployeeTask;
  isMobile: boolean;
  onUpdateClick: (task: EmployeeTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isMobile,
  onUpdateClick,
}) => {
  const theme = useTheme();
  const overdue = isTaskOverdue(task);
  const StatusIcon = getStatusIcon(task.status);
//   const PriorityIcon = getPriorityIcon(task.priority);

  return (
    <Card
      sx={{
        height: '100%',
        border: overdue
          ? `2px solid ${theme.palette.error.main}`
          : `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease',
        },
      }}
    >
      {overdue && (
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant={isMobile ? 'subtitle1' : 'h6'}
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
                // icon={<StatusIcon />}
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
            onClick={() => onUpdateClick(task)}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 2,
              p: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 1,
            }}
          >
            <Folder fontSize="small" color="primary" />
            <Typography variant="caption" color="primary" fontWeight="medium">
              {task.projectName}
            </Typography>
          </Box>
        )}

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 0.5,
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              Progress
            </Typography>
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1,
            mt: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Schedule fontSize="small" color="action" />
            <Typography variant="caption" noWrap>
              {formatTaskDate(task.dueDate)}
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
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Updated:{' '}
              {formatTaskDate(task.updates[task.updates.length - 1].createdAt)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function for priority icons
// const getPriorityIcon = (priority: TaskPriority) => {
//   switch (priority) {
//     case 'urgent': return 'Error';
//     case 'high': return 'Warning';
//     case 'medium': return 'Info';
//     case 'low': return 'CheckCircle';
//     default: return 'Circle';
//   }
// };