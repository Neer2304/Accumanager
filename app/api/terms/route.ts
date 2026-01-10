// app/api/terms/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TermsConditions from '@/models/Terms';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET - Get current active terms
export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/terms - Starting...');
    
    await connectToDatabase();
    console.log('✅ Database connected');

    // Get the active terms
    const activeTerms = await TermsConditions.findOne({ isActive: true })
      .select('-createdBy')
      .sort({ effectiveDate: -1 });

    if (!activeTerms) {
      console.log('⚠️ No active terms found, returning default structure...');
      // Return default structure without saving to database
      return NextResponse.json(getDefaultTermsStructure());
    }

    console.log(`✅ Found active terms version: ${activeTerms.version}`);
    return NextResponse.json(activeTerms);
  } catch (error: any) {
    console.error('❌ Get terms error:', error);
    // Return default structure on error
    return NextResponse.json(getDefaultTermsStructure());
  }
}

// POST - Create new terms (Admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('🆕 POST /api/terms - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      console.log('👤 Decoded user:', decoded.userId);
      
      // Check if user is admin
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 });
      }

      await connectToDatabase();
      console.log('✅ Database connected');

      const termsData = await request.json();
      console.log('📦 Received terms data:', termsData);

      // Validate required fields
      if (!termsData.version || !termsData.title || !termsData.effectiveDate) {
        return NextResponse.json(
          { message: 'Version, title, and effective date are required' },
          { status: 400 }
        );
      }

      // Deactivate current active terms
      await TermsConditions.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      );

      // Create new terms
      const newTerms = new TermsConditions({
        ...termsData,
        createdBy: decoded.userId,
        isActive: true,
        lastUpdated: new Date()
      });

      await newTerms.save();
      console.log('✅ New terms created successfully:', newTerms.version);

      return NextResponse.json(newTerms, { status: 201 });
    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create terms error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to return default terms structure
function getDefaultTermsStructure() {
  return {
    version: '1.0.0',
    title: 'Terms & Conditions',
    description: 'Default terms and conditions for AccuManage Business Management System',
    isActive: true,
    effectiveDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    sections: [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Acceptance of Terms',
        content: 'By accessing and using AccuManage Business Management System ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.',
        order: 1,
        icon: 'Gavel'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Description of Service',
        content: 'AccuManage provides business management tools including but not limited to inventory management, billing and invoicing, customer management, expense tracking, and GST-compliant reporting.',
        order: 2,
        icon: 'Business'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Privacy and Data Protection',
        content: 'We are committed to protecting your privacy. Your business data, including customer information, product details, and financial records, are stored securely and treated as confidential.',
        order: 3,
        icon: 'Privacy'
      }
    ],
    importantPoints: [
      { _id: new mongoose.Types.ObjectId(), text: 'You must be at least 18 years old to use this service', order: 1 },
      { _id: new mongoose.Types.ObjectId(), text: 'You are responsible for GST compliance and accuracy of tax calculations', order: 2 },
      { _id: new mongoose.Types.ObjectId(), text: 'Backup your data regularly; we are not liable for data loss', order: 3 }
    ]
  };
}