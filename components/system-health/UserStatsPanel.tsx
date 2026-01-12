import React from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  alpha,
  useTheme,
} from '@mui/material';
import { Person } from '@mui/icons-material';

interface UserStats {
  totalDocuments: number;
  storageUsage: number;
  collectionsUsed: number;
  recentErrors?: number;
}

interface UserStatsPanelProps {
  stats: UserStats | null;
  title?: string;
  storageLimit?: number;
}

export const UserStatsPanel: React.FC<UserStatsPanelProps> = ({
  stats,
  title = 'Your Account Stats',
  storageLimit = 50, // MB
}) => {
  const theme = useTheme();

  if (!stats) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
        <Typography variant="body2" color="text.secondary">
          Loading your stats...
        </Typography>
      </Paper>
    );
  }

  const storagePercent = Math.min(100, (stats.storageUsage / storageLimit) * 100);
  const getStorageColor = (percent: number) => {
    if (percent > 90) return theme.palette.error.main;
    if (percent > 75) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Paper sx={{ 
      p: 3, 
      borderRadius: 3,
      background: 'background.paper',
      boxShadow: theme.shadows[2],
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    }}>
      <Typography variant="h6" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'text.primary'
      }}>
        <Person />
        {title}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Your Documents:</Typography>
          <Typography variant="body2" fontWeight="medium" color="text.primary">
            {stats.totalDocuments}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Storage Used:</Typography>
          <Typography variant="body2" fontWeight="medium" color="text.primary">
            {stats.storageUsage.toFixed(2)} MB
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">Collections Used:</Typography>
          <Typography variant="body2" fontWeight="medium" color="text.primary">
            {stats.collectionsUsed}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={storagePercent}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: alpha(getStorageColor(storagePercent), 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: getStorageColor(storagePercent),
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 1 }}>
          {storagePercent.toFixed(1)}% of your storage limit ({stats.storageUsage.toFixed(2)} MB / {storageLimit} MB)
        </Typography>
      </Box>

      {stats.recentErrors !== undefined && (
        <Box sx={{ 
          p: 2, 
          borderRadius: 2,
          bgcolor: stats.recentErrors > 0 ? 
            alpha(theme.palette.error.main, 0.05) : 
            alpha(theme.palette.success.main, 0.05),
          border: `1px solid ${alpha(
            stats.recentErrors > 0 ? 
              theme.palette.error.main : 
              theme.palette.success.main, 
            0.2
          )}`,
        }}>
          <Typography variant="body2" sx={{ 
            color: stats.recentErrors > 0 ? 
              theme.palette.error.main : 
              theme.palette.success.main 
          }}>
            {stats.recentErrors > 0 
              ? `${stats.recentErrors} error${stats.recentErrors > 1 ? 's' : ''} in last 24 hours`
              : 'No errors in last 24 hours'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};