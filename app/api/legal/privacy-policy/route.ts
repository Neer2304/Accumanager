// app/api/legal/privacy-policy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LegalDocument from '@/models/LegalDocument';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const document = await LegalDocument.findOne({ 
      type: 'privacy_policy',
      isActive: true 
    }).select('title content version lastUpdated -_id');

    if (!document) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Privacy Policy not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: document
    });

  } catch (error: any) {
    console.error('Get public privacy policy error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}