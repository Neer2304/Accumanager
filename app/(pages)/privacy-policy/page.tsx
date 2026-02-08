"use client";

import React from 'react';
import { Security } from '@mui/icons-material';
import { LegalDocumentPage } from '@/components/legal/LegalDocumentPage';

export default function PrivacyPolicyPage() {
  const relatedLinks = [
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Acceptable Use Policy', href: '/acceptable-use' },
    { label: 'Data Processing Agreement', href: '/data-processing' },
  ];

  return (
    <LegalDocumentPage
      title="Privacy Policy"
      apiEndpoint="/api/legal/privacy-policy"
      icon={<Security />}
      description="Learn about how we collect, use, and protect your personal information"
      relatedLinks={relatedLinks}
    />
  );
}