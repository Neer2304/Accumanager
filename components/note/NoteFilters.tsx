import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  Sort,
  Category,
  Label,
  TrendingUp,
} from '@mui/icons-material';
import { NoteFilters as NoteFiltersType } from './types';

interface NoteFiltersProps {
  filters: NoteFiltersType;
  onFiltersChange: (filters: Partial<NoteFiltersType>) => void;
  sx?: any;
}

export const NoteFilters: React.FC<NoteFiltersProps> = ({
  filters,
  onFiltersChange,
  sx,
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

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      tag: '',
      priority: '',
      status: 'active',
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = 
    filters.search ||
    filters.category ||
    filters.tag ||
    filters.priority ||
    filters.status !== 'active' ||
    filters.sortBy !== 'updatedAt';

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        ...sx,
      }}
    >
      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search notes..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value, page: 1 })}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onFiltersChange({ search: '' })}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <TextField
            select
            label="Category"
            value={filters.category}
            onChange={(e) => onFiltersChange({ category: e.target.value, page: 1 })}
            size="small"
            sx={{ minWidth: 120 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Category fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          {/* Priority Filter */}
          <TextField
            select
            label="Priority"
            value={filters.priority}
            onChange={(e) => onFiltersChange({ priority: e.target.value, page: 1 })}
            size="small"
            sx={{ minWidth: 120 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TrendingUp fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All Priorities</MenuItem>
            {priorities.map((pri) => (
              <MenuItem key={pri} value={pri}>
                {pri.charAt(0).toUpperCase() + pri.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          {/* Status Filter */}
          <TextField
            select
            label="Status"
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

          {/* Sort By */}
          <TextField
            select
            label="Sort By"
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
            size="small"
            sx={{ minWidth: 120 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Sort fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="updatedAt">Last Updated</MenuItem>
            <MenuItem value="createdAt">Date Created</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="category">Category</MenuItem>
          </TextField>

          {/* Sort Order */}
          <TextField
            select
            label="Order"
            value={filters.sortOrder}
            onChange={(e) => onFiltersChange({ sortOrder: e.target.value as any })}
            size="small"
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
          </TextField>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <IconButton
                size="small"
                onClick={handleClearFilters}
                sx={{
                  alignSelf: 'center',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Clear />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filters.search && (
            <Chip
              label={`Search: ${filters.search}`}
              size="small"
              onDelete={() => onFiltersChange({ search: '' })}
            />
          )}
          {filters.category && (
            <Chip
              label={`Category: ${filters.category}`}
              size="small"
              onDelete={() => onFiltersChange({ category: '' })}
            />
          )}
          {filters.priority && (
            <Chip
              label={`Priority: ${filters.priority}`}
              size="small"
              onDelete={() => onFiltersChange({ priority: '' })}
            />
          )}
          {filters.status !== 'active' && (
            <Chip
              label={`Status: ${filters.status}`}
              size="small"
              onDelete={() => onFiltersChange({ status: 'active' })}
            />
          )}
        </Box>
      )}
    </Paper>
  );
};