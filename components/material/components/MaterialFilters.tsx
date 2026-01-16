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
  FormControlLabel,
  Switch,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import {
  Search,
  Clear,
  Category,
  TrendingUp,
  FilterList,
  Download,
  Upload,
  LowPriority,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { 
  MaterialFilters as MaterialFiltersType, 
  MATERIAL_CATEGORIES, 
  getStatusLabel 
} from '../types/material.types';

interface MaterialFiltersProps {
  filters: MaterialFiltersType;
  onFiltersChange: (filters: Partial<MaterialFiltersType>) => void;
  onExport?: () => void;
  onImport?: () => void;
  sx?: any;
}

export const MaterialFilters: React.FC<MaterialFiltersProps> = ({
  filters,
  onFiltersChange,
  onExport,
  onImport,
  sx,
}) => {
  const theme = useTheme();

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'discontinued', label: 'Discontinued' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'sku', label: 'SKU' },
    { value: 'currentStock', label: 'Stock Level' },
    { value: 'unitCost', label: 'Unit Cost' },
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'category', label: 'Category' },
  ];

  // Ensure filter values are never undefined
  const safeFilters = {
    search: filters.search || '',
    category: filters.category || '',
    status: filters.status || '',
    sortBy: filters.sortBy || 'updatedAt',
    sortOrder: filters.sortOrder || 'desc',
    page: filters.page || 1,
    limit: filters.limit || 20,
    lowStockOnly: filters.lowStockOnly || false,
    outOfStockOnly: filters.outOfStockOnly || false,
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      status: '',
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      page: 1,
      lowStockOnly: false,
      outOfStockOnly: false,
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
    safeFilters.status ||
    safeFilters.sortBy !== 'updatedAt' ||
    safeFilters.lowStockOnly ||
    safeFilters.outOfStockOnly;

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        backdropFilter: 'blur(10px)',
        ...sx,
      }}
    >
      {/* Header with Stats and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterList sx={{ color: theme.palette.primary.main }} />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Material Filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Filter and search your inventory
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onExport && (
            <Tooltip title="Export Materials">
              <IconButton
                size="small"
                onClick={onExport}
                sx={{
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  color: theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                  },
                }}
              >
                <Download />
              </IconButton>
            </Tooltip>
          )}
          
          {onImport && (
            <Tooltip title="Import Materials">
              <IconButton
                size="small"
                onClick={onImport}
                sx={{
                  border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                  color: theme.palette.info.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                  },
                }}
              >
                <Upload />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search materials by name, SKU, supplier, or description..."
          value={safeFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          size="small"
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
            },
          }}
        />
      </Box>

      {/* Filter Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {/* Category Filter */}
        <FormControl size="small" fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={safeFilters.category}
            label="Category"
            onChange={(e) => handleFilterChange('category', e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Category fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Categories</MenuItem>
            {MATERIAL_CATEGORIES.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: cat.color,
                    }}
                  />
                  {cat.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl size="small" fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={safeFilters.status}
            label="Status"
            onChange={(e) => handleFilterChange('status', e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <TrendingUp fontSize="small" />
              </InputAdornment>
            }
          >
            {statuses.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl size="small" fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={safeFilters.sortBy}
            label="Sort By"
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Order */}
        <FormControl size="small" fullWidth>
          <InputLabel>Order</InputLabel>
          <Select
            value={safeFilters.sortOrder}
            label="Order"
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <LowPriority fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Quick Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControlLabel
          control={
            <Switch
              checked={safeFilters.lowStockOnly}
              onChange={(e) => handleFilterChange('lowStockOnly', e.target.checked)}
              color="warning"
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Warning fontSize="small" sx={{ color: theme.palette.warning.main }} />
              Show Low Stock Only
            </Box>
          }
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={safeFilters.outOfStockOnly}
              onChange={(e) => handleFilterChange('outOfStockOnly', e.target.checked)}
              color="error"
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ErrorIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
              Show Out of Stock Only
            </Box>
          }
        />
      </Box>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Active filters:
          </Typography>
          
          {safeFilters.search && (
            <Chip
              label={`Search: "${safeFilters.search}"`}
              size="small"
              onDelete={() => handleFilterChange('search', '')}
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.primary.main,
                }
              }}
            />
          )}
          
          {safeFilters.category && (
            <Chip
              label={`Category: ${MATERIAL_CATEGORIES.find(c => c.value === safeFilters.category)?.label || safeFilters.category}`}
              size="small"
              onDelete={() => handleFilterChange('category', '')}
              sx={{ 
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.secondary.main,
                }
              }}
            />
          )}
          
          {safeFilters.status && (
            <Chip
              label={`Status: ${getStatusLabel(safeFilters.status as any)}`}
              size="small"
              onDelete={() => handleFilterChange('status', '')}
              sx={{ 
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.warning.main,
                }
              }}
            />
          )}
          
          {safeFilters.lowStockOnly && (
            <Chip
              label="Low Stock Only"
              size="small"
              onDelete={() => handleFilterChange('lowStockOnly', false)}
              color="warning"
              variant="outlined"
            />
          )}
          
          {safeFilters.outOfStockOnly && (
            <Chip
              label="Out of Stock Only"
              size="small"
              onDelete={() => handleFilterChange('outOfStockOnly', false)}
              color="error"
              variant="outlined"
            />
          )}
          
          {safeFilters.sortBy !== 'updatedAt' && (
            <Chip
              label={`Sorted by: ${sortOptions.find(opt => opt.value === safeFilters.sortBy)?.label}`}
              size="small"
              onDelete={() => handleFilterChange('sortBy', 'updatedAt')}
              sx={{ 
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.info.main,
                }
              }}
            />
          )}
          
          <Tooltip title="Clear all filters">
            <IconButton
              size="small"
              onClick={handleClearFilters}
              sx={{
                ml: 'auto',
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
        </Box>
      )}
    </Paper>
  );
};