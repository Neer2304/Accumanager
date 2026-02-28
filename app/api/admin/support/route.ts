// app/api/admin/support/route.ts
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

// GET: Get all support tickets (admin)
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyAdmin(request);
    
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

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
        .limit(limit)
        .lean(),
      SupportTicket.countDocuments(query)
    ]);

    // Get stats
    const [openCount, inProgressCount, resolvedCount, urgentCount] = await Promise.all([
      SupportTicket.countDocuments({ status: 'open' }),
      SupportTicket.countDocuments({ status: 'in-progress' }),
      SupportTicket.countDocuments({ status: 'resolved' }),
      SupportTicket.countDocuments({ priority: 'urgent' })
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
        open: openCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        urgent: urgentCount
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

// ❌ REMOVE THE POST HANDLER FROM THIS FILE
// It was conflicting with /api/admin/support/[id]/reply