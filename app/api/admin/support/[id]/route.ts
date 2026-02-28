// app/api/admin/support/[id]/route.ts
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
// GET: Get specific ticket details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  try {
    // 1. ALWAYS await params in Next.js 15+
    const resolvedParams = await params;
    const rawId = resolvedParams.id;

    // 2. Trim the ID to remove hidden spaces or newlines
    const id = rawId.trim();

    console.log('🔍 Processing ID:', id);

    await connectToDatabase();
    
    // Check validity
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        message: 'Invalid ID format',
        received: id,
        length: id.length 
      }, { status: 400 });
    }

    const ticket = await SupportTicket.findById(id).lean();
    
    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ ticket });
    
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Define as Promise
) {
  try {
    // 2. Await the params to get the actual ID
    const { id: rawId } = await params;
    const id = rawId.trim();

    const body = await request.json();
    const { status, priority } = body;

    // Verify admin session
    await verifyAdmin(request);
    
    await connectToDatabase();

    // 3. Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    // 4. Update the ticket
    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    updateData.updatedAt = new Date();

    const ticket = await SupportTicket.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Ticket updated successfully', 
      ticket 
    });

  } catch (error: any) {
    console.error('❌ PUT Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Define params as a Promise
) {
  try {
    // 2. Await the params to get the actual ID string
    const { id: rawId } = await params;
    const id = rawId.trim();

    console.log(`🗑️ Admin deleting ticket: ${id}`);
    
    // Verify admin (ensure this helper is imported)
    const decoded = await verifyAdmin(request);
    
    await connectToDatabase();

    // 3. Validate the unwrapped ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        message: 'Invalid ticket ID format',
        received: id
      }, { status: 400 });
    }

    // 4. Perform the delete
    const deletedTicket = await SupportTicket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Delete ticket error:', error);
    
    // Auth error handling
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