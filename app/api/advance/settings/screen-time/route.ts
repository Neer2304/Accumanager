// app/api/advance/settings/screen-time/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import AdvanceScreenTime from '@/models/AdvanceScreenTime';
import { verifyToken } from '@/lib/jwt';

// GET: Get screen time settings
export async function GET(request: NextRequest) {
  try {
    console.log('⚙️ GET /api/advance/settings/screen-time - Getting settings...');
    
    // Authentication
    const authToken = request.cookies.get('auth_token')?.value;
    const authHeader = request.headers.get('authorization');
    
    const token = authHeader?.replace('Bearer ', '') || authToken;
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId;

    await connectToDatabase();
    console.log('✅ Database connected for screen time settings');

    // Get user and advance screen time
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const advanceScreenTime = await AdvanceScreenTime.findOne({ userId: user._id });
    
    // Default settings if no advance screen time exists
    const settings = {
      tracking: {
        enabled: true,
        autoStart: true,
        idleDetection: true,
        idleTimeout: advanceScreenTime?.currentSession?.idleTimeout || 900000 // 15 minutes
      },
      goals: {
        dailyGoal: advanceScreenTime?.achievements?.dailyGoal || 2,
        weeklyGoal: 14, // 2 hours * 7 days
        notifications: true
      },
      privacy: {
        storeDetailedLogs: true,
        logRetentionDays: 90,
        exportData: true
      },
      achievements: advanceScreenTime?.achievements || {
        dailyGoal: 2,
        streakDays: 0,
        longestSession: 0,
        badges: []
      }
    };

    console.log('✅ Screen time settings fetched successfully');

    return NextResponse.json({
      success: true,
      message: 'Screen time settings fetched successfully',
      data: settings
    });

  } catch (error: any) {
    console.error('❌ Screen time settings error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    );
  }
}

// PUT: Update screen time settings
export async function PUT(request: NextRequest) {
  try {
    console.log('⚙️ PUT /api/advance/settings/screen-time - Updating settings...');
    
    // Authentication
    const authToken = request.cookies.get('auth_token')?.value;
    const authHeader = request.headers.get('authorization');
    
    const token = authHeader?.replace('Bearer ', '') || authToken;
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId;

    await connectToDatabase();
    console.log('✅ Database connected for updating screen time settings');

    const body = await request.json();
    
    // Get user and advance screen time
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let advanceScreenTime = await AdvanceScreenTime.findOne({ userId: user._id });
    
    // Create advance screen time if it doesn't exist
    if (!advanceScreenTime) {
      advanceScreenTime = new AdvanceScreenTime({
        userId: user._id,
        currentSession: {
          startTime: null,
          lastActivity: null,
          currentPage: null,
          idleTimeout: body.tracking?.idleTimeout || 900000,
          deviceInfo: null
        },
        achievements: {
          dailyGoal: body.goals?.dailyGoal || 2,
          streakDays: 0,
          longestSession: 0,
          badges: []
        }
      });
    }
    
    // Update tracking settings
    if (body.tracking?.idleTimeout !== undefined) {
      advanceScreenTime.currentSession.idleTimeout = body.tracking.idleTimeout;
    }
    
    // Update goals
    if (body.goals?.dailyGoal !== undefined) {
      advanceScreenTime.achievements.dailyGoal = body.goals.dailyGoal;
    }
    
    // Handle data reset requests
    if (body.resetData) {
      if (body.resetData === 'logs') {
        // Clear activity logs but keep statistics
        user.activityLogs = [];
      } else if (body.resetData === 'stats') {
        // Reset screen time statistics
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
      } else if (body.resetData === 'all') {
        // Reset everything
        user.activityLogs = [];
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
        advanceScreenTime.engagement = {
          pageViews: 0,
          clicks: 0,
          formsSubmitted: 0,
          exportsGenerated: 0,
          reportsViewed: 0
        };
        advanceScreenTime.focus = {
          mostUsedFeature: 'dashboard',
          timeOnDashboard: 0,
          timeOnReports: 0,
          timeOnSettings: 0,
          productivityScore: 0
        };
        advanceScreenTime.sessionHistory = [];
        advanceScreenTime.achievements.streakDays = 0;
        advanceScreenTime.achievements.longestSession = 0;
      }
    }
    
    // Save changes
    await advanceScreenTime.save();
    await user.save();
    
    console.log('✅ Screen time settings updated successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Screen time settings updated successfully',
      data: {
        tracking: {
          idleTimeout: advanceScreenTime.currentSession.idleTimeout
        },
        goals: {
          dailyGoal: advanceScreenTime.achievements.dailyGoal
        },
        updatedAt: new Date()
      }
    });

  } catch (error: any) {
    console.error('❌ Update screen time settings error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    );
  }
}