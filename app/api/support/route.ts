import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// GET: Get user's own support tickets
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    
    await connectToDatabase();
    
    const tickets = await SupportTicket.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json({ tickets });
    
  } catch (error: any) {
    console.error('Get support tickets error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create new support ticket
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    const { subject, message, priority = 'medium', category = 'other' } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { message: 'Subject and message are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Get user info
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const newTicket = new SupportTicket({
      userId: decoded.userId,
      userName: user.name,
      userEmail: user.email,
      subject,
      message,
      priority,
      category,
      status: 'open',
      replies: []
    });

    await newTicket.save();

    return NextResponse.json({
      success: true,
      message: 'Support ticket created successfully',
      ticket: newTicket
    });
    
  } catch (error: any) {
    console.error('Create support ticket error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}