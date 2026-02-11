// components/admin/dashboard/DashboardHeader.tsx
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
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AdminPanelSettings,
  Logout,
  Refresh,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';

  const googleColors = {
    primary: '#1a73e8',
    primaryLight: '#8ab4f8',
    primaryDark: '#1669c1',
    secondary: '#34a853',
    error: '#ea4335',
    warning: '#fbbc04',
    grey50: '#f8f9fa',
    grey100: '#f1f3f4',
    grey200: '#e8eaed',
    grey300: '#dadce0',
    grey400: '#bdc1c6',
    grey500: '#9aa0a6',
    grey600: '#80868b',
    grey700: '#5f6368',
    grey800: '#3c4043',
    grey900: '#202124',
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      justifyContent: 'space-between', 
      alignItems: { xs: 'flex-start', sm: 'center' }, 
      mb: 4,
      gap: 2,
      p: 3,
      borderRadius: '16px',
      backgroundColor: darkMode ? googleColors.grey900 : '#ffffff',
      border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
      boxShadow: darkMode 
        ? '0 2px 8px rgba(0,0,0,0.2)'
        : '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <Box>
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight={500}
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: darkMode ? googleColors.grey200 : googleColors.grey900,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          }}
        >
          <AdminPanelSettings sx={{ color: googleColors.primary }} />
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            variant="body1" 
            sx={{ 
              color: darkMode ? googleColors.grey500 : googleColors.grey600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center', 
        flexWrap: 'wrap',
        justifyContent: { xs: 'flex-start', sm: 'flex-end' },
      }}>
        <FormControl 
          size="small" 
          sx={{ 
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
              borderColor: darkMode ? googleColors.grey700 : googleColors.grey300,
            },
            '& .MuiInputLabel-root': {
              color: darkMode ? googleColors.grey400 : googleColors.grey600,
            },
          }}
        >
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e: SelectChangeEvent) => onTimeRangeChange(e.target.value)}
            sx={{
              color: darkMode ? googleColors.grey200 : googleColors.grey900,
              '& .MuiSelect-icon': {
                color: darkMode ? googleColors.grey400 : googleColors.grey600,
              },
            }}
          >
            <MenuItem value="24h">Last 24 hours</MenuItem>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
        
        <Tooltip title="Refresh Data">
          <IconButton 
            onClick={onRefresh}
            sx={{
              color: darkMode ? googleColors.grey400 : googleColors.grey600,
              backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
              '&:hover': {
                backgroundColor: darkMode ? googleColors.grey700 : googleColors.grey200,
              },
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
        
        {onSettings && (
          <Tooltip title="Settings">
            <IconButton 
              onClick={onSettings}
              sx={{
                color: darkMode ? googleColors.grey400 : googleColors.grey600,
                backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
                '&:hover': {
                  backgroundColor: darkMode ? googleColors.grey700 : googleColors.grey200,
                },
              }}
            >
              <Settings />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title="Logout">
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={onLogout}
            color="error"
            size={isMobile ? "small" : "medium"}
            sx={{
              borderColor: googleColors.error,
              color: googleColors.error,
              '&:hover': {
                borderColor: googleColors.error,
                backgroundColor: alpha(googleColors.error, 0.04),
              },
            }}
          >
            Logout
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};