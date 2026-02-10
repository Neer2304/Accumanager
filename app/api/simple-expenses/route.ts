import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SimpleExpense from '@/models/SimpleExpense';
import { verifyToken } from '@/lib/jwt';

const getAuthUserId = (request: NextRequest): string | null => {
  const authToken = request.cookies.get('auth_token')?.value;
  if (!authToken) return null;
  try {
    const decoded = verifyToken(authToken);
    return decoded?.userId ? String(decoded.userId).trim() : null;
  } catch { return null; }
};

export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter: any = { userId };
    if (category && category !== 'all') filter.category = category;

    const [expenses, total] = await Promise.all([
      SimpleExpense.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean(),
      SimpleExpense.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      expenses: expenses.map((e: any) => ({ ...e, id: e._id.toString() })),
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        total
      },
      summary: {
        totalAmount: expenses.reduce((sum: number, e: any) => sum + e.amount, 0),
        totalExpenses: total
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const data = await request.json();
    const expense = await SimpleExpense.create({ ...data, userId });

    return NextResponse.json({ success: true, expense }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}