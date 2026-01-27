import React from 'react';
import { Box, Typography, Button, Chip, Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Add, FilterList, Search as SearchIcon } from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';

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
  return (
    <>
      <PageHeader
        title="Task Management"
        subtitle="Track, manage, and complete tasks efficiently"
        actionButton={{
          label: 'New Task',
          onClick: onCreateTask,
          icon: <Add />,
          gradient: true,
        }}
        // chips={[
        //   ...(isOnline ? [] : [{ label: 'Offline Mode', color: 'warning', variant: 'outlined' }]),
        //   ...(isTrial ? [{ label: 'Trial Plan', color: 'info', variant: 'outlined' }] : []),
        // ]}
      />

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
        }}>
          <TextField
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{
              flex: 1,
              minWidth: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
              },
            }}
            size="small"
          />

          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="in_review">In Review</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              size="small"
            >
              Filter
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};