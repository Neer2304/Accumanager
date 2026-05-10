// components/proadmindashboard/ProAdminDashboardPage.tsx
'use client';

import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { ProDashboardHeader } from './components/ProDashboardHeader';
import { ProDashboardStats } from './components/ProDashboardStats';
import { ProDashboardCardGrid } from './components/ProDashboardCardGrid';
import { ProDashboardLoadingState } from './components/ProDashboardLoadingState';
import { useProAdminDashboard } from './hooks/useProAdminDashboard';

export default function ProAdminDashboardPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const { loading, stats, adminCards, handleCardClick } = useProAdminDashboard();

  if (loading) {
    return <ProDashboardLoadingState />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <ProDashboardHeader darkMode={darkMode} />
        <ProDashboardStats stats={stats} />
        <ProDashboardCardGrid title="Admin Sections" cards={adminCards} onCardClick={handleCardClick} />
      </Container>
    </Box>
  );
}