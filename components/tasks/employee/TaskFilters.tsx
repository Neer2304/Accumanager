import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

interface TaskFiltersProps {
  sortBy: string;
  filterPriority: string;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  sortBy,
  filterPriority,
  onSortChange,
  onFilterChange,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select value={sortBy} label="Sort By" onChange={(e) => onSortChange(e.target.value)}>
          <MenuItem value="dueDate">Due Date</MenuItem>
          <MenuItem value="priority">Priority</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={filterPriority}
          label="Priority"
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="urgent">Urgent</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};