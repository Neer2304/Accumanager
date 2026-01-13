import React from 'react';
import { Alert, Button, Box } from '@mui/material';
import { Warning, Info, Error as ErrorIcon } from '@mui/icons-material';

interface SubscriptionAlertProps {
  isSubscriptionActive: boolean;
  canAddCustomer: boolean;
  customerLimit: number;
  subscriptionStatus?: string;
  daysRemaining?: number;
  onUpgradeClick?: () => void;
  isMobile: boolean;
}

export const SubscriptionAlert: React.FC<SubscriptionAlertProps> = ({
  isSubscriptionActive,
  canAddCustomer,
  customerLimit,
  subscriptionStatus,
  daysRemaining,
  onUpgradeClick,
  isMobile,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {!isSubscriptionActive && (
        <Alert 
          severity="error"
          icon={<ErrorIcon />}
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={onUpgradeClick}>
              {isMobile ? 'Upgrade' : 'Upgrade Now'}
            </Button>
          }
        >
          Your subscription has expired. Please renew to manage customers.
        </Alert>
      )}

      {!canAddCustomer && isSubscriptionActive && (
        <Alert 
          severity="warning"
          icon={<Warning />}
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={onUpgradeClick}>
              {isMobile ? 'Upgrade' : 'Upgrade Plan'}
            </Button>
          }
        >
          Customer limit reached ({customerLimit} customers). Upgrade to add more.
        </Alert>
      )}

      {subscriptionStatus === 'trial' && daysRemaining && (
        <Alert 
          severity="info"
          icon={<Info />}
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={onUpgradeClick}>
              {isMobile ? 'View' : 'View Plans'}
            </Button>
          }
        >
          Free trial: {daysRemaining} days remaining
        </Alert>
      )}
    </Box>
  );
};