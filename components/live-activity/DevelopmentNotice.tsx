// components/live-activity/DevelopmentNotice.tsx
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { Construction, Info } from '@mui/icons-material';

interface DevelopmentNoticeProps {
  onClose: () => void;
  subscriptionPlan?: string;
  isActive?: boolean;
}

export const DevelopmentNotice = ({ onClose, subscriptionPlan, isActive }: DevelopmentNoticeProps) => {
  return (
    <Alert 
      severity="warning" 
      sx={{ mb: 3 }}
      icon={<Construction />}
      onClose={onClose}
      action={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            size="small"
            href="/subscription"
          >
            View Plans
          </Button>
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
      <AlertTitle>🚧 Advanced Feature Preview</AlertTitle>
      Live activity monitoring is currently in development and requires a paid subscription.
      {subscriptionPlan === 'trial' && (
        <>
          <br />
          <strong>Your trial plan has limited access.</strong> Upgrade to unlock full real-time tracking.
        </>
      )}
      {!isActive && (
        <>
          <br />
          <strong>Subscription required:</strong> This feature is part of our premium offering.
        </>
      )}
    </Alert>
  );
};