'use client';

import React from 'react';
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
  Chip,
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useTermsData } from '@/hooks/useTermsData';
import { TERMS_CONTENT } from './TermsContent';
import { LegalIcon, getSectionIcon } from './TermsIcons';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { DateChip } from '@/components/common/DateChip';

export default function TermsConditionsPage() {
  const { terms, loading, error, fetchTerms } = useTermsData();

  if (loading) {
    return (
      <MainLayout title={TERMS_CONTENT.page.title}>
        <LoadingState />
      </MainLayout>
    );
  }

  if (error || !terms) {
    return (
      <MainLayout title={TERMS_CONTENT.page.title}>
        <ErrorState 
          error={error || TERMS_CONTENT.page.errorTitle} 
          onRetry={fetchTerms}
          retryText={TERMS_CONTENT.buttons.retry}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout title={TERMS_CONTENT.page.title}>
      <Box sx={{ p: 3, maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            textAlign: 'center',
            background: TERMS_CONTENT.header.gradient,
            color: 'white',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Chip 
              label={`${TERMS_CONTENT.labels.version} ${terms.version}`} 
              color="primary" 
              variant="filled"
              sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <DateChip 
              date={terms.lastUpdated}
              label={TERMS_CONTENT.labels.updated}
              variant="outlined"
              sx={{ borderColor: 'white', color: 'white' }}
            />
          </Box>
          
          <LegalIcon name="Gavel" size="extraLarge" sx={{ mb: 2, color: 'white' }} />
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            {terms.title}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {TERMS_CONTENT.header.effectiveDatePrefix}{terms.effectiveDate}
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
              {TERMS_CONTENT.importantNotice.title}
            </Typography>
            <Typography variant="body2">
              {TERMS_CONTENT.importantNotice.content}
            </Typography>
          </CardContent>
        </Card>

        {/* Agreement Overview */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              {TERMS_CONTENT.agreementOverview.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {TERMS_CONTENT.agreementOverview.content}
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
                  <LegalIcon 
                    name={getSectionIcon(section.icon)} 
                    size="large" 
                  />
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
              {terms.sections.length + 2}. {TERMS_CONTENT.userObligations.titlePrefix}
            </Typography>
            <List>
              {terms.importantPoints.length > 0 
                ? terms.importantPoints
                    .sort((a, b) => a.order - b.order)
                    .map((point, index) => (
                    <ListItem key={point._id || index}>
                      <ListItemIcon>
                        <LegalIcon name="CheckCircle" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={point.text} />
                    </ListItem>
                  ))
                : TERMS_CONTENT.userObligations.defaultPoints.map((point, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <LegalIcon name="CheckCircle" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))
              }
            </List>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1 }}>
              <LegalIcon name="History" color="action" />
              <Typography variant="body2" color="text.secondary">
                {TERMS_CONTENT.labels.version}: {terms.version} • {TERMS_CONTENT.labels.effectiveDate}: {terms.effectiveDate}
              </Typography>
            </Box>
            <Typography variant="caption" display="block" color="text.secondary">
              {TERMS_CONTENT.footer.updateNotice}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {TERMS_CONTENT.footer.contactEmail}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}