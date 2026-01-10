import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LegalDocument from '@/models/LegalDocument';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Admin authentication check
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ 
        success: false,
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch {
      return NextResponse.json({ 
        success: false,
        message: 'Invalid token' 
      }, { status: 401 });
    }

    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ 
        success: false,
        message: 'Insufficient permissions' 
      }, { status: 403 });
    }

    await connectToDatabase();

    const documents = await LegalDocument.find()
      .populate('lastUpdatedBy', 'name email')
      .sort({ type: 1 });

    return NextResponse.json({
      success: true,
      data: documents,
      count: documents.length
    });

  } catch (error: any) {
    console.error('Get legal documents error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}