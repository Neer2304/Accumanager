// components/live-activity/AccessDeniedView.tsx
import { Box, Paper, Typography, Button } from '@mui/material';
import { Lock, Upgrade } from '@mui/icons-material';

interface AccessDeniedViewProps {
  onUpgradeClick: () => void;
}

export const AccessDeniedView = ({ onUpgradeClick }: AccessDeniedViewProps) => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
      <Paper sx={{ p: 6, mt: 4 }}>
        <Lock sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="error">
          ⚡ Live Activity Monitoring
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          Premium Feature - Requires Subscription
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          This advanced feature provides real-time employee tracking, productivity analytics, 
          and team activity monitoring. It's currently available only to our premium subscribers.
        </Typography>
        
        <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.900', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            🔥 What you'll get:
          </Typography>
          <Box sx={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              ✓ Real-time employee status monitoring
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              ✓ Productivity analytics and insights
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              ✓ Team distribution and location tracking
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              ✓ Activity timeline and event logging
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✓ Auto-refresh and live updates
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<Upgrade />}
          onClick={onUpgradeClick}
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          Upgrade to Unlock Live Features
        </Button>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Note: This is a premium feature. You can try it with our 7-day trial.
        </Typography>
      </Paper>
    </Box>
  );
};