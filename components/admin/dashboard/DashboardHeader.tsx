import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  AdminPanelSettings,
  Logout,
  Refresh,
  Notifications,
  Settings,
} from '@mui/icons-material';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onRefresh: () => void;
  onLogout: () => void;
  onSettings?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  timeRange,
  onTimeRangeChange,
  onRefresh,
  onLogout,
  onSettings,
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
          <AdminPanelSettings />
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
            <MenuItem value="24h">Last 24 hours</MenuItem>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
        
        <Tooltip title="Refresh Data">
          <IconButton onClick={onRefresh}>
            <Refresh />
          </IconButton>
        </Tooltip>
        
        {onSettings && (
          <Tooltip title="Settings">
            <IconButton onClick={onSettings}>
              <Settings />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title="Logout">
          <Button 
            variant="contained" 
            startIcon={<Logout />} 
            onClick={onLogout}
            color="error"
            size="small"
          >
            Logout
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};