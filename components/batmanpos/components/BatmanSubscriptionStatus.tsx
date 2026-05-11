// components/batmanpos/components/BatmanSubscriptionStatus.tsx
'use client';

import React from 'react';
import { Alert, CircularProgress, Typography } from "@mui/material";
import { Warning as WarningIcon, Error as ErrorIcon } from "@mui/icons-material";
import { batmanColors } from '../types';

interface BatmanSubscriptionStatusProps { isLoading: boolean; isActive: boolean; isOnline: boolean; remainingInvoices: number; }

export const BatmanSubscriptionStatus: React.FC<BatmanSubscriptionStatusProps> = ({ isLoading, isActive, isOnline, remainingInvoices }) => {
  if (isLoading) return <CircularProgress size={20} sx={{ color: batmanColors.gold, mb: 2 }} />;
  if (!isActive && isOnline) return (<Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3, borderRadius: '12px', backgroundColor: batmanColors.goldSoft, border: `2px solid ${batmanColors.error}`, color: batmanColors.error }}><Typography variant="body2" fontWeight={700}>Your subscription is inactive! Renew now - The night is dark!</Typography></Alert>);
  if (remainingInvoices <= 5 && isOnline) return (<Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3, borderRadius: '12px', backgroundColor: batmanColors.goldSoft, border: `2px solid ${batmanColors.gold}`, color: batmanColors.gold }}><Typography variant="body2" fontWeight={700}>You have {remainingInvoices} invoices remaining! Upgrade your plan - Justice demands it! 🦇</Typography></Alert>);
  return null;
};