import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  Chip,
  alpha,
} from '@mui/material';
import {
  Task,
  TrendingUp,
  Person,
  CheckCircle,
  AccessTime,
  Computer,
  Phone,
  Videocam,
  Coffee,
} from '@mui/icons-material';

export type ActivityType = 'task_update' | 'project_update' | 'status_change' | 'login' | 'logout' | 'meeting' | 'break';

interface ActivityItemProps {
  id: string;
  userName: string;
  type: ActivityType;
  description: string;
  projectName?: string;
  taskName?: string;
  timestamp: string;
  metadata?: any;
  showProject?: boolean;
  showTime?: boolean;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  userName,
  type,
  description,
  projectName,
  taskName,
  timestamp,
  metadata,
  showProject = true,
  showTime = true,
}) => {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'task_update': return <Task color="primary" />;
      case 'project_update': return <TrendingUp color="info" />;
      case 'status_change': return <Person color="secondary" />;
      case 'login': return <CheckCircle color="success" />;
      case 'logout': return <AccessTime color="disabled" />;
      case 'meeting': return <Videocam color="action" />;
      case 'break': return <Coffee color="warning" />;
      default: return <Person />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'task_update': return 'primary';
      case 'project_update': return 'info';
      case 'status_change': return 'secondary';
      case 'login': return 'success';
      case 'logout': return 'default';
      case 'meeting': return 'action';
      case 'break': return 'warning';
      default: return 'default';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <ListItem 
      sx={{
        borderRadius: 1,
        mb: 1,
        '&:hover': {
          backgroundColor: theme => alpha(theme.palette.action.hover, 0.05),
        }
      }}
    >
      <ListItemAvatar>
        <Box
          sx={{
            p: 1,
            borderRadius: '50%',
            bgcolor: theme => alpha(theme.palette[getActivityColor(type)].main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {getActivityIcon(type)}
        </Box>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="subtitle2" fontWeight="medium">
              {userName}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {description}
            </Typography>
          </Box>
        }
        secondary={
          <Box sx={{ mt: 0.5 }}>
            {(projectName || taskName) && (
              <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                {projectName && (
                  <Chip
                    label={projectName}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20 }}
                  />
                )}
                {taskName && (
                  <Chip
                    label={taskName}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ height: 20 }}
                  />
                )}
              </Box>
            )}
            {showTime && (
              <Typography variant="caption" color="text.secondary">
                {formatTime(timestamp)}
              </Typography>
            )}
          </Box>
        }
      />
    </ListItem>
  );
};