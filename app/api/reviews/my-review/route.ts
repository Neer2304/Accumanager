// app/api/reviews/my-review/route.ts
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
    await connectToDatabase();

    const review = await Review.findOne({ 
      userId: decoded.userId 
    }).lean();

    return NextResponse.json({ review });

  } catch (error: any) {
    console.error('❌ Get user review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// app/api/reviews/my-review/route.ts - Updated PUT method
export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const body = await request.json();
    const { rating, title, comment } = body;

    // Fetch user details from database
    const User = (await import('@/models/User')).default;
    const user = await User.findById(decoded.userId).select('name avatar businessName role');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find user's existing review
    const existingReview = await Review.findOne({ 
      userId: decoded.userId 
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Update review with latest user data
    existingReview.rating = rating;
    existingReview.title = title.trim();
    existingReview.comment = comment.trim();
    existingReview.userName = user.name || existingReview.userName;
    existingReview.userAvatar = user.avatar || existingReview.userAvatar;
    existingReview.userCompany = user.businessName || existingReview.userCompany;
    existingReview.userRole = user.role || existingReview.userRole;
    existingReview.status = 'pending'; // Needs re-approval after edit

    await existingReview.save();

    return NextResponse.json({
      message: 'Review updated successfully and awaiting approval',
      review: existingReview
    });

  } catch (error: any) {
    console.error('❌ Update review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    await Review.deleteOne({ userId: decoded.userId });

    return NextResponse.json({
      message: 'Review deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Delete review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}