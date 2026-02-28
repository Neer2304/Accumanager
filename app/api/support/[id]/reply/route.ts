import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Await and clean params
    const { id: rawId } = await params;
    const id = rawId.trim();

    console.log(`📝 User replying to ticket: ${id}`);
    
    // 2. Authentication
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verifyToken(authToken);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // 3. Request Body Validation
    const { message } = await request.json();
    if (!message || message.trim().length < 2) {
      return NextResponse.json(
        { message: 'Message must be at least 2 characters' },
        { status: 400 }
      );
    }

    // 4. Database Connection & ID Validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ticket ID format' }, { status: 400 });
    }

    await connectToDatabase();

    // 5. Fetch and Verify Ownership
    const ticket = await SupportTicket.findById(id);
    
    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    // Ensure user owns this ticket (Cast to string for comparison)
    if (ticket.userId.toString() !== decoded.userId.toString()) {
      return NextResponse.json(
        { message: 'You can only reply to your own tickets' },
        { status: 403 }
      );
    }

    if (ticket.status === 'closed') {
      return NextResponse.json({ message: 'Cannot reply to a closed ticket' }, { status: 400 });
    }

    // 6. Update Ticket
    ticket.replies = ticket.replies || [];
    ticket.replies.push({
      message: message.trim(),
      isAdmin: false,
      createdAt: new Date()
    });

    // Reopen if it was previously resolved
    if (ticket.status === 'resolved') {
      ticket.status = 'open';
    }

    ticket.updatedAt = new Date();
    await ticket.save();

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      ticket
    });
    
  } catch (error: any) {
    console.error('❌ User Reply error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}