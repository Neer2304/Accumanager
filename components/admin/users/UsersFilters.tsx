import React from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search,
} from '@mui/icons-material';

interface UsersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  planFilter: string;
  statusFilter: string;
  onFilterChange: (filterType: string, value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  search,
  onSearchChange,
  roleFilter,
  planFilter,
  statusFilter,
  onFilterChange,
  onSearchSubmit,
  loading = false,
}) => {
  const handleRoleChange = (e: SelectChangeEvent) => {
    onFilterChange('role', e.target.value);
  };

  const handlePlanChange = (e: SelectChangeEvent) => {
    onFilterChange('plan', e.target.value);
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    onFilterChange('status', e.target.value);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={onSearchSubmit}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              md: '2fr repeat(3, 1fr) 0.5fr' 
            }, 
            gap: 16,
            alignItems: 'center' 
          }}>
            <TextField
              fullWidth
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              disabled={loading}
            />
            
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={handleRoleChange}
                disabled={loading}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Plan</InputLabel>
              <Select
                value={planFilter}
                label="Plan"
                onChange={handlePlanChange}
                disabled={loading}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="trial">Trial</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusChange}
                disabled={loading}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="trial">Trial</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};