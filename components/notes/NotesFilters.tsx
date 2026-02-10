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
import { NoteFilters as NoteFiltersType, NOTE_CATEGORIES, getPriorityLabel } from '@/components/note/types';

interface NoteFiltersProps {
  filters: NoteFiltersType;
  onFiltersChange: (filters: Partial<NoteFiltersType>) => void;
  sx?: any;
  darkMode?: boolean; // Added from page
}

export const NotesFilters: React.FC<NoteFiltersProps> = ({
  filters,
  onFiltersChange,
  sx,
  darkMode = false,
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
      ...(key !== 'page' && { page: 1 }),
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
        borderRadius: '12px',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        background: darkMode ? '#303134' : '#ffffff',
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
          sx={{ 
            flex: 1, 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                borderColor: darkMode ? '#5f6368' : '#5f6368',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              </InputAdornment>
            ),
            endAdornment: safeFilters.search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleFilterChange('search', '')}
                  edge="end"
                  sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
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
            sx={{ 
              minWidth: 140,
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
              '& .MuiSelect-icon': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Category fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              All Categories
            </MenuItem>
            {NOTE_CATEGORIES.map((cat) => (
              <MenuItem 
                key={cat} 
                value={cat}
                sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}
              >
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
            sx={{ 
              minWidth: 140,
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
              '& .MuiSelect-icon': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TrendingUp fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              All Priorities
            </MenuItem>
            {priorities.map((pri) => (
              <MenuItem 
                key={pri} 
                value={pri}
                sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}
              >
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
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
              '& .MuiSelect-icon': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            {statuses.map((stat) => (
              <MenuItem 
                key={stat} 
                value={stat}
                sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}
              >
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
            sx={{ 
              minWidth: 160,
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
              '& .MuiSelect-icon': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}
              >
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
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
              '& .MuiSelect-icon': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            <MenuItem value="desc" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              Descending
            </MenuItem>
            <MenuItem value="asc" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              Ascending
            </MenuItem>
          </TextField>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <IconButton
                size="small"
                onClick={handleClearFilters}
                sx={{
                  alignSelf: 'center',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    backgroundColor: alpha('#ea4335', 0.1),
                    borderColor: '#ea4335',
                    color: '#ea4335',
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
          <Box 
            component="span" 
            sx={{ 
              fontSize: '0.875rem', 
              color: darkMode ? '#9aa0a6' : '#5f6368', 
              mr: 1 
            }}
          >
            Active filters:
          </Box>
          {safeFilters.search && (
            <Chip
              label={`Search: "${safeFilters.search}"`}
              size="small"
              onDelete={() => handleFilterChange('search', '')}
              sx={{ 
                backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
                color: darkMode ? '#8ab4f8' : '#4285f4',
                border: `1px solid ${darkMode ? alpha('#4285f4', 0.3) : alpha('#4285f4', 0.2)}`,
                '& .MuiChip-deleteIcon': {
                  color: darkMode ? '#8ab4f8' : '#4285f4',
                  '&:hover': {
                    color: darkMode ? '#5e97f6' : '#3367d6',
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
                backgroundColor: darkMode ? alpha('#0f9d58', 0.2) : alpha('#0f9d58', 0.1),
                color: darkMode ? '#81c995' : '#0f9d58',
                border: `1px solid ${darkMode ? alpha('#0f9d58', 0.3) : alpha('#0f9d58', 0.2)}`,
                '& .MuiChip-deleteIcon': {
                  color: darkMode ? '#81c995' : '#0f9d58',
                  '&:hover': {
                    color: darkMode ? '#5bbd79' : '#0a7d48',
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
                backgroundColor: darkMode ? alpha('#fbbc04', 0.2) : alpha('#fbbc04', 0.1),
                color: darkMode ? '#fdd663' : '#fbbc04',
                border: `1px solid ${darkMode ? alpha('#fbbc04', 0.3) : alpha('#fbbc04', 0.2)}`,
                '& .MuiChip-deleteIcon': {
                  color: darkMode ? '#fdd663' : '#fbbc04',
                  '&:hover': {
                    color: darkMode ? '#fbcb43' : '#f9ab00',
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
                backgroundColor: darkMode ? alpha('#9aa0a6', 0.2) : alpha('#9aa0a6', 0.1),
                color: darkMode ? '#c4c7c5' : '#5f6368',
                border: `1px solid ${darkMode ? alpha('#9aa0a6', 0.3) : alpha('#9aa0a6', 0.2)}`,
                '& .MuiChip-deleteIcon': {
                  color: darkMode ? '#c4c7c5' : '#5f6368',
                  '&:hover': {
                    color: darkMode ? '#a8aaab' : '#3c4043',
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
                backgroundColor: darkMode ? alpha('#ea4335', 0.2) : alpha('#ea4335', 0.1),
                color: darkMode ? '#f28b82' : '#ea4335',
                border: `1px solid ${darkMode ? alpha('#ea4335', 0.3) : alpha('#ea4335', 0.2)}`,
                '& .MuiChip-deleteIcon': {
                  color: darkMode ? '#f28b82' : '#ea4335',
                  '&:hover': {
                    color: darkMode ? '#ed6e65' : '#d23c32',
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