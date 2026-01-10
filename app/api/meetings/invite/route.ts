import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MessageUser from '@/models/MessageUser';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { sendMeetingInviteEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { meetingId, receiverEmails, meetingTitle, meetingLink, meetingTime, message } = body;

    if (!meetingId || !receiverEmails || !meetingTitle || !meetingLink || !meetingTime) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get sender info
    const sender = await User.findById(decoded.userId).select('name email');
    if (!sender) {
      return NextResponse.json({ message: 'Sender not found' }, { status: 404 });
    }

    // Find receivers by email
    const receivers = await User.find({ 
      email: { $in: receiverEmails },
      isActive: true 
    }).select('_id name email');

    if (receivers.length === 0) {
      return NextResponse.json(
        { message: 'No active users found with the provided emails' },
        { status: 404 }
      );
    }

    // Create meeting invites
    const invites = await Promise.all(
      receivers.map(async (receiver) => {
        const invite = new MessageUser({
          meetingId,
          senderId: sender._id,
          receiverId: receiver._id,
          senderName: sender.name,
          receiverName: receiver.name,
          meetingTitle,
          meetingLink,
          meetingTime: new Date(meetingTime),
          message,
          status: 'pending'
        });

        await invite.save();

        // Send email notification
        await sendMeetingInviteEmail({
          to: receiver.email,
          senderName: sender.name,
          meetingTitle,
          meetingLink,
          meetingTime: new Date(meetingTime),
          message
        });

        return {
          id: invite._id,
          receiverId: receiver._id,
          receiverName: receiver.name,
          receiverEmail: receiver.email,
          status: invite.status
        };
      })
    );

    return NextResponse.json({
      message: 'Invitations sent successfully',
      invites,
      totalInvited: invites.length
    });
  } catch (error: any) {
    console.error('Meeting invite error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Get meeting invites for current user
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: any = { receiverId: decoded.userId };
    if (status !== 'all') {
      query.status = status;
    }

    const invites = await MessageUser.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Mark unread invites as read
    await MessageUser.updateMany(
      { receiverId: decoded.userId, read: false },
      { $set: { read: true } }
    );

    const unreadCount = await MessageUser.countDocuments({
      receiverId: decoded.userId,
      read: false,
      status: 'pending'
    });

    return NextResponse.json({
      invites,
      unreadCount,
      total: invites.length
    });
  } catch (error: any) {
    console.error('Get invites error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update invite status (accept/decline)
export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (authError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { inviteId, status } = body;

    if (!inviteId || !['accepted', 'declined'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid request' },
        { status: 400 }
      );
    }

    const invite = await MessageUser.findOneAndUpdate(
      {
        _id: inviteId,
        receiverId: decoded.userId,
        status: 'pending'
      },
      {
        $set: { 
          status,
          read: true 
        }
      },
      { new: true }
    );

    if (!invite) {
      return NextResponse.json(
        { message: 'Invite not found or already processed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Invitation ${status} successfully`,
      invite
    });
  } catch (error: any) {
    console.error('Update invite error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}