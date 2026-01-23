// components/live-projects/DevelopmentNotice.tsx
import { Alert, AlertTitle, Button, Chip, Box } from '@mui/material';
import { Construction, Rocket, TrendingUp } from '@mui/icons-material';

interface DevelopmentNoticeProps {
  onClose: () => void;
}

export const DevelopmentNotice = ({ onClose }: DevelopmentNoticeProps) => {
  return (
    <Alert 
      severity="warning" 
      sx={{ mb: 3, position: 'relative' }}
      icon={<Construction />}
      action={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip 
            label="UNDER DEVELOPMENT" 
            color="warning" 
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Button 
            color="inherit" 
            size="small"
            onClick={onClose}
          >
            Dismiss
          </Button>
        </Box>
      }
    >
      <AlertTitle sx={{ fontWeight: 'bold' }}>
        🚧 Live Project Tracker - Feature Preview
      </AlertTitle>
      This is an advanced project monitoring system currently under development. 
      Features like real-time updates, automated alerts, and AI-powered insights 
      are being actively worked on.
      
      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip icon={<Rocket />} label="Beta Features" size="small" variant="outlined" />
        <Chip icon={<TrendingUp />} label="Real-time Data" size="small" variant="outlined" />
        <Chip icon={<Construction />} label="Under Active Development" size="small" variant="outlined" />
      </Box>
    </Alert>
  );
};