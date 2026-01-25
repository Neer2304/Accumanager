// app/resources/billing/page.tsx
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

export default function BillingResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('billing-guides');

  const billingResources = resourcesData.filter(cat => cat.module === 'Billing');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setExpandedCategory(null);
    }
  };

  return (
    <MainLayout title="Billing Resources">
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <ResourceHeader
          title="Billing & Invoicing Resources"
          subtitle="Everything you need to manage invoices, payments, and financial records"
          module="Billing"
        />

        <ResourceSearch onSearch={handleSearch} />

        {!searchQuery.trim() && (
          <>
            <QuickHelpCards module="Billing" />
            
            <Box sx={{ mb: 6 }}>
              {billingResources.map((category) => (
                <ResourceCategory
                  key={category.id}
                  category={category}
                  expanded={expandedCategory === category.id}
                  onToggle={(id) => setExpandedCategory(id)}
                />
              ))}
            </Box>

            <CommonIssues module="Billing" />
          </>
        )}

        <ContactSupport />
      </Container>
    </MainLayout>
  );
}