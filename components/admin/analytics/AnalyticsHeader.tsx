import React from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Assessment,
  Download,
  Refresh,
} from '@mui/icons-material';

interface AnalyticsHeaderProps {
  title: string;
  subtitle?: string;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onExportData: () => void;
  onRefresh: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  title,
  subtitle,
  timeRange,
  onTimeRangeChange,
  onExportData,
  onRefresh,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      justifyContent: 'space-between', 
      alignItems: { xs: 'flex-start', sm: 'center' }, 
      mb: 4,
      gap: 2,
    }}>
      <Box>
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="bold" 
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Assessment />
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e: SelectChangeEvent) => onTimeRangeChange(e.target.value)}
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
          size="small"
        >
          Refresh
        </Button>
        
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={onExportData}
          size="small"
        >
          Export Data
        </Button>
      </Box>
    </Box>
  );
};