// components/googleanalytics/AnalyticsPage.tsx
'use client';

import React from 'react';
import {
  Box,
  Container,
  CircularProgress,
  useTheme
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { AnalyticsSkeleton } from '@/components/analytics/AnalyticsSkeleton';

// Import components
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { AnalyticsStats } from './components/AnalyticsStats';
import { AnalyticsPageContent } from './components/AnalyticsPageContent';
import { AnalyticsEmptyState } from './components/AnalyticsEmptyState';
import { AnalyticsErrorState } from './components/AnalyticsErrorState';

// Import hooks
import { useAnalyticsPage } from './hooks/useAnalyticsPage';

function AnalyticsContent() {
  const {
    darkMode,
    data,
    isLoading,
    error,
    isOnline,
    stats,
    isValidData,
    refetch,
    handleDownloadReport,
    handleBack
  } = useAnalyticsPage();

  if (isLoading) {
    return <AnalyticsSkeleton darkMode={darkMode} />;
  }

  if (error && !isLoading) {
    return <AnalyticsErrorState error={error} onRetry={refetch} darkMode={darkMode} />;
  }

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      minHeight: '100vh',
    }}>
      <AnalyticsHeader darkMode={darkMode} isOnline={isOnline} />

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Stats Overview */}
        {stats && isValidData && (
          <AnalyticsStats
            stats={data.stats}
            recentInvoices={data.recentInvoices}
            darkMode={darkMode}
          />
        )}

        {/* Main Content */}
        {isValidData && (
          <AnalyticsPageContent
            data={data}
            darkMode={darkMode}
            onBack={handleBack}
            onDownload={handleDownloadReport}
          />
        )}

        {/* Empty State */}
        {!isValidData && !isLoading && !error && (
          <AnalyticsEmptyState darkMode={darkMode} />
        )}
      </Container>
    </Box>
  );
}

// Main exported component with layout wrapper
export default function AnalyticsPage() {
  return (
    <MainLayout title="Business Analytics">
      <AnalyticsContent />
    </MainLayout>
  );
}