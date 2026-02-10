import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SimpleExpense from '@/models/SimpleExpense';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

const getAuthUserId = (request: NextRequest): string | null => {
  const authToken = request.cookies.get('auth_token')?.value;
  if (!authToken) return null;
  try {
    const decoded = verifyToken(authToken);
    return decoded?.userId ? String(decoded.userId).trim() : null;
  } catch { return null; }
};

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = getAuthUserId(request);
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const data = await request.json();

    const expense = await SimpleExpense.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), userId: userId },
      { $set: data },
      { new: true }
    );

    if (!expense) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, expense });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = getAuthUserId(request);
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const result = await SimpleExpense.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: userId 
    });

    if (!result) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}