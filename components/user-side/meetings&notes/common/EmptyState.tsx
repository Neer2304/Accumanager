// app/components/user-side/meetings&notes/common/EmptyState.tsx
"use client";

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon,
  title,
  description,
  actionLabel,
  onAction 
}: EmptyStateProps) {
  return (
    <Box sx={{ 
      textAlign: 'center', 
      py: 8,
      px: 2
    }}>
      {icon && (
        <Box sx={{ mb: 2 }}>
          {icon}
        </Box>
      )}
      
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
      
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}