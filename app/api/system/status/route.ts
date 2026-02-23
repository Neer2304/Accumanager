// app/api/system/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StatusService from '@/models/StatusService';
import StatusIncident from '@/models/StatusIncident';
import { verifyToken } from '@/lib/jwt';

// GET /api/system/status - Public endpoint
export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/system/status - Fetching system status');
    
    await connectToDatabase();

    // Get all services sorted by order
    let services = await StatusService.find().sort({ order: 1 });

    // If no services exist, create default ones
    if (services.length === 0) {
      console.log('⚠️ No services found, creating defaults...');
      services = await createDefaultServices();
    }

    // Get recent incidents (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const incidents = await StatusIncident.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(10);

    // Calculate overall status
    const hasOutage = services.some(s => s.status === 'outage');
    const hasDegraded = services.some(s => s.status === 'degraded');
    const hasMaintenance = services.some(s => s.status === 'maintenance');
    
    let overallStatus = 'operational';
    if (hasOutage) overallStatus = 'outage';
    else if (hasDegraded) overallStatus = 'degraded';
    else if (hasMaintenance) overallStatus = 'maintenance';

    return NextResponse.json({
      success: true,
      data: {
        overall: {
          status: overallStatus,
          operationalCount: services.filter(s => s.status === 'operational').length,
          totalCount: services.length,
          message: getOverallStatusMessage(overallStatus)
        },
        services: services.map(service => ({
          id: service._id,
          name: service.name,
          description: service.description,
          status: service.status,
          uptime: service.uptime,
          latency: service.latency,
          group: service.group,
          lastIncident: service.lastIncident
        })),
        incidents: incidents.map(incident => ({
          id: incident._id,
          title: incident.title,
          status: incident.status,
          severity: incident.severity,
          services: incident.services,
          updates: incident.updates,
          resolvedAt: incident.resolvedAt,
          createdAt: incident.createdAt
        }))
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
    const { serviceId, status, message } = body;

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
    service.status = status;
    
    if (status === 'operational' && oldStatus !== 'operational') {
      service.lastIncident = new Date();
    }

    await service.save();

    // Create incident record if status is not operational
    if (status !== 'operational') {
      const incident = new StatusIncident({
        title: `${service.name} is ${status}`,
        status: status === 'outage' ? 'critical' : status === 'degraded' ? 'high' : 'medium',
        severity: status === 'outage' ? 'critical' : status === 'degraded' ? 'high' : 'medium',
        services: [service.name],
        updates: [{
          message: message || `${service.name} is currently ${status}. We are investigating.`,
          timestamp: new Date(),
          status: 'investigating'
        }]
      });

      await incident.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Service status updated successfully',
      data: {
        id: service._id,
        name: service.name,
        status: service.status,
        lastIncident: service.lastIncident
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

// Helper function to create default services
async function createDefaultServices() {
  const defaultServices = [
    {
      name: 'API Server',
      description: 'Handles all API requests',
      status: 'operational',
      uptime: 99.99,
      latency: 45,
      group: 'api',
      order: 1
    },
    {
      name: 'Database',
      description: 'Primary database cluster',
      status: 'operational',
      uptime: 99.95,
      latency: 12,
      group: 'database',
      order: 2
    },
    {
      name: 'Authentication',
      description: 'User authentication service',
      status: 'operational',
      uptime: 99.98,
      latency: 23,
      group: 'auth',
      order: 3
    },
    {
      name: 'Storage',
      description: 'File and media storage',
      status: 'operational',
      uptime: 99.92,
      latency: 67,
      group: 'storage',
      order: 4
    },
    {
      name: 'Payment Gateway',
      description: 'Payment processing service',
      status: 'operational',
      uptime: 99.97,
      latency: 89,
      group: 'payment',
      order: 5
    },
    {
      name: 'Email Service',
      description: 'Email delivery service',
      status: 'operational',
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