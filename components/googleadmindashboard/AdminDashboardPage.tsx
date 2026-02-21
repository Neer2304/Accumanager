// components/googleadmindashboard/AdminDashboardPage.tsx
'use client';

import React from 'react';
import {
  Box,
  Container,
  useTheme
} from '@mui/material';

// Import components
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { DashboardCardGrid } from './components/DashboardCardGrid';
import { DashboardLoadingState } from './components/DashboardLoadingState';

// Import hooks
import { useAdminDashboard } from './hooks/useAdminDashboard';

export default function AdminDashboardPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const {
    loading,
    stats,
    adminCards,
    handleCardClick
  } = useAdminDashboard();

  if (loading) {
    return <DashboardLoadingState />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
    }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <DashboardHeader darkMode={darkMode} />

        {/* Stats Overview */}
        <DashboardStats stats={stats} />

        {/* All Admin Cards */}
        <DashboardCardGrid
          title="Admin Sections"
          cards={adminCards}
          onCardClick={handleCardClick}
        />
      </Container>
    </Box>
  );
}