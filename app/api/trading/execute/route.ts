import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TradingAccount from '@/models/TradingAccount';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    const decoded = verifyToken(token!);
    const { symbol, type, quantity, price } = await req.json();
    const totalCost = quantity * price;

    await connectToDatabase();
    const userAcc = await TradingAccount.findOne({ userId: decoded.userId });

    if (type === 'BUY') {
      if (userAcc.balance < totalCost) return NextResponse.json({ error: "Insufficient Funds" }, { status: 400 });
      
      // Update balance and add to portfolio
      const updated = await TradingAccount.findOneAndUpdate(
        { userId: decoded.userId },
        { 
          $inc: { balance: -totalCost },
          $push: { portfolio: { symbol, quantity, averagePrice: price, date: new Date() } }
        },
        { new: true }
      );
      return NextResponse.json({ success: true, balance: updated.balance, portfolio: updated.portfolio });
    } 
    
    // Logic for SELL would go here (checking if user owns the stock first)
    return NextResponse.json({ success: true, balance: userAcc.balance, portfolio: userAcc.portfolio });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}