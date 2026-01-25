// app/resources/page.tsx - MAIN PAGE
"use client";

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/Layout/MainLayout';
import {
  ResourceHeader,
  ResourceSearch,
  ResourceCategory,
  QuickHelpCards,
  CommonIssues,
  ContactSupport,
  resourcesData,
  moduleColors,
} from '@/components/resources';

export default function ResourcesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(searchParams.get('module') ? null : 'attendance-guides');
  const [activeModule, setActiveModule] = useState<string | null>(searchParams.get('module'));

  // Get module from URL
  const moduleParam = searchParams.get('module');

  // Filter resources by module if specified
  const filteredResources = useMemo(() => {
    if (moduleParam) {
      return resourcesData.filter(category => category.module === moduleParam);
    }
    return resourcesData;
  }, [moduleParam]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setExpandedCategory(null);
    }
  };

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return undefined;
    
    const results = [];
    for (const category of resourcesData) {
      for (const item of category.items) {
        if (
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          results.push(item);
        }
      }
    }
    
    return results;
  }, [searchQuery]);

  // Toggle category
  const handleToggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Module filter chips
  const modules = Array.from(new Set(resourcesData.map(cat => cat.module)));

  return (
    <MainLayout title="Help & Resources">
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Header */}
        <ResourceHeader
          title="Help & Resources Center"
          subtitle="Comprehensive guides, templates, and support for all your business modules"
          module={moduleParam || undefined}
        />

        {/* Module Filter */}
        {!moduleParam && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              Browse by Module
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="All Modules"
                onClick={() => {
                  router.push('/resources');
                  setActiveModule(null);
                }}
                color={!activeModule ? 'primary' : 'default'}
                variant={!activeModule ? 'filled' : 'outlined'}
                sx={{ fontWeight: !activeModule ? 'bold' : 'normal' }}
              />
              {modules.map((module) => (
                <Chip
                  key={module}
                  label={module}
                  onClick={() => {
                    router.push(`/resources?module=${module}`);
                    setActiveModule(module);
                  }}
                  color={activeModule === module ? 'primary' : 'default'}
                  variant={activeModule === module ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: activeModule === module ? 'bold' : 'normal',
                    borderColor: moduleColors[module] || theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(moduleColors[module] || theme.palette.primary.main, 0.1),
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Search */}
        <ResourceSearch
          onSearch={handleSearch}
          searchResults={searchResults}
          allResources={resourcesData.flatMap(cat => cat.items)}
        />

        {/* Search Results Alert */}
        {searchQuery.trim() && searchResults && (
          <Alert 
            severity="info" 
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            }
          >
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
          </Alert>
        )}

        {/* No Results */}
        {searchQuery.trim() && searchResults && searchResults.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6, mb: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No results found for "{searchQuery}"
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try different keywords or browse the categories below
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </Box>
        )}

        {/* Quick Help Cards */}
        {!searchQuery.trim() && (
          <QuickHelpCards module={moduleParam || undefined} />
        )}

        {/* Resource Categories */}
        {!searchQuery.trim() && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              {moduleParam ? `${moduleParam} Resources` : 'All Resources'}
            </Typography>

            {filteredResources.map((category) => (
              <ResourceCategory
                key={category.id}
                category={category}
                expanded={expandedCategory === category.id}
                onToggle={handleToggleCategory}
              />
            ))}
          </Box>
        )}

        {/* Common Issues */}
        {!searchQuery.trim() && (
          <CommonIssues module={moduleParam || undefined} />
        )}

        {/* Contact Support */}
        <Box sx={{ mb: 4 }}>
          <ContactSupport />
        </Box>
      </Container>
    </MainLayout>
  );
}