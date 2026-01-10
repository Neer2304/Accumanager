// app/api/admin/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    const filter: any = { status };
    if (status === 'all') delete filter.status;

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments(filter);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('❌ Admin get reviews error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// PATCH - Update review status (approve/reject/feature)
export async function PATCH(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    
    // Allow both admin and superadmin
    const allowedRoles = ['admin', 'superadmin'];
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { reviewId, status, featured, reply } = body;

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === 'approved') {
        updateData.approvedAt = new Date();
        updateData.approvedBy = decoded.userId;
        updateData.approvedByRole = decoded.role;
      } else if (status === 'rejected') {
        updateData.rejectedAt = new Date();
        updateData.rejectedBy = decoded.userId;
        updateData.rejectedByRole = decoded.role;
      }
    }
    
    if (featured !== undefined) updateData.featured = featured;
    
    if (reply) {
      updateData.reply = {
        message: reply.message,
        repliedBy: decoded.userId,
        repliedByRole: decoded.role,
        repliedAt: new Date()
      };
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true }
    ).lean();

    if (!updatedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Review updated successfully',
      review: updatedReview
    });

  } catch (error: any) {
    console.error('❌ Admin update review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update review' },
      { status: 500 }
    );
  }
}