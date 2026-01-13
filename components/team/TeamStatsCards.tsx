import React from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Chip,
  AvatarGroup,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Person,
  TrendingUp,
  Computer,
  AccessTime,
  CheckCircle,
} from '@mui/icons-material';
import { TeamMember } from './TeamMemberCard';

interface TeamStatsCardsProps {
  members: TeamMember[];
  totalActivities?: number;
  activeProjects?: number;
  completionRate?: number;
}

export const TeamStatsCards: React.FC<TeamStatsCardsProps> = ({
  members,
  totalActivities = 0,
  activeProjects = 0,
  completionRate = 0,
}) => {
  const activeMembers = members.filter(m => m.status === 'active').length;
  const awayMembers = members.filter(m => m.status === 'away').length;
  const offlineMembers = members.filter(m => m.status === 'offline').length;

  const stats = [
    {
      title: 'Team Members',
      value: members.length,
      icon: Person,
      color: '#3b82f6',
      subItems: [
        { label: 'Active', value: activeMembers, color: '#10b981' },
        { label: 'Away', value: awayMembers, color: '#f59e0b' },
        { label: 'Offline', value: offlineMembers, color: '#6b7280' },
      ]
    },
    {
      title: 'Activities',
      value: totalActivities,
      icon: TrendingUp,
      color: '#8b5cf6',
      subText: 'Today',
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: Computer,
      color: '#10b981',
      subText: 'In progress',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: CheckCircle,
      color: '#f59e0b',
      progress: completionRate,
    },
  ];

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
      },
      gap: 2,
      mb: 3
    }}>
      {stats.map((stat, index) => (
        <Paper
          key={index}
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            border: theme => `1px solid ${theme.palette.divider}`,
            background: theme => theme.palette.background.paper,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: '50%',
                bgcolor: stat.color + '20',
                color: stat.color,
                mr: 1.5,
              }}
            >
              <stat.icon />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </Box>
          </Box>

          {stat.subItems && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {stat.subItems.map((item, idx) => (
                <Chip
                  key={idx}
                  label={`${item.label}: ${item.value}`}
                  size="small"
                  sx={{
                    bgcolor: item.color + '20',
                    color: item.color,
                    fontSize: '0.7rem',
                    height: 24,
                  }}
                />
              ))}
            </Box>
          )}

          {stat.subText && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {stat.subText}
            </Typography>
          )}

          {stat.progress !== undefined && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={stat.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'action.disabledBackground',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: stat.color,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {stat.progress}% completed
              </Typography>
            </Box>
          )}

          {/* Avatar group for team members */}
          {index === 0 && members.length > 0 && (
            <AvatarGroup 
              max={4} 
              sx={{ 
                mt: 2,
                '& .MuiAvatar-root': {
                  width: 28,
                  height: 28,
                  fontSize: '0.8rem',
                }
              }}
            >
              {members.slice(0, 5).map((member) => (
                <Tooltip key={member._id} title={member.name}>
                  <Avatar src={member.avatar}>
                    {member.name.charAt(0)}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          )}
        </Paper>
      ))}
    </Box>
  );
};