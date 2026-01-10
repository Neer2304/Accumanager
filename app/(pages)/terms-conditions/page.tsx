// app/terms-conditions/page.tsx - UPDATED VERSION
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from '@mui/material';
import {
  Gavel as GavelIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  PrivacyTip as PrivacyIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

// Icon mapping
const iconMap: { [key: string]: React.ReactElement } = {
  'Gavel': <GavelIcon />,
  'Business': <BusinessIcon />,
  'Privacy': <PrivacyIcon />,
  'Security': <SecurityIcon />,
  'Payment': <PaymentIcon />,
  'Description': <DescriptionIcon />,
};

interface TermsSection {
  title: string;
  content: string;
  order: number;
  icon: string;
}

interface ImportantPoint {
  text: string;
  order: number;
}

interface TermsData {
  version: string;
  title: string;
  description: string;
  sections: TermsSection[];
  importantPoints: ImportantPoint[];
  effectiveDate: string;
  lastUpdated: string;
  isActive: boolean;
}

export default function TermsConditionsPage() {
  const [terms, setTerms] = useState<TermsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/terms');
      
      if (!response.ok) {
        throw new Error('Failed to fetch terms and conditions');
      }
      
      const termsData = await response.json();
      setTerms(termsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching terms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout title="Terms & Conditions">
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error || !terms) {
    return (
      <MainLayout title="Terms & Conditions">
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Failed to load terms and conditions'}
          </Alert>
          <Button onClick={fetchTerms} variant="contained">
            Retry
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Terms & Conditions">
      <Box sx={{ p: 3, maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            color: 'white',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Chip 
              label={`v${terms.version}`} 
              color="primary" 
              variant="filled"
              sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip 
              icon={<UpdateIcon />}
              label={`Updated: ${formatDate(terms.lastUpdated)}`}
              variant="outlined"
              sx={{ borderColor: 'white', color: 'white' }}
            />
          </Box>
          
          <GavelIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            {terms.title}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Effective: {formatDate(terms.effectiveDate)}
          </Typography>
          {terms.description && (
            <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
              {terms.description}
            </Typography>
          )}
        </Paper>

        {/* Important Notice */}
        <Card sx={{ mb: 4, border: '2px solid', borderColor: 'warning.main' }}>
          <CardContent>
            <Typography variant="h6" color="warning.main" gutterBottom fontWeight="bold">
              ⚠️ Important Legal Notice
            </Typography>
            <Typography variant="body2">
              Please read these terms carefully before using our services. By using AccuManage, 
              you agree to be bound by these terms and conditions. If you disagree with any part, 
              you may not access our services.
            </Typography>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              1. Agreement Overview
            </Typography>
            <Typography variant="body1" paragraph>
              This Terms of Service agreement (the "Agreement") governs your use of the AccuManage 
              Business Management System. This Agreement is a legal contract between you (the "User") 
              and AccuManage ("the Company").
            </Typography>
          </CardContent>
        </Card>

        {/* Dynamic Sections from API */}
        {terms.sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
          <Card key={section._id || index} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Box sx={{ color: 'primary.main', mt: 0.5 }}>
                  {iconMap[section.icon] || <DescriptionIcon />}
                </Box>
                <Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {index + 2}. {section.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {section.content}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Important Points */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              {terms.sections.length + 2}. User Obligations
            </Typography>
            <List>
              {terms.importantPoints
                .sort((a, b) => a.order - b.order)
                .map((point, index) => (
                <ListItem key={point._id || index}>
                  <ListItemIcon>
                    <DescriptionIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={point.text} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Version Info */}
        <Card>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1 }}>
              <HistoryIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Terms Version: {terms.version} • Effective: {formatDate(terms.effectiveDate)}
              </Typography>
            </Box>
            <Typography variant="caption" display="block" color="text.secondary">
              These terms may be updated from time to time. Continued use of the Service after changes 
              constitutes acceptance of the new terms.
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Contact us at: legal@accumanage.com
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}