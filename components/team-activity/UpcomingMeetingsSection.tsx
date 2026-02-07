// components/team-activity/UpcomingMeetingsSection.tsx
import React from 'react';
import {
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Videocam,
  Group,
  Task,
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Meeting } from './types';

interface UpcomingMeetingsSectionProps {
  meetings: Meeting[];
  darkMode: boolean;
}

const UpcomingMeetingsSection: React.FC<UpcomingMeetingsSectionProps> = ({
  meetings,
  darkMode,
}) => {
  const getMeetingIcon = (type: Meeting['type']) => {
    switch (type) {
      case 'sprint_planning': return <Videocam />;
      case 'client_review': return <Group />;
      case 'retrospective': return <Task />;
      default: return <Videocam />;
    }
  };

  const getMeetingColor = (type: Meeting['type']) => {
    switch (type) {
      case 'sprint_planning': return '#4285f4';
      case 'client_review': return '#ea4335';
      case 'retrospective': return '#34a853';
      default: return '#5f6368';
    }
  };

  return (
    <Card
      title="Upcoming Meetings"
      subtitle={`${meetings.length} scheduled meetings`}
      hover
      sx={{
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {meetings.slice(0, 3).map((meeting) => (
          <Box key={meeting.id} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 2,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }}>
            <Avatar sx={{ 
              bgcolor: getMeetingColor(meeting.type),
              width: 40,
              height: 40,
            }}>
              {getMeetingIcon(meeting.type)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {meeting.title}
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {meeting.date}, {meeting.time}
              </Typography>
            </Box>
            <Chip 
              label={meeting.participants} 
              size="small"
              sx={{
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            />
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default UpcomingMeetingsSection;