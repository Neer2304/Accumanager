import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  MenuItem,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Close,
  Search,
  Category,
  Label,
  TrendingUp,
  Sort,
  FilterList,
  Numbers,
  Timeline,
} from '@mui/icons-material';
import { NoteFilters, NoteStats } from './types';

interface NoteMobileMenuProps {
  open: boolean;
  onClose: () => void;
  filters: NoteFilters;
  onFiltersChange: (filters: Partial<NoteFilters>) => void;
  stats: NoteStats | null;
}

export const NoteMobileMenu: React.FC<NoteMobileMenuProps> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  stats,
}) => {
  const theme = useTheme();

  const categories = [
    'general',
    'personal',
    'work',
    'ideas',
    'todo',
    'reference',
    'journal',
    'meeting',
    'project',
  ];

  const priorities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['active', 'draft', 'archived'];

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
        {/* Search */}
        <ListItem>
          <TextField
            fullWidth
            placeholder="Search notes..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value, page: 1 })}
            size="small"
            InputProps={{
              startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Category Filter */}
        <ListItem>
          <ListItemIcon>
            <Category fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Category" />
          <TextField
            select
            value={filters.category}
            onChange={(e) => onFiltersChange({ category: e.target.value, page: 1 })}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </ListItem>

        {/* Priority Filter */}
        <ListItem>
          <ListItemIcon>
            <TrendingUp fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Priority" />
          <TextField
            select
            value={filters.priority}
            onChange={(e) => onFiltersChange({ priority: e.target.value, page: 1 })}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            {priorities.map((pri) => (
              <MenuItem key={pri} value={pri}>
                {pri.charAt(0).toUpperCase() + pri.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </ListItem>

        {/* Status Filter */}
        <ListItem>
          <ListItemIcon>
            <FilterList fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Status" />
          <TextField
            select
            value={filters.status}
            onChange={(e) => onFiltersChange({ status: e.target.value, page: 1 })}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {statuses.map((stat) => (
              <MenuItem key={stat} value={stat}>
                {stat.charAt(0).toUpperCase() + stat.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Sort By */}
        <ListItem>
          <ListItemIcon>
            <Sort fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sort By" />
          <TextField
            select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="updatedAt">Last Updated</MenuItem>
            <MenuItem value="createdAt">Date Created</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="category">Category</MenuItem>
          </TextField>
        </ListItem>

        {/* Sort Order */}
        <ListItem>
          <ListItemIcon>
            <Timeline fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Order" />
          <TextField
            select
            value={filters.sortOrder}
            onChange={(e) => onFiltersChange({ sortOrder: e.target.value as any })}
            size="small"
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
          </TextField>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Stats */}
        {stats && (
          <ListItem>
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<Numbers />}
                  label={`${stats.totalNotes} notes`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<Timeline />}
                  label={`${stats.totalWords?.toLocaleString() || 0} words`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<Category />}
                  label={`${stats.categories?.length || 0} categories`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};