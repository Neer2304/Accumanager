// app/api/support/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Here you would save to your database
    // Example with Prisma:
    /*
    const supportRequest = await prisma.supportRequest.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'NEW',
        createdAt: new Date(),
      },
    });
    */

    // For now, we'll just log and return success
    console.log('New support request:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // You can integrate with email services here (SendGrid, Resend, etc.)
    // You can integrate with SMS services here (Twilio, etc.)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Support request submitted successfully',
        // id: supportRequest.id // if using database
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing support request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}