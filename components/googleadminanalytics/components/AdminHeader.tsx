// components/googleadminanalytics/components/AdminHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Assessment
} from '@mui/icons-material';
import Link from 'next/link';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  backLink: string;
  backText: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  backLink,
  backText
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
      <Button
        component={Link}
        href={backLink}
        startIcon={<ArrowBack />}
        sx={{ 
          mb: 3,
          color: darkMode ? '#8ab4f8' : '#1a73e8',
          '&:hover': {
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.08)',
          },
        }}
      >
        {backText}
      </Button>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2 
      }}>
        <Box sx={{
          width: { xs: 48, sm: 56 },
          height: { xs: 48, sm: 56 },
          borderRadius: '16px',
          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: darkMode ? '#8ab4f8' : '#1a73e8',
        }}>
          <Assessment sx={{ fontSize: { xs: 24, sm: 28 } }} />
        </Box>
        <Box>
          <Typography 
            variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
            sx={{ 
              fontWeight: 500,
              color: darkMode ? '#e8eaed' : '#202124',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};