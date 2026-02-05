// app/api/advance/screen-time/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import AdvanceScreenTime from '@/models/AdvanceScreenTime';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

// POST: Track screen time activity
export async function POST(request: NextRequest) {
  try {
    console.log('⏱️ POST /api/advance/screen-time - Tracking activity...');
    
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
    console.log('✅ Database connected for screen time tracking');

    const body = await request.json();
    const {
      action,
      page,
      deviceInfo,
      duration,
      pagesVisited = [],
      actionsPerformed = []
    } = body;

    if (!action || !page) {
      return NextResponse.json(
        { message: 'Action and page are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get or create advance screen time record
    let advanceScreenTime = await AdvanceScreenTime.findOne({ userId: user._id });
    if (!advanceScreenTime) {
      advanceScreenTime = new AdvanceScreenTime({
        userId: user._id,
        currentSession: {
          startTime: new Date(),
          lastActivity: new Date(),
          currentPage: page,
          deviceInfo: deviceInfo || {
            userAgent: 'Unknown',
            screenResolution: 'Unknown',
            platform: 'Unknown'
          }
        }
      });
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const hour = now.getHours();

    // Update user's last active timestamp
    user.screenTime.lastActive = now;

    // Handle different actions
    switch (action) {
      case 'session_start':
        console.log('🟢 Starting new session');
        advanceScreenTime.currentSession = {
          startTime: now,
          lastActivity: now,
          currentPage: page,
          deviceInfo: deviceInfo || advanceScreenTime.currentSession.deviceInfo,
          idleTimeout: 900000
        };
        
        // Log activity
        user.activityLogs.push({
          timestamp: now,
          page,
          duration: 0,
          action: 'session_start'
        });
        break;

      case 'page_view':
        console.log('📄 Tracking page view:', page);
        advanceScreenTime.currentSession.lastActivity = now;
        advanceScreenTime.currentSession.currentPage = page;
        advanceScreenTime.engagement.pageViews += 1;
        
        // Update focus metrics
        if (page.includes('dashboard')) {
          advanceScreenTime.focus.timeOnDashboard += duration || 1;
          advanceScreenTime.focus.mostUsedFeature = 'dashboard';
        } else if (page.includes('reports') || page.includes('analytics')) {
          advanceScreenTime.focus.timeOnReports += duration || 1;
          advanceScreenTime.focus.mostUsedFeature = 'reports';
        } else if (page.includes('settings')) {
          advanceScreenTime.focus.timeOnSettings += duration || 1;
          advanceScreenTime.focus.mostUsedFeature = 'settings';
        }
        
        // Log activity
        user.activityLogs.push({
          timestamp: now,
          page,
          duration: duration || 0,
          action: 'page_view'
        });
        break;

      case 'user_action':
        console.log('🎯 Tracking user action:', body.actionType);
        advanceScreenTime.currentSession.lastActivity = now;
        advanceScreenTime.engagement.clicks += 1;
        
        if (body.actionType === 'form_submit') {
          advanceScreenTime.engagement.formsSubmitted += 1;
        } else if (body.actionType === 'export') {
          advanceScreenTime.engagement.exportsGenerated += 1;
        } else if (body.actionType === 'report_view') {
          advanceScreenTime.engagement.reportsViewed += 1;
        }
        
        // Log activity
        user.activityLogs.push({
          timestamp: now,
          page,
          duration: duration || 0,
          action: `action_${body.actionType}`
        });
        break;

      case 'session_end':
        console.log('🔴 Ending session');
        if (advanceScreenTime.currentSession.startTime) {
          const sessionStart = new Date(advanceScreenTime.currentSession.startTime);
          const sessionDuration = (now.getTime() - sessionStart.getTime()) / 60000; // in minutes
          const sessionHours = sessionDuration / 60;
          
          // Add to session history
          advanceScreenTime.sessionHistory.push({
            sessionId: `session_${Date.now()}`,
            startTime: sessionStart,
            endTime: now,
            duration: sessionDuration,
            pagesVisited: pagesVisited,
            actionsPerformed: actionsPerformed,
            deviceInfo: advanceScreenTime.currentSession.deviceInfo
          });
          
          // Update achievements
          if (sessionDuration > advanceScreenTime.achievements.longestSession) {
            advanceScreenTime.achievements.longestSession = sessionDuration;
          }
          
          // Update user's screen time metrics
          await updateUserScreenTime(user, sessionHours, today, hour, sessionDuration);
          
          // Update weekly streak
          await updateStreak(advanceScreenTime, user, today, sessionHours);
          
          // Calculate productivity score
          calculateProductivityScore(advanceScreenTime);
          
          // Reset current session
          advanceScreenTime.currentSession = {
            startTime: null,
            lastActivity: null,
            currentPage: null,
            deviceInfo: null,
            idleTimeout: 900000
          };
        }
        
        // Log activity
        user.activityLogs.push({
          timestamp: now,
          page,
          duration: duration || 0,
          action: 'session_end'
        });
        break;

      case 'idle_check':
        // Check if user is idle
        const lastActivity = new Date(advanceScreenTime.currentSession.lastActivity);
        const idleTime = now.getTime() - lastActivity.getTime();
        
        if (idleTime > (advanceScreenTime.currentSession.idleTimeout || 900000)) {
          console.log('⏸️ Session idle timeout reached');
          // Auto-end session due to idle timeout
          const idleSessionData = {
            ...body,
            action: 'session_end',
            pagesVisited: [],
            actionsPerformed: ['idle_timeout']
          };
          
          // Create new request for session end
          const idleRequest = new Request(request.url, {
            method: 'POST',
            headers: request.headers,
            body: JSON.stringify(idleSessionData)
          });
          
          return POST(idleRequest);
        }
        break;
    }
    
    // Keep activity logs manageable
    if (user.activityLogs.length > 1000) {
      user.activityLogs = user.activityLogs.slice(-1000);
    }
    
    // Save both documents
    await advanceScreenTime.save();
    await user.save();
    
    console.log('✅ Screen time tracked successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Screen time tracked successfully',
      data: {
        sessionId: advanceScreenTime.currentSession.startTime 
          ? `session_${advanceScreenTime.currentSession.startTime.getTime()}` 
          : null,
        currentSession: advanceScreenTime.currentSession,
        achievements: advanceScreenTime.achievements,
        userStats: {
          totalHours: user.screenTime.totalHours,
          todayHours: getTodayHours(user, today),
          streakDays: advanceScreenTime.achievements.streakDays
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Screen time tracking error:', error);
    
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

// GET: Get screen time analytics
export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/advance/screen-time - Getting analytics...');
    
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
    console.log('✅ Database connected for screen time analytics');

    // Get user and advance screen time
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const advanceScreenTime = await AdvanceScreenTime.findOne({ userId: user._id });
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week';
    const detailed = searchParams.get('detailed') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get analytics based on period
    const analytics = await getScreenTimeAnalytics(user, advanceScreenTime, period);
    
    // Prepare response data
    const responseData: any = {
      stats: analytics.stats,
      dailyStats: analytics.dailyStats,
      hourlyDistribution: analytics.hourlyDistribution,
      period,
      periodInfo: analytics.periodInfo
    };

    // Add detailed data if requested
    if (detailed && advanceScreenTime) {
      responseData.detailed = {
        engagement: advanceScreenTime.engagement,
        focus: advanceScreenTime.focus,
        achievements: advanceScreenTime.achievements,
        recentSessions: advanceScreenTime.sessionHistory
          .sort((a: any, b: any) => b.startTime - a.startTime)
          .slice(0, 10)
      };
    }

    // Add user activity logs if requested
    if (searchParams.get('includeLogs') === 'true') {
      responseData.activityLogs = user.activityLogs
        .sort((a: any, b: any) => b.timestamp - a.timestamp)
        .slice(0, limit)
        .map((log: any) => ({
          timestamp: log.timestamp,
          page: log.page,
          duration: log.duration,
          action: log.action
        }));
    }

    console.log('✅ Screen time analytics fetched successfully');

    return NextResponse.json({
      success: true,
      message: 'Screen time analytics fetched successfully',
      data: responseData
    });

  } catch (error: any) {
    console.error('❌ Screen time analytics error:', error);
    
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

// Helper functions
async function updateUserScreenTime(user: any, sessionHours: number, today: string, hour: number, sessionDuration: number) {
  // Update total hours
  user.screenTime.totalHours += sessionHours;
  user.screenTime.lastSessionDuration = sessionDuration;
  
  // Update daily stats
  let dailyStat = user.screenTime.dailyStats.find(
    (stat: any) => stat.date === today
  );
  
  if (!dailyStat) {
    dailyStat = { date: today, hours: 0, sessions: 0 };
    user.screenTime.dailyStats.push(dailyStat);
  }
  
  dailyStat.hours += sessionHours;
  dailyStat.sessions += 1;
  
  // Update hourly distribution
  let hourStat = user.screenTime.hourlyDistribution.find(
    (h: any) => h.hour === hour
  );
  
  if (!hourStat) {
    hourStat = { hour, hours: 0 };
    user.screenTime.hourlyDistribution.push(hourStat);
  }
  
  hourStat.hours += sessionHours;
  
  // Update peak hour
  const maxHour = user.screenTime.hourlyDistribution.reduce(
    (max: any, curr: any) => curr.hours > max.hours ? curr : max,
    { hour: 0, hours: 0 }
  );
  user.screenTime.peakHour = maxHour.hour;
  
  // Update last 7 days
  user.screenTime.last7Days.shift();
  user.screenTime.last7Days.push(sessionHours);
  
  // Update weekly average
  const weeklyTotal = user.screenTime.last7Days.reduce(
    (sum: number, hours: number) => sum + hours, 0
  );
  user.screenTime.weeklyAverage = weeklyTotal / 7;
  
  // Update average session length
  const totalSessions = user.screenTime.dailyStats.reduce(
    (sum: number, stat: any) => sum + stat.sessions, 0
  );
  user.screenTime.avgSessionLength = totalSessions > 0 
    ? user.screenTime.totalHours / totalSessions 
    : 0;
}

async function updateStreak(advanceScreenTime: any, user: any, today: string, sessionHours: number) {
  // Check if user met daily goal
  const dailyStat = user.screenTime.dailyStats.find(
    (stat: any) => stat.date === today
  );
  
  if (dailyStat && dailyStat.hours >= advanceScreenTime.achievements.dailyGoal) {
    advanceScreenTime.achievements.streakDays += 1;
    
    // Award badge for consistent usage
    if (advanceScreenTime.achievements.streakDays >= 7 && 
        !advanceScreenTime.achievements.badges.includes('weekly_streak')) {
      advanceScreenTime.achievements.badges.push('weekly_streak');
    }
    
    if (advanceScreenTime.achievements.streakDays >= 30 && 
        !advanceScreenTime.achievements.badges.includes('monthly_streak')) {
      advanceScreenTime.achievements.badges.push('monthly_streak');
    }
  } else {
    // Reset streak if goal not met
    advanceScreenTime.achievements.streakDays = 0;
  }
}

function calculateProductivityScore(advanceScreenTime: any) {
  // Calculate based on engagement and focus
  const engagementScore = (
    advanceScreenTime.engagement.formsSubmitted * 10 +
    advanceScreenTime.engagement.exportsGenerated * 15 +
    advanceScreenTime.engagement.reportsViewed * 5 +
    advanceScreenTime.engagement.pageViews * 0.5 +
    advanceScreenTime.engagement.clicks * 0.2
  );
  
  const focusScore = (
    advanceScreenTime.focus.timeOnReports * 2 +
    advanceScreenTime.focus.timeOnDashboard * 1 +
    advanceScreenTime.focus.timeOnSettings * 0.5
  );
  
  advanceScreenTime.focus.productivityScore = Math.round(engagementScore + focusScore);
}

function getTodayHours(user: any, today: string) {
  const dailyStat = user.screenTime.dailyStats.find(
    (stat: any) => stat.date === today
  );
  return dailyStat ? dailyStat.hours : 0;
}

async function getScreenTimeAnalytics(user: any, advanceScreenTime: any, period: string) {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();
  
  // Set date range based on period
  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 7);
  }
  
  // Filter daily stats based on period
  const filteredDailyStats = user.screenTime.dailyStats.filter((stat: any) => {
    const statDate = new Date(stat.date);
    return statDate >= startDate && statDate <= endDate;
  });
  
  // Calculate statistics
  const totalHours = filteredDailyStats.reduce((sum: number, stat: any) => sum + stat.hours, 0);
  const totalSessions = filteredDailyStats.reduce((sum: number, stat: any) => sum + stat.sessions, 0);
  const avgSessionLength = totalSessions > 0 ? totalHours / totalSessions : 0;
  
  // Get hourly distribution for the period
  const hourlyStats = user.screenTime.hourlyDistribution
    .filter((h: any) => h.hours > 0)
    .sort((a: any, b: any) => a.hour - b.hour);
  
  // Calculate peak usage time
  const peakHour = hourlyStats.reduce(
    (max: any, curr: any) => curr.hours > max.hours ? curr : max,
    { hour: 0, hours: 0 }
  ).hour;
  
  // Calculate consistency score
  const consistencyScore = calculateConsistencyScore(filteredDailyStats);
  
  // Get productivity insights
  const productivity = advanceScreenTime ? {
    score: advanceScreenTime.focus.productivityScore,
    mostUsedFeature: advanceScreenTime.focus.mostUsedFeature,
    engagement: advanceScreenTime.engagement
  } : null;
  
  // Get achievements
  const achievements = advanceScreenTime ? advanceScreenTime.achievements : null;
  
  return {
    stats: {
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalSessions,
      avgSessionLength: parseFloat(avgSessionLength.toFixed(2)),
      peakHour,
      consistencyScore,
      streakDays: achievements?.streakDays || 0,
      productivityScore: productivity?.score || 0
    },
    dailyStats: filteredDailyStats,
    hourlyDistribution: hourlyStats,
    productivity,
    achievements,
    periodInfo: {
      startDate,
      endDate,
      period
    }
  };
}

function calculateConsistencyScore(dailyStats: any[]): number {
  if (dailyStats.length === 0) return 0;
  
  const activeDays = dailyStats.filter(stat => stat.hours > 0).length;
  return Math.round((activeDays / dailyStats.length) * 100);
}