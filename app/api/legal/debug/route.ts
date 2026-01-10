// app/api/admin/legal/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LegalDocument from '@/models/LegalDocument';

export async function GET() {
  try {
    await connectToDatabase();
    const allDocs = await LegalDocument.find({});
    
    return NextResponse.json({
      success: true,
      count: allDocs.length,
      documents: allDocs
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}