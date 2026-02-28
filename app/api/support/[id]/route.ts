import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Await and clean params
    const { id: rawId } = await params;
    const id = rawId.trim();

    console.log(`🔍 User fetching ticket: ${id}`);
    
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

    // 3. ID Validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ticket ID format' }, { status: 400 });
    }

    await connectToDatabase();

    // 4. Fetch Ticket
    const ticket = await SupportTicket.findById(id).lean();
    
    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    // 5. Security: Ownership Check
    if (ticket.userId.toString() !== decoded.userId.toString()) {
      return NextResponse.json(
        { message: 'You can only view your own tickets' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, ticket });
    
  } catch (error: any) {
    console.error('❌ Get ticket error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}