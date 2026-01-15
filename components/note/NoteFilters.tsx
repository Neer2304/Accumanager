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
  Category,
  TrendingUp,
} from '@mui/icons-material';
import { NoteFilters as NoteFiltersType, NOTE_CATEGORIES, getPriorityLabel } from './types';

interface NoteFiltersProps {
  filters: NoteFiltersType;
  onFiltersChange: (filters: Partial<NoteFiltersType>) => void;
  sx?: any;
}

export const NotesFilters: React.FC<NoteFiltersProps> = ({
  filters,
  onFiltersChange,
  sx,
}) => {
  const theme = useTheme();

  const priorities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  const statuses = ['active', 'draft', 'archived'] as const;
  const sortOptions = [
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' },
    { value: 'category', label: 'Category' },
    { value: 'wordCount', label: 'Word Count' },
    { value: 'readCount', label: 'Read Count' },
  ];

  // Ensure filter values are never undefined
  const safeFilters = {
    search: filters.search || '',
    category: filters.category || '',
    tag: filters.tag || '',
    priority: filters.priority || '',
    status: filters.status || 'active',
    sortBy: filters.sortBy || 'updatedAt',
    sortOrder: filters.sortOrder || 'desc',
    page: filters.page || 1,
    limit: filters.limit || 20,
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      tag: '',
      priority: '',
      status: 'active',
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      page: 1,
    });
  };

  const handleFilterChange = (key: keyof typeof safeFilters, value: any) => {
    onFiltersChange({ 
      [key]: value,
      ...(key !== 'page' && { page: 1 }), // Reset to first page when filters change (except page itself)
    });
  };

  const hasActiveFilters = 
    safeFilters.search ||
    safeFilters.category ||
    safeFilters.tag ||
    safeFilters.priority ||
    safeFilters.status !== 'active' ||
    safeFilters.sortBy !== 'updatedAt';

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        ...sx,
      }}
    >
      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search notes by title, content, or tags..."
          value={safeFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: safeFilters.search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleFilterChange('search', '')}
                  edge="end"
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
            value={safeFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Category fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {NOTE_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          {/* Priority Filter */}
          <TextField
            select
            label="Priority"
            value={safeFilters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
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
                {getPriorityLabel(pri)}
              </MenuItem>
            ))}
          </TextField>

          {/* Status Filter */}
          <TextField
            select
            label="Status"
            value={safeFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
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
            value={safeFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Sort Order */}
          <TextField
            select
            label="Order"
            value={safeFilters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
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
                  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    borderColor: theme.palette.error.main,
                  },
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
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary', mr: 1 }}>
            Active filters:
          </Box>
          {safeFilters.search && (
            <Chip
              label={`Search: "${safeFilters.search}"`}
              size="small"
              onDelete={() => handleFilterChange('search', '')}
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color: theme.palette.primary.dark,
                  }
                }
              }}
            />
          )}
          {safeFilters.category && (
            <Chip
              label={`Category: ${safeFilters.category}`}
              size="small"
              onDelete={() => handleFilterChange('category', '')}
              sx={{ 
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    color: theme.palette.secondary.dark,
                  }
                }
              }}
            />
          )}
          {safeFilters.priority && (
            <Chip
              label={`Priority: ${getPriorityLabel(safeFilters.priority as any)}`}
              size="small"
              onDelete={() => handleFilterChange('priority', '')}
              sx={{ 
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.warning.main,
                  '&:hover': {
                    color: theme.palette.warning.dark,
                  }
                }
              }}
            />
          )}
          {safeFilters.status !== 'active' && (
            <Chip
              label={`Status: ${safeFilters.status.charAt(0).toUpperCase() + safeFilters.status.slice(1)}`}
              size="small"
              onDelete={() => handleFilterChange('status', 'active')}
              sx={{ 
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.info.main,
                  '&:hover': {
                    color: theme.palette.info.dark,
                  }
                }
              }}
            />
          )}
          {safeFilters.sortBy !== 'updatedAt' && (
            <Chip
              label={`Sorted by: ${sortOptions.find(opt => opt.value === safeFilters.sortBy)?.label || safeFilters.sortBy}`}
              size="small"
              onDelete={() => handleFilterChange('sortBy', 'updatedAt')}
              sx={{ 
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.success.main,
                  '&:hover': {
                    color: theme.palette.success.dark,
                  }
                }
              }}
            />
          )}
        </Box>
      )}
    </Paper>
  );
};