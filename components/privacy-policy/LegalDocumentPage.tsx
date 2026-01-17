// components/privacy-policy/LegalDocumentPage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Container, Alert } from '@mui/material';
import {
  LegalDocumentHeader,
  LegalDocumentContent,
  LegalDocumentFooter,
  LegalDocumentError,
  LegalDocumentLoading,
  LegalDocumentContainer,
  LegalDocumentNavigation,
} from './index';

interface LegalDocumentPageProps {
  apiEndpoint: string;
  documentName: string;
  backLink?: string;
  showTermsLink?: boolean;
  termsLink?: string;
  homeLink?: string;
}

interface LegalDocumentData {
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
}

export function LegalDocumentPage({
  apiEndpoint,
  documentName,
  backLink = "/",
  showTermsLink = true,
  termsLink = "/terms-of-service",
  homeLink = "/"
}: LegalDocumentPageProps) {
  const [document, setDocument] = useState<LegalDocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDocument();
  }, [apiEndpoint]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${documentName}. Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setDocument(data.data);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (err: any) {
      console.error(`Error fetching ${documentName}:`, err);
      setError(`Failed to load ${documentName}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!document) return;
    
    try {
      const fileName = `${documentName.toLowerCase().replace(/\s+/g, '-')}-v${document.version}.md`;
      const blob = new Blob([document.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
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
        <LegalDocumentLoading message={`Loading ${documentName}...`} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <LegalDocumentNavigation 
        backLink={backLink} 
        backText={`Back to ${backLink === "/" ? "Home" : "Previous"}`}
      />

      {/* Error Alert */}
      {error && !document && (
        <LegalDocumentError 
          error={error} 
          onRetry={fetchDocument}
          homeLink={homeLink}
        />
      )}

      {/* Warning Alert */}
      {error && document && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      {document && (
        <>
          <LegalDocumentContainer>
            <LegalDocumentHeader
              title={document.title}
              version={document.version}
              lastUpdated={document.lastUpdated}
              onDownload={handleDownload}
            />
            
            <LegalDocumentContent
              content={document.content}
              version={document.version}
            />
          </LegalDocumentContainer>

          <LegalDocumentFooter
            showTermsLink={showTermsLink}
            homeLink={homeLink}
            termsLink={termsLink}
          />
        </>
      )}
    </Container>
  );
}