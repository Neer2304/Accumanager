import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock verification (in real app, check against database)
    const isValid = otp === '123456' // Demo OTP

    if (!isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid OTP' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token: 'mock-jwt-token',
        expiresIn: 3600 // 1 hour
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to verify OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}