// app/api/meetings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Meeting from '@/models/Meeting';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/meetings - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('⚠️ No auth token found in request cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      console.log('👤 Decoded user:', decoded.userId);
      
      await connectToDatabase();
      console.log('✅ Database connected');

      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status');
      const date = searchParams.get('date');
      
      let query: any = { userId: decoded.userId };
      
      if (status && status !== 'all') {
        query.status = status;
      }
      
      if (date) {
        query.date = {
          $gte: new Date(date + 'T00:00:00.000Z'),
          $lt: new Date(date + 'T23:59:59.999Z')
        };
      }

      const meetings = await Meeting.find(query)
        .sort({ date: 1, startTime: 1 })
        .lean();

      console.log(`✅ Found ${meetings.length} meetings for user ${decoded.userId}`);
      return NextResponse.json(meetings);

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get meetings error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/meetings - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('⚠️ No auth token found in request cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      console.log('👤 Decoded user:', decoded.userId);
      
      await connectToDatabase();
      console.log('✅ Database connected');

      let meetingData;
      try {
        meetingData = await request.json();
        console.log('📦 Meeting data:', JSON.stringify(meetingData, null, 2));
      } catch (parseError) {
        console.error('❌ Error parsing request body:', parseError);
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        );
      }

      // Validate required fields
      if (!meetingData.title || !meetingData.date || !meetingData.startTime || !meetingData.endTime) {
        console.log('❌ Missing required fields:', { 
          title: meetingData.title, 
          date: meetingData.date, 
          startTime: meetingData.startTime, 
          endTime: meetingData.endTime 
        });
        return NextResponse.json(
          { error: 'Title, date, start time, and end time are required' },
          { status: 400 }
        );
      }

      // Generate meeting link for virtual meetings if not provided
      if (!meetingData.location && !meetingData.meetingLink) {
        meetingData.meetingLink = `https://meet.accumanage.com/${Math.random().toString(36).substring(7)}`;
        console.log('🔗 Generated meeting link:', meetingData.meetingLink);
      }

      const meeting = new Meeting({
        ...meetingData,
        organizer: decoded.userId,
        userId: decoded.userId,
        reminders: {
          sent: false,
          scheduledTime: new Date(new Date(meetingData.date).getTime() - 30 * 60000) // 30 minutes before
        }
      });

      await meeting.save();
      console.log('✅ Meeting created successfully:', meeting._id);

      return NextResponse.json(meeting, { status: 201 });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create meeting error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 PUT /api/meetings - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('⚠️ No auth token found in request cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      console.log('👤 Decoded user:', decoded.userId);
      
      await connectToDatabase();
      console.log('✅ Database connected');

      let updateData;
      try {
        updateData = await request.json();
        console.log('📦 Update data:', JSON.stringify(updateData, null, 2));
      } catch (parseError) {
        console.error('❌ Error parsing request body:', parseError);
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        );
      }

      const { meetingId, ...updateFields } = updateData;

      if (!meetingId) {
        return NextResponse.json(
          { error: 'Meeting ID is required' },
          { status: 400 }
        );
      }

      // Verify the meeting belongs to the user
      const existingMeeting = await Meeting.findOne({ 
        _id: meetingId, 
        userId: decoded.userId 
      });

      if (!existingMeeting) {
        return NextResponse.json(
          { error: 'Meeting not found' },
          { status: 404 }
        );
      }

      const updatedMeeting = await Meeting.findByIdAndUpdate(
        meetingId,
        { ...updateFields, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      console.log('✅ Meeting updated successfully:', meetingId);
      return NextResponse.json(updatedMeeting);

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update meeting error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ DELETE /api/meetings - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('⚠️ No auth token found in request cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      console.log('👤 Decoded user:', decoded.userId);
      
      await connectToDatabase();
      console.log('✅ Database connected');

      const { searchParams } = new URL(request.url);
      const meetingId = searchParams.get('id');

      if (!meetingId) {
        return NextResponse.json(
          { error: 'Meeting ID is required' },
          { status: 400 }
        );
      }

      // Verify the meeting belongs to the user
      const existingMeeting = await Meeting.findOne({ 
        _id: meetingId, 
        userId: decoded.userId 
      });

      if (!existingMeeting) {
        return NextResponse.json(
          { error: 'Meeting not found' },
          { status: 404 }
        );
      }

      await Meeting.findByIdAndDelete(meetingId);
      console.log('✅ Meeting deleted successfully:', meetingId);

      return NextResponse.json({ 
        success: true, 
        message: 'Meeting deleted successfully' 
      });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Delete meeting error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}