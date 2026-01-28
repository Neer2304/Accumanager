// Create this test endpoint to check if comments route works
// app/api/community/comments/test/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Comments API test endpoint works',
    timestamp: new Date().toISOString()
  });
}