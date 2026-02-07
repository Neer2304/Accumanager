// components/tasks/TasksHeader.tsx - Optional, you can remove if not needed
"use client";

import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Chip } from '@/components/ui/Chip';

interface TasksHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusFilterChange: (value: string) => void;
  onCreateTask: () => void;
  totalTasks: number;
  isOnline: boolean;
  isTrial?: boolean;
}

export const TasksHeader: React.FC<TasksHeaderProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusFilterChange,
  onCreateTask,
  totalTasks,
  isOnline,
  isTrial = false,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Card
      title="Task Management"
      subtitle={`${totalTasks} total tasks`}
      action={
        <Button
          variant="contained"
          onClick={onCreateTask}
          size="medium"
          sx={{ 
            backgroundColor: '#34a853',
            '&:hover': { backgroundColor: '#2d9248' }
          }}
        >
          New Task
        </Button>
      }
      hover
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' },
        mt: 2,
      }}>
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Select
            size="small"
            label="Status"
            value={filterStatus}
            onChange={(e: any) => onStatusFilterChange(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'todo', label: 'To Do' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'in_review', label: 'In Review' },
              { value: 'completed', label: 'Completed' },
              { value: 'blocked', label: 'Blocked' },
            ]}
            sx={{ minWidth: 140 }}
          />
        </Box>
      </Box>
    </Card>
  );
};