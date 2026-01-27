import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock response
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        otp: '123456', // In real app, this would be sent via email/SMS
        expiresIn: 300 // 5 minutes
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}