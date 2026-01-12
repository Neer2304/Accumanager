import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, opacity: 0.5 }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};