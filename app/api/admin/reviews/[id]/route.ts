// app/api/admin/reviews/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import { verifyToken } from '@/lib/jwt';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    
    // Check if user is admin OR superadmin
    const allowedRoles = ['admin', 'superadmin'];
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { action } = body; // 'approve' or 'reject'

    const review = await Review.findById(params.id);
    
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (action === 'approve') {
      review.status = 'approved';
      review.approvedAt = new Date();
      review.approvedBy = decoded.userId;
      review.approvedByRole = decoded.role; // Store who approved it
    } else if (action === 'reject') {
      review.status = 'rejected';
      review.rejectionReason = body.reason || '';
      review.rejectedBy = decoded.userId;
      review.rejectedByRole = decoded.role;
    }

    await review.save();

    return NextResponse.json({
      message: `Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      review
    });

  } catch (error: any) {
    console.error('❌ Admin review update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update review' },
      { status: 500 }
    );
  }
}