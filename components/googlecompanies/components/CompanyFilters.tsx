// components/googlecompanies/components/CompanyFilters.tsx
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
  SelectChangeEvent,
  Tooltip,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface CompanyFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  planFilter: string;
  onPlanFilterChange: (event: SelectChangeEvent) => void;
  onRefresh: () => void;
  canCreateMore: boolean;
  onCreateClick: () => void;
  darkMode: boolean;
}

export const CompanyFilters: React.FC<CompanyFiltersProps> = ({
  searchQuery,
  onSearchChange,
  onSearchClear,
  planFilter,
  onPlanFilterChange,
  onRefresh,
  canCreateMore,
  onCreateClick,
  darkMode
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        mb: 4,
        p: 2.5,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: '20px',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        gap: 2
      }}>
        <Box sx={{ flex: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search companies by name, email or industry..."
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
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                },
              },
            }}
          />
          <Tooltip title="Refresh companies">
            <IconButton 
              onClick={onRefresh}
              sx={{ 
                bgcolor: darkMode ? '#202124' : '#f8f9fa',
                '&:hover': { bgcolor: darkMode ? '#3c4043' : '#f1f3f4' },
                borderRadius: '12px',
                width: 40,
                height: 40
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 160,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              }
            }}
          >
            <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Filter by Plan
            </InputLabel>
            <Select
              value={planFilter}
              label="Filter by Plan"
              onChange={onPlanFilterChange}
            >
              <MenuItem value="all">All Plans</MenuItem>
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="pro">Pro</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </Select>
          </FormControl>

          {canCreateMore && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateClick}
              sx={{ 
                borderRadius: '28px',
                backgroundColor: '#1a73e8',
                '&:hover': { backgroundColor: '#1a5cb0' },
                whiteSpace: 'nowrap',
                px: 3,
                boxShadow: 'none'
              }}
            >
              New Company
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};