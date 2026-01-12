'use client';

import React, { useState } from 'react';
import { Container, Alert, Snackbar } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { HELP_SUPPORT_CONTENT } from './HelpSupportContent';
import { AIHelper } from './AIHelper/AIHelper';
import { BreadcrumbsSection } from './sections/BreadcrumbsSection';
import { HeaderSection } from './sections/HeaderSection';
import { TabsSection } from './sections/TabsSection';
import { TabPanel } from './sections/TabPanel';
import { QuickHelpSection } from './sections/QuickHelpSection';
import { DocumentationSection } from './sections/DocumentationSection';
import { ContactSupportSection } from './sections/ContactSupportSection';
import { VideoGuidesSection } from './sections/VideoGuidesSection';
import { SystemStatusSection } from './sections/SystemStatusSection';

export default function HelpSupportPage() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleFormChange = (field: keyof typeof contactForm, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: HELP_SUPPORT_CONTENT.messages.success.contactForm,
          severity: 'success',
        });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: HELP_SUPPORT_CONTENT.messages.error.contactForm,
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIClick = () => {
    // This will be handled by the AIHelper component
    console.log('AI Assistant clicked');
  };

  return (
    <MainLayout title={HELP_SUPPORT_CONTENT.page.title}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <BreadcrumbsSection />
        <HeaderSection />
        <TabsSection value={tabValue} onChange={handleTabChange} />

        <TabPanel value={tabValue} index={0}>
          <QuickHelpSection
            onAIClick={handleAIClick}
            onTabChange={setTabValue}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <DocumentationSection
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onSearchChange={handleSearchChange}
            onCategorySelect={handleCategorySelect}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ContactSupportSection
            formData={contactForm}
            isSubmitting={isSubmitting}
            onFormChange={handleFormChange}
            onSubmit={handleContactSubmit}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <VideoGuidesSection />
        </TabPanel>

        <SystemStatusSection />

        {/* AI Helper Component */}
        <AIHelper />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
}