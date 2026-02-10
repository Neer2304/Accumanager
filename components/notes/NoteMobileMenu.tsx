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
import { NoteFilters, NoteStats } from '@/components/note/types';

interface NoteMobileMenuProps {
  open: boolean;
  onClose: () => void;
  filters: NoteFilters;
  onFiltersChange: (filters: Partial<NoteFilters>) => void;
  stats: NoteStats | null;
  darkMode?: boolean;
}

export const NoteMobileMenu: React.FC<NoteMobileMenuProps> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  stats,
  darkMode = false,
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

  // Helper function to safely update filters
  const handleFilterChange = (key: keyof NoteFilters, value: any) => {
    onFiltersChange({ 
      [key]: value,
      ...(key !== 'page' && { page: 1 }),
    });
  };

  // Safely get filter values
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

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 320,
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        <Typography 
          variant="h6" 
          fontWeight="bold"
          sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
        >
          Filters & Sort
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
        >
          <Close />
        </IconButton>
      </Box>

      <List sx={{ backgroundColor: darkMode ? '#202124' : '#ffffff' }}>
        {/* Search */}
        <ListItem>
          <TextField
            fullWidth
            placeholder="Search notes..."
            value={safeFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#5f6368' : '#5f6368',
                },
              },
            }}
            InputProps={{
              startAdornment: <Search fontSize="small" sx={{ 
                mr: 1, 
                color: darkMode ? '#9aa0a6' : '#5f6368' 
              }} />,
            }}
          />
        </ListItem>

        <Divider sx={{ my: 1, backgroundColor: darkMode ? '#3c4043' : '#dadce0' }} />

        {/* Category Filter */}
        <ListItem>
          <ListItemIcon>
            <Category fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Category" 
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          />
          <TextField
            select
            value={safeFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            size="small"
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              },
              '& .MuiSelect-icon': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            <MenuItem value="" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              All
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem 
                key={cat} 
                value={cat}
                sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </ListItem>

        {/* Priority Filter */}
        <ListItem>
          <ListItemIcon>
            <TrendingUp fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Priority" 
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          />
          <TextField
            select
            value={safeFilters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            size="small"
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              },
              '& .MuiSelect-icon': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            <MenuItem value="" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              All
            </MenuItem>
            {priorities.map((pri) => (
              <MenuItem 
                key={pri} 
                value={pri}
                sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}
              >
                {pri.charAt(0).toUpperCase() + pri.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </ListItem>

        {/* Status Filter */}
        <ListItem>
          <ListItemIcon>
            <FilterList fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Status" 
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          />
          <TextField
            select
            value={safeFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            size="small"
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
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
        </ListItem>

        <Divider sx={{ my: 1, backgroundColor: darkMode ? '#3c4043' : '#dadce0' }} />

        {/* Sort By */}
        <ListItem>
          <ListItemIcon>
            <Sort fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Sort By" 
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          />
          <TextField
            select
            value={safeFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            size="small"
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              },
              '& .MuiSelect-icon': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            <MenuItem value="updatedAt" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              Last Updated
            </MenuItem>
            <MenuItem value="createdAt" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              Date Created
            </MenuItem>
            <MenuItem value="title" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              Title
            </MenuItem>
            <MenuItem value="priority" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              Priority
            </MenuItem>
            <MenuItem value="category" sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff' }}>
              Category
            </MenuItem>
          </TextField>
        </ListItem>

        {/* Sort Order */}
        <ListItem>
          <ListItemIcon>
            <Timeline fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Order" 
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          />
          <TextField
            select
            value={safeFilters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            size="small"
            sx={{ 
              minWidth: 100,
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
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
        </ListItem>

        <Divider sx={{ my: 1, backgroundColor: darkMode ? '#3c4043' : '#dadce0' }} />

        {/* Stats */}
        {stats && (
          <ListItem>
            <Box sx={{ width: '100%' }}>
              <Typography 
                variant="subtitle2" 
                fontWeight="bold" 
                gutterBottom
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<Numbers />}
                  label={`${stats.totalNotes} notes`}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                  }}
                />
                <Chip
                  icon={<Timeline />}
                  label={`${stats.totalWords?.toLocaleString() || 0} words`}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                  }}
                />
                <Chip
                  icon={<Category />}
                  label={`${stats.categories?.length || 0} categories`}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                  }}
                />
              </Box>
            </Box>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};