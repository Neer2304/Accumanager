// app/resources/analytics/page.tsx
"use client";

import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import {
  ResourceHeader,
  ResourceSearch,
  ResourceCategory,
  QuickHelpCards,
  CommonIssues,
  ContactSupport,
  resourcesData,
} from '@/components/resources';

export default function AnalyticsResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('analytics-guides');

  const analyticsResources = resourcesData.filter(cat => cat.module === 'Analytics');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setExpandedCategory(null);
    }
  };

  return (
    <MainLayout title="Analytics Resources">
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <ResourceHeader
          title="Analytics & Reports Resources"
          subtitle="Everything you need to analyze data, generate reports, and gain business insights"
          module="Analytics"
        />

        <ResourceSearch onSearch={handleSearch} />

        {!searchQuery.trim() && (
          <>
            <QuickHelpCards module="Analytics" />
            
            <Box sx={{ mb: 6 }}>
              {analyticsResources.map((category) => (
                <ResourceCategory
                  key={category.id}
                  category={category}
                  expanded={expandedCategory === category.id}
                  onToggle={(id) => setExpandedCategory(id)}
                />
              ))}
            </Box>

            <CommonIssues module="Analytics" />
          </>
        )}

        <ContactSupport />
      </Container>
    </MainLayout>
  );
}