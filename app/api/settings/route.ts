// app/api/settings/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Setting from '@/models/Setting'
import { verifyToken } from '@/lib/jwt'

// Helper function to get user ID from token
async function getUserIdFromRequest(request: NextRequest): Promise<string> {
  const authToken = request.cookies.get('auth_token')?.value
  
  if (!authToken) {
    throw new Error('Unauthorized')
  }
  
  const decoded = verifyToken(authToken)
  return decoded.userId
}

// Helper function to transform database settings to frontend format
function transformToFrontendFormat(dbSettings: any) {
  return {
    business: {
      name: dbSettings.business?.name || 'My Business',
      taxRate: dbSettings.billing?.taxRate || 18,
      invoicePrefix: dbSettings.billing?.invoicePrefix || 'INV',
      gstNumber: dbSettings.business?.gstNumber || '',
      businessAddress: dbSettings.business?.address || '',
      phone: dbSettings.business?.phone || '',
      email: dbSettings.business?.email || '',
      website: '',
      logoUrl: ''
    },
    notifications: {
      email: dbSettings.notifications?.email || true,
      push: dbSettings.notifications?.salesAlerts || true,
      salesAlerts: dbSettings.notifications?.salesAlerts || true,
      lowStockAlerts: dbSettings.notifications?.lowStockAlerts || true,
      newCustomerAlerts: dbSettings.notifications?.newCustomerAlerts || true,
      billingReminders: dbSettings.notifications?.billingReminders || true,
      monthlyReports: dbSettings.notifications?.dailySummary || true
    },
    security: {
      twoFactorAuth: dbSettings.security?.twoFactorAuth || false,
      sessionTimeout: dbSettings.security?.sessionTimeout || 30,
      passwordChangeRequired: dbSettings.security?.passwordChangeRequired || false,
      loginAlerts: dbSettings.security?.loginAlerts || true,
      ipWhitelist: []
    },
    appearance: {
      language: 'en',
      dateFormat: dbSettings.theme?.dateFormat || 'dd/mm/yyyy',
      compactMode: dbSettings.theme?.compactMode || false,
      dashboardLayout: 'standard',
      primaryColor: dbSettings.theme?.primaryColor || '#2563eb'
    }
  }
}

// Helper function to transform frontend data to database format
function transformToDatabaseFormat(frontendSettings: any) {
  return {
    business: {
      name: frontendSettings.business?.name,
      email: frontendSettings.business?.email,
      phone: frontendSettings.business?.phone,
      address: frontendSettings.business?.businessAddress,
      gstNumber: frontendSettings.business?.gstNumber
    },
    billing: {
      taxRate: frontendSettings.business?.taxRate,
      invoicePrefix: frontendSettings.business?.invoicePrefix
    },
    theme: {
      dateFormat: frontendSettings.appearance?.dateFormat,
      compactMode: frontendSettings.appearance?.compactMode,
      primaryColor: frontendSettings.appearance?.primaryColor
    },
    notifications: {
      email: frontendSettings.notifications?.email,
      salesAlerts: frontendSettings.notifications?.salesAlerts,
      lowStockAlerts: frontendSettings.notifications?.lowStockAlerts,
      newCustomerAlerts: frontendSettings.notifications?.newCustomerAlerts,
      billingReminders: frontendSettings.notifications?.billingReminders,
      dailySummary: frontendSettings.notifications?.monthlyReports
    },
    security: {
      twoFactorAuth: frontendSettings.security?.twoFactorAuth,
      sessionTimeout: frontendSettings.security?.sessionTimeout,
      passwordChangeRequired: frontendSettings.security?.passwordChangeRequired,
      loginAlerts: frontendSettings.security?.loginAlerts
    }
  }
}

// GET: Fetch user settings
export async function GET(request: NextRequest) {
  try {
    console.log('🔧 GET /api/settings - Starting...')
    
    const userId = await getUserIdFromRequest(request)
    await connectToDatabase()

    // Get or create settings for this user
    let settings = await Setting.findOne({ userId })

    if (!settings) {
      console.log('📝 Creating default settings for user:', userId)
      
      // Default settings for India
      settings = new Setting({
        userId,
        business: {
          name: 'My Business',
          email: '',
          phone: '',
          address: '',
          gstNumber: '',
          panNumber: '',
          state: '',
          city: '',
          pincode: '',
          businessType: 'proprietorship',
          industry: ''
        },
        billing: {
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          taxRate: 18,
          invoicePrefix: 'INV',
          invoiceStartingNumber: 1000,
          quotationValidityDays: 30,
          gstType: 'cgst_sgst',
          placeOfSupply: '',
          paymentTerms: 'immediate',
          customPaymentDays: 0
        },
        theme: {
          mode: 'light',
          primaryColor: '#2563eb',
          secondaryColor: '#8b5cf6',
          sidebarWidth: 280,
          compactMode: false,
          fontSize: 'medium',
          dateFormat: 'dd/mm/yyyy',
          timeFormat: '12hour'
        },
        notifications: {
          email: true,
          whatsapp: false,
          sms: false,
          salesAlerts: true,
          lowStockAlerts: true,
          paymentReminders: true,
          gstFilingReminders: true,
          newCustomerAlerts: true,
          billingReminders: true,
          dailySummary: true,
          summaryTime: '18:00'
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30,
          passwordChangeRequired: false,
          loginAlerts: true,
          mobileVerification: false
        },
        backup: {
          autoBackup: false,
          backupFrequency: 'weekly',
          backupTime: '02:00',
          retainBackupDays: 30
        },
        compliance: {
          enableGstInvoices: true,
          includeHsnCode: true,
          includeSacCode: false,
          tdsApplicable: false,
          tdsRate: 0,
          tcsApplicable: false,
          tcsRate: 0
        },
        integrations: {
          razorpay: {
            enabled: false,
            keyId: '',
            keySecret: ''
          },
          cashfree: {
            enabled: false,
            appId: '',
            secretKey: ''
          },
          smsGateway: {
            provider: '',
            apiKey: '',
            senderId: ''
          }
        }
      })
      
      await settings.save()
    }

    console.log('✅ Settings retrieved successfully for user:', userId)
    
    // Transform to frontend format
    const frontendSettings = transformToFrontendFormat(settings)
    
    return NextResponse.json({
      success: true,
      settings: frontendSettings
    })

  } catch (error: any) {
    console.error('❌ Get settings error:', error)
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required. Please login again.' 
        }, 
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}

// PUT: Update settings
export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 PUT /api/settings - Starting...')
    
    const userId = await getUserIdFromRequest(request)
    const frontendUpdateData = await request.json()
    
    await connectToDatabase()

    // Validate update data structure
    if (!frontendUpdateData || typeof frontendUpdateData !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid settings data' },
        { status: 400 }
      )
    }

    // Transform frontend data to database format
    const dbUpdateData = transformToDatabaseFormat(frontendUpdateData)

    // Update settings with proper merging
    const updatedSettings = await Setting.findOneAndUpdate(
      { userId },
      { 
        $set: {
          ...dbUpdateData,
          updatedAt: new Date()
        }
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    )

    console.log('✅ Settings updated successfully for user:', userId)
    
    // Transform back to frontend format for response
    const frontendSettings = transformToFrontendFormat(updatedSettings)
    
    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings: frontendSettings
    })

  } catch (error: any) {
    console.error('❌ Update settings error:', error)
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required' 
        }, 
        { status: 401 }
      )
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: Object.values(error.errors).map((err: any) => err.message)
        }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}