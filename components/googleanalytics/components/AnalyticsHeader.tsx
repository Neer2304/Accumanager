// components/googleanalytics/components/AnalyticsHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  useTheme,
  alpha
} from '@mui/material';
import {
  Home as HomeIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { Chip } from '@/components/ui/Chip';

interface AnalyticsHeaderProps {
  darkMode: boolean;
  isOnline: boolean;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ darkMode, isOnline }) => {
  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
      background: darkMode 
        ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
        : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
    }}>
      <Breadcrumbs sx={{ 
        mb: { xs: 1, sm: 2 }, 
        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
      }}>
        <Link 
          href="/dashboard" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: darkMode ? '#9aa0a6' : '#5f6368', 
            fontWeight: 300,
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
          Dashboard
        </Link>
        <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
          Analytics
        </Typography>
      </Breadcrumbs>

      <Box sx={{ 
        textAlign: 'center', 
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}>
        <Typography 
          variant="h4" 
          fontWeight={500} 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          Business Analytics
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368', 
            fontWeight: 300,
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
            lineHeight: 1.5,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Real-time business performance metrics and insights
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2,
        flexWrap: 'wrap',
        mt: 3,
      }}>
        <Chip
          label="Business Intelligence"
          variant="outlined"
          sx={{
            backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
            borderColor: alpha('#4285f4', 0.3),
            color: darkMode ? '#8ab4f8' : '#4285f4',
          }}
        />
        {!isOnline && (
          <Chip
            label="Offline Mode"
            variant="outlined"
            sx={{
              backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
              borderColor: alpha('#fbbc04', 0.3),
              color: darkMode ? '#fdd663' : '#fbbc04',
            }}
          />
        )}
      </Box>
    </Box>
  );
};