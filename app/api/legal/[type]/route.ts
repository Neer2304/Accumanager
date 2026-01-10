import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LegalDocument from '@/models/LegalDocument';

// Document type mapping
const TYPE_MAPPING: Record<string, string> = {
  'privacy-policy': 'privacy_policy',
  'terms-of-service': 'terms_of_service',
  'cookie-policy': 'cookie_policy',
  'privacy_policy': 'privacy_policy',
  'terms_of_service': 'terms_of_service',
  'cookie_policy': 'cookie_policy'
};

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const rawType = params.type;
    const dbType = TYPE_MAPPING[rawType];
    
    if (!dbType) {
      return NextResponse.json(
        { 
          success: false,
          message: `Invalid document type. Valid types are: privacy-policy, terms-of-service, cookie-policy` 
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const document = await LegalDocument.findOne({ 
      type: dbType,
      isActive: true 
    }).select('title content version lastUpdated -_id');

    if (!document) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Document not found or inactive' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: document
    });

  } catch (error: any) {
    console.error('Get public legal document error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}