// app/api/legal/[type]/route.ts - PUBLIC API (keep this as is)
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LegalDocument from '@/models/LegalDocument';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const type = params.type;
    console.log(`🌐 GET PUBLIC LEGAL DOCUMENT - ${type}`);

    await connectToDatabase();

    const document = await LegalDocument.findOne({ 
      type,
      isActive: true 
    }).select('title content version lastUpdated');

    if (!document) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Document not found or inactive' 
        },
        { status: 404 }
      );
    }

    console.log(`✅ Public legal document retrieved: ${type}`);

    return NextResponse.json({
      success: true,
      data: document
    });

  } catch (error: any) {
    console.error('❌ Get public legal document error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}