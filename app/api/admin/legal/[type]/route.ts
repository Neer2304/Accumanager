// app/api/admin/legal/[type]/route.ts - ADMIN API
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LegalDocument from '@/models/LegalDocument';
import { verifyToken } from '@/lib/jwt';

export async function PUT(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const type = params.type;
    console.log(`📝 ADMIN UPDATE LEGAL DOCUMENT - ${type}`);
    
    // Check admin authentication
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

    // Verify admin role
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ 
        success: false,
        message: 'Insufficient permissions' 
      }, { status: 403 });
    }

    const { title, content, version } = await request.json();

    if (!title || !content || !version) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Title, content, and version are required' 
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const document = await LegalDocument.findOneAndUpdate(
      { type },
      {
        title,
        content,
        version,
        lastUpdated: new Date(),
        lastUpdatedBy: decoded.userId
      },
      { 
        new: true,
        upsert: true, // Create if doesn't exist
        runValidators: true 
      }
    );

    console.log(`✅ Legal document updated: ${type}`);

    return NextResponse.json({
      success: true,
      message: 'Document updated successfully',
      data: document
    });

  } catch (error: any) {
    console.error('❌ Update legal document error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// GET specific document (Admin version)
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const type = params.type;
    console.log(`📄 ADMIN GET LEGAL DOCUMENT - ${type}`);
    
    // Check admin authentication
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

    // Verify admin role
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ 
        success: false,
        message: 'Insufficient permissions' 
      }, { status: 403 });
    }

    await connectToDatabase();

    const document = await LegalDocument.findOne({ type })
      .populate('lastUpdatedBy', 'name email');

    if (!document) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Document not found' 
        },
        { status: 404 }
      );
    }

    console.log(`✅ Found legal document: ${type}`);

    return NextResponse.json({
      success: true,
      data: document
    });

  } catch (error: any) {
    console.error('❌ Get legal document error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}