// components/privacy-policy/LegalDocumentContainer.tsx
"use client";

import React from 'react';
import { Paper } from '@mui/material';

interface LegalDocumentContainerProps {
  children: React.ReactNode;
}

export function LegalDocumentContainer({ children }: LegalDocumentContainerProps) {
  return (
    <Paper elevation={0} sx={{ 
      p: { xs: 3, md: 6 },
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider'
    }}>
      {children}
    </Paper>
  );
}