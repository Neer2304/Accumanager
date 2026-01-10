// app/api/admin/legal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LegalDocument from '@/models/LegalDocument';
import { verifyToken } from '@/lib/jwt';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET LEGAL DOCUMENTS - Starting...');
    
    // Check admin authentication
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch {
      return NextResponse.json({ 
        message: 'Invalid token' 
      }, { status: 401 });
    }

    // Verify admin role
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ 
        message: 'Insufficient permissions' 
      }, { status: 403 });
    }

    await connectToDatabase();

    const documents = await LegalDocument.find()
      .populate('lastUpdatedBy', 'name email')
      .sort({ type: 1 });

    console.log(`✅ Found ${documents.length} legal documents`);

    return NextResponse.json({
      success: true,
      data: documents
    });

  } catch (error: any) {
    console.error('❌ Get legal documents error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}