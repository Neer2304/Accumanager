// app/api/activity/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import EmployeeActivity from '@/models/EmployeeActivity';
import ActivityEvent from '@/models/ActivityEvent';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/activity/status - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const { employeeId, status, currentActivity, device, location } = await request.json();

      if (!employeeId || !status) {
        return NextResponse.json(
          { error: 'Employee ID and status are required' },
          { status: 400 }
        );
      }

      // Update or create employee activity
      const activity = await EmployeeActivity.findOneAndUpdate(
        { employeeId, userId: decoded.userId },
        {
          employeeId,
          status,
          currentActivity: currentActivity || 'Working',
          device: device || 'desktop',
          location: location || 'office',
          lastActive: new Date(),
          productivity: calculateProductivity(status), // You can implement this based on your metrics
          userId: decoded.userId,
        },
        { upsert: true, new: true }
      );

      // Create activity event
      const eventDescription = getEventDescription(employeeId, status, currentActivity);
      await ActivityEvent.create({
        employeeId,
        employeeName: activity.employeeName,
        type: getEventType(status),
        description: eventDescription,
        userId: decoded.userId,
      });

      console.log(`✅ Updated status for employee ${employeeId} to ${status}`);
      
      return NextResponse.json({ success: true, activity });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update activity status error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateProductivity(status: string): number {
  const productivityMap: { [key: string]: number } = {
    'focus': 95,
    'online': 85,
    'meeting': 70,
    'break': 0,
    'away': 10,
    'offline': 0,
  };
  return productivityMap[status] || 50;
}

function getEventType(status: string): string {
  const typeMap: { [key: string]: string } = {
    'online': 'login',
    'offline': 'logout',
    'meeting': 'meeting_start',
    'break': 'break_start',
    'focus': 'task_start',
  };
  return typeMap[status] || 'status_change';
}

function getEventDescription(employeeId: string, status: string, activity: string): string {
  const baseDescription = `Employee ${employeeId} is now ${status}`;
  return activity ? `${baseDescription} - ${activity}` : baseDescription;
}