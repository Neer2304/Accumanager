import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { sendEmail } from '@/lib/email';

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
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');

    const query: any = { 
      $or: [
        { receiverId: decoded.userId },
        { senderId: decoded.userId },
      ]
    };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { senderName: { $regex: search, $options: 'i' } },
        { senderEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments(query),
    ]);

    const unreadCount = await Message.countDocuments({
      receiverId: decoded.userId,
      status: 'unread',
    });

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error: any) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { 
      to, 
      subject, 
      content, 
      type = 'direct_message',
      meetingDetails,
      attachments = []
    } = body;

    if (!to || !subject || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get sender info
    const sender = await User.findById(decoded.userId).select('name email avatar');
    if (!sender) {
      return NextResponse.json({ message: 'Sender not found' }, { status: 404 });
    }

    // Find receiver by email
    const receiver = await User.findOne({ 
      email: to,
      isActive: true 
    }).select('_id name email');

    if (!receiver) {
      return NextResponse.json(
        { message: 'Receiver not found or inactive' },
        { status: 404 }
      );
    }

    // Create message
    const messageData: any = {
      type,
      senderId: sender._id,
      senderName: sender.name,
      senderEmail: sender.email,
      senderAvatar: sender.avatar,
      receiverId: receiver._id,
      receiverName: receiver.name,
      receiverEmail: receiver.email,
      subject,
      content,
      status: 'unread',
      isStarred: false,
      isImportant: false,
      attachments,
    };

    if (type === 'meeting_invite' && meetingDetails) {
      messageData.meetingId = meetingDetails.meetingId;
      messageData.meetingTitle = meetingDetails.title;
      messageData.meetingLink = meetingDetails.link;
      messageData.meetingTime = new Date(meetingDetails.date + 'T' + meetingDetails.time);
      messageData.meetingType = meetingDetails.type;
    }

    const message = new Message(messageData);
    await message.save();

    // Send email notification
    if (type === 'meeting_invite') {
      await sendEmail({
        to: receiver.email,
        subject: `Meeting Invitation: ${meetingDetails?.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">📅 Meeting Invitation</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-top: 0;">${meetingDetails?.title}</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>👤 From:</strong> ${sender.name}</p>
                <p><strong>📋 Subject:</strong> ${subject}</p>
                <p><strong>⏰ Time:</strong> ${new Date(meetingDetails?.date + 'T' + meetingDetails?.time).toLocaleString()}</p>
                <p><strong>🔗 Meeting Link:</strong> 
                  <a href="${meetingDetails?.link}" style="color: #667eea;">
                    Join Meeting
                  </a>
                </p>
                <p><strong>💬 Message:</strong> ${content}</p>
              </div>
              <div style="text-align: center;">
                <a href="${meetingDetails?.link}" style="
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: bold;
                  display: inline-block;
                  margin: 10px;
                ">
                  Join Meeting
                </a>
              </div>
            </div>
          </div>
        `,
      });
    } else {
      await sendEmail({
        to: receiver.email,
        subject: `New Message: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">✉️ New Message</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-top: 0;">${subject}</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>👤 From:</strong> ${sender.name}</p>
                <p><strong>📧 To:</strong> ${receiver.email}</p>
                <p><strong>💬 Message:</strong></p>
                <div style="padding: 15px; background: #f8f9fa; border-radius: 4px; margin-top: 10px;">
                  ${content.replace(/\n/g, '<br>')}
                </div>
              </div>
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/messages" style="
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: bold;
                  display: inline-block;
                ">
                  View in AccuManage
                </a>
              </div>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error: any) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { messageId, action, data } = body;

    if (!messageId || !action) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const message = await Message.findOne({
      _id: messageId,
      $or: [
        { senderId: decoded.userId },
        { receiverId: decoded.userId },
      ],
    });

    if (!message) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};
    switch (action) {
      case 'read':
        updateData.status = 'read';
        break;
      case 'star':
        updateData.isStarred = !message.isStarred;
        break;
      case 'archive':
        updateData.status = 'archived';
        break;
      case 'delete':
        updateData.status = 'deleted';
        break;
      case 'respond':
        if (message.type === 'meeting_invite' && data?.response) {
          updateData.status = data.response;
        }
        break;
      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({
      message: 'Message updated successfully',
      data: updatedMessage,
    });
  } catch (error: any) {
    console.error('Update message error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const messageId = searchParams.get('id');

    if (!messageId) {
      return NextResponse.json(
        { message: 'Message ID is required' },
        { status: 400 }
      );
    }

    const message = await Message.findOne({
      _id: messageId,
      $or: [
        { senderId: decoded.userId },
        { receiverId: decoded.userId },
      ],
    });

    if (!message) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      );
    }

    await Message.findByIdAndDelete(messageId);

    return NextResponse.json({
      message: 'Message deleted permanently',
    });
  } catch (error: any) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}