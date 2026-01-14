import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface MobileFiltersProps {
  open: boolean;
  onClose: () => void;
  sortBy: string;
  filterPriority: string;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
}

export const MobileFilters: React.FC<MobileFiltersProps> = ({
  open,
  onClose,
  sortBy,
  filterPriority,
  onSortChange,
  onFilterChange,
  stats,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 320,
          p: 2,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Filters & Sort
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
      <List>
        <ListItem>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={(e) => onSortChange(e.target.value)}>
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={filterPriority}
              label="Priority"
              onChange={(e) => onFilterChange(e.target.value)}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <span>Total</span>
              <span>{stats.total}</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <span>Completed</span>
              <span color="success.main">
                {stats.completed}
              </span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Overdue</span>
              <span  color="error.main">
                {stats.overdue}
              </span>
            </Box>
          </Typography>
        </ListItem>
      </List>
    </Drawer>
  );
};