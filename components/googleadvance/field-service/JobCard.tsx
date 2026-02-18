// components/googleadvance/field-service/JobCard.tsx

'use client';

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import {
  NavigateNext,
  Build,
  Settings,
  Computer,
  LocalShipping,
  Assignment,
} from '@mui/icons-material';
import { FieldVisit } from '../types';
import { googleColors, getPriorityColor, getStatusColor } from '../common/GoogleColors';
import { format, parseISO } from 'date-fns';

interface JobCardProps {
  job: FieldVisit;
  currentColors: any;
  isMobile?: boolean;
  onClick?: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  currentColors,
  isMobile = false,
  onClick,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'installation': return <Build fontSize="small" />;
      case 'repair': return <Settings fontSize="small" />;
      case 'maintenance': return <Computer fontSize="small" />;
      case 'delivery': return <LocalShipping fontSize="small" />;
      default: return <Assignment fontSize="small" />;
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      completed: <Done fontSize="small" />,
      'in-progress': <DirectionsRun fontSize="small" />,
      scheduled: <Schedule fontSize="small" />,
      pending: <Pending fontSize="small" />,
      cancelled: <Cancel fontSize="small" />,
    };
    return icons[status] || <Error fontSize="small" />;
  };

  return (
    <Paper
      sx={{
        p: 2,
        background: currentColors.background,
        border: `1px solid ${currentColors.border}`,
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': {
          borderColor: googleColors.blue,
        },
        mb: 2,
      }}
      onClick={() => onClick?.(job._id)}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {job.title}
          </Typography>
          <Typography variant="caption" color={currentColors.textSecondary}>
            {job.customerName}
          </Typography>
        </Box>
        
        <Chip
          label={job.priority}
          size="small"
          sx={{
            background: `${getPriorityColor(job.priority)}20`,
            color: getPriorityColor(job.priority),
          }}
        />
      </Box>
      
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            icon={getStatusIcon(job.status)}
            label={job.status.replace('-', ' ')}
            size="small"
            variant="outlined"
            sx={{
              borderColor: getStatusColor(job.status),
              color: getStatusColor(job.status),
            }}
          />
          <Typography variant="caption" color={currentColors.textSecondary}>
            {format(parseISO(job.scheduledDate), 'MMM d, h:mm a')}
          </Typography>
        </Box>
        
        <IconButton size="small" disabled>
          <NavigateNext />
        </IconButton>
      </Box>
    </Paper>
  );
};

// Missing imports
import { Done, DirectionsRun, Schedule, Pending, Cancel, Error } from '@mui/icons-material';