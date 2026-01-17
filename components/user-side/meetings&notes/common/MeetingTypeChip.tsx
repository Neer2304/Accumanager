// app/components/user-side/meetings&notes/common/MeetingTypeChip.tsx
"use client";

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { Groups, Business, People, Person } from '@mui/icons-material';

export interface MeetingTypeChipProps extends ChipProps {
  type: 'internal' | 'client' | 'partner' | 'team' | 'one-on-one';
}

export function MeetingTypeChip({ type, ...props }: MeetingTypeChipProps) {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'internal':
        return { label: 'Internal', icon: <Groups />, color: 'primary' as const };
      case 'client':
        return { label: 'Client', icon: <Business />, color: 'secondary' as const };
      case 'partner':
        return { label: 'Partner', icon: <People />, color: 'info' as const };
      case 'team':
        return { label: 'Team', icon: <Groups />, color: 'success' as const };
      case 'one-on-one':
        return { label: '1:1', icon: <Person />, color: 'warning' as const };
      default:
        return { label: type, icon: <Groups />, color: 'default' as const };
    }
  };

  const config = getTypeConfig(type);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
      {...props}
    />
  );
}