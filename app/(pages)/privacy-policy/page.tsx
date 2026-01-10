// app/privacy-policy/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface LegalDocument {
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
}

export default function PrivacyPolicyPage() {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/legal/privacy_policy');
      
      if (!response.ok) {
        throw new Error('Failed to fetch privacy policy');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDocument(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load privacy policy');
      console.error('Error fetching privacy policy:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!document) return;
    
    const blob = new Blob([document.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privacy-policy-${document.version}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          component={Link}
          href="/"
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {document && (
        <Paper elevation={0} sx={{ p: { xs: 3, md: 6 } }}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {document.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Version {document.version} • Last updated: {new Date(document.lastUpdated).toLocaleDateString()}
              </Typography>
            </Box>
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              variant="outlined"
              size="small"
            >
              Download
            </Button>
          </Box>

          <Box sx={{ 
            '& h1': { mt: 4, mb: 2, fontSize: '2rem' },
            '& h2': { mt: 3, mb: 1.5, fontSize: '1.5rem' },
            '& h3': { mt: 2, mb: 1, fontSize: '1.25rem' },
            '& p': { mb: 2, lineHeight: 1.6 },
            '& ul, & ol': { pl: 4, mb: 2 },
            '& li': { mb: 1 }
          }}>
            <ReactMarkdown>
              {document.content}
            </ReactMarkdown>
          </Box>

          <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} AccumaManage. All rights reserved.
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
}