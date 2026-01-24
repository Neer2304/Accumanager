// app/api/about/route.ts - NEW API ROUTE
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Review from '@/models/Review'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get featured reviews (show at least 3)
    const featuredReviews = await Review.find({ 
      status: 'approved',
      featured: true 
    })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean()

    // If we have less than 3 featured reviews, add recent approved reviews
    let reviews = [...featuredReviews]
    if (reviews.length < 3) {
      const additionalReviews = await Review.find({
        status: 'approved',
        _id: { $nin: reviews.map(r => r._id) } // Exclude already fetched
      })
      .sort({ createdAt: -1 })
      .limit(3 - reviews.length)
      .lean()
      
      reviews = [...reviews, ...additionalReviews]
    }

    // Calculate summary
    const summaryResult = await Review.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ])

    const summary = summaryResult[0] || {
      averageRating: 0,
      totalReviews: 0
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews: reviews.slice(0, 3), // Always return exactly 3 for home page
        summary: {
          averageRating: Math.round(summary.averageRating * 10) / 10,
          totalReviews: summary.totalReviews
        }
      }
    })

  } catch (error: any) {
    console.error('❌ About data fetch error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch about data'
    }, { status: 500 })
  }
}