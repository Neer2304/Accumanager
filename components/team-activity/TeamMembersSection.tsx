// components/team-activity/TeamMembersSection.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Task,
  MoreVert,
  FiberManualRecord,
  Add,
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { TeamMember } from './types';

interface TeamMembersSectionProps {
  teamMembers: TeamMember[];
  darkMode: boolean;
  onAddMember: () => void;
}

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  teamMembers,
  darkMode,
  onAddMember,
}) => {
  const [autoRefresh, setAutoRefresh] = useState(false);

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return '#34a853';
      case 'away': return '#fbbc04';
      case 'offline': return '#5f6368';
      default: return '#5f6368';
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
      title="Team Members"
      subtitle={`${teamMembers.length} total members • ${teamMembers.filter(m => m.status === 'active').length} active now`}
      action={
        <>
          <Chip
            label="Auto Refresh"
            size="small"
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: autoRefresh ? '#4285f4' : 'transparent',
              borderColor: '#3c4043',
              color: autoRefresh ? 'white' : darkMode ? '#e8eaed' : '#202124',
            }}
          />
          <Button
            variant="text"
            size="small"
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            iconRight={<MoreVert />}
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
        {teamMembers.map((member) => (
          <Box
            key={member.id}
            sx={{
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
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <FiberManualRecord 
                    sx={{ 
                      fontSize: 12,
                      color: getStatusColor(member.status),
                      bgcolor: darkMode ? '#202124' : '#ffffff',
                      borderRadius: '50%',
                    }}
                  />
                }
              >
                <Avatar
                  src={member.avatar}
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: '#4285f4',
                  }}
                >
                  {member.name.charAt(0)}
                </Avatar>
              </Badge>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {member.name}
                  </Typography>
                  <Chip
                    label={`${member.performance}%`}
                    size="small"
                    sx={{
                      backgroundColor: member.performance > 90 ? '#34a85320' : 
                                     member.performance > 80 ? '#fbbc0420' : '#ea433520',
                      color: member.performance > 90 ? '#34a853' : 
                            member.performance > 80 ? '#fbbc04' : '#ea4335',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1 }}>
                  {member.role}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {member.currentProjects.slice(0, 2).map((project, idx) => (
                    <Chip
                      key={idx}
                      label={project}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        borderColor: darkMode ? '#3c4043' : '#dadce0',
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    />
                  ))}
                  {member.currentProjects.length > 2 && (
                    <Chip
                      label={`+${member.currentProjects.length - 2}`}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      }}
                    />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Task fontSize="small" sx={{ color: darkMode ? '#5f6368' : '#9aa0a6' }} />
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      {member.tasksCompleted} tasks
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {formatTime(member.lastActive)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      
      <Button
        fullWidth
        variant="outlined"
        onClick={onAddMember}
        iconLeft={<Add />}
        sx={{
          mt: 3,
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          color: darkMode ? '#e8eaed' : '#202124',
        }}
      >
        Add New Team Member
      </Button>
    </Card>
  );
};

export default TeamMembersSection;