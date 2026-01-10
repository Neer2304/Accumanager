// app/api/user/activity/route.ts - ENHANCED
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Your JWT verification logic here
    // const decoded = verifyToken(authToken);
    // const userId = decoded.userId;
    
    // For demo - extract from token (adjust based on your auth system)
    let userId: string;
    try {
      const tokenParts = authToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        userId = payload.userId || payload.sub;
      } else {
        userId = authToken; // Simple token case
      }
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Invalid token format' }, { status: 401 });
    }

    const body = await request.json();
    const { activeTime, timestamp, page, device, action = 'active' } = body;
    
    if (!activeTime || activeTime <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid activity time' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const date = new Date();
    const today = date.toISOString().split('T')[0];
    const hour = date.getHours();
    
    // Convert activeTime from seconds to hours
    const hoursSpent = activeTime / 3600;
    
    // Initialize screenTime if it doesn't exist
    if (!user.screenTime) {
      user.screenTime = {
        totalHours: 0,
        lastActive: new Date(),
        dailyStats: [],
        hourlyDistribution: [],
        weeklyAverage: 0,
        last7Days: [0, 0, 0, 0, 0, 0, 0],
        peakHour: 0,
        avgSessionLength: 0,
        lastSessionDuration: 0
      };
    }
    
    // Update basic stats
    user.screenTime.totalHours += hoursSpent;
    user.screenTime.lastActive = date;
    user.screenTime.lastSessionDuration = activeTime;
    
    // Update daily stats
    let todayIndex = user.screenTime.dailyStats.findIndex((stat: any) => stat.date === today);
    if (todayIndex >= 0) {
      user.screenTime.dailyStats[todayIndex].hours += hoursSpent;
      user.screenTime.dailyStats[todayIndex].sessions += 1;
    } else {
      // Keep only last 30 days
      if (user.screenTime.dailyStats.length >= 30) {
        user.screenTime.dailyStats.shift();
      }
      user.screenTime.dailyStats.push({
        date: today,
        hours: hoursSpent,
        sessions: 1
      });
    }
    
    // Update hourly distribution
    let hourIndex = user.screenTime.hourlyDistribution.findIndex((h: any) => h.hour === hour);
    if (hourIndex >= 0) {
      user.screenTime.hourlyDistribution[hourIndex].hours += hoursSpent;
    } else {
      user.screenTime.hourlyDistribution.push({
        hour: hour,
        hours: hoursSpent
      });
    }
    
    // Sort and find peak hour
    user.screenTime.hourlyDistribution.sort((a: any, b: any) => a.hour - b.hour);
    const peakHourData = user.screenTime.hourlyDistribution.reduce(
      (max: any, curr: any) => (curr.hours > max.hours ? curr : max),
      { hour: 0, hours: 0 }
    );
    user.screenTime.peakHour = peakHourData.hour;
    
    // Update last 7 days (circular buffer)
    const dayOfWeek = date.getDay();
    user.screenTime.last7Days[dayOfWeek] += hoursSpent;
    
    // Calculate weekly average
    const totalLast7Days = user.screenTime.last7Days.reduce((a: number, b: number) => a + b, 0);
    user.screenTime.weeklyAverage = totalLast7Days / 7;
    
    // Calculate average session length
    const totalSessions = user.screenTime.dailyStats.reduce((sum: number, stat: any) => sum + stat.sessions, 0);
    const totalHours = user.screenTime.totalHours;
    user.screenTime.avgSessionLength = totalSessions > 0 ? (totalHours / totalSessions) * 60 : 0; // in minutes
    
    // Log activity if enabled
    if (user.activityLogs && user.activityLogs.length < 1000) { // Limit logs
      user.activityLogs.push({
        timestamp: date,
        page: page || 'unknown',
        duration: Math.round(activeTime / 60), // Convert to minutes
        action: action
      });
    }
    
    await user.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Activity tracked successfully',
      data: {
        totalHours: Number(user.screenTime.totalHours.toFixed(2)),
        todayHours: todayIndex >= 0 ? 
          Number(user.screenTime.dailyStats[todayIndex].hours.toFixed(2)) : 0,
        weeklyAverage: Number(user.screenTime.weeklyAverage.toFixed(2)),
        peakHour: user.screenTime.peakHour,
        avgSessionLength: Number(user.screenTime.avgSessionLength.toFixed(1))
      }
    });
    
  } catch (error: any) {
    console.error('Activity tracking error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to track activity',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// GET endpoint to retrieve user's screen time stats
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let userId: string;
    try {
      const tokenParts = authToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        userId = payload.userId || payload.sub;
      } else {
        userId = authToken;
      }
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Invalid token format' }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(userId).select('screenTime name email subscription');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Initialize if not exists
    if (!user.screenTime) {
      return NextResponse.json({
        success: true,
        data: {
          totalHours: 0,
          lastActive: null,
          dailyStats: [],
          hourlyDistribution: [],
          weeklyAverage: 0,
          last7Days: [0, 0, 0, 0, 0, 0, 0],
          peakHour: 0,
          avgSessionLength: 0,
          lastSessionDuration: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalHours: Number(user.screenTime.totalHours.toFixed(2)),
        lastActive: user.screenTime.lastActive,
        dailyStats: user.screenTime.dailyStats.slice(-30),
        hourlyDistribution: user.screenTime.hourlyDistribution,
        weeklyAverage: Number(user.screenTime.weeklyAverage.toFixed(2)),
        last7Days: user.screenTime.last7Days,
        peakHour: user.screenTime.peakHour,
        avgSessionLength: Number(user.screenTime.avgSessionLength.toFixed(1)),
        lastSessionDuration: user.screenTime.lastSessionDuration
      }
    });
    
  } catch (error: any) {
    console.error('Get screen time error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to get screen time',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}