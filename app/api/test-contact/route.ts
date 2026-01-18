// app/api/test-contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const testData = {
    name: "John Doe",
    email: "test@example.com", // Change to your actual email
    phone: "+91 98765 43210",
    company: "Test Company",
    subject: "Test Contact Form",
    message: "This is a test message to check if the contact form works properly."
  };
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    return NextResponse.json({
      testPerformed: true,
      apiResponse: result,
      testData: testData,
      statusCode: response.status,
      success: response.ok,
    });
    
  } catch (error: any) {
    return NextResponse.json({
      testPerformed: false,
      error: error.message,
    }, { status: 500 });
  }
}