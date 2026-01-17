// app/components/user-side/meetings&notes/common/GradientButton.tsx
"use client";

import React from 'react';
import { Button, ButtonProps, alpha, styled } from '@mui/material';

const StyledGradientButton = styled(Button)<ButtonProps>(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  fontWeight: 600,
  borderRadius: '12px',
  padding: '10px 24px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  '&.Mui-disabled': {
    background: theme.palette.action.disabledBackground,
  },
}));

export interface GradientButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function GradientButton({ children, ...props }: GradientButtonProps) {
  return <StyledGradientButton {...props}>{children}</StyledGradientButton>;
}