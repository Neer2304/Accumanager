// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Event from '@/models/Events';
import UserCompany from '@/models/UserCompany';
import { NotificationService } from '@/services/notificationService';

// ✅ GET EVENTS
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/events - Starting...');
    
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
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const type = searchParams.get('type');

      let query: any = { 
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { organizerId: decoded.userId },
          { 'attendees.userId': decoded.userId },
          { visibility: 'public' },
          { 
            visibility: 'team',
            'sharedWith.userId': decoded.userId 
          }
        ]
      };

      if (startDate && endDate) {
        query.startDateTime = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      if (type && type !== 'all') {
        query.type = type;
      }

      const events = await Event.find(query)
        .sort({ startDateTime: 1 })
        .lean();

      return NextResponse.json({ 
        success: true,
        events,
        count: events.length
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get events error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ CREATE EVENT
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/events - Starting...');
    
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

      const eventData = await request.json();

      if (!eventData.title || !eventData.startDateTime || !eventData.endDateTime || !eventData.type) {
        return NextResponse.json(
          { success: false, error: 'Title, start date, end date, and type are required' },
          { status: 400 }
        );
      }

      const event = new Event({
        ...eventData,
        companyId: userCompany.companyId,
        userId: decoded.userId,
        organizerId: decoded.userId,
        organizerName: decoded.name || 'Unknown',
        organizerEmail: decoded.email,
        createdBy: decoded.userId,
        createdByName: decoded.name || 'Unknown',
        status: 'scheduled',
        reminders: eventData.reminders || []
      });

      await event.save();

      // Send notifications to attendees
      try {
        if (event.attendees && event.attendees.length > 0) {
          for (const attendee of event.attendees) {
            if (attendee.userId) {
              await NotificationService.notifyEventInvitation(event, attendee.userId, decoded.userId);
            }
          }
        }
      } catch (notifError) {
        console.error('⚠️ Failed to send event invitations:', notifError);
      }

      console.log('✅ Event created:', event._id);
      return NextResponse.json({ success: true, event }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create event error:', error);
    
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