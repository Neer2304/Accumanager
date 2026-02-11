import React from 'react';
import {
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories?: Array<{ value: string; label: string }>;
  onClearFilters: () => void;
  additionalFilters?: React.ReactNode;
  darkMode?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  searchPlaceholder = 'Search products...',
  categoryFilter,
  onCategoryChange,
  categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'beauty', label: 'Beauty & Health' },
  ],
  onClearFilters,
  additionalFilters,
  darkMode = false,
}) => {
  return (
    <Paper sx={{ 
      p: 2, 
      mb: 3,
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', md: 'center' },
      }}>
        {/* Search Field */}
        <Box sx={{ flex: { xs: '1 1 100%', md: 6 } }}>
          <TextField
            fullWidth
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                '&:hover': {
                  borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                },
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#e8eaed' : '#202124',
              },
            }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }} />,
            }}
          />
        </Box>
        
        {/* Category Filter */}
        <Box sx={{ flex: { xs: '1 1 100%', md: 3 } }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => onCategoryChange(e.target.value)}
              sx={{
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                }
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* Additional Filters */}
        {additionalFilters && (
          <Box sx={{ flex: { xs: '1 1 100%', md: 3 } }}>
            {additionalFilters}
          </Box>
        )}
        
        {/* Clear Filters Button */}
        <Box sx={{ 
          flex: { xs: '1 1 100%', md: additionalFilters ? 0 : 3 },
          minWidth: { xs: '100%', md: 'auto' }
        }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Clear />}
            onClick={onClearFilters}
            disabled={!search && !categoryFilter}
            sx={{
              borderRadius: '8px',
              borderWidth: 2,
              borderColor: darkMode ? '#5f6368' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': { 
                borderWidth: 2,
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              },
              '&.Mui-disabled': {
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#5f6368' : '#9aa0a6',
              },
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductFilters;