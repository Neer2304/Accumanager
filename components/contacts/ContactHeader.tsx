"use client";

import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { SupportAgent } from '@mui/icons-material';

export const ContactHeader: React.FC = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2.5rem', md: '3rem' },
          fontWeight: 800,
          background: darkMode
            ? `linear-gradient(135deg, #8ab4f8 0%, #4285f4 100%)`
            : `linear-gradient(135deg, #4285f4 0%, #0d3064 100%)`,
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
        sx={{
          maxWidth: 700,
          mx: 'auto',
          lineHeight: 1.6,
          fontSize: { xs: '1rem', md: '1.125rem' },
          color: darkMode ? '#9aa0a6' : '#5f6368',
        }}
      >
        Have questions? We&apos;re here to help. Reach out to our team for any inquiries 
        about AccuManage solutions.
      </Typography>
    </Box>
  );
};