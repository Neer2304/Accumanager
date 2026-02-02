// components/team/TeamMemberCard.tsx
"use client";

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';
import { TeamMember } from '@/types/teamActivity';
import { formatTime } from '@/utils/dateFormatter';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

interface TeamMemberCardProps {
  member: TeamMember;
  onClick?: (member: TeamMember) => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onClick }) => {
  const theme = useTheme();

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'away': return theme.palette.warning.main;
      case 'offline': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        transition: 'all 0.3s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick && {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[2],
          transform: 'translateY(-2px)',
        },
      }}
      onClick={() => onClick?.(member)}
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
                bgcolor: 'white',
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
              bgcolor: theme.palette.primary.main,
            }}
          >
            {member.name.charAt(0)}
          </Avatar>
        </Badge>
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {member.name}
            </Typography>
            <Chip
              label={`${member.performance}%`}
              size="small"
              color={member.performance > 90 ? 'success' : member.performance > 80 ? 'warning' : 'error'}
              sx={{ fontWeight: 600 }}
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {member.role}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            {member.currentProjects.map((project, idx) => (
              <Chip
                key={idx}
                label={project}
                size="small"
                variant="outlined"
                sx={{ height: 24, fontSize: '0.75rem' }}
              />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title="Tasks completed">
              <Typography variant="caption" color="text.secondary">
                {member.tasksCompleted} tasks
              </Typography>
            </Tooltip>
            <Tooltip title="Last active">
              <Typography variant="caption" color="text.secondary">
                {formatTime(member.lastActive)}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};