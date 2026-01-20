import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { verifyToken } from '@/lib/jwt';

// Middleware to verify admin access
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

// GET: Get all support tickets (admin)
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyAdmin(request);
    
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      SupportTicket.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SupportTicket.countDocuments(query)
    ]);

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        total,
        open: await SupportTicket.countDocuments({ status: 'open' }),
        inProgress: await SupportTicket.countDocuments({ status: 'in-progress' }),
        resolved: await SupportTicket.countDocuments({ status: 'resolved' }),
        urgent: await SupportTicket.countDocuments({ priority: 'urgent' })
      }
    });
    
  } catch (error: any) {
    console.error('Admin get tickets error:', error);
    
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

// POST: Create admin reply (admin)
export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyAdmin(request);
    const { ticketId, message } = await request.json();

    if (!ticketId || !message) {
      return NextResponse.json(
        { message: 'Ticket ID and message are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const ticket = await SupportTicket.findById(ticketId);
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
    console.error('Admin reply error:', error);
    
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