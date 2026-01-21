import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TradingAccount from '@/models/TradingAccount';
import { verifyToken } from '@/lib/jwt'; // Or your auth library

export async function GET(request: NextRequest) {
  try {
    // 1. Get the user ID from the cookie/token
    const token = request.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    
    await connectToDatabase();

    // 2. Find the account or create a default one if it doesn't exist
    let account = await TradingAccount.findOne({ userId: decoded.userId });
    
    if (!account) {
      account = await TradingAccount.create({
        userId: decoded.userId,
        balance: 1000, // Starting bonus
        portfolio: [],
        history: []
      });
    }

    return NextResponse.json(account);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}