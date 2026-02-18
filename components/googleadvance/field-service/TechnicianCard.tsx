// components/googleadvance/field-service/TechnicianCard.tsx

'use client';

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { Technician } from '../types';
import { googleColors } from '../common/GoogleColors';

interface TechnicianCardProps {
  technician: Technician;
  currentColors: any;
  isMobile?: boolean;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  currentColors,
  isMobile = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return googleColors.green;
      case 'busy': return googleColors.yellow;
      case 'on-break': return googleColors.blue;
      case 'offline': return googleColors.red;
      default: return currentColors.textSecondary;
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        background: currentColors.background,
        border: `1px solid ${currentColors.border}`,
        borderRadius: 2,
        mb: 2,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          <Badge
            color={
              technician.status === 'available' ? 'success' :
              technician.status === 'busy' ? 'warning' :
              technician.status === 'on-break' ? 'info' : 'error'
            }
            variant="dot"
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar sx={{ bgcolor: googleColors.blue }}>
              {technician.name?.split(' ').map(n => n[0]).join('') || '?'}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="body1" fontWeight="medium">
              {technician.name || 'Unknown Technician'}
            </Typography>
            <Typography variant="caption" color={currentColors.textSecondary}>
              {technician.specialization?.slice(0, 2).join(', ') || technician.department || 'General'}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {technician.totalJobsCompleted || 0}
            </Typography>
            <Typography variant="caption" color={currentColors.textSecondary}>
              Jobs
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {technician.rating?.toFixed(1) || 'N/A'}
            </Typography>
            <Typography variant="caption" color={currentColors.textSecondary}>
              Rating
            </Typography>
          </Box>
          
          <IconButton size="small" disabled>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>
      
      {/* Status Bar */}
      <Box sx={{ mt: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color={currentColors.textSecondary}>
            Status
          </Typography>
          <Chip
            label={technician.status}
            size="small"
            sx={{
              background: technician.status === 'available'
                ? `${googleColors.green}20`
                : technician.status === 'busy'
                ? `${googleColors.yellow}20`
                : technician.status === 'on-break'
                ? `${googleColors.blue}20`
                : `${googleColors.red}20`,
              color: getStatusColor(technician.status),
            }}
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={
            technician.status === 'available' ? 100 :
            technician.status === 'busy' ? 60 :
            technician.status === 'on-break' ? 30 : 0
          }
          sx={{
            height: 6,
            borderRadius: 3,
            background: currentColors.border,
            '& .MuiLinearProgress-bar': {
              background: getStatusColor(technician.status),
            },
          }}
        />
      </Box>
    </Paper>
  );
};