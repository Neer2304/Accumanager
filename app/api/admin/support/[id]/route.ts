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

// GET: Get specific ticket details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = await verifyAdmin(request);
    
    await connectToDatabase();

    const ticket = await SupportTicket.findById(params.id);
    
    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ ticket });
    
  } catch (error: any) {
    console.error('Get ticket error:', error);
    
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

// PUT: Update ticket status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = await verifyAdmin(request);
    const { status, priority, assignedTo } = await request.json();
    
    await connectToDatabase();

    const ticket = await SupportTicket.findById(params.id);
    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    const updateData: any = { updatedAt: new Date() };
    
    if (status && ['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      updateData.status = status;
    }
    
    if (priority && ['low', 'medium', 'high', 'urgent'].includes(priority)) {
      updateData.priority = priority;
    }
    
    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: updatedTicket
    });
    
  } catch (error: any) {
    console.error('Update ticket error:', error);
    
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

// DELETE: Delete ticket (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = await verifyAdmin(request);
    
    await connectToDatabase();

    const ticket = await SupportTicket.findById(params.id);
    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    await SupportTicket.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Delete ticket error:', error);
    
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