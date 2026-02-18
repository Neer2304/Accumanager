// components/googlecompanies/CompaniesPage.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  useTheme,
  Alert,
  IconButton,
  SelectChangeEvent
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { MainLayout } from '@/components/Layout/MainLayout';

// Import components
import { CompanyHeader } from './components/CompanyHeader';
import { CompanyStats } from './components/CompanyStats';
import { CompanyFilters } from './components/CompanyFilters';
import { CompanyGrid } from './components/CompanyGrid';
import { CompanyDetailDialog } from './components/CompanyDialogs/CompanyDetailDialog';
import { DeleteConfirmDialog } from './components/CompanyDialogs/DeleteConfirmDialog';
import { CompanyMenu } from './components/CompanyMenu';

// Import hooks
import { useCompanies } from './hooks/useCompanies';

export default function CompaniesPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const router = useRouter();
  
  const {
    filteredCompanies,
    loading,
    error,
    setError,
    deleting,
    selectedCompany,
    setSelectedCompany,
    searchQuery,
    setSearchQuery,
    planFilter,
    setPlanFilter,
    canCreateMore,
    stats,
    handleDelete,
    refreshCompanies
  } = useCompanies();

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePlanFilterChange = (event: SelectChangeEvent) => {
    setPlanFilter(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, company: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCompany(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = (company: any) => {
    setSelectedCompany(company);
    setDetailDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCompany) {
      const success = await handleDelete(selectedCompany._id);
      if (success) {
        setDeleteDialogOpen(false);
        setSelectedCompany(null);
      }
    }
  };

  return (
    <MainLayout title="Companies">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
        py: { xs: 2, sm: 3, md: 4 }
      }}>
        <Container maxWidth="xl">
          <CompanyHeader 
            canCreateMore={canCreateMore}
            darkMode={darkMode}
          />

          <CompanyStats stats={stats} darkMode={darkMode} />

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4, 
                borderRadius: '12px',
                backgroundColor: darkMode ? 'rgba(234,67,53,0.1)' : 'rgba(234,67,53,0.05)',
                color: darkMode ? '#f28b82' : '#d93025',
                border: `1px solid ${darkMode ? 'rgba(234,67,53,0.2)' : 'rgba(234,67,53,0.2)'}`
              }}
              action={
                <IconButton size="small" onClick={() => setError(null)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          )}

          <CompanyFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchClear={() => setSearchQuery('')}
            planFilter={planFilter}
            onPlanFilterChange={handlePlanFilterChange}
            onRefresh={refreshCompanies}
            canCreateMore={canCreateMore}
            onCreateClick={() => router.push('/companies/create')}
            darkMode={darkMode}
          />

          <CompanyGrid
            companies={filteredCompanies}
            darkMode={darkMode}
            searchQuery={searchQuery}
            planFilter={planFilter}
            canCreateMore={canCreateMore}
            onMenuOpen={handleMenuOpen}
            onCardClick={handleCardClick}
            onTeamClick={(companyId, e) => {
              e.stopPropagation();
              router.push(`/companies/${companyId}/members`);
            }}
            onViewClick={(companyId, e) => {
              e.stopPropagation();
              router.push(`/companies/${companyId}`);
            }}
            onCreateClick={() => router.push('/companies/create')}
          />

          <CompanyDetailDialog
            open={detailDialogOpen}
            onClose={() => setDetailDialogOpen(false)}
            company={selectedCompany}
            darkMode={darkMode}
          />

          <DeleteConfirmDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            company={selectedCompany}
            deleting={deleting === selectedCompany?._id}
            darkMode={darkMode}
          />

          <CompanyMenu
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            selectedCompany={selectedCompany}
            onViewDetails={() => {
              handleMenuClose();
              setDetailDialogOpen(true);
            }}
            onManageTeam={() => {
              handleMenuClose();
              if (selectedCompany) {
                router.push(`/companies/${selectedCompany._id}/members`);
              }
            }}
            onDelete={() => {
              handleMenuClose();
              setDeleteDialogOpen(true);
            }}
            darkMode={darkMode}
          />
        </Container>
      </Box>
    </MainLayout>
  );
}