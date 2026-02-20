// components/googleapidocs/ApiDocsPage.tsx
'use client';

import React from 'react';
import {
  Box,
  Container,
  useTheme
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';

// Import components
import { ApiDocsHeader } from './components/ApiDocsHeader';
import { ApiStats } from './components/ApiStats';
import { ApiExplorer } from './components/ApiExplorer';
import { ApiAuthAlert } from './components/ApiAuthAlert';
import { ApiEndpointList } from './components/ApiEndpointList';
import { EmptyApiState } from './components/EmptyApiState';
import { ApiUsageNotes } from './components/ApiUsageNotes';

// Import hooks
import { useApiDocs } from './components/hooks/useApiDocs';

function ApiDocsContent() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const {
    filteredEndpoints,
    categories,
    expandedEndpoint,
    searchQuery,
    selectedCategory,
    stats,
    setExpandedEndpoint,
    setSearchQuery,
    setSelectedCategory,
    handleCopy,
    getMethodColor,
    clearFilters
  } = useApiDocs();

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      minHeight: '100vh',
    }}>
      <ApiDocsHeader darkMode={darkMode} totalEndpoints={stats.totalEndpoints} />

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Quick Stats */}
        <ApiStats stats={stats} darkMode={darkMode} />

        {/* Header Controls */}
        <ApiExplorer
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          darkMode={darkMode}
        />

        {/* Getting Started Alert */}
        <ApiAuthAlert darkMode={darkMode} />

        {/* API Endpoints */}
        {filteredEndpoints.length > 0 ? (
          <ApiEndpointList
            endpoints={filteredEndpoints}
            expandedEndpoint={expandedEndpoint}
            onToggleEndpoint={setExpandedEndpoint}
            onCopy={handleCopy}
            getMethodColor={getMethodColor}
            darkMode={darkMode}
          />
        ) : (
          <EmptyApiState onClearFilters={clearFilters} darkMode={darkMode} />
        )}

        {/* API Usage Notes */}
        <ApiUsageNotes darkMode={darkMode} />
      </Container>
    </Box>
  );
}

// Main exported component with layout wrapper
export default function ApiDocsPage() {
  return (
    <MainLayout title="API Documentation">
      <ApiDocsContent />
    </MainLayout>
  );
}