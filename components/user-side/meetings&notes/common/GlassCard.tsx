// app/components/user-side/meetings&notes/common/GlassCard.tsx
"use client";

import React from 'react';
import { Card, CardProps, alpha, styled } from '@mui/material';

const StyledGlassCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
}));

export interface GlassCardProps extends CardProps {
  children: React.ReactNode;
}

export function GlassCard({ children, ...props }: GlassCardProps) {
  return <StyledGlassCard {...props}>{children}</StyledGlassCard>;
}