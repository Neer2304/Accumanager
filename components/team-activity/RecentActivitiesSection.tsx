// components/team-activity/RecentActivitiesSection.tsx
import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import {
  Task,
  TrendingUp,
  Person,
  CheckCircle,
  Videocam,
  Download,
  Share,
  Notifications,
  Star,
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Activity } from './types';

interface RecentActivitiesSectionProps {
  activities: Activity[];
  darkMode: boolean;
}

const RecentActivitiesSection: React.FC<RecentActivitiesSectionProps> = ({
  activities,
  darkMode,
}) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task_update': return <Task sx={{ color: '#4285f4' }} />;
      case 'project_update': return <TrendingUp sx={{ color: '#8ab4f8' }} />;
      case 'status_change': return <Person sx={{ color: '#ea4335' }} />;
      case 'login': return <CheckCircle sx={{ color: '#34a853' }} />;
      case 'meeting': return <Videocam sx={{ color: '#fbbc04' }} />;
      default: return <Task sx={{ color: '#5f6368' }} />;
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
    <Card
      title="Recent Activities"
      subtitle={`${activities.length} activities in last 24 hours`}
      action={
        <>
          <Button
            variant="text"
            size="small"
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            iconRight={<Download />}
          />
          <Button
            variant="text"
            size="small"
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            iconRight={<Share />}
          />
        </>
      }
      hover
      sx={{
        height: '100%',
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {activities.slice(0, 5).map((activity) => (
          <Box
            key={activity.id}
            sx={{
              p: 2,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
              },
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                }}
              >
                {getActivityIcon(activity.type)}
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {activity.userName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {formatTime(activity.timestamp)}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1, color: darkMode ? '#e8eaed' : '#202124' }}>
                  {activity.description}
                </Typography>
                
                {(activity.projectName || activity.taskName) && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {activity.projectName && (
                      <Chip
                        label={activity.projectName}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          borderColor: darkMode ? '#3c4043' : '#dadce0',
                          color: darkMode ? '#e8eaed' : '#202124',
                        }}
                      />
                    )}
                    {activity.taskName && (
                      <Chip
                        label={activity.taskName}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          backgroundColor: '#4285f4',
                          color: 'white',
                        }}
                      />
                    )}
                  </Box>
                )}
                
                {activity.metadata?.points && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <Star fontSize="small" sx={{ color: '#fbbc04' }} />
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      +{activity.metadata.points} points
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      
      <Button
        fullWidth
        variant="outlined"
        iconLeft={<Notifications />}
        sx={{
          mt: 3,
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          color: darkMode ? '#e8eaed' : '#202124',
        }}
      >
        View All Activities
      </Button>
    </Card>
  );
};

export default RecentActivitiesSection;