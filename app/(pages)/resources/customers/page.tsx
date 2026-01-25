// app/resources/customers/page.tsx
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

export default function CustomersResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('customers-guides');

  const customersResources = resourcesData.filter(cat => cat.module === 'Customers');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setExpandedCategory(null);
    }
  };

  return (
    <MainLayout title="Customers Resources">
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <ResourceHeader
          title="Customer Management Resources"
          subtitle="Everything you need to manage customer relationships and communications"
          module="Customers"
        />

        <ResourceSearch onSearch={handleSearch} />

        {!searchQuery.trim() && (
          <>
            <QuickHelpCards module="Customers" />
            
            <Box sx={{ mb: 6 }}>
              {customersResources.map((category) => (
                <ResourceCategory
                  key={category.id}
                  category={category}
                  expanded={expandedCategory === category.id}
                  onToggle={(id) => setExpandedCategory(id)}
                />
              ))}
            </Box>

            <CommonIssues module="Customers" />
          </>
        )}

        <ContactSupport />
      </Container>
    </MainLayout>
  );
}