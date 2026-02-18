// components/googlecompanies/components/CompanyHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  alpha,
  useTheme,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  Add as AddIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CompanyHeaderProps {
  canCreateMore: boolean;
  darkMode: boolean;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ canCreateMore, darkMode }) => {
  const router = useRouter();
  const theme = useTheme();
  const GOOGLE_COLORS = { blue: '#1a73e8' };

  return (
    <>
      <Breadcrumbs sx={{ 
        mb: 3, 
        color: darkMode ? '#9aa0a6' : '#5f6368',
        '& a': { 
          color: darkMode ? '#9aa0a6' : '#5f6368',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            color: darkMode ? '#e8eaed' : '#202124',
            textDecoration: 'underline'
          }
        }
      }}>
        <MuiLink component={Link} href="/dashboard">
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Dashboard
        </MuiLink>
        <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={500}>
          Companies
        </Typography>
      </Breadcrumbs>

      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, sm: 4 },
          mb: 4,
          borderRadius: '24px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '100%',
          background: darkMode
            ? `linear-gradient(90deg, transparent, ${alpha(GOOGLE_COLORS.blue, 0.02)} 50%, ${alpha(GOOGLE_COLORS.blue, 0.04)})`
            : `linear-gradient(90deg, transparent, ${alpha(GOOGLE_COLORS.blue, 0.02)} 50%, ${alpha(GOOGLE_COLORS.blue, 0.04)})`,
          pointerEvents: 'none'
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1"
              fontWeight={500} 
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                letterSpacing: '-0.01em',
                color: darkMode ? '#e8eaed' : '#202124',
                mb: 1
              }}
            >
              Companies
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                maxWidth: 600
              }}
            >
              Manage your organizations, team access, and company settings from one place
            </Typography>
          </Box>
          
          {canCreateMore && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/companies/create')}
              sx={{ 
                borderRadius: '28px',
                backgroundColor: GOOGLE_COLORS.blue,
                '&:hover': { backgroundColor: '#1a5cb0' },
                px: 4,
                py: 1.5,
                fontSize: '0.9375rem',
                fontWeight: 500,
                boxShadow: 'none'
              }}
            >
              New Company
            </Button>
          )}
        </Box>
      </Paper>
    </>
  );
};