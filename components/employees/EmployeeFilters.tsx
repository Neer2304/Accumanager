import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  IconButton,
  Collapse,
  InputAdornment,
  Chip,
  useTheme,
  alpha,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Person,
  Work,
  Business,
} from '@mui/icons-material';
import { EmployeeFilters as FiltersType } from '@/types/employee.types';

interface EmployeeFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: Partial<FiltersType>) => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const departments = [
    'Sales',
    'Marketing',
    'Development',
    'Design',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Support',
    'IT',
    'Administration',
    'Production',
    'Quality Assurance',
    'Research & Development',
    'Logistics',
    'Other'
  ];

  const roles = [
    'Manager',
    'Team Lead',
    'Senior Developer',
    'Developer',
    'Designer',
    'Sales Executive',
    'Marketing Specialist',
    'HR Manager',
    'Accountant',
    'Operations Manager',
    'Customer Support',
    'Intern',
    'Trainee',
    'Contractor',
    'Other'
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: '-name', label: 'Name Z-A' },
    { value: 'salary', label: 'Salary Low-High' },
    { value: '-salary', label: 'Salary High-Low' },
    { value: 'joiningDate', label: 'Joining Date Old-New' },
    { value: '-joiningDate', label: 'Joining Date New-Old' },
    { value: 'createdAt', label: 'Recently Added' },
    { value: '-createdAt', label: 'Oldest Added' },
  ];

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      department: '',
      role: '',
      isActive: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
    });
  };

  const hasActiveFilters = filters.search || filters.department || filters.role || filters.isActive !== 'all' || filters.sortBy !== 'name';

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: expanded ? 2 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <TextField
            placeholder="Search employees..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value, page: 1 })}
            variant="outlined"
            size="small"
            sx={{ flex: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            startIcon={<FilterList />}
            onClick={() => setExpanded(!expanded)}
            variant={expanded ? 'contained' : 'outlined'}
            size="small"
          >
            Filters {hasActiveFilters && `(${Object.values(filters).filter(v => v && v !== 'all').length})`}
          </Button>
          
          {hasActiveFilters && (
            <Button
              startIcon={<Clear />}
              onClick={handleClearFilters}
              variant="text"
              size="small"
              color="error"
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <TextField
            select
            label="Department"
            value={filters.department}
            onChange={(e) => onFiltersChange({ department: e.target.value, page: 1 })}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Role"
            value={filters.role}
            onChange={(e) => onFiltersChange({ role: e.target.value, page: 1 })}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Work fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All Roles</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          <FormControl size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.isActive}
              label="Status"
              onChange={(e) => onFiltersChange({ isActive: e.target.value, page: 1 })}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="true">Active Only</MenuItem>
              <MenuItem value="false">Inactive Only</MenuItem>
            </Select>
          </FormControl>

          <TextField
            select
            label="Sort By"
            value={`${filters.sortOrder === 'desc' ? '-' : ''}${filters.sortBy}`}
            onChange={(e) => {
              const value = e.target.value;
              const sortOrder = value.startsWith('-') ? 'desc' : 'asc';
              const sortBy = value.startsWith('-') ? value.substring(1) : value;
              onFiltersChange({ sortBy, sortOrder, page: 1 });
            }}
            size="small"
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Items per page"
            value={filters.limit}
            onChange={(e) => onFiltersChange({ limit: parseInt(e.target.value), page: 1 })}
            size="small"
          >
            <MenuItem value={10}>10 per page</MenuItem>
            <MenuItem value={20}>20 per page</MenuItem>
            <MenuItem value={50}>50 per page</MenuItem>
            <MenuItem value={100}>100 per page</MenuItem>
          </TextField>
        </Box>

        {/* Active filters chips */}
        {hasActiveFilters && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {filters.search && (
              <Chip
                label={`Search: ${filters.search}`}
                size="small"
                onDelete={() => onFiltersChange({ search: '', page: 1 })}
              />
            )}
            {filters.department && (
              <Chip
                label={`Department: ${filters.department}`}
                size="small"
                onDelete={() => onFiltersChange({ department: '', page: 1 })}
              />
            )}
            {filters.role && (
              <Chip
                label={`Role: ${filters.role}`}
                size="small"
                onDelete={() => onFiltersChange({ role: '', page: 1 })}
              />
            )}
            {filters.isActive !== 'all' && (
              <Chip
                label={`Status: ${filters.isActive === 'true' ? 'Active' : 'Inactive'}`}
                size="small"
                onDelete={() => onFiltersChange({ isActive: 'all', page: 1 })}
              />
            )}
          </Box>
        )}
      </Collapse>
    </Paper>
  );
};