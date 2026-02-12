// app/api/deals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Deal from '@/models/Deal';
import UserCompany from '@/models/UserCompany';
import { NotificationService } from '@/services/notificationService';

// ✅ GET ALL DEALS
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/deals - Starting...');
    
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

      const { searchParams } = new URL(request.url);
      const pipelineStage = searchParams.get('pipelineStage');
      const status = searchParams.get('status');
      const accountId = searchParams.get('accountId');
      const assignedTo = searchParams.get('assignedTo');
      const search = searchParams.get('search');
      const limit = parseInt(searchParams.get('limit') || '50');
      const page = parseInt(searchParams.get('page') || '1');
      const skip = (page - 1) * limit;

      let query: any = { 
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { assignedTo: decoded.userId },
          { 'sharedWith.userId': decoded.userId }
        ]
      };

      if (pipelineStage && pipelineStage !== 'all') {
        query.pipelineStage = pipelineStage;
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      if (accountId) {
        query.accountId = accountId;
      }

      if (assignedTo) {
        query.assignedTo = assignedTo;
      }

      if (search) {
        query.$or = [
          ...query.$or,
          { name: { $regex: search, $options: 'i' } },
          { accountName: { $regex: search, $options: 'i' } },
          { contactName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Deal.countDocuments(query);
      const deals = await Deal.find(query)
        .sort({ expectedClosingDate: 1, probability: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get pipeline stats
      const pipelineStats = await Deal.aggregate([
        { $match: { companyId: userCompany.companyId, status: 'open' } },
        {
          $group: {
            _id: '$pipelineStage',
            count: { $sum: 1 },
            value: { $sum: '$dealValue' },
            expectedRevenue: { $sum: '$expectedRevenue' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Get forecast
      const forecast = await Deal.aggregate([
        { 
          $match: { 
            companyId: userCompany.companyId,
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

      return NextResponse.json({ 
        success: true,
        deals,
        pipelineStats,
        forecast,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get deals error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ CREATE DEAL
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/deals - Starting...');
    
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

      const dealData = await request.json();

      if (!dealData.name || !dealData.dealValue || !dealData.expectedClosingDate || !dealData.pipelineStage) {
        return NextResponse.json(
          { success: false, error: 'Name, deal value, expected closing date, and pipeline stage are required' },
          { status: 400 }
        );
      }

      const deal = new Deal({
        ...dealData,
        companyId: userCompany.companyId,
        userId: decoded.userId,
        createdBy: decoded.userId,
        createdByName: decoded.name || 'Unknown',
        assignedToName: dealData.assignedTo ? decoded.name : null,
        expectedRevenue: (dealData.dealValue * (dealData.probability || 10)) / 100,
        stageChangedAt: new Date(),
        status: 'open',
        activityCount: 0,
        teamMembers: dealData.teamMembers || []
      });

      await deal.save();

      // Update account stats if linked
      if (dealData.accountId) {
        try {
          const Account = (await import('@/models/Account')).default;
          await Account.findByIdAndUpdate(dealData.accountId, {
            $inc: { 
              'stats.totalDeals': 1,
              'stats.totalOpenDeals': 1,
              'stats.totalDealValue': dealData.dealValue
            },
            $set: { lastActivityAt: new Date() }
          });
        } catch (error) {
          console.error('⚠️ Failed to update account stats:', error);
        }
      }

      // Create notification
      try {
        await NotificationService.notifyDealCreated(deal, decoded.userId);
        if (deal.assignedTo && deal.assignedTo.toString() !== decoded.userId) {
          await NotificationService.notifyDealAssigned(deal, deal.assignedTo, decoded.userId);
        }
      } catch (notifError) {
        console.error('⚠️ Failed to create notification:', notifError);
      }

      console.log('✅ Deal created:', deal._id);
      return NextResponse.json({ success: true, deal }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create deal error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}