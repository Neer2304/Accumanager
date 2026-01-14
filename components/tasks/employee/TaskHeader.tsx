import React from 'react';
import { Box, Typography, Button, Badge, IconButton } from '@mui/material';
import { Assignment, Update, FilterList } from '@mui/icons-material';

interface TaskHeaderProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    assigned: number;
  };
  isMobile: boolean;
  onRefresh: () => void;
  onOpenFilters: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  stats,
  isMobile,
  onRefresh,
  onOpenFilters,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Assignment sx={{ fontSize: isMobile ? 24 : 32, color: 'primary.main' }} />
          <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" fontWeight="bold">
            My Tasks
          </Typography>
          <Badge badgeContent={stats.total} color="primary" sx={{ ml: 1 }} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Track and update your assigned tasks
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {isMobile && (
          <IconButton
            onClick={onOpenFilters}
            size="small"
            sx={{
              border: 1,
              borderColor: 'divider',
            }}
          >
            <FilterList />
          </IconButton>
        )}

        <Button
          variant="contained"
          startIcon={<Update />}
          onClick={onRefresh}
          size={isMobile ? 'medium' : 'large'}
          fullWidth={isMobile}
          sx={{
            minHeight: isMobile ? 44 : 48,
            whiteSpace: 'nowrap',
            flex: { xs: 1, sm: 'none' },
          }}
        >
          {isMobile ? 'Refresh' : 'Refresh Tasks'}
        </Button>
      </Box>
    </Box>
  );
};