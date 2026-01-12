import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Switch,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface SystemHealthHeaderProps {
  title?: string;
  subtitle?: string;
  autoRefresh: boolean;
  onAutoRefreshChange: (checked: boolean) => void;
  onRefresh: () => void;
  loading?: boolean;
  lastUpdated?: string;
}

export const SystemHealthHeader: React.FC<SystemHealthHeaderProps> = ({
  title = 'System Health Dashboard',
  subtitle = 'Monitoring your account services and performance',
  autoRefresh,
  onAutoRefreshChange,
  onRefresh,
  loading = false,
  lastUpdated,
}) => {
  const theme = useTheme();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between', 
      alignItems: { xs: 'flex-start', sm: 'center' }, 
      mb: 4,
      gap: 2
    }}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
        {lastUpdated && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Last updated: {formatDate(lastUpdated)}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Auto refresh every 10 seconds">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch
              checked={autoRefresh}
              onChange={(e) => onAutoRefreshChange(e.target.checked)}
              color="primary"
            />
            <Typography variant="body2" color="text.secondary">Auto Refresh</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Refresh now">
          <IconButton 
            onClick={onRefresh} 
            disabled={loading}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              },
              '&.Mui-disabled': {
                background: alpha(theme.palette.text.secondary, 0.5),
              }
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};