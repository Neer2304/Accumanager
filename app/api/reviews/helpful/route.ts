// app/api/reviews/helpful/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import ReviewHelpful from '@/models/ReviewHelpful';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const body = await request.json();
    const { reviewId } = body;

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Check if review exists and is approved
    const review = await Review.findOne({ 
      _id: reviewId, 
      status: 'approved' 
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user already marked helpful
    const existingHelpful = await ReviewHelpful.findOne({
      reviewId,
      userId: decoded.userId
    });

    if (existingHelpful) {
      // Remove helpful
      await ReviewHelpful.deleteOne({ _id: existingHelpful._id });
      await Review.updateOne(
        { _id: reviewId },
        { $inc: { helpful: -1 } }
      );

      return NextResponse.json({
        message: 'Helpful removed',
        helpful: false,
        newCount: review.helpful - 1
      });
    } else {
      // Add helpful
      const newHelpful = new ReviewHelpful({
        reviewId,
        userId: decoded.userId
      });

      await newHelpful.save();
      await Review.updateOne(
        { _id: reviewId },
        { $inc: { helpful: 1 } }
      );

      return NextResponse.json({
        message: 'Marked as helpful',
        helpful: true,
        newCount: review.helpful + 1
      });
    }

  } catch (error: any) {
    console.error('❌ Helpful review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update helpful' },
      { status: 500 }
    );
  }
}