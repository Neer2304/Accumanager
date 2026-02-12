// app/api/activities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Activity from '@/models/Activity';
import UserCompany from '@/models/UserCompany';
import { NotificationService } from '@/services/notificationService';
import Lead from '@/models/Lead';
import Contact from '@/models/Contacts';
import Deal from '@/models/Deal';

// ✅ GET ALL ACTIVITIES
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/activities - Starting...');
    
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
      const type = searchParams.get('type');
      const entityType = searchParams.get('entityType');
      const entityId = searchParams.get('entityId');
      const assignedTo = searchParams.get('assignedTo');
      const fromDate = searchParams.get('fromDate');
      const toDate = searchParams.get('toDate');
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

      if (type && type !== 'all') {
        query.type = type;
      }

      if (entityType && entityId) {
        query['relatedTo'] = {
          $elemMatch: {
            model: entityType,
            id: entityId
          }
        };
      }

      if (assignedTo) {
        query.assignedTo = assignedTo;
      }

      if (fromDate || toDate) {
        query.createdAt = {};
        if (fromDate) query.createdAt.$gte = new Date(fromDate);
        if (toDate) query.createdAt.$lte = new Date(toDate);
      }

      const total = await Activity.countDocuments(query);
      const activities = await Activity.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return NextResponse.json({ 
        success: true,
        activities,
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
    console.error('❌ Get activities error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ CREATE ACTIVITY
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/activities - Starting...');
    
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

      const activityData = await request.json();

      if (!activityData.type || !activityData.subject) {
        return NextResponse.json(
          { success: false, error: 'Activity type and subject are required' },
          { status: 400 }
        );
      }

      const activity = new Activity({
        ...activityData,
        companyId: userCompany.companyId,
        userId: decoded.userId,
        createdBy: decoded.userId,
        createdByName: decoded.name || 'Unknown',
        assignedToName: activityData.assignedTo ? decoded.name : null,
        status: activityData.status || 'not_started',
        progress: activityData.progress || 0
      });

      await activity.save();

      // Update related entity's last activity
      if (activityData.relatedTo && activityData.relatedTo.length > 0) {
        const related = activityData.relatedTo[0];
        
        try {
          switch (related.model) {
            case 'Lead':
              await Lead.findByIdAndUpdate(related.id, {
                lastContactedAt: new Date(),
                $inc: { followUpCount: 1 }
              });
              break;
            case 'Contact':
              await Contact.findByIdAndUpdate(related.id, {
                lastContactedAt: new Date(),
                lastActivityAt: new Date()
              });
              break;
            case 'Deal':
              await Deal.findByIdAndUpdate(related.id, {
                lastActivityAt: new Date(),
                $inc: { activityCount: 1 }
              });
              break;
          }
        } catch (error) {
          console.error('⚠️ Failed to update entity activity:', error);
        }
      }

      // Create notification
      try {
        await NotificationService.notifyActivityCreated(activity, decoded.userId);
        
        if (activity.assignedTo && activity.assignedTo.toString() !== decoded.userId) {
          await NotificationService.notifyActivityAssigned(activity, activity.assignedTo, decoded.userId);
        }
      } catch (notifError) {
        console.error('⚠️ Failed to create notification:', notifError);
      }

      console.log('✅ Activity created:', activity._id);
      return NextResponse.json({ success: true, activity }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create activity error:', error);
    
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