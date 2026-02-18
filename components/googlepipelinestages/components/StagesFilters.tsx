// components/googlepipelinestages/components/StagesFilters.tsx
import React from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip as MuiChip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { STAGE_CATEGORIES, GOOGLE_COLORS } from '../constants';

interface StagesFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onRefresh: () => void;
  onAddClick: () => void;
}

export const StagesFilters: React.FC<StagesFiltersProps> = ({
  searchQuery,
  onSearchChange,
  onSearchClear,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  onAddClick
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Paper
      sx={{
        mb: 4,
        p: 2.5,
        bgcolor: darkMode ? '#2d2e30' : '#fff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: '16px',
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { md: 'center' },
        gap: 2
      }}>
        {/* Search */}
        <Box sx={{ flex: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search stages by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={onSearchClear}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
              },
            }}
          />
          <IconButton
            onClick={onRefresh}
            sx={{
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              borderRadius: '50%',
              width: 40,
              height: 40
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Filters */}
        <Box sx={{
          display: 'flex',
          gap: 1.5,
          flexWrap: 'wrap'
        }}>
          {/* Category Filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: 140,
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
              }
            }}
          >
            <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Category
            </InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => onCategoryFilterChange(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {STAGE_CATEGORIES.map(cat => (
                <MenuItem key={cat.value} value={cat.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color }} />
                    {cat.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
              }
            }}
          >
            <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Status
            </InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{
              borderRadius: '24px',
              bgcolor: GOOGLE_COLORS.green,
              '&:hover': { bgcolor: '#2d9248' },
              px: 3,
              whiteSpace: 'nowrap'
            }}
          >
            Add Stage
          </Button>
        </Box>
      </Box>

      {/* Active Filters */}
      {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {searchQuery && (
            <MuiChip
              label={`Search: ${searchQuery}`}
              onDelete={onSearchClear}
              size="small"
            />
          )}
          {categoryFilter !== 'all' && (
            <MuiChip
              label={`Category: ${STAGE_CATEGORIES.find(c => c.value === categoryFilter)?.label}`}
              onDelete={() => onCategoryFilterChange('all')}
              size="small"
            />
          )}
          {statusFilter !== 'all' && (
            <MuiChip
              label={`Status: ${statusFilter === 'active' ? 'Active' : 'Inactive'}`}
              onDelete={() => onStatusFilterChange('all')}
              size="small"
            />
          )}
        </Box>
      )}
    </Paper>
  );
};