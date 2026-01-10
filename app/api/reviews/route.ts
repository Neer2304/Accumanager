// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured') === 'true';

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { status: 'approved' };
    if (rating) filter.rating = parseInt(rating);
    if (featured) filter.featured = true;

    // Build sort
    let sortOptions: any = { createdAt: -1 };
    if (sort === 'helpful') sortOptions = { helpful: -1, createdAt: -1 };
    if (sort === 'rating') sortOptions = { rating: -1, createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    // Get reviews with user info
    const reviews = await Review.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Review.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Calculate average rating
    const avgRatingResult = await Review.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const averageRating = avgRatingResult[0]?.averageRating || 0;
    const totalReviews = avgRatingResult[0]?.totalReviews || 0;

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      summary: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution
      }
    });

  } catch (error: any) {
    console.error('❌ Get reviews error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// app/api/reviews/route.ts - Updated POST method
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const body = await request.json();
    const { rating, title, comment } = body;

    // Validate required fields
    if (!rating || !title || !comment) {
      return NextResponse.json(
        { error: 'Rating, title, and comment are required' },
        { status: 400 }
      );
    }

    // Check if rating is valid
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user already submitted a review
    const existingReview = await Review.findOne({ 
      userId: decoded.userId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already submitted a review' },
        { status: 400 }
      );
    }

    // IMPORTANT: Fetch actual user details from database
    const User = (await import('@/models/User')).default;
    const user = await User.findById(decoded.userId).select('name email phone avatar businessName businessAddress role');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user details from database
    const userDetails = {
      name: user.name || 'User',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      company: user.businessName || '',
      role: user.role || 'Business Owner'
    };

    // Create new review with actual user data
    const newReview = new Review({
      userId: decoded.userId,
      userName: userDetails.name,
      userEmail: userDetails.email,
      userPhone: userDetails.phone,
      userAvatar: userDetails.avatar,
      userCompany: userDetails.company,
      userRole: userDetails.role,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      status: 'pending' // Reviews need approval
    });

    await newReview.save();

    return NextResponse.json({
      message: 'Review submitted successfully and awaiting approval',
      review: newReview
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Create review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}