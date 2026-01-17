// components/privacy-policy/LegalDocumentNavigation.tsx
"use client";

import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import Link from 'next/link';

interface LegalDocumentNavigationProps {
  backLink?: string;
  backText?: string;
}

export function LegalDocumentNavigation({ 
  backLink = "/", 
  backText = "Back to Home" 
}: LegalDocumentNavigationProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Button
        startIcon={<BackIcon />}
        component={Link}
        href={backLink}
        sx={{ mb: 2 }}
      >
        {backText}
      </Button>
    </Box>
  );
}