// components/dppos/components/DpSubscriptionStatus.tsx
'use client';

import React from 'react';
import { Alert, CircularProgress, Typography } from "@mui/material";
import { Warning as WarningIcon, Error as ErrorIcon } from "@mui/icons-material";
import { dpColors } from '../types';

interface DpSubscriptionStatusProps { isLoading: boolean; isActive: boolean; isOnline: boolean; remainingInvoices: number; }

export const DpSubscriptionStatus: React.FC<DpSubscriptionStatusProps> = ({ isLoading, isActive, isOnline, remainingInvoices }) => {
  if (isLoading) return <CircularProgress size={20} sx={{ color: dpColors.red, mb: 2 }} />;
  if (!isActive && isOnline) return (<Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3, borderRadius: '12px', backgroundColor: dpColors.redSoft, border: `2px solid ${dpColors.error}`, color: dpColors.error }}><Typography variant="body2" fontWeight={700}>Your subscription is not active! Renew to create bills - Maximum effort required! 🦸</Typography></Alert>);
  if (remainingInvoices <= 5 && isOnline) return (<Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3, borderRadius: '12px', backgroundColor: dpColors.goldSoft, border: `2px solid ${dpColors.gold}`, color: dpColors.gold }}><Typography variant="body2" fontWeight={700}>You have {remainingInvoices} invoices remaining! Consider upgrading your plan before you run out!</Typography></Alert>);
  return null;
};