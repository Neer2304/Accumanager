// components/googlecompanydashboard/CompanyDashboardPage.tsx
'use client';

import React from 'react';
import { useTheme } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useCompanyDashboard } from './hooks/useCompanyDashboard';
import { LoadingState } from './components/LoadingState';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsGrid } from './components/StatsGrid';
import { QuickActions } from './components/QuickActions';

function CompanyDashboardContent() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const {
    company,
    companyId,
    stats,
    loading,
    isAdmin,
    navigateTo,
    router
  } = useCompanyDashboard();

  if (loading || !company) {
    return <LoadingState darkMode={darkMode} />;
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      padding: '32px 0',
      transition: 'background-color 0.2s'
    },
    wrapper: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <DashboardHeader
          company={company}
          isAdmin={isAdmin}
          onBack={() => router.push('/companies')}
          onSettings={() => navigateTo(`/companies/${companyId}/settings`)}
          darkMode={darkMode}
        />

        <StatsGrid
          stats={stats}
          companyId={companyId}
          memberCount={company.memberCount}
          maxMembers={company.maxMembers}
          onNavigate={navigateTo}
          darkMode={darkMode}
        />

        {isAdmin && (
          <QuickActions
            companyId={companyId}
            onNavigate={navigateTo}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}

// Main exported component with layout wrapper
export default function CompanyDashboardPage() {
  return (
    <MainLayout title="Company Dashboard">
      <CompanyDashboardContent />
    </MainLayout>
  );
}