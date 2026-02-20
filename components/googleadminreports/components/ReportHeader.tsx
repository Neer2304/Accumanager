// components/googlereports/components/ReportHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

interface ReportHeaderProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  onExport: (type: string) => void;
  loading?: boolean;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  timeRange,
  onTimeRangeChange,
  onExport,
  loading = false
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const timeRangeOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'flex-start', md: 'center' },
      gap: 2,
      mb: 4,
      pb: 2,
      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: darkMode ? '#8ab4f8' : '#1a73e8',
        }}>
          <AssessmentIcon />
        </Box>
        <Box>
          <Typography 
            variant="h5" 
            fontWeight={500} 
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
            Reports & Analytics
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
          >
            Business insights and performance metrics
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        width: { xs: '100%', md: 'auto' }
      }}>
        <FormControl 
          size="small" 
          sx={{ 
            minWidth: { xs: '100%', md: 150 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            }
          }}
        >
          <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => onTimeRangeChange(e.target.value)}
            disabled={loading}
            sx={{
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            {timeRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => onExport('full')}
          disabled={loading}
          sx={{
            backgroundColor: '#1a73e8',
            '&:hover': { backgroundColor: '#1669c1' },
            borderRadius: '8px',
            px: 3,
            whiteSpace: 'nowrap',
            minWidth: { xs: '100%', md: 'auto' }
          }}
        >
          Export CSV
        </Button>
      </Box>
    </Box>
  );
};