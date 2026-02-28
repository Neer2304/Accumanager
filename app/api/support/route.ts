// app/api/support/route.ts - Updated POST handler

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// Helper function to generate unique ticket number
async function generateTicketNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Find the latest ticket to get the last sequence number
  const lastTicket = await SupportTicket.findOne({})
    .sort({ createdAt: -1 })
    .select('ticketNumber');
  
  let sequence = 1;
  
  if (lastTicket && lastTicket.ticketNumber) {
    // Extract sequence from last ticket number (format: TKT-YYYYMM-XXXXXX)
    const match = lastTicket.ticketNumber.match(/-(\d+)$/);
    if (match) {
      sequence = parseInt(match[1]) + 1;
    }
  }
  
  // Format: TKT-202602-000001
  const ticketNumber = `TKT-${year}${String(month).padStart(2, '0')}-${String(sequence).padStart(6, '0')}`;
  
  // Check if this number already exists (just in case)
  const exists = await SupportTicket.findOne({ ticketNumber });
  if (exists) {
    // If exists, increment sequence and try again
    return generateTicketNumber(); // Recursive retry
  }
  
  return ticketNumber;
}

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

    // Validation
    if (!subject || !message) {
      return NextResponse.json(
        { message: 'Subject and message are required' },
        { status: 400 }
      );
    }

    if (subject.length < 5) {
      return NextResponse.json(
        { message: 'Subject must be at least 5 characters' },
        { status: 400 }
      );
    }

    if (message.length < 20) {
      return NextResponse.json(
        { message: 'Please describe your issue in at least 20 characters' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Get user info
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate unique ticket number
    const ticketNumber = await generateTicketNumber();
    console.log('Generated ticket number:', ticketNumber);

    const newTicket = new SupportTicket({
      userId: decoded.userId,
      userName: user.name,
      userEmail: user.email,
      subject,
      message,
      priority,
      category,
      status: 'open',
      ticketNumber, // Add the generated ticket number
      replies: []
    });

    await newTicket.save();
    console.log('Ticket created with ID:', newTicket._id);

    return NextResponse.json({
      success: true,
      message: 'Support ticket created successfully',
      ticket: newTicket
    });
    
  } catch (error: any) {
    console.error('Create support ticket error:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      // Try one more time with a new number
      try {
        await connectToDatabase();
        const authToken = request.cookies.get('auth_token')?.value;
        const decoded = verifyToken(authToken!);
        const user = await User.findById(decoded.userId);
        const { subject, message, priority, category } = await request.json().catch(() => ({}));
        
        // Generate with timestamp to avoid collision
        const ticketNumber = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        const newTicket = new SupportTicket({
          userId: decoded.userId,
          userName: user.name,
          userEmail: user.email,
          subject,
          message,
          priority,
          category,
          status: 'open',
          ticketNumber,
          replies: []
        });
        
        await newTicket.save();
        
        return NextResponse.json({
          success: true,
          message: 'Support ticket created successfully',
          ticket: newTicket
        });
      } catch (retryError: any) {
        console.error('Retry also failed:', retryError);
        return NextResponse.json(
          { message: 'Failed to create ticket due to duplicate key. Please try again.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}