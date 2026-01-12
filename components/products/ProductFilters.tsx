import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Search, FilterList, Clear } from '@mui/icons-material';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories?: Array<{ value: string; label: string }>;
  onClearFilters: () => void;
  additionalFilters?: React.ReactNode;
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
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {additionalFilters && (
          <Grid item xs={12} md={3}>
            {additionalFilters}
          </Grid>
        )}
        
        <Grid item xs={12} md={additionalFilters ? 0 : 3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Clear />}
            onClick={onClearFilters}
            disabled={!search && !categoryFilter}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductFilters;