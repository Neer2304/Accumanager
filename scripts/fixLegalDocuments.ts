// scripts/fixLegalDocuments.ts
import mongoose from 'mongoose';
import LegalDocument from '@/models/LegalDocument';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';

async function fixLegalDocuments() {
  try {
    await connectToDatabase();
    
    // Find an admin user
    const adminUser = await User.findOne({ role: { $in: ['admin', 'superadmin'] } });
    
    if (!adminUser) {
      console.error('❌ No admin user found');
      return;
    }

    const documents = [
      {
        type: 'privacy_policy',
        title: 'Privacy Policy',
        content: `# Privacy Policy

Last Updated: ${new Date().toLocaleDateString()}

## 1. Information We Collect

We collect information to provide better services to our users.

### 1.1 Information you provide
- Account information (name, email, business details)
- Payment information (processed securely via third-party processors)
- Content you create in our platform

### 1.2 Information we collect automatically
- Usage data and logs
- Device information
- IP addresses

## 2. How We Use Information

We use the information we collect to:
- Provide, maintain, and improve our services
- Process transactions and send notifications
- Protect AccumaManage and our users
- Comply with legal obligations

## 3. Information Security

We work hard to protect your information from unauthorized access, alteration, disclosure, or destruction.

## 4. Your Rights

You have rights regarding your personal information, including:
- Access to your data
- Correction of inaccurate data
- Deletion of your data
- Objection to processing

## 5. Contact Us

For privacy-related questions or concerns:
Email: privacy@accumamanage.com

We may update this privacy policy from time to time.`,
        version: '1.0.0',
        isActive: true,
        lastUpdatedBy: adminUser._id
      },
      {
        type: 'terms_of_service',
        title: 'Terms of Service',
        content: `# Terms of Service

Last Updated: ${new Date().toLocaleDateString()}

## 1. Acceptance of Terms

By accessing or using AccumaManage, you agree to be bound by these Terms of Service.

## 2. Description of Service

AccumaManage provides business management tools including inventory management, customer tracking, invoicing, and analytics.

## 3. Account Registration

### 3.1 Eligibility
You must be at least 18 years old to use our services.

### 3.2 Account Security
You are responsible for:
- Maintaining the confidentiality of your login credentials
- All activities under your account
- Notifying us of any unauthorized use

## 4. Subscription and Payments

### 4.1 Subscription Plans
We offer various subscription plans as described on our pricing page.

### 4.2 Billing
- Subscription fees are billed in advance
- All fees are non-refundable
- You may cancel at any time

### 4.3 Price Changes
We reserve the right to change subscription fees with 30 days notice.

## 5. User Conduct

You agree not to:
- Violate any applicable laws
- Infringe intellectual property rights
- Attempt to gain unauthorized access
- Interfere with service operation

## 6. Limitation of Liability

To the maximum extent permitted by law, AccumaManage shall not be liable for any indirect, incidental, special, consequential, or punitive damages.

## 7. Modifications to Terms

We may modify these terms at any time. Continued use after changes constitutes acceptance.

## 8. Contact

Questions about these Terms? Contact us at: legal@accumamanage.com`,
        version: '1.0.0',
        isActive: true,
        lastUpdatedBy: adminUser._id
      },
      {
        type: 'cookie_policy',
        title: 'Cookie Policy',
        content: `# Cookie Policy

Last Updated: ${new Date().toLocaleDateString()}

## 1. What Are Cookies

Cookies are small text files that are placed on your device when you visit our website.

## 2. How We Use Cookies

We use cookies for several purposes:

### 2.1 Essential Cookies
Required for basic functionality:
- User authentication
- Session management
- Security features

### 2.2 Performance Cookies
Help us understand how visitors interact:
- Page visits and navigation
- Error monitoring
- Performance analytics

### 2.3 Functionality Cookies
Remember your preferences:
- Language settings
- Display preferences
- Consent choices

## 3. Your Cookie Choices

Most web browsers allow you to:
- See what cookies are stored
- Delete cookies individually
- Block third-party cookies
- Block all cookies

## 4. Third-Party Cookies

We may use third-party services that set cookies:
- Analytics providers (Google Analytics)
- Payment processors
- Customer support tools

## 5. Updates to This Policy

We may update this Cookie Policy to reflect changes in our practices or for other operational, legal, or regulatory reasons.

## 6. Contact

For questions about our use of cookies:
Email: privacy@accumamanage.com`,
        version: '1.0.0',
        isActive: true,
        lastUpdatedBy: adminUser._id
      }
    ];

    for (const doc of documents) {
      const result = await LegalDocument.findOneAndUpdate(
        { type: doc.type },
        doc,
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true 
        }
      );
      console.log(`✅ ${doc.type}: ${result ? 'Updated' : 'Created'}`);
    }

    console.log('✅ All legal documents fixed successfully');
    
    // Verify
    const allDocs = await LegalDocument.find({});
    console.log('\n📋 Current documents:');
    allDocs.forEach(doc => {
      console.log(`  - ${doc.type}: "${doc.title}" (Active: ${doc.isActive})`);
    });

  } catch (error) {
    console.error('❌ Error fixing legal documents:', error);
  } finally {
    process.exit(0);
  }
}

fixLegalDocuments();