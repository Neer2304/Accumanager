import React from 'react';
import { Box, Typography, Button, Paper, alpha, useTheme } from '@mui/material';
import { Add, SearchOff, Inbox } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle = 'No data available',
  icon,
  actionLabel = 'Add New',
  onAction,
  showAction = false,
}) => {
  const theme = useTheme();

  const defaultIcon = icon || <Inbox sx={{ fontSize: 64 }} />;

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 2,
        border: `2px dashed ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.5),
        maxWidth: 500,
        mx: 'auto',
      }}
      elevation={0}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          mx: 'auto',
          mb: 3,
          color: theme.palette.primary.main,
        }}
      >
        {defaultIcon}
      </Box>
      
      <Typography variant="h6" gutterBottom color="text.primary" fontWeight="medium">
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 300, mx: 'auto' }}>
        {subtitle}
      </Typography>
      
      {showAction && onAction && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAction}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};