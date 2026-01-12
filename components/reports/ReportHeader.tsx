import React, { ReactNode } from 'react';
import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel, BoxProps } from '@mui/material';
import { Assessment, Download } from '@mui/icons-material';

interface ReportHeaderProps extends BoxProps {
  title?: string;
  subtitle?: string;
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  onExport?: (type: string) => void;
  additionalActions?: ReactNode;
  timeRangeOptions?: Array<{ value: string; label: string }>;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  title = 'Reports & Analytics',
  subtitle = 'Business insights and performance metrics',
  timeRange,
  onTimeRangeChange,
  onExport,
  additionalActions,
  timeRangeOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ],
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        ...sx,
      }}
      {...props}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          <Assessment sx={{ mr: 2, verticalAlign: 'middle' }} />
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            {timeRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {onExport && (
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => onExport('full')}
          >
            Export CSV
          </Button>
        )}
        
        {additionalActions}
      </Box>
    </Box>
  );
};

export default ReportHeader;