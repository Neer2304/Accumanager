// Fixed date to avoid hydration errors
const SYSTEM_LAST_UPDATED = "2024-01-15";

export const HELP_SUPPORT_CONTENT = {
  page: {
    title: "Help & Support",
    description: "Complete Business Management Solution for Indian Businesses",
    tagline: "Get instant help with our AI Assistant, browse documentation, or contact our support team",
  },

  breadcrumbs: {
    home: "Home",
    helpSupport: "Help & Support",
  },

  header: {
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    title: "AccuManage Help Center",
  },

  tabs: {
    quickHelp: "Quick Help",
    documentation: "Documentation",
    contactSupport: "Contact Support",
    videoGuides: "Video Guides",
  },

  quickHelp: {
    aiAssistant: {
      title: "AI Assistant",
      description: "Get instant answers to your questions about AccumaManage features, setup, and troubleshooting.",
      buttonText: "Open AI Assistant",
    },
    quickActions: {
      title: "🚀 Quick Actions",
      browseDocumentation: "Browse Documentation",
      watchTutorials: "Watch Video Tutorials",
      contactSupport: "Contact Support Team",
    },
    quickStartGuides: {
      title: "🎯 Quick Start Guides",
      firstTimeSetup: {
        title: "🚀 First Time Setup",
        steps: [
          "Complete Business Profile with GST details and bank information",
          "Add your Products & Services with HSN codes and tax rates",
          "Set up Customer Database with complete contact and GST information",
          "Configure your Invoice templates and numbering system",
          "Create your first GST-compliant invoice and test the system",
        ],
      },
      dailyOperations: {
        title: "📊 Daily Operations",
        steps: [
          "Record sales through the billing system with automatic GST calculation",
          "Track purchases and expenses in relevant categories",
          "Update inventory levels and receive low stock alerts",
          "Manage customer payments and track outstanding amounts",
          "Review daily sales and expense summaries",
        ],
      },
      monthlyClosing: {
        title: "📅 Monthly Closing",
        steps: [
          "Generate monthly GST reports for return filing",
          "Review profit & loss statements and balance sheets",
          "Reconcile bank transactions and cash flow",
          "Analyze customer payment patterns and follow up on dues",
          "Backup your data and update product pricing if needed",
        ],
      },
    },
  },

  documentation: {
    title: "📚 Documentation & FAQ",
    searchPlaceholder: "Search documentation...",
  },

  contactSupport: {
    title: "📞 Contact Our Support Team",
    description: "Fill out the form below and our support team will get back to you within 24 hours.",
    form: {
      name: "Your Name",
      email: "Email Address",
      subject: "Subject",
      message: "How can we help you?",
      sendButton: "Send Message",
      sending: "Sending...",
    },
    contactMethods: {
      title: "Contact Methods",
      emailSupport: "Email Support",
      emailAddress: "support@accumanage.com",
      phoneSupport: "Phone Support",
      phoneNumber: "+91-9876543210",
      supportHours: "Support Hours",
      hours: "Mon-Sun, 9AM-9PM IST",
    },
    testimonials: {
      title: "What Our Users Say",
      testimonials: [
        {
          name: "Rajesh Kumar",
          company: "RK Traders",
          rating: 5,
          comment: "AccuManage simplified my GST compliance and inventory management. Highly recommended for Indian businesses!",
          avatar: "RK",
        },
        {
          name: "Priya Sharma",
          company: "Event Masters",
          rating: 5,
          comment: "The event expense tracking feature saved us 20% in costs. Excellent support and easy to use.",
          avatar: "PS",
        },
        {
          name: "Amit Patel",
          company: "Tech Solutions Inc",
          rating: 4,
          comment: "Great product with continuous improvements. Customer support is responsive and helpful.",
          avatar: "AP",
        },
      ],
    },
  },

  videoGuides: {
    title: "🎥 Video Tutorials",
    videos: [
      {
        title: "Getting Started Guide",
        duration: "15:30",
        description: "Complete setup and first invoice",
      },
      {
        title: "GST Invoicing Masterclass",
        duration: "22:15",
        description: "Advanced GST compliance features",
      },
      {
        title: "Inventory Management",
        duration: "18:45",
        description: "Stock tracking and alerts",
      },
      {
        title: "Event Expense Tracking",
        duration: "12:20",
        description: "Budget management and reports",
      },
      {
        title: "Customer Management",
        duration: "14:10",
        description: "CRM and payment tracking",
      },
      {
        title: "Advanced Reports",
        duration: "20:05",
        description: "Business analytics and insights",
      },
    ],
  },

  systemStatus: {
    title: "✅ All Systems Operational",
    description: `AccumaManage is running smoothly • Last updated: ${SYSTEM_LAST_UPDATED} • Server Status: Normal • API Response: Optimal`,
  },

  faq: {
    categories: [
      "All",
      "Products & Inventory",
      "Billing & Invoicing",
      "Event Management",
      "Business Setup",
      "Customer Management",
      "General",
      "GST & Compliance",
      "Subscription & Payments",
      "Reports & Analytics",
      "Data & Security",
      "User Management",
    ],
    data: [
      {
        question: "How do I add my first product?",
        answer: "Go to Products → Add Product → Fill in product details (name, category, price, stock, GST details) → Save. Your product will now appear in your inventory and be available for invoicing.",
        category: "Products & Inventory",
      },
      {
        question: "How do I create and manage invoices?",
        answer: "Navigate to Billing → Create Invoice → Select customer → Add products with quantities → System auto-calculates GST (CGST+SGST for intra-state, IGST for inter-state) → Apply discounts if any → Choose payment method → Generate professional GST invoice with automatic numbering.",
        category: "Billing & Invoicing",
      },
      {
        question: "How do I track event expenses and budgets?",
        answer: "Go to Events → Create Event → Add sub-events → Record expenses under each category → Set budgets → View real-time spending reports and budget vs actual comparisons → Generate event profitability reports.",
        category: "Event Management",
      },
      {
        question: "How do I set up my business profile for GST compliance?",
        answer: "Click on Business Setup → Enter business details (name, address, GSTIN, state, contact) → Set invoice preferences → Configure tax settings. This information auto-populates on all your GST-compliant invoices.",
        category: "Business Setup",
      },
      {
        question: "How do I manage customer database and payment tracking?",
        answer: "Go to Customers → Add Customer with complete details including GSTIN → Track customer transactions → View payment history → Send payment reminders → Maintain customer credit limits.",
        category: "Customer Management",
      },
      {
        question: "Can I use AccumaManage offline?",
        answer: "Yes! The system works offline with automatic data sync. Create invoices, record expenses, and manage inventory without internet. Data automatically syncs when you're back online.",
        category: "General",
      },
      {
        question: "How does the GST calculation and compliance work?",
        answer: "System automatically detects transaction type (B2B/B2C) and location to apply correct GST rates. Generates GST-compliant invoices with HSN codes, maintains required records for GSTR filings, and provides GST summary reports.",
        category: "GST & Compliance",
      },
      {
        question: "How do I manage subscriptions and payments?",
        answer: "Go to Profile → Subscription to view your current plan, usage limits, and upgrade options. Choose from Trial, Monthly (₹999), Quarterly (₹2599), or Yearly (₹8999) plans with UPI payment integration.",
        category: "Subscription & Payments",
      },
      {
        question: "How do I track stock levels and get low stock alerts?",
        answer: "Inventory dashboard shows real-time stock levels. Set minimum stock thresholds to receive automatic alerts. Track stock movement across multiple locations with batch tracking support.",
        category: "Products & Inventory",
      },
      {
        question: "How do I generate business reports and analytics?",
        answer: "Access comprehensive reports from Analytics dashboard: Sales reports, Expense reports, GST reports, Customer reports, Inventory reports, and Profitability analysis with visual charts and export options.",
        category: "Reports & Analytics",
      },
      {
        question: "How do I backup and secure my business data?",
        answer: "Automatic real-time cloud backup. Manual backup/export from Settings → Data Management. Role-based access control, secure authentication, and data encryption ensure your business data is always safe.",
        category: "Data & Security",
      },
      {
        question: "How do I manage multiple users and permissions?",
        answer: "Go to Settings → User Management to add team members with role-based permissions (Admin, Manager, Staff). Control access to sensitive data and features based on user roles.",
        category: "User Management",
      },
    ],
  },

  featureHighlights: [
    {
      icon: "Receipt",
      title: "GST Compliant Invoicing",
      description: "Automated GST calculations, HSN code management, and compliant invoice generation for all business types.",
    },
    {
      icon: "Inventory",
      title: "Smart Inventory Management",
      description: "Real-time stock tracking, low stock alerts, batch management, and multi-location inventory support.",
    },
    {
      icon: "Event",
      title: "Event & Expense Tracking",
      description: "Comprehensive event budgeting, expense categorization, and real-time budget vs actual reporting.",
    },
    {
      icon: "People",
      title: "Customer Relationship Management",
      description: "Complete customer database, payment tracking, credit management, and customer analytics.",
    },
    {
      icon: "Analytics",
      title: "Advanced Analytics & Reports",
      description: "Sales reports, GST summaries, profit analysis, inventory reports, and customizable dashboards.",
    },
    {
      icon: "Security",
      title: "Data Security & Backup",
      description: "Enterprise-grade security, automatic backups, role-based access, and data encryption.",
    },
  ],

  subscriptionPlans: [
    {
      name: "Free Trial",
      price: "₹0",
      duration: "14 days",
      features: [
        "Up to 50 customers",
        "100 products",
        "Basic invoicing",
        "GST compliance",
        "Email support",
      ],
    },
    {
      name: "Monthly Pro",
      price: "₹999",
      duration: "per month",
      features: [
        "Unlimited customers",
        "5000 products",
        "Advanced reports",
        "Priority support",
        "1GB storage",
      ],
    },
    {
      name: "Quarterly Business",
      price: "₹2,599",
      duration: "per quarter",
      features: [
        "All Pro features",
        "Bulk operations",
        "Custom branding",
        "Phone + email support",
        "2GB storage",
      ],
    },
    {
      name: "Yearly Enterprise",
      price: "₹8,999",
      duration: "per year",
      features: [
        "All Business features",
        "API access",
        "Dedicated manager",
        "Custom features",
        "5GB storage",
      ],
    },
  ],

  messages: {
    success: {
      contactForm: "Thank you for your message! We will get back to you within 24 hours.",
    },
    error: {
      contactForm: "There was an error submitting your message. Please try again.",
    },
  },

  aiHelper: {
    quickActions: [
      "Dashboard not loading data",
      "GST invoice calculation issue",
      "Inventory stock sync problem",
      "Customer payment tracking",
      "Event expense management",
      "API integration help",
      "Subscription plan questions",
      "How to backup data",
    ],
    responses: {
      dashboard: "I see you're asking about dashboard data. Check if your API endpoints are returning data in correct format. Also verify that you're properly authenticated. Would you like me to help you debug your dashboard integration?",
      gst: "For GST invoicing issues: 1) Verify your business GST details in Settings 2) Check if HSN codes are properly set 3) Ensure customer GSTIN is entered for B2B invoices 4) Verify tax calculation formulas. Need help with specific GST issue?",
      inventory: "Inventory management: 1) Check product categories and variants 2) Set low stock thresholds 3) Verify batch tracking settings 4) Ensure proper stock movement recording. Would you like guidance on specific inventory feature?",
      customer: "Customer management: 1) Verify customer GSTIN format 2) Check credit limit settings 3) Review payment terms 4) Ensure proper contact information. Need help with customer-specific issue?",
      event: "Event & expense tracking: 1) Set up event categories 2) Configure budget limits 3) Categorize expenses properly 4) Use expense reports for analysis. Can you specify which event feature you need help with?",
      api: "API issues: 1) Check network connectivity 2) Verify API endpoint URLs 3) Ensure proper authentication tokens 4) Check CORS settings 5) Review request/response format. Need specific API help?",
      error: "For errors: 1) Check browser console (F12) for detailed messages 2) Verify all required fields are filled 3) Ensure proper data formatting 4) Check network tab for failed requests. Can you share the exact error message?",
      subscription: "Subscription & billing: 1) Check current plan limits 2) Verify payment method 3) Review billing history 4) Contact billing support for payment issues. Need specific billing help?",
      setup: "For setup guidance: Check our Quick Start guides above or browse the FAQ section. I can walk you through specific setup steps. What exactly are you trying to set up?",
      default: "I understand you need assistance with AccumaManage. Could you provide more specific details about your issue or what you're trying to accomplish? This will help me provide more targeted help.",
    },
  },
};