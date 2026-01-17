// app/components/user-side/meetings&notes/common/MeetingStatusChip.tsx
"use client";

import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export interface MeetingStatusChipProps extends ChipProps {
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export function MeetingStatusChip({ status, ...props }: MeetingStatusChipProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ongoing':
        return { label: 'Live', color: 'success' as const };
      case 'scheduled':
        return { label: 'Scheduled', color: 'info' as const };
      case 'completed':
        return { label: 'Completed', color: 'default' as const };
      case 'cancelled':
        return { label: 'Cancelled', color: 'error' as const };
      default:
        return { label: status, color: 'default' as const };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 'bold' }}
      {...props}
    />
  );
}