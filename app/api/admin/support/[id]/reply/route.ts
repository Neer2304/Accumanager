import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { verifyToken } from '@/lib/jwt';

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

// POST: Add admin reply to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = await verifyAdmin(request);
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const ticket = await SupportTicket.findById(params.id);
    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    ticket.replies.push({
      message,
      isAdmin: true,
      createdAt: new Date()
    });

    // Auto update status to in-progress if still open
    if (ticket.status === 'open') {
      ticket.status = 'in-progress';
    }

    ticket.updatedAt = new Date();
    await ticket.save();

    return NextResponse.json({
      success: true,
      message: 'Reply added successfully',
      ticket
    });
    
  } catch (error: any) {
    console.error('Add reply error:', error);
    
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