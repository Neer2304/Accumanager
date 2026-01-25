// app/resources/dashboard/page.tsx
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

export default function DashboardResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('dashboard-guides');

  const dashboardResources = resourcesData.filter(cat => cat.module === 'Dashboard');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setExpandedCategory(null);
    }
  };

  return (
    <MainLayout title="Dashboard Resources">
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <ResourceHeader
          title="Dashboard & Analytics Resources"
          subtitle="Everything you need to customize dashboards and analyze data"
          module="Dashboard"
        />

        <ResourceSearch onSearch={handleSearch} />

        {!searchQuery.trim() && (
          <>
            <QuickHelpCards module="Dashboard" />
            
            <Box sx={{ mb: 6 }}>
              {dashboardResources.map((category) => (
                <ResourceCategory
                  key={category.id}
                  category={category}
                  expanded={expandedCategory === category.id}
                  onToggle={(id) => setExpandedCategory(id)}
                />
              ))}
            </Box>

            <CommonIssues module="Dashboard" />
          </>
        )}

        <ContactSupport />
      </Container>
    </MainLayout>
  );
}