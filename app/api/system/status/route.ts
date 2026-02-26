// app/api/system/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StatusService from '@/models/StatusService';
import StatusIncident from '@/models/StatusIncident';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET /api/system/status - Public endpoint (with optional user-specific data)
export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/system/status - Fetching system status');
    
    await connectToDatabase();

    // Check if user is authenticated for user-specific data
    const authToken = request.cookies.get('auth_token')?.value;
    let userId = null;
    let isAdmin = false;

    if (authToken) {
      try {
        const decoded = verifyToken(authToken) as any;
        userId = decoded.userId;
        isAdmin = decoded.role === 'admin' || decoded.role === 'superadmin';
      } catch (error) {
        // Token invalid, but that's fine - just don't include user-specific data
        console.log('Invalid token, proceeding with public data only');
      }
    }

    // Get all services sorted by order
    let services = await StatusService.find().sort({ order: 1 }).lean();

    // If no services exist, create default ones
    if (services.length === 0) {
      console.log('⚠️ No services found, creating defaults...');
      services = await createDefaultServices();
    }

    // Get real uptime data from service metrics
    const servicesWithRealData = await Promise.all(
      services.map(async (service) => {
        // Calculate real uptime based on incidents in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const incidents = await StatusIncident.find({
          services: service.name,
          createdAt: { $gte: thirtyDaysAgo }
        });

        // Calculate uptime percentage (100% - downtime percentage)
        let totalDowntimeMinutes = 0;
        incidents.forEach(incident => {
          if (incident.status === 'resolved' && incident.resolvedAt) {
            const downtime = incident.resolvedAt.getTime() - incident.createdAt.getTime();
            totalDowntimeMinutes += downtime / (1000 * 60);
          } else if (incident.status !== 'resolved') {
            // Ongoing incident
            const downtime = Date.now() - incident.createdAt.getTime();
            totalDowntimeMinutes += downtime / (1000 * 60);
          }
        });

        const totalMinutesIn30Days = 30 * 24 * 60;
        const uptime = Math.max(0, 100 - (totalDowntimeMinutes / totalMinutesIn30Days * 100));
        
        // Get real latency from database (simulate with ping time)
        const latency = await measureLatency();

        // Get last incident date
        const lastIncident = incidents.length > 0 
          ? incidents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
          : null;

        return {
          id: service._id,
          name: service.name,
          description: service.description,
          status: service.status,
          uptime: Math.round(uptime * 100) / 100, // Round to 2 decimal places
          latency,
          group: service.group,
          lastIncident,
          ...(isAdmin && { // Include admin-only data
            incidents: incidents.slice(0, 5),
            totalIncidents: incidents.length
          })
        };
      })
    );

    // Get recent incidents (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const incidents = await StatusIncident.find({
      createdAt: { $gte: thirtyDaysAgo }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Calculate overall status
    const hasOutage = services.some(s => s.status === 'outage');
    const hasDegraded = services.some(s => s.status === 'degraded');
    const hasMaintenance = services.some(s => s.status === 'maintenance');
    
    let overallStatus = 'operational';
    if (hasOutage) overallStatus = 'outage';
    else if (hasDegraded) overallStatus = 'degraded';
    else if (hasMaintenance) overallStatus = 'maintenance';

    // Calculate 30-day uptime for all services
    const averageUptime = servicesWithRealData.reduce((sum, s) => sum + s.uptime, 0) / servicesWithRealData.length;

    return NextResponse.json({
      success: true,
      data: {
        overall: {
          status: overallStatus,
          operationalCount: services.filter(s => s.status === 'operational').length,
          totalCount: services.length,
          message: getOverallStatusMessage(overallStatus),
          uptime: Math.round(averageUptime * 100) / 100,
          lastUpdated: new Date().toISOString()
        },
        services: servicesWithRealData,
        incidents: incidents.map(incident => ({
          id: incident._id,
          title: incident.title,
          status: incident.status,
          severity: incident.severity,
          services: incident.services,
          updates: incident.updates,
          resolvedAt: incident.resolvedAt,
          createdAt: incident.createdAt
        })),
        ...(userId && { // Include user-specific data if authenticated
          user: {
            id: userId,
            isAdmin,
            notifications: await getUserNotifications(userId)
          }
        })
      }
    });

  } catch (error: any) {
    console.error('❌ System status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// POST /api/system/status - Admin only - Update service status
export async function POST(request: NextRequest) {
  try {
    console.log('🆕 POST /api/system/status - Updating service status');
    
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
    const { serviceId, status, message, severity } = body;

    // Validate required fields
    if (!serviceId || !status) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Service ID and status are required' 
        },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['operational', 'degraded', 'outage', 'maintenance'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Status must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Find and update service
    const service = await StatusService.findById(serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    const oldStatus = service.status;
    const oldStatusMessage = service.statusMessage;
    
    service.status = status;
    if (message) {
      service.statusMessage = message;
    }
    
    // Update last incident timestamp if status changed to non-operational
    if (status !== 'operational' && oldStatus === 'operational') {
      service.lastIncident = new Date();
    }

    await service.save();

    // Create incident record if status is not operational and it's a significant change
    let incident = null;
    if (status !== 'operational' && oldStatus === 'operational') {
      const incidentSeverity = severity || getSeverityFromStatus(status);
      
      incident = new StatusIncident({
        title: message || `${service.name} is ${status}`,
        description: message || `${service.name} is currently experiencing ${status} issues.`,
        status: 'investigating',
        severity: incidentSeverity,
        services: [service.name],
        updates: [{
          message: message || `${service.name} is currently ${status}. We are investigating.`,
          timestamp: new Date(),
          status: 'investigating'
        }],
        createdBy: decoded.userId
      });

      await incident.save();

      // Log the status change
      console.log(`📝 Status change: ${service.name} changed from ${oldStatus} to ${status} by user ${decoded.userId}`);
    } 
    // If status improved from degraded/outage to operational
    else if (status === 'operational' && oldStatus !== 'operational') {
      // Find and resolve any open incidents for this service
      await StatusIncident.updateMany(
        {
          services: service.name,
          status: { $ne: 'resolved' }
        },
        {
          status: 'resolved',
          resolvedAt: new Date(),
          $push: {
            updates: {
              message: message || `${service.name} has recovered and is now operational.`,
              timestamp: new Date(),
              status: 'resolved'
            }
          }
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service status updated successfully',
      data: {
        id: service._id,
        name: service.name,
        status: service.status,
        statusMessage: service.statusMessage,
        lastIncident: service.lastIncident,
        incident: incident ? {
          id: incident._id,
          title: incident.title
        } : null
      }
    });

  } catch (error: any) {
    console.error('❌ Update service status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// GET /api/system/status/history - Public - Get status history
export async function GET_HISTORY(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const service = searchParams.get('service');

    await connectToDatabase();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query: any = {
      createdAt: { $gte: startDate }
    };

    if (service) {
      query.services = service;
    }

    const incidents = await StatusIncident.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Group incidents by day for the chart
    const dailyStatus = await generateDailyStatus(startDate, new Date(), incidents);

    return NextResponse.json({
      success: true,
      data: {
        period: `${days} days`,
        incidents,
        dailyStatus
      }
    });

  } catch (error: any) {
    console.error('❌ Status history error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Helper function to create default services
async function createDefaultServices() {
  const defaultServices = [
    {
      name: 'API Server',
      description: 'Handles all API requests',
      status: 'operational',
      statusMessage: 'All systems operational',
      uptime: 99.99,
      latency: 45,
      group: 'api',
      order: 1
    },
    {
      name: 'Database',
      description: 'Primary database cluster',
      status: 'operational',
      statusMessage: 'All systems operational',
      uptime: 99.95,
      latency: 12,
      group: 'database',
      order: 2
    },
    {
      name: 'Authentication',
      description: 'User authentication service',
      status: 'operational',
      statusMessage: 'All systems operational',
      uptime: 99.98,
      latency: 23,
      group: 'auth',
      order: 3
    },
    {
      name: 'Storage',
      description: 'File and media storage',
      status: 'operational',
      statusMessage: 'All systems operational',
      uptime: 99.92,
      latency: 67,
      group: 'storage',
      order: 4
    },
    {
      name: 'Payment Gateway',
      description: 'Payment processing service',
      status: 'operational',
      statusMessage: 'All systems operational',
      uptime: 99.97,
      latency: 89,
      group: 'payment',
      order: 5
    },
    {
      name: 'Email Service',
      description: 'Email delivery service',
      status: 'operational',
      statusMessage: 'All systems operational',
      uptime: 99.88,
      latency: 34,
      group: 'email',
      order: 6
    }
  ];

  return await StatusService.insertMany(defaultServices);
}

// Helper function for status messages
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

// Helper function to get severity from status
function getSeverityFromStatus(status: string): string {
  switch (status) {
    case 'outage':
      return 'critical';
    case 'degraded':
      return 'high';
    case 'maintenance':
      return 'medium';
    default:
      return 'low';
  }
}

// Helper function to measure latency
async function measureLatency(): Promise<number> {
  const start = Date.now();
  try {
    await mongoose.connection.db?.admin().ping();
    return Date.now() - start;
  } catch (error) {
    return 999;
  }
}

// Helper function to get user notifications
async function getUserNotifications(userId: string) {
  // Get incidents from the last 7 days that might affect the user
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentIncidents = await StatusIncident.find({
    createdAt: { $gte: sevenDaysAgo }
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return recentIncidents.map(incident => ({
    id: incident._id,
    title: incident.title,
    severity: incident.severity,
    status: incident.status,
    createdAt: incident.createdAt,
    read: false // You could track this in a user notifications collection
  }));
}

// Helper function to generate daily status for charts
async function generateDailyStatus(startDate: Date, endDate: Date, incidents: any[]) {
  const dailyStatus = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayStr = currentDate.toISOString().split('T')[0];
    const dayIncidents = incidents.filter(i => 
      i.createdAt.toISOString().split('T')[0] === dayStr
    );

    let dayStatus = 'operational';
    if (dayIncidents.some(i => i.severity === 'critical')) {
      dayStatus = 'outage';
    } else if (dayIncidents.some(i => i.severity === 'high')) {
      dayStatus = 'degraded';
    } else if (dayIncidents.some(i => i.severity === 'medium')) {
      dayStatus = 'maintenance';
    }

    dailyStatus.push({
      date: dayStr,
      status: dayStatus,
      incidents: dayIncidents.length
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dailyStatus;
}