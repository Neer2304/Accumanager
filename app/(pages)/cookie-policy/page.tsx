"use client";

import React from 'react';
import { Cookie as CookieIcon } from '@mui/icons-material';
import { LegalDocumentPage } from '@/components/legal/LegalDocumentPage';

export default function CookiePolicyPage() {
  const relatedLinks = [
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Acceptable Use Policy', href: '/acceptable-use' },
    { label: 'Data Processing Agreement', href: '/data-processing' },
  ];

  return (
    <LegalDocumentPage
      title="Cookie Policy"
      apiEndpoint="/api/legal/cookie-policy"
      icon={<CookieIcon />}
      description="Learn about how we use cookies on our website"
      relatedLinks={relatedLinks}
    />
  );
}