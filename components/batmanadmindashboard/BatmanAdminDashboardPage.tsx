// components/batmanadmindashboard/BatmanAdminDashboardPage.tsx
'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { BatmanDashboardHeader } from './components/BatmanDashboardHeader';
import { BatmanDashboardStats } from './components/BatmanDashboardStats';
import { BatmanDashboardCardGrid } from './components/BatmanDashboardCardGrid';
import { BatmanDashboardLoadingState } from './components/BatmanDashboardLoadingState';
import { useBatmanAdminDashboard } from './hooks/useBatmanAdminDashboard';
import { batmanColors } from './components/types';

export default function BatmanAdminDashboardPage() {
  const { loading, stats, adminCards, handleCardClick } = useBatmanAdminDashboard();

  if (loading) {
    return <BatmanDashboardLoadingState />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: batmanColors.bg }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <BatmanDashboardHeader />
        <BatmanDashboardStats stats={stats} />
        <BatmanDashboardCardGrid title="🦇 GOTHAM ADMIN PROTOCOLS 🦇" cards={adminCards} onCardClick={handleCardClick} />
      </Container>
    </Box>
  );
}