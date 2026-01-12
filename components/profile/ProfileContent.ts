export const PROFILE_CONTENT = {
  page: {
    title: "Profile",
    loading: "Loading...",
    loginRequired: "Please log in to view your profile.",
  },

  header: {
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    memberSince: "Member since",
    lastLogin: "Last login",
  },

  usage: {
    title: "Usage Statistics",
    resources: {
      products: "Products",
      customers: "Customers",
      invoices: "Invoices",
      storageMB: "Storage",
    },
    used: "used",
  },

  tabs: {
    personalInfo: "Personal Info",
    businessDetails: "Business Details",
    notifications: "Notifications",
    security: "Security",
    subscription: "Subscription",
  },

  personalInfo: {
    title: "Personal Information",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    saveChanges: "Save Changes",
    saving: "Saving...",
  },

  businessInfo: {
    title: "Business Information",
    businessName: "Business Name",
    gstNumber: "GST Number",
    gstPlaceholder: "e.g., 07AABCU9603R1ZM",
    businessAddress: "Business Address",
    saveChanges: "Save Changes",
    saving: "Saving...",
  },

  notifications: {
    title: "Notification Preferences",
    emailNotifications: "Email Notifications",
    smsNotifications: "SMS Notifications",
    lowStockAlerts: "Low Stock Alerts",
    monthlyReports: "Monthly Reports",
  },

  security: {
    title: "Security Settings",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    changePassword: "Change Password",
    changing: "Changing...",
    sessionInfo: "Session Information",
    passwordMismatch: "New passwords do not match",
    passwordLength: "Password must be at least 6 characters long",
  },

  subscription: {
    title: "Current Subscription",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    renewsOn: "Renews on",
    expiredOn: "Expired on",
    daysRemaining: "days remaining",
    currentPlanFeatures: "Current Plan Features",
    loading: "Loading subscription details...",
    upgradePlan: "Upgrade Plan",
  },

  upgradeDialog: {
    title: "Upgrade Your Plan",
    subtitle: "Choose the plan that best fits your business needs",
    mostPopular: "Most Popular",
    currentPlan: "Current Plan",
    upgradeTo: "Upgrade to",
    perMonth: "per month",
    perQuarter: "per quarter",
    perYear: "per year",
    cancel: "Cancel",
  },

  pricingPlans: {
    trial: {
      name: 'Free Trial',
      price: 0,
      duration: 14,
      features: [
        'Up to 50 products',
        'Up to 100 customers',
        'Basic inventory management',
        'Email support',
        '14-day free trial'
      ],
      limits: {
        products: 50,
        customers: 100,
        invoices: 200,
        storageMB: 100
      }
    },
    monthly: {
      name: 'Monthly Pro',
      price: 999,
      duration: 30,
      features: [
        'Up to 500 products',
        'Up to 1000 customers',
        'Advanced inventory management',
        'GST billing & reporting',
        'Priority email support',
        'Basic analytics'
      ],
      limits: {
        products: 500,
        customers: 1000,
        invoices: 5000,
        storageMB: 500
      }
    },
    quarterly: {
      name: 'Quarterly Business',
      price: 2599,
      duration: 90,
      features: [
        'Up to 2000 products',
        'Up to 5000 customers',
        'Advanced analytics & reports',
        'Multi-user access (up to 3)',
        'Phone + email support',
        'Custom branding'
      ],
      limits: {
        products: 2000,
        customers: 5000,
        invoices: 15000,
        storageMB: 2000
      }
    },
    yearly: {
      name: 'Yearly Enterprise',
      price: 8999,
      duration: 365,
      features: [
        'Unlimited products',
        'Unlimited customers',
        'Advanced AI analytics',
        'Multi-user access (up to 10)',
        '24/7 priority support',
        'Custom integrations',
        'Dedicated account manager'
      ],
      limits: {
        products: 10000,
        customers: 25000,
        invoices: 50000,
        storageMB: 5000
      }
    }
  },

  messages: {
    success: {
      profileUpdated: 'Profile updated successfully',
      preferencesUpdated: 'Preferences updated successfully',
      passwordChanged: 'Password changed successfully',
      paymentInitiated: 'Payment initiated. Please complete the payment in your UPI app.',
      paymentCompleted: 'Payment completed successfully! Your subscription has been activated.',
      paymentFailed: 'Payment failed. Please try again.',
      paymentTimeout: 'Payment verification timeout. Please check your payment status manually.',
    },
    error: {
      profileLoad: 'Failed to load profile data',
      profileUpdate: 'Failed to update profile',
      preferencesUpdate: 'Failed to update preferences',
      passwordChange: 'Failed to change password',
      paymentCreation: 'Failed to create payment',
      paymentInitiation: 'Failed to initiate payment',
    }
  },

  planColors: {
    trial: 'default',
    monthly: 'primary',
    quarterly: 'secondary',
    yearly: 'success',
  }
};