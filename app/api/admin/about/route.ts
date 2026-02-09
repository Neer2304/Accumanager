import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import About from '@/models/About'
import { verifyToken } from '@/lib/jwt'

// GET - Get all about data (public or admin)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const authToken = request.cookies.get('auth_token')?.value
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    
    // Get about data
    const aboutData = await About.findOne().lean()
    
    if (!aboutData) {
      // Create default about data
      const defaultAbout = new About({
        companyName: 'Admin Dashboard',
        createdBy: 'system',
        updatedBy: 'system',
        
        // Add default values for all required fields
        contact: {
          email: 'contact@company.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, City, Country',
          workingHours: 'Mon-Fri, 9AM-6PM',
          supportHours: '24/7'
        },
        
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: '',
          github: ''
        },
        
        labels: {
          appName: 'Admin Dashboard',
          dashboard: 'Dashboard',
          profile: 'Profile',
          settings: 'Settings',
          logout: 'Logout',
          login: 'Login',
          register: 'Register',
          save: 'Save',
          cancel: 'Cancel',
          delete: 'Delete',
          edit: 'Edit',
          view: 'View',
          welcomeMessage: 'Welcome back!',
          totalUsers: 'Total Users',
          totalRevenue: 'Total Revenue',
          activeSubscriptions: 'Active Subscriptions',
          recentActivities: 'Recent Activities',
          createNew: 'Create New',
          viewDetails: 'View Details',
          downloadReport: 'Download Report',
          exportData: 'Export Data',
          importData: 'Import Data',
          name: 'Name',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          phone: 'Phone',
          address: 'Address',
          active: 'Active',
          inactive: 'Inactive',
          pending: 'Pending',
          completed: 'Completed',
          draft: 'Draft'
        },
        
        seo: {
          metaTitle: 'Admin Dashboard',
          metaDescription: 'Manage your application with our admin dashboard',
          metaKeywords: ['admin', 'dashboard', 'management'],
          ogTitle: 'Admin Dashboard',
          ogDescription: 'Manage your application with our admin dashboard',
          ogImage: '/og-image.png'
        },
        
        theme: {
          primaryColor: '#4285f4',
          secondaryColor: '#34a853',
          accentColor: '#ea4335',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          fontFamily: 'Inter, sans-serif',
          borderRadius: '8px'
        },
        
        system: {
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: 'hh:mm A',
          currency: 'USD',
          currencySymbol: '$',
          language: 'en',
          defaultRole: 'user',
          defaultPlan: 'trial',
          trialDays: 14,
          sessionTimeout: 30,
          itemsPerPage: 10,
          enableRegistration: true,
          enableEmailVerification: false,
          enablePhoneVerification: false,
          enableTwoFactor: false,
          enableCaptcha: false,
          maintenanceMode: false
        }
      })
      
      await defaultAbout.save()
      
      return NextResponse.json({
        success: true,
        data: defaultAbout.toObject(),
        message: 'Default about data created'
      })
    }
    
    // If user is authenticated as admin, return all data
    if (authToken) {
      try {
        const decoded = verifyToken(authToken)
        if (decoded.role && ['admin', 'superadmin'].includes(decoded.role)) {
          return NextResponse.json({
            success: true,
            data: section ? aboutData[section as keyof typeof aboutData] : aboutData,
            isAdmin: true
          })
        }
      } catch {
        // Token invalid, return public data
      }
    }
    
    // Return public data only
    const publicData = {
      companyName: aboutData.companyName,
      companyDescription: aboutData.companyDescription,
      companyLogo: aboutData.companyLogo,
      contact: aboutData.contact,
      socialMedia: aboutData.socialMedia,
      labels: aboutData.labels,
      seo: aboutData.seo,
      theme: aboutData.theme,
      system: {
        timezone: aboutData.system?.timezone,
        dateFormat: aboutData.system?.dateFormat,
        timeFormat: aboutData.system?.timeFormat,
        currency: aboutData.system?.currency,
        currencySymbol: aboutData.system?.currencySymbol,
        language: aboutData.system?.language
      }
    }
    
    return NextResponse.json({
      success: true,
      data: section ? publicData[section as keyof typeof publicData] : publicData,
      isAdmin: false
    })
    
  } catch (error: any) {
    console.error('❌ Get about error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch about data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// POST - Update specific section
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    let decoded
    try {
      decoded = verifyToken(authToken)
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        return NextResponse.json(
          { success: false, message: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        )
      }
    } catch (authError: any) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    const data = await request.json()
    const { section, updates } = data
    
    if (!section) {
      return NextResponse.json(
        { success: false, message: 'Missing section parameter' },
        { status: 400 }
      )
    }
    
    // Find or create about data
    let aboutData = await About.findOne()
    
    if (!aboutData) {
      aboutData = new About({
        createdBy: decoded.id,
        updatedBy: decoded.id
      })
    }
    
    // Update the specific section
    if (section === 'company') {
      // Handle company fields at root level
      aboutData.set(updates)
    } else if (section === 'labels') {
      // Merge labels
      aboutData.labels = {
        ...aboutData.labels.toObject(),
        ...updates
      }
    } else {
      // For nested sections
      aboutData.set({
        [section]: {
          ...aboutData[section as keyof typeof aboutData],
          ...updates
        }
      })
    }
    
    aboutData.updatedBy = decoded.id
    aboutData.updatedAt = new Date()
    
    await aboutData.save()
    
    return NextResponse.json({
      success: true,
      message: 'About data updated successfully',
      data: section === 'company' ? aboutData.toObject() : aboutData[section as keyof typeof aboutData]
    })
    
  } catch (error: any) {
    console.error('❌ Update about error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update about data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// PUT - Bulk update
export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    let decoded
    try {
      decoded = verifyToken(authToken)
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        return NextResponse.json(
          { success: false, message: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        )
      }
    } catch (authError: any) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    const data = await request.json()
    
    let aboutData = await About.findOne()
    
    if (!aboutData) {
      aboutData = new About({
        ...data,
        createdBy: decoded.id,
        updatedBy: decoded.id
      })
    } else {
      aboutData.set({
        ...data,
        updatedBy: decoded.id,
        updatedAt: new Date()
      })
    }
    
    await aboutData.save()
    
    return NextResponse.json({
      success: true,
      message: 'About data updated successfully',
      data: aboutData.toObject()
    })
    
  } catch (error: any) {
    console.error('❌ Bulk update about error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update about data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// DELETE - Reset to defaults
export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    let decoded
    try {
      decoded = verifyToken(authToken)
      if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
        return NextResponse.json(
          { success: false, message: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        )
      }
    } catch (authError: any) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    await About.deleteMany({})
    
    // Create fresh default
    const defaultAbout = new About({
      companyName: 'Admin Dashboard',
      createdBy: decoded.id,
      updatedBy: decoded.id
    })
    
    await defaultAbout.save()
    
    return NextResponse.json({
      success: true,
      message: 'About data reset to defaults',
      data: defaultAbout.toObject()
    })
    
  } catch (error: any) {
    console.error('❌ Reset about error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to reset about data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}