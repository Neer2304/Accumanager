import React from 'react';
import { Alert, CircularProgress } from "@mui/material";

interface SubscriptionStatusProps {
  isLoading: boolean;
  isActive: boolean;
  isOnline: boolean;
  remainingInvoices: number;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  isLoading,
  isActive,
  isOnline,
  remainingInvoices,
}) => {
  if (isLoading) {
    return <CircularProgress size={20} />;
  }

  if (!isActive && isOnline) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Your subscription is not active. Please renew to create bills.
      </Alert>
    );
  }

  if (remainingInvoices <= 5 && isOnline) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        You have {remainingInvoices} invoices remaining. Consider upgrading your plan.
      </Alert>
    );
  }

  return null;
};