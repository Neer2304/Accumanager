// app/api/auth/register/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import { generateToken } from '@/lib/jwt'
import { connectToDatabase } from '@/lib/mongodb'
import { PaymentService } from '@/services/paymentService'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { name, email, password, shopName } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with trial subscription
    const user = new User({
      name,
      email,
      password: hashedPassword,
      shopName: shopName || '',
    })

    await user.save()

    // Start free trial automatically
    await PaymentService.startFreeTrial(user._id.toString());

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Get updated user with subscription
    const userWithSubscription = await User.findById(user._id);
    
    // Return user data (without password)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      shopName: user.shopName,
      isActive: user.isActive,
      subscription: userWithSubscription.subscription,
      usage: userWithSubscription.usage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json({
      user: userData,
      token,
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}