// app/api/terms/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TermsConditions from '@/models/Terms';

// GET - Get terms history
export async function GET(request: NextRequest) {
  try {
    console.log('📜 GET /api/terms/history - Starting...');
    
    await connectToDatabase();
    console.log('✅ Database connected');

    const termsHistory = await TermsConditions.find()
      .select('version title effectiveDate isActive')
      .sort({ effectiveDate: -1 })
      .limit(10);

    console.log(`✅ Found ${termsHistory.length} terms versions`);
    return NextResponse.json(termsHistory);
  } catch (error: any) {
    console.error('❌ Get terms history error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}