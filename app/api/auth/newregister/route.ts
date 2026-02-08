// app/api/auth/newregister/route.ts - WORKING VERSION (NO ENCRYPTION)
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import NewUser from '@/models/NewUser'
import { generateToken } from '@/lib/jwt'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    
    // Extract all fields
    const {
      // Basic Information
      fullName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      
      // Personal Information
      gender,
      relationshipStatus,
      
      // Address
      streetAddress,
      city,
      state,
      country,
      zipCode,
      
      // Professional Information
      occupation,
      companyName,
      jobTitle,
      incomeRange,
      
      // Interests & Preferences
      interests,
      newsletterSubscription,
      termsAccepted,
      privacyAccepted,
      
      // Account Details
      username,
    } = body

    // Comprehensive validation
    const errors: string[] = []

    // Basic Information Validation
    if (!fullName || fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters')
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push('Please enter a valid email address')
    }

    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters')
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    }

    if (!phoneNumber || phoneNumber.trim().length < 10) {
      errors.push('Please enter a valid phone number')
    }

    if (!dateOfBirth) {
      errors.push('Date of birth is required')
    } else {
      const dob = new Date(dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      const dayDiff = today.getDate() - dob.getDate()
      
      const adjustedAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age
      
      if (adjustedAge < 13) {
        errors.push('You must be at least 13 years old to register')
      }
      if (adjustedAge > 120) {
        errors.push('Please enter a valid date of birth')
      }
    }

    // Personal Information Validation
    if (!gender || !['male', 'female', 'other', 'prefer-not-to-say'].includes(gender)) {
      errors.push('Please select a valid gender')
    }

    if (!relationshipStatus || !['single', 'married', 'divorced', 'widowed', 'separated'].includes(relationshipStatus)) {
      errors.push('Please select a valid relationship status')
    }

    // Address Validation
    if (!streetAddress || streetAddress.trim().length < 5) {
      errors.push('Please enter a valid street address')
    }

    if (!city || city.trim().length < 2) {
      errors.push('Please enter a valid city')
    }

    if (!state || state.trim().length < 2) {
      errors.push('Please enter a valid state')
    }

    if (!country || country.trim().length < 2) {
      errors.push('Please enter a valid country')
    }

    if (!zipCode || zipCode.trim().length < 3) {
      errors.push('ZIP code is required')
    }

    // Professional Information Validation
    if (occupation && occupation.length > 50) {
      errors.push('Occupation cannot exceed 50 characters')
    }

    if (companyName && companyName.length > 100) {
      errors.push('Company name cannot exceed 100 characters')
    }

    if (jobTitle && jobTitle.length > 50) {
      errors.push('Job title cannot exceed 50 characters')
    }

    if (!incomeRange || !['<20k', '20k-40k', '40k-60k', '60k-80k', '80k-100k', '100k+'].includes(incomeRange)) {
      errors.push('Please select a valid income range')
    }

    // Interests Validation
    if (interests && Array.isArray(interests) && interests.length > 10) {
      errors.push('Cannot select more than 10 interests')
    }

    // Terms Validation
    if (!termsAccepted) {
      errors.push('You must accept the terms and conditions')
    }

    if (!privacyAccepted) {
      errors.push('You must accept the privacy policy')
    }

    // Username Validation
    if (!username || username.length < 3) {
      errors.push('Username must be at least 3 characters')
    } else if (username.length > 30) {
      errors.push('Username cannot exceed 30 characters')
    } else if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, dots and underscores')
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation failed',
          errors 
        },
        { status: 400 }
      )
    }

    // Check if user already exists with email or username
    const existingUser = await NewUser.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          message: existingUser.email === email.toLowerCase() 
            ? 'User already exists with this email' 
            : 'Username is already taken'
        },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user WITHOUT encryption for now
    const newUser = new NewUser({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber: phoneNumber || '',
      dateOfBirth: new Date(dateOfBirth) || new Date(),
      gender,
      relationshipStatus,
      streetAddress: streetAddress || '',
      city: city || '',
      state: state || '',
      country: country || '',
      zipCode: zipCode || '',
      occupation: occupation || '',
      companyName: companyName || '',
      jobTitle: jobTitle || '',
      incomeRange: incomeRange || '<20k',
      interests: Array.isArray(interests) ? interests : [],
      newsletterSubscription: newsletterSubscription || false,
      termsAccepted,
      privacyAccepted,
      username: username.toLowerCase(),
    })

    await newUser.save()

    // Generate JWT token
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      username: newUser.username,
      emailVerified: newUser.emailVerified,
      phoneVerified: newUser.phoneVerified,
    })

    // Return user data
    const userResponse = {
      id: newUser._id.toString(),
      fullName: newUser.fullName,
      email: newUser.email,
      username: newUser.username,
      gender: newUser.gender,
      city: newUser.city,
      state: newUser.state,
      country: newUser.country,
      occupation: newUser.occupation,
      companyName: newUser.companyName,
      jobTitle: newUser.jobTitle,
      interests: newUser.interests,
      newsletterSubscription: newUser.newsletterSubscription,
      isActive: newUser.isActive,
      emailVerified: newUser.emailVerified,
      phoneVerified: newUser.phoneVerified,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: userResponse,
      token,
    }, { 
      status: 201,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`
      }
    })

  } catch (error: any) {
    console.error('New registration error:', error)
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json(
        { 
          success: false,
          message: field === 'email' 
            ? 'Email already exists' 
            : 'Username already taken',
          field
        },
        { status: 409 }
      )
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation failed',
          errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// OPTIONS method for CORS
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}