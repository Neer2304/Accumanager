// components/privacy-policy/LegalDocumentHeader.tsx
"use client";

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

interface LegalDocumentHeaderProps {
  title: string;
  version: string;
  lastUpdated: string;
  onDownload: () => void;
}

export function LegalDocumentHeader({ 
  title, 
  version, 
  lastUpdated, 
  onDownload 
}: LegalDocumentHeaderProps) {
  return (
    <Box sx={{ 
      mb: 4, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="600">
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            Version {version}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>
      </Box>
      <Button
        startIcon={<DownloadIcon />}
        onClick={onDownload}
        variant="outlined"
        size="medium"
      >
        Download
      </Button>
    </Box>
  );
}