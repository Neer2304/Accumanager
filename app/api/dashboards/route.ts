// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import UserCompany from '@/models/UserCompany';
import Lead from '@/models/Lead';
import Contact from '@/models/Contacts';
import Deal from '@/models/Deal';
import Activity from '@/models/Activity';

// ✅ GET DASHBOARD DATA
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/dashboard - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const userCompany = await UserCompany.findOne({
        userId: decoded.userId,
        isDefault: true,
        status: 'active'
      });

      if (!userCompany) {
        return NextResponse.json(
          { success: false, error: 'No active company found' },
          { status: 403 }
        );
      }

      const companyId = userCompany.companyId;

      // 1. LEAD STATS
      const leadStats = await Lead.aggregate([
        { $match: { companyId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            value: { $sum: '$budget' }
          }
        }
      ]);

      const totalLeads = leadStats.reduce((acc, stat) => acc + stat.count, 0);
      const convertedLeads = leadStats.find(s => s._id === 'converted')?.count || 0;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      // Leads by source
      const leadsBySource = await Lead.aggregate([
        { $match: { companyId } },
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      // 2. DEAL STATS
      const dealStats = await Deal.aggregate([
        { $match: { companyId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            value: { $sum: '$dealValue' },
            expectedRevenue: { $sum: '$expectedRevenue' }
          }
        }
      ]);

      const openDeals = dealStats.find(s => s._id === 'open')?.count || 0;
      const wonDeals = dealStats.find(s => s._id === 'won')?.count || 0;
      const lostDeals = dealStats.find(s => s._id === 'lost')?.count || 0;
      const totalDealValue = dealStats.find(s => s._id === 'open')?.value || 0;
      const totalExpectedRevenue = dealStats.find(s => s._id === 'open')?.expectedRevenue || 0;
      const winRate = (wonDeals + lostDeals) > 0 ? (wonDeals / (wonDeals + lostDeals)) * 100 : 0;

      // Pipeline stages
      const pipelineStages = await Deal.aggregate([
        { $match: { companyId, status: 'open' } },
        {
          $group: {
            _id: '$pipelineStage',
            count: { $sum: 1 },
            value: { $sum: '$dealValue' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // 3. REVENUE FORECAST
      const forecast = await Deal.aggregate([
        { 
          $match: { 
            companyId,
            status: 'open',
            expectedClosingDate: { 
              $gte: new Date(),
              $lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m', date: '$expectedClosingDate' }
            },
            value: { $sum: '$dealValue' },
            expectedRevenue: { $sum: '$expectedRevenue' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // 4. ACTIVITIES
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const activitiesToday = await Activity.countDocuments({
        companyId,
        createdAt: { $gte: today },
        $or: [
          { userId: decoded.userId },
          { assignedTo: decoded.userId }
        ]
      });

      // Upcoming activities
      const upcomingActivities = await Activity.find({
        companyId,
        dueDate: { 
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        status: { $ne: 'completed' },
        $or: [
          { userId: decoded.userId },
          { assignedTo: decoded.userId }
        ]
      })
        .sort({ dueDate: 1 })
        .limit(10)
        .lean();

      // 5. CONTACT STATS
      const totalContacts = await Contact.countDocuments({ 
        companyId,
        isActive: true 
      });

      // 6. SALES PERFORMANCE (Last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const recentDeals = await Deal.aggregate([
        {
          $match: {
            companyId,
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 },
            value: { $sum: '$dealValue' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // 7. TOP PERFORMERS
      const topPerformers = await Deal.aggregate([
        {
          $match: {
            companyId,
            status: 'won',
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: '$assignedTo',
            name: { $first: '$assignedToName' },
            dealsWon: { $sum: 1 },
            value: { $sum: '$dealValue' }
          }
        },
        { $sort: { value: -1 } },
        { $limit: 5 }
      ]);

      return NextResponse.json({
        success: true,
        data: {
          // Summary
          summary: {
            totalLeads,
            totalDeals: openDeals,
            totalContacts,
            activitiesToday,
            totalDealValue,
            totalExpectedRevenue
          },
          
          // Lead Analytics
          leadAnalytics: {
            total: totalLeads,
            converted: convertedLeads,
            conversionRate: Math.round(conversionRate * 10) / 10,
            byStatus: leadStats,
            bySource: leadsBySource
          },
          
          // Deal Analytics
          dealAnalytics: {
            open: openDeals,
            won: wonDeals,
            lost: lostDeals,
            winRate: Math.round(winRate * 10) / 10,
            totalValue: totalDealValue,
            expectedRevenue: totalExpectedRevenue,
            pipeline: pipelineStages
          },
          
          // Revenue Forecast
          forecast,
          
          // Activities
          upcomingActivities,
          
          // Sales Performance
          performance: {
            recentDeals,
            topPerformers
          },
          
          // User Context
          user: {
            id: decoded.userId,
            name: decoded.name,
            companyId: companyId.toString()
          }
        }
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Dashboard error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}