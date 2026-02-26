// app/api/system/status/incident/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StatusIncident from '@/models/StatusIncident';
import UserNotification from '@/models/UserNotification';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

// GET /api/system/status/incident/[id] - Public with user-specific data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📋 GET /api/system/status/incident/${params.id} - Fetching incident`);
    
    await connectToDatabase();

    // 🔐 Get ACTUAL authenticated user
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;
    
    let userId = null;
    let isAdmin = false;

    if (token) {
      try {
        const decoded = await verifyToken(token);
        userId = decoded.userId;
        isAdmin = decoded.role === 'admin' || decoded.role === 'superadmin';
        console.log(`👤 Authenticated user viewing incident: ${userId}`);
      } catch (error) {
        console.log('⚠️ Invalid token - public view');
      }
    }

    // 📊 Get REAL incident from database
    const incident = await StatusIncident.findById(params.id).lean();

    if (!incident) {
      return NextResponse.json(
        { success: false, message: 'Incident not found' },
        { status: 404 }
      );
    }

    // 🔔 Check if this user has been notified about this incident
    let userNotified = false;
    let notificationRead = false;
    
    if (userId) {
      const notification = await UserNotification.findOne({
        userId: userId,
        incidentId: incident._id
      }).lean();
      
      if (notification) {
        userNotified = true;
        notificationRead = notification.read;
        
        // Auto-mark as read when user views the incident
        if (!notification.read) {
          await UserNotification.updateOne(
            { _id: notification._id },
            { 
              read: true, 
              readAt: new Date() 
            }
          );
        }
      }
    }

    // 📝 Get REAL update history
    const updates = incident.updates?.map((u: any) => ({
      id: u._id?.toString(),
      message: u.message,
      timestamp: u.timestamp,
      status: u.status,
      author: u.author || 'System'
    })) || [];

    // 👥 Get REAL affected services with their current status
    const StatusService = (await import('@/models/StatusService')).default;
    const affectedServices = await StatusService.find({
      name: { $in: incident.services }
    }).lean();

    return NextResponse.json({
      success: true,
      data: {
        id: incident._id.toString(),
        title: incident.title,
        description: incident.description || '',
        status: incident.status,
        severity: incident.severity,
        services: incident.services.map((service: string, index: number) => ({
          name: service,
          currentStatus: affectedServices[index]?.status || 'unknown',
          group: affectedServices[index]?.group || 'other'
        })),
        updates: updates,
        createdAt: incident.createdAt,
        resolvedAt: incident.resolvedAt || null,
        autoCreated: incident.autoCreated || false,
        createdBy: incident.createdBy || null,
        
        // 👤 User-specific data
        user: userId ? {
          id: userId,
          isAdmin: isAdmin,
          notified: userNotified,
          read: notificationRead,
          readAt: notificationRead ? new Date() : null
        } : null,

        // 📊 Stats
        stats: {
          updateCount: updates.length,
          timeOpen: incident.resolvedAt 
            ? Math.round((new Date(incident.resolvedAt).getTime() - new Date(incident.createdAt).getTime()) / (1000 * 60))
            : Math.round((Date.now() - new Date(incident.createdAt).getTime()) / (1000 * 60)),
          affectedServicesCount: incident.services.length
        }
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

// POST /api/system/status/incident/[id] - Admin only - Add REAL update
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🆕 POST /api/system/status/incident/${params.id} - Adding update`);
    
    // 🔐 Verify authentication
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get REAL user info
    let decoded;
    try {
      decoded = await verifyToken(authToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user has REAL admin privileges
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await request.json();
    const { message, status, notifyUsers } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Update message is required' },
        { status: 400 }
      );
    }

    // Find REAL incident
    const incident = await StatusIncident.findById(params.id);
    if (!incident) {
      return NextResponse.json(
        { success: false, message: 'Incident not found' },
        { status: 404 }
      );
    }

    // Add REAL update
    const newUpdate = {
      message,
      timestamp: new Date(),
      status: status || incident.status,
      author: decoded.userId,
      authorName: decoded.name || 'Admin'
    };

    incident.updates.push(newUpdate);

    // Update incident status if provided
    if (status) {
      const validStatuses = ['investigating', 'identified', 'monitoring', 'resolved'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, message: `Status must be one of: ${validStatuses.join(', ')}` },
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

    // 🔔 Create notifications for users if requested
    if (notifyUsers && status) {
      const User = (await import('@/models/User')).default;
      const users = await User.find({}, '_id email');
      
      const notifications = users.map(user => ({
        userId: user._id,
        incidentId: incident._id,
        read: false,
        emailSent: false
      }));

      if (notifications.length > 0) {
        await UserNotification.insertMany(notifications);
        console.log(`📨 Created ${notifications.length} notifications for incident update`);
      }
    }

    // Log the REAL update
    console.log(`📝 Incident ${incident._id} updated by user ${decoded.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Incident updated successfully',
      data: {
        id: incident._id.toString(),
        status: incident.status,
        updates: incident.updates,
        resolvedAt: incident.resolvedAt,
        updateCount: incident.updates.length,
        lastUpdate: incident.updates[incident.updates.length - 1]
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

// DELETE /api/system/status/incident/[id] - Admin only - Delete incident
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🗑️ DELETE /api/system/status/incident/${params.id} - Deleting incident`);
    
    // 🔐 Verify authentication
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get REAL user info
    let decoded;
    try {
      decoded = await verifyToken(authToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user has REAL admin privileges
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Find and delete REAL incident
    const incident = await StatusIncident.findByIdAndDelete(params.id);

    if (!incident) {
      return NextResponse.json(
        { success: false, message: 'Incident not found' },
        { status: 404 }
      );
    }

    // Also delete associated notifications
    await UserNotification.deleteMany({ incidentId: params.id });

    console.log(`🗑️ Incident ${params.id} deleted by user ${decoded.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Incident deleted successfully',
      data: {
        id: incident._id,
        title: incident.title,
        deletedAt: new Date().toISOString(),
        deletedBy: decoded.userId
      }
    });

  } catch (error: any) {
    console.error('❌ Delete incident error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}