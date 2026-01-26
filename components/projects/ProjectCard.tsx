import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  LinearProgress,
  AvatarGroup,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import { MoreVert, People } from '@mui/icons-material';

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    description: string;
    status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled' | 'delayed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    progress: number;
    deadline: string;
    budget: number;
    clientName: string;
    category: 'sales' | 'marketing' | 'development' | 'internal' | 'client' | 'other';
    teamMembers: string[];
    isLocal?: boolean;
    isSynced?: boolean;
  };
  onMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
  getStatusColor: (s: string) => any;
  getPriorityColor: (p: string) => any;
  getCategoryIcon: (c: string) => React.ReactNode;
  formatDate: (d: string) => string;
  getDaysRemaining: (d: string) => number;
  isOnline: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onMenuOpen,
  getStatusColor,
  getPriorityColor,
  getCategoryIcon,
  formatDate,
  getDaysRemaining,
  isOnline,
}) => {
  const daysLeft = getDaysRemaining(project.deadline);
  const isOverdue = daysLeft < 0;
  const isSoon = daysLeft <= 7 && daysLeft >= 0;

  return (
    <Card sx={{
      borderRadius: 3,
      boxShadow: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: '0.3s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
      border: project.isLocal && !project.isSynced ? '2px dashed #ff9800' : 'none',
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>{project.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {project.description || 'No description'}
            </Typography>
          </Box>
          <IconButton onClick={onMenuOpen} size="small"><MoreVert /></IconButton>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          <Chip label={project.status} color={getStatusColor(project.status)} size="small" />
          <Chip label={project.priority} color={getPriorityColor(project.priority)} variant="outlined" size="small" />
          <Chip label={project.category} size="small" />
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2" fontWeight="bold">{project.progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={project.progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">Deadline</Typography>
            <Typography variant="body2" fontWeight="medium">{formatDate(project.deadline)}</Typography>
            <Chip 
              label={isOverdue ? 'Overdue' : `${daysLeft} days left`} 
              size="small" 
              color={isOverdue ? 'error' : isSoon ? 'warning' : 'default'} 
              sx={{ mt: 0.5 }} 
            />
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">Budget</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">${project.budget.toLocaleString()}</Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary">Client</Typography>
            <Typography variant="body2">{project.clientName || 'No client'}</Typography>
          </Box>
          
          {project.teamMembers.length > 0 && (
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
              {project.teamMembers.slice(0, 3).map((member, i) => (
                <Tooltip key={i} title={member}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {member.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};