"use client";

import React from 'react';
import { Gavel } from '@mui/icons-material';
import { LegalDocumentPage } from '@/components/legal/LegalDocumentPage';

export default function TermsOfServicePage() {
  const relatedLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Acceptable Use Policy', href: '/acceptable-use' },
    { label: 'Data Processing Agreement', href: '/data-processing' },
  ];

  return (
    <LegalDocumentPage
      title="Terms of Service"
      apiEndpoint="/api/legal/terms-of-service"
      icon={<Gavel />}
      description="Please read these terms carefully before using our services"
      relatedLinks={relatedLinks}
    />
  );
}