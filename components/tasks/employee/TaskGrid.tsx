import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add, Assignment } from '@mui/icons-material';
import { TaskCard } from './TaskCard';
import { EmployeeTask } from './types';

interface TaskGridProps {
  tasks: EmployeeTask[];
  isMobile: boolean;
  onUpdateClick: (task: EmployeeTask) => void;
  onRefresh: () => void;
  selectedTab: number;
}

export const TaskGrid: React.FC<TaskGridProps> = ({
  tasks,
  isMobile,
  onUpdateClick,
  onRefresh,
  selectedTab,
}) => {
  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 6, sm: 8 },
          px: 2,
        }}
      >
        <Assignment
          sx={{
            fontSize: { xs: 48, sm: 64 },
            color: 'text.secondary',
            mb: 2,
            opacity: 0.5,
          }}
        />
        <Typography variant={isMobile ? 'h6' : 'h5'} color="text.secondary" gutterBottom>
          No tasks found
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}
        >
          You don't have any{' '}
          {selectedTab === 1
            ? 'assigned'
            : selectedTab === 2
            ? 'in progress'
            : selectedTab === 3
            ? 'completed'
            : ''}{' '}
          tasks at the moment.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={onRefresh}
          size={isMobile ? 'medium' : 'large'}
        >
          Refresh Tasks
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        },
        gap: { xs: 2, sm: 3 },
        mb: 3,
      }}
    >
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          isMobile={isMobile}
          onUpdateClick={onUpdateClick}
        />
      ))}
    </Box>
  );
};