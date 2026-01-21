import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TradingAccount from '@/models/TradingAccount';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    const decoded = verifyToken(authToken!);
    const { amount } = await request.json();

    await connectToDatabase();
    const account = await TradingAccount.findOneAndUpdate(
      { userId: decoded.userId },
      { $inc: { balance: amount } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, balance: account.balance });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}