// app/api/test/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🔍 GET /api/test called');
  return NextResponse.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}

export async function POST(request: Request) {
  console.log('🔄 POST /api/test called');
  try {
    const body = await request.json();
    console.log('📦 Received body:', body);
    
    return NextResponse.json({ 
      message: 'POST received successfully!',
      receivedData: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ POST test error:', error);
    return NextResponse.json(
      { message: 'Error processing request' },
      { status: 400 }
    )
  }
}