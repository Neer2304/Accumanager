// app/api/system/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StatusService from '@/models/StatusService';
import StatusIncident from '@/models/StatusIncident';
import StatusCheck from '@/models/StatusCheck';
import UserNotification from '@/models/UserNotification';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/system/status - Fetching REAL system status');
    
    await connectToDatabase();

    // 🔐 Get ACTUAL authenticated user from token
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;
    
    let userId = null;
    let userRole = null;
    let isAdmin = false;

    if (token) {
      try {
        const decoded = await verifyToken(token);
        userId = decoded.userId;
        userRole = decoded.role;
        isAdmin = decoded.role === 'admin' || decoded.role === 'superadmin';
        console.log(`👤 Authenticated user: ${userId}, Role: ${userRole}`);
      } catch (error) {
        console.log('⚠️ Invalid token - proceeding as public user');
      }
    }

    // 📊 Get ALL services from database - REAL DATA
    const services = await StatusService.find().sort({ order: 1 }).lean();

    if (services.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          overall: {
            status: 'operational',
            operationalCount: 0,
            totalCount: 0,
            message: 'No services configured',
            uptime: 100,
            lastUpdated: new Date().toISOString()
          },
          services: [],
          incidents: []
        }
      });
    }

    // 📅 Calculate REAL date ranges
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 📋 Get REAL incidents from database
    const incidents = await StatusIncident.find({
      createdAt: { $gte: thirtyDaysAgo }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // 📊 Get REAL data for EACH service from actual database records
    const servicesWithRealData = await Promise.all(
      services.map(async (service) => {
        // Get ALL health checks for this service in last 30 days - REAL DATA
        const checks = await StatusCheck.find({ 
          serviceId: service._id,
          timestamp: { $gte: thirtyDaysAgo }
        }).sort({ timestamp: -1 }).lean();

        // Calculate REAL uptime from actual checks
        const totalChecks = checks.length;
        const successfulChecks = checks.filter(c => c.success === true).length;
        
        // REAL uptime percentage
        const uptime = totalChecks > 0 
          ? Number(((successfulChecks / totalChecks) * 100).toFixed(2))
          : 100; // If no checks yet, assume 100%

        // Get LATEST check for current latency - REAL DATA
        const latestCheck = checks[0] || null;

        // Get LAST incident for this service - REAL DATA
        const lastIncident = await StatusIncident.findOne({
          services: service.name,
          createdAt: { $gte: thirtyDaysAgo }
        }).sort({ createdAt: -1 }).lean();

        // Calculate REAL average response time
        const avgResponseTime = checks.length > 0
          ? Math.round(checks.reduce((sum, c) => sum + (c.responseTime || 0), 0) / checks.length)
          : 0;

        // Get REAL status from database (last known status)
        const currentStatus = service.status || 'operational';

        // Get REAL failure count for status determination
        const recentFailures = checks
          .slice(0, 5)
          .filter(c => !c.success).length;

        // Determine if status should be updated based on REAL failures
        let determinedStatus = currentStatus;
        if (recentFailures >= 3) {
          determinedStatus = 'outage';
        } else if (recentFailures >= 1) {
          determinedStatus = 'degraded';
        } else if (checks.length > 0 && checks[0]?.success) {
          determinedStatus = 'operational';
        }

        // Update service status in database if changed (REAL update)
        if (determinedStatus !== currentStatus) {
          await StatusService.updateOne(
            { _id: service._id },
            { 
              status: determinedStatus,
              lastChecked: new Date()
            }
          );
        }

        return {
          id: service._id.toString(),
          name: service.name,
          description: service.description || '',
          status: determinedStatus,
          uptime: uptime,
          latency: avgResponseTime,
          responseTime: latestCheck?.responseTime || 0,
          lastCheckTime: latestCheck?.timestamp || null,
          group: service.group || 'api',
          lastIncident: lastIncident?.createdAt || null,
          totalChecks: totalChecks,
          successfulChecks: successfulChecks,
          failureCount: totalChecks - successfulChecks,
          lastChecked: latestCheck?.timestamp || null
        };
      })
    );

    // Calculate REAL overall status based on actual service statuses
    const hasOutage = servicesWithRealData.some(s => s.status === 'outage');
    const hasDegraded = servicesWithRealData.some(s => s.status === 'degraded');
    const hasMaintenance = servicesWithRealData.some(s => s.status === 'maintenance');
    
    let overallStatus = 'operational';
    if (hasOutage) overallStatus = 'outage';
    else if (hasDegraded) overallStatus = 'degraded';
    else if (hasMaintenance) overallStatus = 'maintenance';

    // Calculate REAL average uptime across all services
    const averageUptime = servicesWithRealData.length > 0
      ? Number((servicesWithRealData.reduce((sum, s) => sum + s.uptime, 0) / servicesWithRealData.length).toFixed(2))
      : 100;

    // 📋 Get REAL operational count
    const operationalCount = servicesWithRealData.filter(s => s.status === 'operational').length;

    // 🔔 Get REAL user notifications if authenticated
    let userNotifications = [];
    if (userId) {
      userNotifications = await UserNotification.find({ 
        userId: userId,
        read: false
      })
        .populate('incidentId')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    }

    // Format REAL incidents for response
    const formattedIncidents = incidents.map(incident => ({
      id: incident._id.toString(),
      title: incident.title,
      status: incident.status,
      severity: incident.severity,
      services: incident.services,
      updates: incident.updates?.map((u: any) => ({
        message: u.message,
        timestamp: u.timestamp,
        status: u.status
      })) || [],
      createdAt: incident.createdAt,
      resolvedAt: incident.resolvedAt || null,
      autoCreated: incident.autoCreated || false
    }));

    // 📊 Get REAL health check summary
    const totalChecksAll = await StatusCheck.countDocuments({
      timestamp: { $gte: thirtyDaysAgo }
    });

    const successfulChecksAll = await StatusCheck.countDocuments({
      timestamp: { $gte: thirtyDaysAgo },
      success: true
    });

    const overallSuccessRate = totalChecksAll > 0
      ? Number(((successfulChecksAll / totalChecksAll) * 100).toFixed(2))
      : 100;

    return NextResponse.json({
      success: true,
      data: {
        overall: {
          status: overallStatus,
          operationalCount: operationalCount,
          totalCount: services.length,
          message: getOverallStatusMessage(overallStatus),
          uptime: averageUptime,
          successRate: overallSuccessRate,
          totalChecks: totalChecksAll,
          lastUpdated: new Date().toISOString()
        },
        services: servicesWithRealData,
        incidents: formattedIncidents,
        user: userId ? {
          id: userId,
          role: userRole,
          isAdmin: isAdmin,
          notifications: userNotifications.map(n => ({
            id: n._id.toString(),
            incidentId: n.incidentId?._id.toString(),
            title: n.incidentId?.title,
            severity: n.incidentId?.severity,
            createdAt: n.createdAt,
            read: n.read
          })),
          unreadCount: userNotifications.length
        } : null,
        meta: {
          period: '30days',
          timestamp: new Date().toISOString(),
          authenticated: !!userId
        }
      }
    });

  } catch (error: any) {
    console.error('❌ System status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Helper function for REAL status messages
function getOverallStatusMessage(status: string): string {
  switch (status) {
    case 'operational':
      return 'All systems are operational';
    case 'degraded':
      return 'Some systems are experiencing degraded performance';
    case 'outage':
      return 'Some systems are experiencing an outage';
    case 'maintenance':
      return 'Some systems are under maintenance';
    default:
      return 'System status unknown';
  }
}

// POST /api/system/status - REAL manual status update (admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('🆕 POST /api/system/status - Manual status update');
    
    await connectToDatabase();

    // 🔐 Verify ACTUAL authenticated user
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get REAL user data
    let decoded;
    try {
      decoded = await verifyToken(token);
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

    const body = await request.json();
    const { serviceId, status, message, severity } = body;

    // Validate inputs
    if (!serviceId || !status) {
      return NextResponse.json(
        { success: false, message: 'Service ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['operational', 'degraded', 'outage', 'maintenance'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Find REAL service in database
    const service = await StatusService.findById(serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    // Update REAL service in database
    const oldStatus = service.status;
    service.status = status;
    service.statusMessage = message || service.statusMessage;
    service.lastChecked = new Date();
    
    if (status !== 'operational' && oldStatus === 'operational') {
      service.lastIncident = new Date();
    }

    await service.save();

    // Log the REAL status change
    console.log(`📝 Status change: ${service.name} changed from ${oldStatus} to ${status} by user ${decoded.userId}`);

    // Create REAL incident in database if needed
    let incident = null;
    if (status !== 'operational' && oldStatus === 'operational') {
      const incidentSeverity = severity || getSeverityFromStatus(status);
      
      incident = await StatusIncident.create({
        title: message || `${service.name} is ${status}`,
        status: 'investigating',
        severity: incidentSeverity,
        services: [service.name],
        updates: [{
          message: message || `${service.name} is currently ${status}. We are investigating.`,
          timestamp: new Date(),
          status: 'investigating'
        }],
        createdBy: decoded.userId,
        autoCreated: false
      });

      console.log(`📝 Created incident: ${incident._id} for ${service.name}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Service status updated successfully',
      data: {
        id: service._id.toString(),
        name: service.name,
        status: service.status,
        message: service.statusMessage,
        lastIncident: service.lastIncident,
        incident: incident ? {
          id: incident._id.toString(),
          title: incident.title
        } : null,
        updatedBy: decoded.userId,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Update error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Helper function for severity
function getSeverityFromStatus(status: string): string {
  switch (status) {
    case 'outage': return 'critical';
    case 'degraded': return 'high';
    case 'maintenance': return 'medium';
    default: return 'low';
  }
}