// scripts/seedLegalDocuments.ts
import mongoose from 'mongoose';
import LegalDocument from '@/models/LegalDocument';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';

async function seedLegalDocuments() {
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
        content: '# Privacy Policy\n\nYour privacy is important to us...',
        version: '1.0.0',
        lastUpdatedBy: adminUser._id
      },
      {
        type: 'terms_of_service',
        title: 'Terms of Service',
        content: '# Terms of Service\n\nBy using our services...',
        version: '1.0.0',
        lastUpdatedBy: adminUser._id
      },
      {
        type: 'cookie_policy',
        title: 'Cookie Policy',
        content: '# Cookie Policy\n\nWe use cookies to improve...',
        version: '1.0.0',
        lastUpdatedBy: adminUser._id
      }
    ];

    for (const doc of documents) {
      await LegalDocument.findOneAndUpdate(
        { type: doc.type },
        doc,
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded ${doc.type}`);
    }

    console.log('✅ All legal documents seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding legal documents:', error);
    process.exit(1);
  }
}

seedLegalDocuments();