import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { verifyToken } from '@/lib/jwt';

// Helper function to get user ID from token
async function getUserIdFromRequest(request: NextRequest): Promise<string> {
  const authToken = request.cookies.get('auth_token')?.value;
  
  if (!authToken) {
    throw new Error('Unauthorized');
  }
  
  const decoded = verifyToken(authToken);
  return decoded.userId;
}

// Helper function to create default settings
function createDefaultSettings(userId: string) {
  return new Setting({
    userId,
    business: {
      businessName: 'My Business',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      gstNumber: '',
      panNumber: '',
      logo: '',
      website: '',
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
      language: 'en',
      dateFormat: 'dd/mm/yyyy',
      timeFormat: '12hour',
      compactMode: false,
      sidebarWidth: 280,
      fontSize: 'medium'
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
      mobileVerification: false,
      ipWhitelist: []
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
      razorpay: { enabled: false, keyId: '', keySecret: '' },
      cashfree: { enabled: false, appId: '', secretKey: '' },
      smsGateway: { provider: '', apiKey: '', senderId: '' }
    }
  });
}

// Transform database settings to frontend format
function transformToFrontendFormat(dbSettings: any) {
  return {
    business: {
      name: dbSettings.business?.businessName || 'My Business',
      email: dbSettings.business?.email || '',
      phone: dbSettings.business?.phone || '',
      businessAddress: dbSettings.business?.address || '',
      address: dbSettings.business?.address || '',
      city: dbSettings.business?.city || '',
      state: dbSettings.business?.state || '',
      pincode: dbSettings.business?.pincode || '',
      country: dbSettings.business?.country || 'India',
      gstNumber: dbSettings.business?.gstNumber || '',
      panNumber: dbSettings.business?.panNumber || '',
      website: dbSettings.business?.website || '',
      logoUrl: dbSettings.business?.logo || '',
      businessType: dbSettings.business?.businessType || 'proprietorship',
      industry: dbSettings.business?.industry || '',
      taxRate: dbSettings.billing?.taxRate || 18,
      invoicePrefix: dbSettings.billing?.invoicePrefix || 'INV'
    },
    notifications: {
      email: dbSettings.notifications?.email ?? true,
      push: dbSettings.notifications?.salesAlerts ?? true,
      salesAlerts: dbSettings.notifications?.salesAlerts ?? true,
      lowStockAlerts: dbSettings.notifications?.lowStockAlerts ?? true,
      newCustomerAlerts: dbSettings.notifications?.newCustomerAlerts ?? true,
      billingReminders: dbSettings.notifications?.billingReminders ?? true,
      monthlyReports: dbSettings.notifications?.dailySummary ?? true
    },
    security: {
      twoFactorAuth: dbSettings.security?.twoFactorAuth ?? false,
      sessionTimeout: dbSettings.security?.sessionTimeout ?? 30,
      passwordChangeRequired: dbSettings.security?.passwordChangeRequired ?? false,
      loginAlerts: dbSettings.security?.loginAlerts ?? true,
      ipWhitelist: dbSettings.security?.ipWhitelist || []
    },
    appearance: {
      themeMode: dbSettings.theme?.mode || 'light',
      language: dbSettings.theme?.language || 'en',
      dateFormat: dbSettings.theme?.dateFormat || 'dd/mm/yyyy',
      timeFormat: dbSettings.theme?.timeFormat || '12hour',
      compactMode: dbSettings.theme?.compactMode || false,
      dashboardLayout: 'standard',
      sidebarWidth: dbSettings.theme?.sidebarWidth || 280,
      fontSize: dbSettings.theme?.fontSize || 'medium'
    },
    backup: {
      autoBackup: dbSettings.backup?.autoBackup ?? false,
      backupFrequency: dbSettings.backup?.backupFrequency || 'weekly',
      backupTime: dbSettings.backup?.backupTime || '02:00',
      retainBackupDays: dbSettings.backup?.retainBackupDays || 30
    },
    compliance: {
      enableGstInvoices: dbSettings.compliance?.enableGstInvoices ?? true,
      includeHsnCode: dbSettings.compliance?.includeHsnCode ?? true,
      includeSacCode: dbSettings.compliance?.includeSacCode ?? false,
      tdsApplicable: dbSettings.compliance?.tdsApplicable ?? false,
      tdsRate: dbSettings.compliance?.tdsRate || 0,
      tcsApplicable: dbSettings.compliance?.tcsApplicable ?? false,
      tcsRate: dbSettings.compliance?.tcsRate || 0
    },
    integrations: {
      razorpay: {
        enabled: dbSettings.integrations?.razorpay?.enabled ?? false,
        keyId: dbSettings.integrations?.razorpay?.keyId || '',
        keySecret: dbSettings.integrations?.razorpay?.keySecret || ''
      },
      cashfree: {
        enabled: dbSettings.integrations?.cashfree?.enabled ?? false,
        appId: dbSettings.integrations?.cashfree?.appId || '',
        secretKey: dbSettings.integrations?.cashfree?.secretKey || ''
      }
    }
  };
}

// Transform frontend data to database format
function transformToDatabaseFormat(frontendSettings: any) {
  const updateData: any = {
    'business.businessName': frontendSettings.business?.name,
    'business.email': frontendSettings.business?.email,
    'business.phone': frontendSettings.business?.phone,
    'business.address': frontendSettings.business?.businessAddress,
    'business.city': frontendSettings.business?.city,
    'business.state': frontendSettings.business?.state,
    'business.pincode': frontendSettings.business?.pincode,
    'business.country': frontendSettings.business?.country,
    'business.gstNumber': frontendSettings.business?.gstNumber,
    'business.panNumber': frontendSettings.business?.panNumber,
    'business.website': frontendSettings.business?.website,
    'business.logo': frontendSettings.business?.logoUrl,
    'business.businessType': frontendSettings.business?.businessType,
    'business.industry': frontendSettings.business?.industry,
    
    'billing.taxRate': frontendSettings.business?.taxRate,
    'billing.invoicePrefix': frontendSettings.business?.invoicePrefix,
    
    'theme.mode': frontendSettings.appearance?.themeMode,
    'theme.language': frontendSettings.appearance?.language,
    'theme.dateFormat': frontendSettings.appearance?.dateFormat,
    'theme.timeFormat': frontendSettings.appearance?.timeFormat,
    'theme.compactMode': frontendSettings.appearance?.compactMode,
    'theme.sidebarWidth': frontendSettings.appearance?.sidebarWidth,
    'theme.fontSize': frontendSettings.appearance?.fontSize,
    
    'notifications.email': frontendSettings.notifications?.email,
    'notifications.salesAlerts': frontendSettings.notifications?.salesAlerts,
    'notifications.lowStockAlerts': frontendSettings.notifications?.lowStockAlerts,
    'notifications.newCustomerAlerts': frontendSettings.notifications?.newCustomerAlerts,
    'notifications.billingReminders': frontendSettings.notifications?.billingReminders,
    'notifications.dailySummary': frontendSettings.notifications?.monthlyReports,
    
    'security.twoFactorAuth': frontendSettings.security?.twoFactorAuth,
    'security.sessionTimeout': frontendSettings.security?.sessionTimeout,
    'security.passwordChangeRequired': frontendSettings.security?.passwordChangeRequired,
    'security.loginAlerts': frontendSettings.security?.loginAlerts,
    'security.ipWhitelist': frontendSettings.security?.ipWhitelist,
    
    'backup.autoBackup': frontendSettings.backup?.autoBackup,
    'backup.backupFrequency': frontendSettings.backup?.backupFrequency,
    'backup.backupTime': frontendSettings.backup?.backupTime,
    'backup.retainBackupDays': frontendSettings.backup?.retainBackupDays,
    
    'compliance.enableGstInvoices': frontendSettings.compliance?.enableGstInvoices,
    'compliance.includeHsnCode': frontendSettings.compliance?.includeHsnCode,
    'compliance.includeSacCode': frontendSettings.compliance?.includeSacCode,
    'compliance.tdsApplicable': frontendSettings.compliance?.tdsApplicable,
    'compliance.tdsRate': frontendSettings.compliance?.tdsRate,
    'compliance.tcsApplicable': frontendSettings.compliance?.tcsApplicable,
    'compliance.tcsRate': frontendSettings.compliance?.tcsRate,
    
    'integrations.razorpay.enabled': frontendSettings.integrations?.razorpay?.enabled,
    'integrations.razorpay.keyId': frontendSettings.integrations?.razorpay?.keyId,
    'integrations.razorpay.keySecret': frontendSettings.integrations?.razorpay?.keySecret,
    
    'integrations.cashfree.enabled': frontendSettings.integrations?.cashfree?.enabled,
    'integrations.cashfree.appId': frontendSettings.integrations?.cashfree?.appId,
    'integrations.cashfree.secretKey': frontendSettings.integrations?.cashfree?.secretKey
  };

  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  return updateData;
}

// GET: Fetch user settings
export async function GET(request: NextRequest) {
  try {
    console.log('🔧 GET /api/settings - Starting...');
    
    const userId = await getUserIdFromRequest(request);
    await connectToDatabase();

    // Get or create settings for this user
    let settings = await Setting.findOne({ userId });

    if (!settings) {
      console.log('📝 Creating default settings for user:', userId);
      settings = createDefaultSettings(userId);
      await settings.save();
    }

    console.log('✅ Settings retrieved successfully for user:', userId);
    
    // Transform to frontend format
    const frontendSettings = transformToFrontendFormat(settings);
    
    return NextResponse.json({
      success: true,
      settings: frontendSettings
    });

  } catch (error: any) {
    console.error('❌ Get settings error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required. Please login again.' 
        }, 
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}

// PUT: Update settings
export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 PUT /api/settings - Starting...');
    
    const userId = await getUserIdFromRequest(request);
    const frontendUpdateData = await request.json();
    
    await connectToDatabase();

    // Validate update data structure
    if (!frontendUpdateData || typeof frontendUpdateData !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Transform frontend data to database format
    const dbUpdateData = transformToDatabaseFormat(frontendUpdateData);

    // Add updatedAt to update data
    dbUpdateData.updatedAt = new Date();

    // Update settings with proper merging
    const updatedSettings = await Setting.findOneAndUpdate(
      { userId },
      { $set: dbUpdateData },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );

    console.log('✅ Settings updated successfully for user:', userId);
    
    // Transform back to frontend format for response
    const frontendSettings = transformToFrontendFormat(updatedSettings);
    
    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings: frontendSettings
    });

  } catch (error: any) {
    console.error('❌ Update settings error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required' 
        }, 
        { status: 401 }
      );
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
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}