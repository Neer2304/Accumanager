// components/dpadmindashboard/DpAdminDashboardPage.tsx
'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { DpDashboardHeader } from './components/DpDashboardHeader';
import { DpDashboardStats } from './components/DpDashboardStats';
import { DpDashboardCardGrid } from './components/DpDashboardCardGrid';
import { DpDashboardLoadingState } from './components/DpDashboardLoadingState';
import { useDpAdminDashboard } from './hooks/useDpAdminDashboard';
import { dpColors } from './components/types';

export default function DpAdminDashboardPage() {
  const { loading, stats, adminCards, handleCardClick } = useDpAdminDashboard();

  if (loading) {
    return <DpDashboardLoadingState />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: dpColors.bg }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <DpDashboardHeader />
        <DpDashboardStats stats={stats} />
        <DpDashboardCardGrid title="💀 Deadpool's Admin Sections 💀" cards={adminCards} onCardClick={handleCardClick} />
      </Container>
    </Box>
  );
}