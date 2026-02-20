// components/googleadminanalytics/components/AdminControls.tsx
import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  useTheme
} from '@mui/material';
import {
  Refresh,
  Download
} from '@mui/icons-material';

interface AdminControlsProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
  isMobile: boolean;
}

export const AdminControls: React.FC<AdminControlsProps> = ({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  onExport,
  loading,
  isMobile
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      gap: 2,
      alignItems: { xs: 'stretch', sm: 'center' },
      width: { xs: '100%', sm: 'auto' }
    }}>
      <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
        <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Time Range</InputLabel>
        <Select
          value={timeRange}
          label="Time Range"
          onChange={(e: SelectChangeEvent) => onTimeRangeChange(e.target.value)}
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
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="quarterly">Quarterly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </FormControl>
      
      <Button
        variant="outlined"
        startIcon={<Refresh />}
        onClick={onRefresh}
        disabled={loading}
        size="small"
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
          minHeight: { xs: 40, sm: 36 }
        }}
      >
        Refresh
      </Button>
      
      <Button
        variant="contained"
        startIcon={<Download />}
        onClick={onExport}
        size="small"
        sx={{
          backgroundColor: '#1a73e8',
          '&:hover': {
            backgroundColor: '#1669c1',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
          },
          borderRadius: '8px',
          fontWeight: 500,
        }}
      >
        Export Data
      </Button>
    </Box>
  );
};