"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import { QuestionAnswer } from '@mui/icons-material';
import Link from 'next/link';

export const FAQCallToAction: React.FC = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: darkMode
          ? `linear-gradient(135deg, ${alpha('#4285f4', 0.8)} 0%, ${alpha('#0d3064', 0.9)} 100%)`
          : `linear-gradient(135deg, ${alpha('#4285f4', 0.9)} 0%, ${alpha('#0d3064', 0.9)} 100%)`,
        color: '#ffffff',
        position: 'relative',
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
      <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              backgroundColor: alpha('#ffffff', 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <QuestionAnswer sx={{ fontSize: 32, color: '#ffffff' }} />
          </Box>
        </Box>
        
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
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
            fontWeight: 600,
            textTransform: 'none',
            backgroundColor: '#ffffff',
            color: '#4285f4',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha('#000', 0.2)}`,
            },
          }}
        >
          Visit FAQ Section
        </Button>
      </CardContent>
    </Card>
  );
};