// components/privacy-policy/LegalDocumentFooter.tsx
"use client";

import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import Link from 'next/link';

interface LegalDocumentFooterProps {
  showTermsLink?: boolean;
  homeLink?: string;
  termsLink?: string;
}

export function LegalDocumentFooter({ 
  showTermsLink = true, 
  homeLink = "/",
  termsLink = "/terms-of-service"
}: LegalDocumentFooterProps) {
  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
      {showTermsLink && (
        <Button
          component={Link}
          href={termsLink}
          variant="text"
        >
          View Terms of Service
        </Button>
      )}
      <Button
        startIcon={<BackIcon />}
        component={Link}
        href={homeLink}
        variant="contained"
      >
        Return to Home
      </Button>
    </Box>
  );
}