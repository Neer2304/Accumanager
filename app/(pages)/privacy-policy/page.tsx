// app/privacy-policy/page.tsx - CORRECTED VERSION
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
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface LegalDocumentData {
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
}

export default function PrivacyPolicyPage() {
  const [legalDocument, setLegalDocument] = useState<LegalDocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/legal/privacy-policy');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch privacy policy. Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setLegalDocument(data.data);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (err: any) {
      console.error('Error fetching privacy policy:', err);
      setError(err.message || 'Failed to load privacy policy. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!legalDocument) return;
    
    try {
      const blob = new Blob([legalDocument.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `privacy-policy-v${legalDocument.version}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error('Download error:', downloadError);
      setError('Failed to download document');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Loading Privacy Policy...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error && !legalDocument) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
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
        
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Error Loading Document
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Privacy Policy Not Available
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            We apologize for the inconvenience. Please try again later or contact support.
          </Typography>
          <Button 
            variant="contained" 
            onClick={fetchDocument}
            sx={{ mr: 2 }}
          >
            Retry
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            href="/"
          >
            Go to Homepage
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Navigation */}
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

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      {legalDocument && (
        <Paper elevation={0} sx={{ 
          p: { xs: 3, md: 6 },
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          {/* Header */}
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
                {legalDocument.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Version {legalDocument.version}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date(legalDocument.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            </Box>
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              variant="outlined"
              size="medium"
            >
              Download
            </Button>
          </Box>

          {/* Content */}
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
              {legalDocument.content}
            </ReactMarkdown>
          </Box>

          {/* Footer */}
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
              Document ID: PP-{legalDocument.version.replace(/\./g, '')}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Bottom Navigation */}
      {legalDocument && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            component={Link}
            href="/terms-of-service"
            variant="text"
          >
            View Terms of Service
          </Button>
          <Button
            startIcon={<BackIcon />}
            component={Link}
            href="/"
            variant="contained"
          >
            Return to Home
          </Button>
        </Box>
      )}
    </Container>
  );
}