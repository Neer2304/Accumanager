import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Expense from '@/models/Expense';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('GET Expenses API called');
    
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const paymentMethod = searchParams.get('paymentMethod');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const isBusiness = searchParams.get('isBusiness');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log('Query params:', {
      page, limit, category, paymentMethod, startDate, endDate, isBusiness
    });

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { userId: decoded.userId };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (paymentMethod && paymentMethod !== 'all') {
      filter.paymentMethod = paymentMethod;
    }
    
    if (isBusiness) {
      filter.isBusinessExpense = isBusiness === 'true';
    }
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    }

    // Build sort
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    console.log('Filter with userId:', JSON.stringify(filter));

    const expenses = await Expense.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Expense.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    console.log(`Found ${expenses.length} expenses for user ${decoded.userId}`);

    // Get summary stats
    const summary = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalGst: { $sum: '$gstAmount' },
          totalExpenses: { $sum: 1 },
          businessExpenses: {
            $sum: { $cond: ['$isBusinessExpense', '$amount', 0] }
          },
          personalExpenses: {
            $sum: { $cond: ['$isBusinessExpense', 0, '$amount'] }
          }
        }
      }
    ]);

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      summary: summary[0] || {
        totalAmount: 0,
        totalGst: 0,
        totalExpenses: 0,
        businessExpenses: 0,
        personalExpenses: 0
      }
    });

  } catch (error: any) {
    console.error('Get expenses error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST Expenses API called');
    
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

    const expenseData = await request.json();
    console.log('Received expense data:', JSON.stringify(expenseData, null, 2));

    // Validate required fields
    if (!expenseData.title || !expenseData.amount || !expenseData.category) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Title, amount, and category are required' },
        { status: 400 }
      );
    }

    // Validate amount
    if (expenseData.amount <= 0) {
      console.log('Invalid amount:', expenseData.amount);
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Clean and prepare expense data
    const cleanedExpenseData: any = {
      title: expenseData.title.trim(),
      amount: parseFloat(expenseData.amount),
      currency: expenseData.currency || 'INR',
      category: expenseData.category,
      paymentMethod: expenseData.paymentMethod || 'cash',
      date: expenseData.date ? new Date(expenseData.date) : new Date(),
      description: expenseData.description?.trim() || '',
      isBusinessExpense: Boolean(expenseData.isBusinessExpense),
      gstAmount: parseFloat(expenseData.gstAmount) || 0,
      tags: Array.isArray(expenseData.tags) ? expenseData.tags : [],
      isRecurring: Boolean(expenseData.isRecurring),
      recurrence: expenseData.isRecurring ? (expenseData.recurrence || 'monthly') : null,
      status: expenseData.status || 'pending',
      userId: decoded.userId
    };

    // Add vendor data if it's a business expense
    if (cleanedExpenseData.isBusinessExpense && expenseData.vendor) {
      cleanedExpenseData.vendor = {
        name: expenseData.vendor.name?.trim() || '',
        gstin: expenseData.vendor.gstin?.trim() || '',
        contact: expenseData.vendor.contact?.trim() || ''
      };
    }

    console.log('Cleaned expense data with userId:', JSON.stringify(cleanedExpenseData, null, 2));

    // Create new expense
    const expense = new Expense(cleanedExpenseData);
    await expense.save();

    console.log('Expense saved successfully with ID:', expense._id, 'for user:', decoded.userId);

    return NextResponse.json({
      ...expense.toObject(),
      _id: expense._id.toString()
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create expense error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      console.error('Validation errors:', errors);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    console.error('Server error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to create expense' },
      { status: 500 }
    );
  }
}