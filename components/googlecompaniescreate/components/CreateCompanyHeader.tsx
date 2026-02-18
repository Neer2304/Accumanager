// components/googlecompaniescreate/components/CreateCompanyHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  IconButton,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GOOGLE_COLORS } from '../constants';

interface CreateCompanyHeaderProps {
  darkMode: boolean;
}

export const CreateCompanyHeader: React.FC<CreateCompanyHeaderProps> = ({ darkMode }) => {
  const router = useRouter();

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      background: darkMode 
        ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
        : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
    }}>
      <Breadcrumbs sx={{ 
        mb: { xs: 1, sm: 2 }, 
        color: darkMode ? '#9aa0a6' : '#5f6368',
      }}>
        <Link 
          href="/dashboard" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: 'inherit',
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
          Dashboard
        </Link>
        <Link 
          href="/companies" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: 'inherit',
          }}
        >
          Companies
        </Link>
        <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
          Create New
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={() => router.back()}
          sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Create New Company
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}>
            Set up your company to start managing your business and team
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};