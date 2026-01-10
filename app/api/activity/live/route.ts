// app/api/activity/live/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import EmployeeActivity from '@/models/EmployeeActivity';
import { verifyToken } from '@/lib/jwt';
import { PaymentService } from '@/services/paymentService';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/activity/live - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      // Check subscription status
      const subscription = await PaymentService.checkSubscription(decoded.userId);
      if (!subscription.isActive) {
        return NextResponse.json(
          { error: 'Live activity monitoring requires an active subscription. Please upgrade your plan.' },
          { status: 402 }
        );
      }

      await connectToDatabase();

      // Get all employee activities for this user's organization
      const activities = await EmployeeActivity.find({ userId: decoded.userId })
        .sort({ lastActive: -1 })
        .lean();

      // Calculate stats
      const onlineCount = activities.filter(a => 
        ['online', 'focus', 'meeting'].includes(a.status)
      ).length;
      
      const inMeetingCount = activities.filter(a => a.status === 'meeting').length;
      const onBreakCount = activities.filter(a => a.status === 'break').length;
      const avgProductivity = activities.length > 0 
        ? Math.round(activities.reduce((acc, emp) => acc + emp.productivity, 0) / activities.length)
        : 0;

      console.log(`✅ Found ${activities.length} employee activities`);
      
      return NextResponse.json({
        employees: activities,
        stats: {
          onlineCount,
          inMeetingCount,
          onBreakCount,
          avgProductivity,
          totalEmployees: activities.length
        }
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get live activity error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}