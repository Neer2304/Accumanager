// app/api/admin/legal/refund-policy/route.ts
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
      type: 'refund_policy'  // Database uses underscores
    }).populate('lastUpdatedBy', 'name email');

    return NextResponse.json({
      success: true,
      data: document || null
    });

  } catch (error: any) {
    console.error('Get refund policy error:', error);
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
    let document = await LegalDocument.findOne({ type: 'refund_policy' });

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
        type: 'refund_policy',
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
      message: document.isNew ? 'Refund Policy created' : 'Refund Policy updated',
      data: document
    });

  } catch (error: any) {
    console.error('Update refund policy error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}