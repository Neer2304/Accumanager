// app/api/admin/visitors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Visitor from '@/models/Visitor';
import { verifyToken } from '@/lib/jwt';

// Helper function to parse user agent
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Detect bots
  const botKeywords = ['bot', 'crawler', 'spider', 'scraper', 'googlebot', 'bingbot'];
  const isBot = botKeywords.some(keyword => ua.includes(keyword));
  
  // Detect device type
  const isMobile = /mobile|android|iphone|ipod/i.test(ua) && !/ipad|tablet/i.test(ua);
  const isTablet = /ipad|tablet|kindle/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua));
  const isDesktop = !isMobile && !isTablet && !isBot;
  
  // Detect OS
  let os = 'Unknown';
  let osVersion = '';
  
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('ios')) os = 'iOS';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('linux')) os = 'Linux';
  
  // Detect browser
  let browser = 'Unknown';
  let browserVersion = '';
  
  if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('safari')) browser = 'Safari';
  
  return {
    deviceType: isBot ? 'bot' : (isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop')),
    brand: 'Unknown',
    model: 'Unknown',
    os,
    osVersion,
    browser,
    browserVersion,
    engine: 'Unknown',
    engineVersion: '',
    isMobile,
    isTablet,
    isDesktop,
    isBot
  };
}

// Helper function to calculate bounce rate
function calculateBounceRate(visitors: any[]) {
  if (!visitors.length) return 0;
  const singlePageVisits = visitors.filter(v => (v.pageViews?.length || 1) === 1).length;
  return (singlePageVisits / visitors.length) * 100;
}

// POST - Track visitor (public endpoint - NO AUTH NEEDED)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Get IP from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || '127.0.0.1';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || body.userAgent || '';

    // Parse user agent
    const deviceInfo = parseUserAgent(userAgent);
    
    // Get location data
    let locationData = null;
    if (ip && ip !== '127.0.0.1') {
      try {
        const locationResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,org,lat,lon`);
        locationData = await locationResponse.json();
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    }

    // Check existing visitor
    const existingVisitor = await Visitor.findOne({
      ipAddress: ip,
      timestamp: { $gte: new Date(Date.now() - 30 * 60000) }
    });

    if (existingVisitor) {
      existingVisitor.visitCount += 1;
      existingVisitor.lastVisit = new Date();
      existingVisitor.pageViews.push({
        url: body.pageUrl || '/',
        timestamp: new Date(),
        referrer: body.referrer || ''
      });
      await existingVisitor.save();

      return NextResponse.json({ 
        success: true, 
        visitorId: existingVisitor._id,
        isNew: false
      });
    }

    // Create new visitor
    const visitor = await Visitor.create({
      ipAddress: ip,
      userAgent,
      pageUrl: body.pageUrl || '/',
      referrer: body.referrer || '',
      timestamp: new Date(),
      lastVisit: new Date(),
      visitCount: 1,
      pageViews: [{
        url: body.pageUrl || '/',
        timestamp: new Date(),
        referrer: body.referrer || ''
      }],
      device: {
        type: deviceInfo.deviceType,
        brand: deviceInfo.brand,
        model: deviceInfo.model,
        os: deviceInfo.os,
        osVersion: deviceInfo.osVersion,
        browser: deviceInfo.browser,
        browserVersion: deviceInfo.browserVersion,
        isMobile: deviceInfo.isMobile,
        isTablet: deviceInfo.isTablet,
        isDesktop: deviceInfo.isDesktop,
        isBot: deviceInfo.isBot,
      },
      location: locationData && locationData.status === 'success' ? {
        country: locationData.country,
        region: locationData.regionName,
        city: locationData.city,
        isp: locationData.isp,
        organization: locationData.org,
        latitude: locationData.lat,
        longitude: locationData.lon,
      } : null,
      sessionId: body.sessionId,
      userId: body.userId || null,
    });

    return NextResponse.json({ 
      success: true, 
      visitorId: visitor._id,
      isNew: true
    });
    
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to track visitor' 
    }, { status: 500 });
  }
}

// GET - Fetch visitors (admin only - REQUIRES AUTH)
export async function GET(request: NextRequest) {
  try {
    console.log('📈 GET /api/admin/visitors - Starting...');
    
    // 1. Check Authentication
    const authToken = request.cookies.get('auth_token')?.value;
    
    console.log('Auth token present:', !!authToken);
    
    if (!authToken) {
      console.log('No auth token found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No authentication token' }, 
        { status: 401 }
      );
    }

    // 2. Verify Token
    let decoded;
    try {
      decoded = verifyToken(authToken);
      console.log('Token verified for user:', decoded.email, 'role:', decoded.role);
      
      // 3. Check Admin Role
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        console.log('User not admin:', decoded.role);
        return NextResponse.json(
          { success: false, message: 'Forbidden - Admin access required' }, 
          { status: 403 }
        );
      }
    } catch (authError) {
      console.error('Token verification failed:', authError);
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' }, 
        { status: 401 }
      );
    }

    // 4. Connect to Database
    await connectToDatabase();

    // 5. Parse Query Parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const range = searchParams.get('range') || 'week';
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // 6. Calculate Date Range
    const startDate = new Date();
    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setFullYear(2000); // All time
    }

    // 7. Build Query
    const query: any = { timestamp: { $gte: startDate } };
    
    if (search) {
      query.$or = [
        { ipAddress: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } },
        { pageUrl: { $regex: search, $options: 'i' } },
      ];
    }

    // 8. Get Data
    const [visitors, total, stats] = await Promise.all([
      Visitor.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      
      Visitor.countDocuments(query),
      
      Visitor.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalVisitors: { $sum: 1 },
            uniqueIPs: { $addToSet: '$ipAddress' },
            totalPageViews: { $sum: '$visitCount' },
          }
        }
      ])
    ]);

    // 9. Get Device Stats
    const deviceStats = await Visitor.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$device.type',
          count: { $sum: 1 }
        }
      }
    ]);

    // 10. Get Country Stats
    const countryStats = await Visitor.aggregate([
      { $match: { ...query, 'location.country': { $ne: null } } },
      {
        $group: {
          _id: '$location.country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 11. Get Hourly Activity
    const hourlyStats = await Visitor.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // 12. Get Browser Stats
    const browserStats = await Visitor.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$device.browser',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 13. Get OS Stats
    const osStats = await Visitor.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$device.os',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 14. Get Top Pages
    const pageStats = await Visitor.aggregate([
      { $match: query },
      { $unwind: '$pageViews' },
      {
        $group: {
          _id: '$pageViews.url',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 15. Get Active Now
    const activeNow = await Visitor.countDocuments({
      lastVisit: { $gte: new Date(Date.now() - 5 * 60000) }
    });

    // 16. Get Today's Visitors
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await Visitor.countDocuments({
      timestamp: { $gte: today }
    });

    // 17. Format Stats
    const formattedStats = {
      totalVisitors: stats[0]?.totalVisitors || 0,
      uniqueIPs: stats[0]?.uniqueIPs?.length || 0,
      todayVisitors,
      activeNow,
      bounceRate: calculateBounceRate(visitors),
      totalPageViews: stats[0]?.totalPageViews || 0,
      byDevice: {
        desktop: deviceStats.find(d => d._id === 'desktop')?.count || 0,
        mobile: deviceStats.find(d => d._id === 'mobile')?.count || 0,
        tablet: deviceStats.find(d => d._id === 'tablet')?.count || 0,
        bot: deviceStats.find(d => d._id === 'bot')?.count || 0,
        other: deviceStats.filter(d => !['desktop', 'mobile', 'tablet', 'bot'].includes(d._id))
          .reduce((sum, d) => sum + d.count, 0)
      },
      byBrowser: browserStats.map(b => ({ name: b._id || 'Unknown', value: b.count })),
      byOS: osStats.map(o => ({ name: o._id || 'Unknown', value: o.count })),
      byCountry: countryStats.map(c => ({ country: c._id, visitors: c.count })),
      hourlyActivity: Array.from({ length: 24 }, (_, i) => {
        const hour = hourlyStats.find(h => h._id === i);
        return hour?.count || 0;
      }),
      topPages: pageStats.map(p => ({ url: p._id, visits: p.count })),
      topReferrers: []
    };

    console.log(`✅ Data fetched successfully for admin: ${decoded.email}`);

    return NextResponse.json({
      success: true,
      data: {
        visitors,
        stats: formattedStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch visitors' },
      { status: 500 }
    );
  }
}

// DELETE - Delete visitor (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Same auth check as GET
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        return NextResponse.json(
          { success: false, message: 'Forbidden' }, 
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid token' }, 
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing id' },
        { status: 400 }
      );
    }

    await Visitor.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Visitor deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete visitor' },
      { status: 500 }
    );
  }
}