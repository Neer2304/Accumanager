// app/resources/attendance/page.tsx
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

export default function AttendanceResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('attendance-guides');

  const attendanceResources = resourcesData.filter(cat => cat.module === 'Attendance');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setExpandedCategory(null);
    }
  };

  return (
    <MainLayout title="Attendance Resources">
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <ResourceHeader
          title="Attendance Management Resources"
          subtitle="Everything you need to manage employee attendance effectively"
          module="Attendance"
        />

        <ResourceSearch onSearch={handleSearch} />

        {!searchQuery.trim() && (
          <>
            <QuickHelpCards module="Attendance" />
            
            <Box sx={{ mb: 6 }}>
              {attendanceResources.map((category) => (
                <ResourceCategory
                  key={category.id}
                  category={category}
                  expanded={expandedCategory === category.id}
                  onToggle={(id) => setExpandedCategory(id)}
                />
              ))}
            </Box>

            <CommonIssues module="Attendance" />
          </>
        )}

        <ContactSupport />
      </Container>
    </MainLayout>
  );
}