import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Expense from '@/models/Expense';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('GET Expense Stats API called');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('No auth token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    console.log('User ID:', decoded.userId);
    
    if (!decoded.userId) {
      console.log('Invalid user ID in token');
      return NextResponse.json({ error: 'Invalid user token' }, { status: 401 });
    }
    
    await connectToDatabase();
    console.log('Connected to database');

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || new Date().getMonth() + 1);

    console.log('Stats for:', { year, month });

    // Monthly category breakdown
    const categoryStats = await Expense.aggregate([
      {
        $match: {
          userId: decoded.userId,
          date: {
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(year, month, 0, 23, 59, 59)
          }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          averageAmount: { $avg: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Monthly trend (last 6 months)
    const monthlyTrend = await Expense.aggregate([
      {
        $match: {
          userId: decoded.userId,
          date: {
            $gte: new Date(year, month - 6, 1),
            $lte: new Date(year, month, 0, 23, 59, 59)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalAmount: { $sum: '$amount' },
          businessExpenses: {
            $sum: { $cond: ['$isBusinessExpense', '$amount', 0] }
          },
          personalExpenses: {
            $sum: { $cond: ['$isBusinessExpense', 0, '$amount'] }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Payment method distribution
    const paymentStats = await Expense.aggregate([
      {
        $match: {
          userId: decoded.userId,
          date: {
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(year, month, 0, 23, 59, 59)
          }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    console.log('Stats calculated:', {
      categoryCount: categoryStats.length,
      monthlyTrendCount: monthlyTrend.length,
      paymentStatsCount: paymentStats.length
    });

    return NextResponse.json({
      categoryStats,
      monthlyTrend,
      paymentStats,
      period: { year, month }
    });

  } catch (error: any) {
    console.error('Get expense stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch expense statistics' },
      { status: 500 }
    );
  }
}