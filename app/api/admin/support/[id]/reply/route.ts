import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

async function verifyAdmin(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  
  if (!authToken) {
    throw new Error('Unauthorized');
  }

  const decoded = verifyToken(authToken);
  
  if (!decoded.role || !['superadmin', 'admin'].includes(decoded.role)) {
    throw new Error('Admin access required');
  }

  return decoded;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Change to Promise
) {
  try {
    // 2. Await the params to get the actual ID
    const { id: rawId } = await params;
    const id = rawId.trim();

    console.log(`📝 Admin replying to ticket: ${id}`);
    
    const decoded = await verifyAdmin(request);
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }

    // 3. Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ticket ID format' }, { status: 400 });
    }

    await connectToDatabase();

    // 4. Use the resolved ID to find the ticket
    const ticket = await SupportTicket.findById(id);
    
    if (!ticket) {
      console.log(`❌ Ticket not found: ${id}`);
      return NextResponse.json(
        { message: 'Ticket not found' }, 
        { status: 404 }
      );
    }

    // Add reply
    const newReply = {
      message,
      isAdmin: true,
      adminId: decoded.userId, // Adding this for better tracking
      createdAt: new Date()
    };

    ticket.replies = ticket.replies || [];
    ticket.replies.push(newReply);

    // Auto update status to in-progress if still open
    if (ticket.status === 'open') {
      ticket.status = 'in-progress';
    }

    ticket.updatedAt = new Date();
    await ticket.save();

    console.log(`✅ Reply added to ${id}. Total replies: ${ticket.replies.length}`);

    return NextResponse.json({
      success: true,
      message: 'Reply added successfully',
      ticket
    });
    
  } catch (error: any) {
    console.error('❌ Add reply error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (error.message === 'Admin access required') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}