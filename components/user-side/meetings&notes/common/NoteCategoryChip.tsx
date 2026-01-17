// app/components/user-side/meetings&notes/common/NoteCategoryChip.tsx
"use client";

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import {
  Groups,
  Work,
  Person,
  Lightbulb,
  Checklist,
  School,
  Search,
} from '@mui/icons-material';

export interface NoteCategoryChipProps extends ChipProps {
  category: 'meeting' | 'project' | 'personal' | 'ideas' | 'todo' | 'research' | 'learning';
}

export function NoteCategoryChip({ category, ...props }: NoteCategoryChipProps) {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'meeting':
        return { label: 'Meeting', icon: <Groups />, color: 'primary' as const };
      case 'project':
        return { label: 'Project', icon: <Work />, color: 'secondary' as const };
      case 'personal':
        return { label: 'Personal', icon: <Person />, color: 'info' as const };
      case 'ideas':
        return { label: 'Ideas', icon: <Lightbulb />, color: 'warning' as const };
      case 'todo':
        return { label: 'To-Do', icon: <Checklist />, color: 'success' as const };
      case 'research':
        return { label: 'Research', icon: <Search />, color: 'error' as const };
      case 'learning':
        return { label: 'Learning', icon: <School />, color: 'default' as const };
      default:
        return { label: category, icon: <Groups />, color: 'default' as const };
    }
  };

  const config = getCategoryConfig(category);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      {...props}
    />
  );
}