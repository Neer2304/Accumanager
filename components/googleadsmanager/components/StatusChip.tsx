// components/googleadsmanager/components/StatusChip.tsx
import React from 'react';
import {
  Chip,
  useTheme
} from '@mui/material';

interface StatusChipProps {
  status: 'active' | 'paused' | 'completed';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return darkMode ? '#34a853' : '#34a853';
      case 'paused':
        return darkMode ? '#fbbc04' : '#f57c00';
      case 'completed':
        return darkMode ? '#9aa0a6' : '#5f6368';
      default:
        return darkMode ? '#9aa0a6' : '#5f6368';
    }
  };

  const getStatusBgColor = () => {
    switch (status) {
      case 'active':
        return darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)';
      case 'paused':
        return darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)';
      case 'completed':
        return darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)';
      default:
        return darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)';
    }
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: getStatusBgColor(),
        color: getStatusColor(),
        fontWeight: "medium",
        border: 'none',
        textTransform: 'capitalize',
      }}
    />
  );
};