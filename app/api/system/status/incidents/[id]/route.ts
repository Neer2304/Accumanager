// app/api/system/status/incident/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StatusIncident from '@/models/StatusIncident';
import { verifyToken } from '@/lib/jwt';

// GET /api/system/status/incident/[id] - Public - Get single incident
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📋 GET /api/system/status/incident/${params.id} - Fetching incident`);
    
    await connectToDatabase();

    const incident = await StatusIncident.findById(params.id);

    if (!incident) {
      return NextResponse.json(
        { success: false, message: 'Incident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: incident._id,
        title: incident.title,
        status: incident.status,
        severity: incident.severity,
        services: incident.services,
        updates: incident.updates,
        resolvedAt: incident.resolvedAt,
        createdAt: incident.createdAt,
        updatedAt: incident.updatedAt
      }
    });

  } catch (error: any) {
    console.error('❌ Get incident error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// POST /api/system/status/incident/[id] - Admin only - Add update to incident
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🆕 POST /api/system/status/incident/${params.id} - Adding update`);
    
    // Verify authentication
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user info
    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await request.json();
    const { message, status } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Update message is required' },
        { status: 400 }
      );
    }

    const incident = await StatusIncident.findById(params.id);

    if (!incident) {
      return NextResponse.json(
        { success: false, message: 'Incident not found' },
        { status: 404 }
      );
    }

    // Add update
    incident.updates.push({
      message,
      timestamp: new Date(),
      status: status || incident.status
    });

    // Update incident status if provided
    if (status) {
      const validStatuses = ['investigating', 'identified', 'monitoring', 'resolved'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Status must be one of: ${validStatuses.join(', ')}` 
          },
          { status: 400 }
        );
      }
      incident.status = status;
    }

    // Mark as resolved if status is resolved
    if (status === 'resolved') {
      incident.resolvedAt = new Date();
    }

    await incident.save();

    return NextResponse.json({
      success: true,
      message: 'Incident updated successfully',
      data: {
        id: incident._id,
        status: incident.status,
        updates: incident.updates,
        resolvedAt: incident.resolvedAt
      }
    });

  } catch (error: any) {
    console.error('❌ Update incident error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}