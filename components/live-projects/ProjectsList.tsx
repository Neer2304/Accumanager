// components/live-projects/ProjectsList.tsx
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  AvatarGroup,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import { PlayArrow, Pause, CheckCircle, Warning, MoreVert } from '@mui/icons-material';
import { LiveProject } from './types';

interface ProjectsListProps {
  projects: LiveProject[];
  autoRefresh: boolean;
  onAutoRefreshChange: (value: boolean) => void;
}

export const ProjectsList = ({ projects, autoRefresh, onAutoRefreshChange }: ProjectsListProps) => {
  const getStatusColor = (status: LiveProject['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'primary';
      case 'delayed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: LiveProject['status']) => {
    switch (status) {
      case 'active': return <PlayArrow fontSize="small" />;
      case 'paused': return <Pause fontSize="small" />;
      case 'completed': return <CheckCircle fontSize="small" />;
      case 'delayed': return <Warning fontSize="small" />;
      default: return <MoreVert fontSize="small" />;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  const calculateDaysRemaining = (deadline: string) => {
    try {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diff = deadlineDate.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    } catch {
      return 30;
    }
  };

  if (projects.length === 0) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Projects Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first project to start tracking progress
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h5">
          Your Projects ({projects.length})
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={autoRefresh}
              onChange={(e) => onAutoRefreshChange(e.target.checked)}
              size="small"
            />
          }
          label="Auto Refresh"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {projects.map((project) => (
          <Card key={project.id} sx={{ 
            borderRadius: 2, 
            '&:hover': { 
              boxShadow: 6,
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease'
            },
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Status indicator bar */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              bgcolor: `${getStatusColor(project.status)}.main`,
              opacity: 0.8
            }} />
            
            <CardContent>
              {/* Project Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                mb: 2 
              }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {project.description}
                  </Typography>
                </Box>
                <Chip
                  icon={getStatusIcon(project.status)}
                  label={project.status.toUpperCase()}
                  color={getStatusColor(project.status) as any}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 1 
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {project.progress.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  color={
                    project.progress > 80 ? "success" :
                    project.progress > 50 ? "warning" : "primary"
                  }
                  sx={{ 
                    height: 8, 
                    borderRadius: 4 
                  }}
                />
              </Box>

              {/* Task Breakdown */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2,
                mb: 3
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {project.tasks?.completed || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Done
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.main">
                    {project.tasks?.inProgress || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="error.main">
                    {project.tasks?.blocked || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Blocked
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    {project.tasks?.total || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total
                  </Typography>
                </Box>
              </Box>

              {/* Footer */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2 
                }}>
                  <AvatarGroup max={3}>
                    {(project.team || []).map((member, index) => (
                      <Tooltip key={index} title={member}>
                        <Avatar sx={{ width: 30, height: 30, fontSize: 14 }}>
                          {member.charAt(0).toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                  <Typography variant="caption" color="text.secondary">
                    Velocity: {project.velocity.toFixed(1)} tasks/day
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {calculateDaysRemaining(project.deadline)} days remaining
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated: {formatTime(project.lastUpdate)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};