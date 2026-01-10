// components/admin/LegalDocumentEditor.tsx
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface LegalDocument {
  _id: string;
  type: string;
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
  lastUpdatedBy: {
    name: string;
    email: string;
  };
  isActive: boolean;
}

interface LegalDocumentEditorProps {
  document: LegalDocument;
  open: boolean;
  onClose: () => void;
  onSave: (document: LegalDocument) => void;
}

const predefinedTemplates: Record<string, { title: string; content: string }> = {
  privacy_policy: {
    title: 'Privacy Policy',
    content: `# Privacy Policy

Last Updated: [Date]

## 1. Information We Collect

### 1.1 Personal Information
- Name and contact details
- Business information
- Payment information (processed securely via third-party processors)

### 1.2 Usage Data
- IP addresses and device information
- Browser type and version
- Pages visited and time spent

## 2. How We Use Your Information

We use the information we collect to:
- Provide and maintain our services
- Process your transactions
- Send important notifications
- Improve our services

## 3. Data Security

We implement appropriate security measures to protect your data:
- Encryption in transit and at rest
- Regular security audits
- Access controls and authentication

## 4. Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Object to data processing

## 5. Contact Us

For privacy-related questions:
Email: privacy@accumamanage.com`
  },
  terms_of_service: {
    title: 'Terms of Service',
    content: `# Terms of Service

Last Updated: [Date]

## 1. Acceptance of Terms

By accessing and using AccumaManage, you agree to be bound by these Terms of Service.

## 2. Account Registration

### 2.1 Eligibility
You must be at least 18 years old to create an account.

### 2.2 Account Security
You are responsible for:
- Maintaining the confidentiality of your credentials
- All activities under your account
- Notifying us of unauthorized access

## 3. Service Usage

### 3.1 Permitted Use
You may use our services for lawful business purposes only.

### 3.2 Prohibited Activities
You may not:
- Violate any laws or regulations
- Infringe on intellectual property rights
- Attempt to gain unauthorized access
- Disrupt service operations

## 4. Payments and Billing

### 4.1 Subscription Fees
Fees are billed in advance and are non-refundable.

### 4.2 Cancellation
You may cancel your subscription at any time.

## 5. Limitation of Liability

We are not liable for:
- Indirect or consequential damages
- Service interruptions
- Third-party actions`
  },
  cookie_policy: {
    title: 'Cookie Policy',
    content: `# Cookie Policy

Last Updated: [Date]

## 1. What Are Cookies

Cookies are small text files stored on your device when you visit our website.

## 2. Types of Cookies We Use

### 2.1 Essential Cookies
Required for basic functionality:
- Session management
- Authentication
- Security features

### 2.2 Analytics Cookies
Help us understand how visitors interact:
- Page visits and navigation
- Time spent on pages
- Error monitoring

### 2.3 Preference Cookies
Remember your settings:
- Language preferences
- Display settings
- Consent choices

## 3. Your Cookie Choices

You can:
- Accept all cookies
- Reject non-essential cookies
- Change preferences anytime

## 4. Third-Party Cookies

We may use services that set their own cookies:
- Analytics providers
- Payment processors
- Customer support tools

## 5. Managing Cookies

Most browsers allow you to:
- View stored cookies
- Delete cookies
- Block future cookies`
  }
};

export default function LegalDocumentEditor({ document, open, onClose, onSave }: LegalDocumentEditorProps) {
  const [editedDoc, setEditedDoc] = useState<LegalDocument>(document);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (field: keyof LegalDocument, value: string) => {
    setEditedDoc(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleApplyTemplate = () => {
    const template = predefinedTemplates[document.type];
    if (template) {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const contentWithDate = template.content.replace('[Date]', currentDate);
      
      setEditedDoc(prev => ({
        ...prev,
        title: template.title,
        content: contentWithDate,
        version: incrementVersion(prev.version)
      }));
      setIsDirty(true);
    }
  };

  const incrementVersion = (currentVersion: string): string => {
    const parts = currentVersion.split('.');
    if (parts.length === 3) {
      const minor = parseInt(parts[2]) + 1;
      return `${parts[0]}.${parts[1]}.${minor}`;
    }
    return currentVersion;
  };

  const handleSave = () => {
    if (!editedDoc.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!editedDoc.content.trim()) {
      setError('Content is required');
      return;
    }
    if (!editedDoc.version.trim()) {
      setError('Version is required');
      return;
    }

    setError('');
    onSave(editedDoc);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {document._id ? 'Edit' : 'Create'} Document
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Apply Template">
              <IconButton size="small" onClick={handleApplyTemplate}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Type: {document.type.replace('_', ' ').toUpperCase()}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={editedDoc.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
            <TextField
              label="Version"
              value={editedDoc.version}
              onChange={(e) => handleChange('version', e.target.value)}
              required
              sx={{ width: 150 }}
            />
          </Box>
          
          <TextField
            fullWidth
            label="Content"
            value={editedDoc.content}
            onChange={(e) => handleChange('content', e.target.value)}
            multiline
            rows={15}
            required
            placeholder="Enter document content here..."
            InputProps={{
              sx: { fontFamily: 'monospace', fontSize: '0.875rem' }
            }}
          />
          
          <Box>
            <Typography variant="caption" color="text.secondary">
              Tips: Use Markdown for formatting. Supports # Headers, **bold**, *italic*, etc.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose} 
          startIcon={<CancelIcon />}
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          startIcon={<SaveIcon />}
          variant="contained"
          disabled={!isDirty}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}