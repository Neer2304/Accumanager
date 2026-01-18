// components/contacts/ContactHeader.tsx
"use client";

import React from 'react';
import { Box, Typography, Chip, useTheme, alpha } from '@mui/material';
import { SupportAgent } from '@mui/icons-material';

export const ContactHeader: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
      <Chip
        label="24/7 Support Available"
        color="primary"
        icon={<SupportAgent />}
        sx={{
          mb: 3,
          px: 2,
          py: 1,
          fontSize: '0.875rem',
          fontWeight: 600,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          '& .MuiChip-icon': {
            color: theme.palette.primary.main,
          }
        }}
      />
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2.5rem', md: '3rem' },
          fontWeight: 800,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
        }}
      >
        Get in Touch
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          maxWidth: 700,
          mx: 'auto',
          lineHeight: 1.6,
          fontSize: { xs: '1rem', md: '1.125rem' },
        }}
      >
        Have questions? We&apos;re here to help. Reach out to our team for any inquiries 
        about AccumaManage solutions.
      </Typography>
    </Box>
  );
};