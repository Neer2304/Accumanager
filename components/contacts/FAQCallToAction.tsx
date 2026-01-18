// components/contacts/FAQCallToAction.tsx
"use client";

import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import { QuestionAnswer } from '@mui/icons-material';
import Link from 'next/link';

export const FAQCallToAction: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        mt: { xs: 6, md: 8 },
        p: { xs: 4, md: 6 },
        borderRadius: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <QuestionAnswer
          sx={{
            fontSize: { xs: 48, md: 64 },
            mb: 3,
            opacity: 0.9,
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 800,
            mb: 2,
          }}
        >
          Check Our FAQ First
        </Typography>
        <Typography
          variant="body1"
          sx={{
            opacity: 0.9,
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            fontSize: '1.125rem',
            lineHeight: 1.7,
          }}
        >
          Many common questions are already answered in our comprehensive FAQ section.
          Save time by checking it first!
        </Typography>
        <Button
          component={Link}
          href="/faq"
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'none',
            bgcolor: 'white',
            color: theme.palette.primary.main,
            '&:hover': {
              bgcolor: 'grey.50',
              transform: 'translateY(-3px)',
              boxShadow: `0 10px 30px ${alpha('#000', 0.2)}`,
            },
          }}
        >
          Visit FAQ Section
        </Button>
      </Box>
    </Box>
  );
};