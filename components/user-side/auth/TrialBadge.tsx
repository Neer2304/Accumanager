import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { RocketLaunch } from '@mui/icons-material';

interface TrialBadgeProps {
  days?: number;
  position?: 'top' | 'side';
}

const TrialBadge: React.FC<TrialBadgeProps> = ({
  days = 14,
  position = 'top',
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: position === 'top' ? 'absolute' : 'relative',
        top: position === 'top' ? -20 : 'auto',
        left: position === 'top' ? '50%' : 'auto',
        transform: position === 'top' ? 'translateX(-50%)' : 'none',
        px: 3,
        py: 1,
        borderRadius: 20,
        bgcolor: 'success.main',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <RocketLaunch sx={{ fontSize: 18 }} />
      {days}-Day Free Trial
    </Paper>
  );
};

export default TrialBadge;