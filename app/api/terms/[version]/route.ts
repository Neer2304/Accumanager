// app/api/terms/[version]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TermsConditions from '@/models/Terms';

// GET - Get specific version of terms
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ version: string }> }
) {
  try {
    const { version } = await params;
    console.log(`🔍 GET /api/terms/${version} - Starting...`);
    
    await connectToDatabase();
    console.log('✅ Database connected');

    const terms = await TermsConditions.findOne({ version })
      .select('-createdBy');

    if (!terms) {
      console.log('❌ Terms version not found:', version);
      return NextResponse.json(
        { message: 'Terms version not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Found terms version: ${terms.version}`);
    return NextResponse.json(terms);
  } catch (error: any) {
    console.error('❌ Get terms version error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}