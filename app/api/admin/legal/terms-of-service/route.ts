// app/api/admin/legal/terms-of-service/route.ts
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

    const document = await LegalDocument.findOne({ 
      type: 'terms_of_service'  // Database uses underscores
    }).populate('lastUpdatedBy', 'name email');

    return NextResponse.json({
      success: true,
      data: document || null
    });

  } catch (error: any) {
    console.error('Get terms of service error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const { title, content, version } = await request.json();

    // Validation
    if (!title || !content || !version) {
      return NextResponse.json(
        { 
          success: false,
          message: 'All fields are required' 
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find or create document
    let document = await LegalDocument.findOne({ type: 'terms_of_service' });

    if (document) {
      // Update existing
      document.title = title;
      document.content = content;
      document.version = version;
      document.lastUpdatedBy = decoded.userId;
      document.lastUpdated = new Date();
    } else {
      // Create new
      document = new LegalDocument({
        type: 'terms_of_service',
        title,
        content,
        version,
        lastUpdatedBy: decoded.userId,
        isActive: true
      });
    }

    await document.save();
    await document.populate('lastUpdatedBy', 'name email');

    return NextResponse.json({
      success: true,
      message: document.isNew ? 'Terms of Service created' : 'Terms of Service updated',
      data: document
    });

  } catch (error: any) {
    console.error('Update terms of service error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}