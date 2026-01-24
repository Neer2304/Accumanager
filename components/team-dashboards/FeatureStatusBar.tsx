// components/team-dashboard/FeatureStatusBar.tsx
import { Box, Typography, Chip, LinearProgress, Tooltip } from '@mui/material';
import {
  CheckCircle,
  Build,
  Schedule,
  Code,
  BugReport,
  Rocket,
  TrendingUp,
  Notifications
} from '@mui/icons-material';

interface FeatureStatusBarProps {
  showProgressBar?: boolean;
  onFeatureClick?: (feature: string) => void;
}

export const FeatureStatusBar = ({ 
  showProgressBar = true,
  onFeatureClick 
}: FeatureStatusBarProps) => {
  const features = [
    { 
      name: 'Task Assignment', 
      status: 'completed', 
      version: 'v1.0',
      description: 'Assign tasks to team members with due dates and priorities',
      icon: <CheckCircle fontSize="small" />
    },
    { 
      name: 'Progress Tracking', 
      status: 'completed', 
      version: 'v1.0',
      description: 'Real-time progress monitoring and updates',
      icon: <TrendingUp fontSize="small" />
    },
    { 
      name: 'Performance Analytics', 
      status: 'completed', 
      version: 'v1.0',
      description: 'Team and individual performance metrics',
      icon: <Rocket fontSize="small" />
    },
    { 
      name: 'Real-time Updates', 
      status: 'in-progress', 
      version: 'v1.1',
      description: 'Live updates without page refresh',
      icon: <Notifications fontSize="small" />
    },
    { 
      name: 'Notifications', 
      status: 'in-progress', 
      version: 'v1.2',
      description: 'Email and in-app notifications system',
      icon: <Schedule fontSize="small" />
    },
    { 
      name: 'Advanced Reporting', 
      status: 'planned', 
      version: 'v2.0',
      description: 'Custom reports and analytics dashboard',
      icon: <Code fontSize="small" />
    },
    { 
      name: 'AI Insights', 
      status: 'planned', 
      version: 'v2.0',
      description: 'AI-powered productivity recommendations',
      icon: <Build fontSize="small" />
    },
    { 
      name: 'API Integration', 
      status: 'planned', 
      version: 'v2.1',
      description: 'Third-party integrations and API access',
      icon: <BugReport fontSize="small" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'planned': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle fontSize="small" />;
      case 'in-progress': return <Build fontSize="small" />;
      case 'planned': return <Schedule fontSize="small" />;
      default: return <Schedule fontSize="small" />;
    }
  };

  const completedCount = features.filter(f => f.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / features.length) * 100);

  return (
    <Box sx={{ 
      mb: 4, 
      p: 3, 
      borderRadius: 3,
      background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.8) 0%, rgba(228, 232, 240, 0.8) 100%)',
      border: '1px solid',
      borderColor: 'divider',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rocket fontSize="small" />
            🚀 Development Roadmap
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track the progress of Team Dashboard features
          </Typography>
        </Box>
        <Chip 
          label={`${completedCount}/${features.length} Complete`} 
          color="primary" 
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Progress Bar */}
      {showProgressBar && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Overall Progress
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {progressPercentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)'
              }
            }}
          />
        </Box>
      )}

      {/* Feature Chips */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1.5,
        '& .MuiChip-root': {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2
          }
        }
      }}>
        {features.map((feature, index) => (
          <Tooltip key={index} title={
            <Box>
              <Typography variant="body2" fontWeight="bold">{feature.name}</Typography>
              <Typography variant="caption">{feature.description}</Typography>
              <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                Version: {feature.version}
              </Typography>
            </Box>
          } arrow>
            <Chip
              icon={feature.icon}
              label={feature.name}
              color={getStatusColor(feature.status) as any}
              variant={feature.status === 'completed' ? 'filled' : 'outlined'}
              size="medium"
              onClick={() => onFeatureClick?.(feature.name)}
              sx={{
                fontWeight: feature.status === 'completed' ? 'bold' : 'normal',
                borderWidth: feature.status === 'in-progress' ? 2 : 1,
                cursor: 'pointer'
              }}
            />
          </Tooltip>
        ))}
      </Box>

      {/* Legend */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        mt: 3, 
        pt: 2,
        borderTop: '1px dashed',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CheckCircle color="success" fontSize="small" />
          <Typography variant="caption" color="text.secondary">Completed</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Build color="warning" fontSize="small" />
          <Typography variant="caption" color="text.secondary">In Progress</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Schedule color="action" fontSize="small" />
          <Typography variant="caption" color="text.secondary">Planned</Typography>
        </Box>
      </Box>
    </Box>
  );
};