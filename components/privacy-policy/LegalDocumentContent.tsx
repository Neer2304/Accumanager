// components/privacy-policy/LegalDocumentContent.tsx
"use client";

import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface LegalDocumentContentProps {
  content: string;
  version: string;
}

export function LegalDocumentContent({ content, version }: LegalDocumentContentProps) {
  return (
    <>
      <Box sx={{ 
        '& h1': { 
          mt: 4, 
          mb: 2, 
          fontSize: '1.75rem',
          fontWeight: 600,
          color: 'primary.main'
        },
        '& h2': { 
          mt: 3, 
          mb: 1.5, 
          fontSize: '1.5rem',
          fontWeight: 600
        },
        '& h3': { 
          mt: 2, 
          mb: 1, 
          fontSize: '1.25rem',
          fontWeight: 500
        },
        '& p': { 
          mb: 2, 
          lineHeight: 1.7,
          fontSize: '1rem'
        },
        '& ul, & ol': { 
          pl: 4, 
          mb: 2 
        },
        '& li': { 
          mb: 1,
          lineHeight: 1.6
        },
        '& strong': {
          fontWeight: 600
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        }
      }}>
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </Box>

      <Divider sx={{ my: 4 }} />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} AccumaManage. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Document ID: PP-{version.replace(/\./g, '')}
        </Typography>
      </Box>
    </>
  );
}