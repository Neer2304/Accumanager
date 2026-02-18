// components/googlecompanies/components/CompanyGrid.tsx
import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import { CompanyCard } from './CompanyCard';
import { Button } from '@/components/ui/Button';
import { AddIcon } from '@/assets/icons/InventoryIcons';

interface Company {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  industry?: string;
  size: string;
  logo?: string;
  userRole: string;
  memberCount: number;
  maxMembers: number;
  plan: string;
  address?: {
    city?: string;
    country?: string;
  };
}

interface CompanyGridProps {
  companies: Company[];
  darkMode: boolean;
  searchQuery: string;
  planFilter: string;
  canCreateMore: boolean;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, company: Company) => void;
  onCardClick: (company: Company) => void;
  onTeamClick: (companyId: string, e: React.MouseEvent) => void;
  onViewClick: (companyId: string, e: React.MouseEvent) => void;
  onCreateClick: () => void;
}

export const CompanyGrid: React.FC<CompanyGridProps> = ({
  companies,
  darkMode,
  searchQuery,
  planFilter,
  canCreateMore,
  onMenuOpen,
  onCardClick,
  onTeamClick,
  onViewClick,
  onCreateClick
}) => {
  if (companies.length === 0) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          textAlign: 'center', 
          py: 8,
          px: 3,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '24px',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
            color: darkMode ? '#9aa0a6' : '#5f6368',
            margin: '0 auto',
            mb: 2
          }}>
            <BusinessIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            No Companies Found
          </Typography>
          <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}>
            {searchQuery || planFilter !== 'all'
              ? "No companies match your current filters. Try adjusting your search criteria."
              : "Get started by creating your first company."}
          </Typography>
        </Box>
        {!searchQuery && planFilter === 'all' && canCreateMore && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateClick}
            sx={{ 
              borderRadius: '28px',
              backgroundColor: '#1a73e8',
              '&:hover': { backgroundColor: '#1a5cb0' },
              px: 5,
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            Create Your First Company
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(4, 1fr)'
      },
      gap: 3,
    }}>
      {companies.map((company) => (
        <CompanyCard
          key={company._id}
          company={company}
          darkMode={darkMode}
          onMenuOpen={onMenuOpen}
          onCardClick={onCardClick}
          onTeamClick={onTeamClick}
          onViewClick={onViewClick}
        />
      ))}
    </Box>
  );
};