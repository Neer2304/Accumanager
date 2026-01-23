// components/live-projects/SidebarSection.tsx
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  AvatarGroup,
  Button,
  Divider,
  alpha,
  useTheme,
  Zoom
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Warning,
  Task,
  Schedule,
  NotificationsActive,
  MoreVert,
  Refresh,
  ArrowForward,
  Speed,
  Timeline,
  TrendingFlat,
  FiberManualRecord,
  AccessTime,
  Person
} from '@mui/icons-material';
import { ProjectUpdate, LiveProject } from './types';
import { useState } from 'react';

interface SidebarSectionProps {
  updates: ProjectUpdate[];
  projects: LiveProject[];
  onRefreshUpdates?: () => void;
  loading?: boolean;
}

export const SidebarSection = ({ updates, projects, onRefreshUpdates, loading = false }: SidebarSectionProps) => {
  const theme = useTheme();
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Just now';
    }
  };

  const getUpdateIcon = (type: ProjectUpdate['type']) => {
    switch (type) {
      case 'task_complete': return <CheckCircle color="success" fontSize="small" />;
      case 'task_blocked': return <Warning color="error" fontSize="small" />;
      case 'progress': return <TrendingUp color="primary" fontSize="small" />;
      case 'milestone': return <Task color="info" fontSize="small" />;
      case 'delay': return <Schedule color="warning" fontSize="small" />;
      default: return <NotificationsActive fontSize="small" />;
    }
  };

  const getUpdateColor = (type: ProjectUpdate['type']) => {
    switch (type) {
      case 'task_complete': return theme.palette.success.main;
      case 'task_blocked': return theme.palette.error.main;
      case 'progress': return theme.palette.primary.main;
      case 'milestone': return theme.palette.info.main;
      case 'delay': return theme.palette.warning.main;
      default: return theme.palette.text.secondary;
    }
  };

  const calculateProjectHealth = (project: LiveProject) => {
    if (project.progress >= 80 && project.status === 'active') return 'success';
    if (project.progress >= 50 && project.status !== 'delayed') return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Recent Updates Card */}
      <Card sx={{ 
        borderRadius: 3,
        position: 'relative',
        overflow: 'visible',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)'
        }
      }}>
        {/* Gradient Top Border */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '3px 3px 0 0'
        }} />
        
        {/* Animated Pulse Dot */}
        <Box sx={{
          position: 'absolute',
          top: -6,
          left: 20,
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: 'success.main',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(0.8)', opacity: 0.7 },
            '50%': { transform: 'scale(1.1)', opacity: 1 },
            '100%': { transform: 'scale(0.8)', opacity: 0.7 }
          }
        }} />
        
        {/* Feature Badge */}
        <Chip 
          label="LIVE FEED" 
          color="primary" 
          size="small"
          icon={<FiberManualRecord fontSize="small" sx={{ animation: 'blink 1.5s infinite' }} />}
          sx={{ 
            position: 'absolute', 
            top: -12, 
            right: 20,
            fontWeight: 'bold',
            fontSize: '0.65rem',
            boxShadow: 1,
            '@keyframes blink': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.3 }
            }
          }}
        />
        
        <CardContent sx={{ pt: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <Timeline fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Live Updates
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime fontSize="inherit" />
                  Real-time activity stream
                </Typography>
              </Box>
            </Box>
            <Tooltip title="Refresh updates">
              <IconButton 
                size="small" 
                onClick={onRefreshUpdates}
                disabled={loading}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'rotate(90deg)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Updates List */}
          <List sx={{ maxHeight: 380, overflow: 'auto', pr: 1 }}>
            {updates.length === 0 ? (
              <ListItem sx={{
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                mb: 1
              }}>
                <ListItemIcon>
                  <NotificationsActive color="disabled" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      No updates yet
                    </Typography>
                  }
                  secondary="Activity will appear here"
                />
              </ListItem>
            ) : (
              updates.map((update, index) => (
                <Zoom in={true} timeout={300 + index * 100} key={update.id}>
                  <ListItem 
                    sx={{
                      borderRadius: 2,
                      mb: 1.5,
                      transition: 'all 0.2s ease',
                      bgcolor: alpha(getUpdateColor(update.type), 0.05),
                      border: `1px solid ${alpha(getUpdateColor(update.type), 0.1)}`,
                      '&:hover': {
                        bgcolor: alpha(getUpdateColor(update.type), 0.1),
                        transform: 'translateX(4px)'
                      },
                      alignItems: 'flex-start'
                    }}
                  >
                    {/* Update Icon with Status Indicator */}
                    <Box sx={{ position: 'relative', mr: 2, mt: 0.5 }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(getUpdateColor(update.type), 0.15),
                        color: getUpdateColor(update.type)
                      }}>
                        {getUpdateIcon(update.type)}
                      </Box>
                      {/* Mini pulse indicator for recent updates */}
                      {index < 3 && (
                        <Box sx={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: getUpdateColor(update.type),
                          animation: 'pulse 1.5s infinite'
                        }} />
                      )}
                    </Box>

                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                          {update.description}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mt: 0.5 }}>
                          <Chip
                            label={update.projectName}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Person fontSize="inherit" />
                            {update.user}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime fontSize="inherit" />
                            {formatTime(update.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </Zoom>
              ))
            )}
          </List>

          {/* View All Button */}
          {updates.length > 0 && (
            <Button
              fullWidth
              endIcon={<ArrowForward fontSize="small" />}
              sx={{
                mt: 2,
                borderRadius: 2,
                textTransform: 'none',
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              View All Activity
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Project Progress Analytics Card */}
      <Card sx={{ 
        borderRadius: 3,
        position: 'relative',
        overflow: 'visible',
        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)'
        }
      }}>
        {/* Gradient Top Border */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
          borderRadius: '3px 3px 0 0'
        }} />
        
        {/* Feature Badge */}
        <Chip 
          label="ANALYTICS" 
          color="info" 
          size="small"
          icon={<Speed fontSize="small" />}
          sx={{ 
            position: 'absolute', 
            top: -12, 
            right: 20,
            fontWeight: 'bold',
            fontSize: '0.65rem',
            boxShadow: 1
          }}
        />
        
        <CardContent sx={{ pt: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
              color: 'white'
            }}>
              <TrendingFlat fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Progress Analytics
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {projects.length} active projects
              </Typography>
            </Box>
          </Box>

          {/* Projects Progress List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {projects.slice(0, 5).map((project) => {
              const health = calculateProjectHealth(project);
              const isExpanded = expandedProject === project.id;

              return (
                <Box
                  key={project.id}
                  sx={{
                    borderRadius: 2,
                    p: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'scale(1.01)'
                    }
                  }}
                  onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                >
                  {/* Project Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="bold" noWrap>
                        {project.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime fontSize="inherit" />
                        {formatTime(project.lastUpdate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`${project.progress.toFixed(0)}%`}
                        size="small"
                        color={health as any}
                        sx={{ 
                          fontWeight: 'bold', 
                          fontSize: '0.7rem',
                          height: 22 
                        }}
                      />
                      <AvatarGroup 
                        max={3} 
                        sx={{ 
                          '& .MuiAvatar-root': { 
                            width: 20, 
                            height: 20, 
                            fontSize: '0.6rem' 
                          } 
                        }}
                      >
                        {project.team.slice(0, 3).map((member, idx) => (
                          <Avatar key={idx}>{member.charAt(0)}</Avatar>
                        ))}
                      </AvatarGroup>
                    </Box>
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 1.5 }}>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette[health].main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          background: `linear-gradient(90deg, ${theme.palette[health].light} 0%, ${theme.palette[health].main} 100%)`,
                        }
                      }}
                    />
                  </Box>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <Zoom in={isExpanded}>
                      <Box sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${theme.palette.divider}` }}>
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(2, 1fr)', 
                          gap: 1.5,
                          mb: 2 
                        }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Completed</Typography>
                            <Typography variant="h6" color="success.main">{project.tasks.completed}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">In Progress</Typography>
                            <Typography variant="h6" color="warning.main">{project.tasks.inProgress}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Blocked</Typography>
                            <Typography variant="h6" color="error.main">{project.tasks.blocked}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Velocity</Typography>
                            <Typography variant="h6" color="info.main">{project.velocity.toFixed(1)}/day</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Zoom>
                  )}

                  {/* Task Distribution Mini Bars */}
                  <Box sx={{ display: 'flex', gap: 0.5, height: 3 }}>
                    {[
                      { value: project.tasks.completed, color: theme.palette.success.main },
                      { value: project.tasks.inProgress, color: theme.palette.warning.main },
                      { value: project.tasks.blocked, color: theme.palette.error.main },
                      { value: project.tasks.total - project.tasks.completed - project.tasks.inProgress - project.tasks.blocked, 
                        color: theme.palette.grey[400] }
                    ].map((task, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          flex: task.value,
                          height: '100%',
                          bgcolor: task.color,
                          borderRadius: 1.5,
                          opacity: 0.7,
                          transition: 'opacity 0.2s ease',
                          '&:hover': { opacity: 1 }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              );
            })}

            {/* View More Projects */}
            {projects.length > 5 && (
              <Button
                fullWidth
                endIcon={<ArrowForward fontSize="small" />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.info.main, 0.1)
                  }
                }}
              >
                View All Projects ({projects.length})
              </Button>
            )}
          </Box>

          {/* Summary Stats */}
          {projects.length > 0 && (
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 2 
              }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Avg. Progress</Typography>
                  <Typography variant="h6">
                    {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Delayed</Typography>
                  <Typography variant="h6" color="warning.main">
                    {projects.filter(p => p.status === 'delayed').length}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};