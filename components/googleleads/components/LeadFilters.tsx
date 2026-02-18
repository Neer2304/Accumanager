import React from 'react';
import {
  Box,
  TextField,
  Paper,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  InputAdornment,
  IconButton,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { LEAD_STATUS, LEAD_SOURCES, GOOGLE_COLORS } from '../constants';

interface LeadFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  statusFilter: string;
  onStatusFilterChange: (event: SelectChangeEvent) => void;
  sourceFilter: string;
  onSourceFilterChange: (event: SelectChangeEvent) => void;
  onRefresh: () => void;
  onAddClick: () => void;
  darkMode: boolean;
}

export function LeadFilters({
  searchQuery,
  onSearchChange,
  onSearchClear,
  statusFilter,
  onStatusFilterChange,
  sourceFilter,
  onSourceFilterChange,
  onRefresh,
  onAddClick,
  darkMode
}: LeadFiltersProps) {
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
        <Box sx={{ flex: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search leads by name, email, company..."
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

        <Box sx={{
          display: 'flex',
          gap: 1.5,
          flexWrap: 'wrap'
        }}>
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
              Status
            </InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={onStatusFilterChange}
            >
              <MenuItem value="all">All Status</MenuItem>
              {LEAD_STATUS.map(status => (
                <MenuItem key={status.value} value={status.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{status.emoji}</span>
                    {status.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
              Source
            </InputLabel>
            <Select
              value={sourceFilter}
              label="Source"
              onChange={onSourceFilterChange}
            >
              <MenuItem value="all">All Sources</MenuItem>
              {LEAD_SOURCES.map(source => (
                <MenuItem key={source.value} value={source.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{source.emoji}</span>
                    {source.label}
                  </Box>
                </MenuItem>
              ))}
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
            Add Lead
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}