// components/live-activity/HeaderSection.tsx
import { Paper, Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { SubscriptionStatus } from './types';

interface HeaderSectionProps {
  subscriptionStatus: SubscriptionStatus | null;
  onRefresh: () => void;
  loading: boolean;
}

export const HeaderSection = ({ subscriptionStatus, onRefresh, loading }: HeaderSectionProps) => {
  return (
    <Paper sx={{ 
      p: 4, 
      mb: 4, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      color: 'white',
      position: 'relative'
    }}>
      {/* Development Badge */}
      <Chip 
        label="UNDER DEVELOPMENT" 
        color="warning"
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16,
          fontWeight: 'bold',
          color: 'white'
        }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            📊 Live Activity Dashboard
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Real-time monitoring of team activity and productivity
            {subscriptionStatus && (
              <Chip 
                label={subscriptionStatus.plan.toUpperCase()} 
                size="small" 
                sx={{ ml: 2, bgcolor: 'white', color: '#667eea' }} 
              />
            )}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={onRefresh} sx={{ color: 'white' }} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};