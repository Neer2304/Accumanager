// app/community/layout.tsx
"use client";

import React from 'react';
import { Box } from '@mui/material';
import CommunityNavbar from '@/components/community/CommunityNavbar';

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CommunityNavbar />
      <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
        {children}
      </Box>
    </>
  );
}