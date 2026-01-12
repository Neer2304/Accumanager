// AI Helper Content - Contains all text content and configurations for the AI Assistant

export const AI_HELPER_CONTENT = {
  // Button configuration
  button: {
    text: "AI Assistant",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },

  // Dialog configuration
  dialog: {
    title: "AccumaManage AI Assistant",
    welcomeMessage: "Ask me anything about AccumaManage features, issues, or setup!",
    quickQuestions: "Quick questions:",
    placeholder: "Ask about features, issues, or setup...",
    clearChat: "Clear Chat",
    send: "Send",
    thinking: "Thinking...",
  },

  // Quick actions that users can click
  quickActions: [
    "Dashboard not loading data",
    "GST invoice calculation issue",
    "Inventory stock sync problem",
    "Customer payment tracking",
    "Event expense management",
    "API integration help",
    "Subscription plan questions",
    "How to backup data",
    "Low stock alerts setup",
    "Monthly reports generation",
    "User permissions configuration",
    "GST compliance checks",
  ],

  // Enhanced AI responses with more detailed help
  responses: {
    dashboard: {
      title: "Dashboard Data Issues",
      steps: [
        "Check if your API endpoints are returning data in the correct format",
        "Verify that you're properly authenticated with valid tokens",
        "Ensure network connectivity is stable",
        "Clear browser cache and reload the dashboard",
        "Check browser console for any JavaScript errors",
        "Verify user permissions for dashboard access",
      ],
      followUp: "Would you like me to help you debug your dashboard integration step by step?",
    },

    gst: {
      title: "GST Invoicing Issues",
      steps: [
        "Verify your business GST details in Settings → Business Profile",
        "Check if HSN codes are properly set for all products",
        "Ensure customer GSTIN is entered for B2B invoices",
        "Verify tax calculation formulas and rates",
        "Check invoice numbering sequence",
        "Validate state codes for CGST/SGST vs IGST calculation",
      ],
      followUp: "Need help with specific GST invoice calculations or compliance requirements?",
    },

    inventory: {
      title: "Inventory Management",
      steps: [
        "Check product categories and variants are properly configured",
        "Set appropriate low stock thresholds for each product",
        "Verify batch tracking settings for expiry management",
        "Ensure proper stock movement recording",
        "Check multi-location inventory synchronization",
        "Validate stock adjustment procedures",
      ],
      followUp: "Would you like guidance on specific inventory features like batch tracking or stock transfers?",
    },

    customer: {
      title: "Customer Management",
      steps: [
        "Verify customer GSTIN format and validation",
        "Check credit limit settings and payment terms",
        "Review customer categorization and tags",
        "Ensure proper contact information and communication history",
        "Validate customer payment tracking and aging reports",
        "Check customer import/export procedures",
      ],
      followUp: "Need help with customer-specific issues like payment tracking or credit management?",
    },

    event: {
      title: "Event Expense Tracking",
      steps: [
        "Set up event categories and sub-events properly",
        "Configure budget limits and approval workflows",
        "Categorize expenses according to tax regulations",
        "Use expense reports for detailed analysis",
        "Track event profitability and ROI",
        "Set up recurring event templates",
      ],
      followUp: "Can you specify which event feature you need help with - budgeting, expense categorization, or reporting?",
    },

    api: {
      title: "API Integration Issues",
      steps: [
        "Check network connectivity and firewall settings",
        "Verify API endpoint URLs and authentication tokens",
        "Ensure proper CORS settings are configured",
        "Review request/response format and headers",
        "Check rate limiting and API quotas",
        "Validate webhook configurations",
      ],
      followUp: "Need specific API help with endpoints, authentication, or webhook setup?",
    },

    error: {
      title: "Error Debugging",
      steps: [
        "Check browser console (F12) for detailed error messages",
        "Verify all required fields are properly filled",
        "Ensure proper data formatting and validation",
        "Check network tab for failed API requests",
        "Review application logs for backend errors",
        "Clear application cache and refresh",
      ],
      followUp: "Can you share the exact error message or error code for more specific help?",
    },

    subscription: {
      title: "Subscription & Billing",
      steps: [
        "Check current plan limits and usage statistics",
        "Verify payment method and billing details",
        "Review billing history and invoice downloads",
        "Contact billing support for payment issues",
        "Check subscription renewal settings",
        "Review feature access based on plan",
      ],
      followUp: "Need specific billing help or want to understand plan upgrade benefits?",
    },

    setup: {
      title: "Setup Guidance",
      steps: [
        "Start with business profile setup including GST details",
        "Configure invoice templates and numbering system",
        "Set up product catalog with HSN codes",
        "Import or add customer database",
        "Configure user roles and permissions",
        "Set up backup and data export procedures",
      ],
      followUp: "What exactly are you trying to set up? I can provide step-by-step guidance.",
    },

    backup: {
      title: "Data Backup & Security",
      steps: [
        "Configure automatic backup schedules",
        "Set up manual export procedures",
        "Implement role-based access control",
        "Enable two-factor authentication",
        "Configure data retention policies",
        "Set up audit trails and activity logs",
      ],
      followUp: "Need help with specific backup procedures or security configurations?",
    },

    reports: {
      title: "Reports & Analytics",
      steps: [
        "Generate GST summary reports for filing",
        "Create sales and expense analysis reports",
        "Set up inventory valuation reports",
        "Configure customer aging reports",
        "Create profitability analysis",
        "Set up automated report scheduling",
      ],
      followUp: "Which specific reports do you need help with generating or customizing?",
    },

    default: {
      title: "General Assistance",
      steps: [
        "I'm here to help with AccumaManage features and issues",
        "Please provide specific details about what you're trying to accomplish",
        "I can guide you through setup, troubleshooting, and best practices",
        "For complex issues, our support team is available 24/7",
      ],
      followUp: "Could you provide more specific details about your issue or what you're trying to accomplish? This will help me provide more targeted help.",
    },
  },

  // AI personality and behavior configuration
  aiConfig: {
    name: "AccumaManage AI Assistant",
    personality: "helpful, professional, detailed",
    tone: "friendly and supportive",
    expertise: [
      "GST compliance and invoicing",
      "Inventory management",
      "Customer relationship management",
      "Event and expense tracking",
      "Business analytics and reporting",
      "Data security and backup",
      "User management and permissions",
      "API integration and setup",
    ],
  },

  // API configuration for AI integration
  api: {
    endpoints: {
      chat: "/api/ai/chat",
      suggestions: "/api/ai/suggestions",
      feedback: "/api/ai/feedback",
    },
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
  },

  // Fallback responses when API is unavailable
  fallbackResponses: {
    apiUnavailable: "I'm currently experiencing connection issues. Here's some general help based on your question:",
    timeout: "The request is taking longer than expected. Please try again or contact support for immediate assistance.",
    error: "I encountered an error processing your request. Please try again or reach out to our support team.",
  },

  // Help categories for better organization
  categories: {
    technical: [
      "API Integration",
      "Data Sync",
      "Performance Issues",
      "Error Messages",
      "Browser Compatibility",
    ],
    functional: [
      "GST Invoicing",
      "Inventory Management",
      "Customer Management",
      "Event Tracking",
      "Reporting",
    ],
    setup: [
      "Initial Configuration",
      "Data Import",
      "User Setup",
      "Template Configuration",
      "Integration Setup",
    ],
    billing: [
      "Subscription Plans",
      "Payment Issues",
      "Invoice Generation",
      "Plan Upgrades",
      "Billing History",
    ],
  },

  // Support escalation paths
  escalation: {
    levels: {
      ai: "AI Assistant (Immediate)",
      chat: "Live Chat Support (Within minutes)",
      email: "Email Support (Within 24 hours)",
      phone: "Phone Support (Business hours)",
    },
    triggers: {
      complex: "This seems complex. Would you like me to connect you with a specialist?",
      urgent: "For urgent matters, please contact our support team directly.",
      technical: "This requires technical investigation. Shall I create a support ticket?",
    },
  },

  // Learning and improvement
  learning: {
    feedbackPrompt: "Was this response helpful?",
    improvement: "Your feedback helps me improve. Thank you!",
    ratingOptions: ["Very Helpful", "Somewhat Helpful", "Not Helpful"],
  },

  // Common issues and solutions database
  solutions: {
    commonIssues: [
      {
        issue: "Dashboard not showing data",
        solution: "Check API connectivity and authentication. Refresh browser cache.",
        category: "technical",
      },
      {
        issue: "GST calculation incorrect",
        solution: "Verify HSN codes and tax rates. Check customer state code.",
        category: "functional",
      },
      {
        issue: "Inventory not updating",
        solution: "Check stock movement entries. Verify batch tracking.",
        category: "functional",
      },
      {
        issue: "Invoice printing issues",
        solution: "Check printer configuration. Verify invoice template.",
        category: "technical",
      },
      {
        issue: "User login problems",
        solution: "Reset password. Check user permissions.",
        category: "setup",
      },
    ],
  },

  // Tutorial links and resources
  resources: {
    tutorials: [
      {
        title: "Getting Started Guide",
        url: "/help-support#getting-started",
        duration: "15 min",
      },
      {
        title: "GST Compliance Masterclass",
        url: "/help-support#gst-compliance",
        duration: "25 min",
      },
      {
        title: "Inventory Management Tutorial",
        url: "/help-support#inventory",
        duration: "20 min",
      },
      {
        title: "Advanced Reporting Guide",
        url: "/help-support#reporting",
        duration: "30 min",
      },
    ],
    documentation: {
      api: "/api-docs",
      userGuide: "/user-guide",
      faq: "/faq",
      releaseNotes: "/release-notes",
    },
  },

  // Context for different user roles
  userContext: {
    admin: {
      focus: ["Setup", "Configuration", "User Management", "Reports"],
      complexity: "Detailed technical explanations",
    },
    manager: {
      focus: ["Operations", "Team Management", "Reports", "Approvals"],
      complexity: "Operational guidance",
    },
    staff: {
      focus: ["Daily Tasks", "Data Entry", "Basic Operations"],
      complexity: "Simple step-by-step instructions",
    },
    owner: {
      focus: ["Business Insights", "Financial Reports", "Growth Strategies"],
      complexity: "Strategic business advice",
    },
  },

  // Time-based responses
  timeBased: {
    morning: "Good morning! Ready to help with AccumaManage.",
    afternoon: "Good afternoon! How can I assist you today?",
    evening: "Good evening! I'm here to help with any AccumaManage queries.",
    night: "Working late? I'm here to help with AccumaManage.",
  },

  // Emergency contact information
  emergencyContacts: {
    technical: "tech-support@accumanage.com",
    billing: "billing@accumanage.com",
    general: "support@accumanage.com",
    phone: "+91-9876543210",
  },

  // System status messages
  systemStatus: {
    normal: "✅ All systems operational",
    maintenance: "⚠️ Scheduled maintenance in progress",
    outage: "🚨 Service interruption detected",
    performance: "⚡ Performance optimization active",
  },
};

// Helper functions for AI responses
export const getAIResponse = (userMessage: string): { title: string; steps: string[]; followUp: string } => {
  const lowerMessage = userMessage.toLowerCase();
  const { responses } = AI_HELPER_CONTENT;

  if (lowerMessage.includes('dashboard') || lowerMessage.includes('data') || lowerMessage.includes('chart')) {
    return responses.dashboard;
  }

  if (lowerMessage.includes('gst') || lowerMessage.includes('tax') || lowerMessage.includes('invoice')) {
    return responses.gst;
  }

  if (lowerMessage.includes('inventory') || lowerMessage.includes('stock') || lowerMessage.includes('product')) {
    return responses.inventory;
  }

  if (lowerMessage.includes('customer') || lowerMessage.includes('client') || lowerMessage.includes('contact')) {
    return responses.customer;
  }

  if (lowerMessage.includes('event') || lowerMessage.includes('expense') || lowerMessage.includes('budget')) {
    return responses.event;
  }

  if (lowerMessage.includes('api') || lowerMessage.includes('endpoint') || lowerMessage.includes('fetch')) {
    return responses.api;
  }

  if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
    return responses.error;
  }

  if (lowerMessage.includes('subscription') || lowerMessage.includes('payment') || lowerMessage.includes('plan') || lowerMessage.includes('billing')) {
    return responses.subscription;
  }

  if (lowerMessage.includes('how to') || lowerMessage.includes('setup') || lowerMessage.includes('configure')) {
    return responses.setup;
  }

  if (lowerMessage.includes('backup') || lowerMessage.includes('security') || lowerMessage.includes('export')) {
    return responses.backup;
  }

  if (lowerMessage.includes('report') || lowerMessage.includes('analytics') || lowerMessage.includes('statistics')) {
    return responses.reports;
  }

  return responses.default;
};

// Format AI response for display
export const formatAIResponse = (response: { title: string; steps: string[]; followUp: string }): string => {
  const { title, steps, followUp } = response;
  
  let formattedResponse = `**${title}**\n\n`;
  
  steps.forEach((step, index) => {
    formattedResponse += `${index + 1}. ${step}\n`;
  });
  
  formattedResponse += `\n${followUp}`;
  
  return formattedResponse;
};

// Get quick action suggestions based on user role
export const getQuickActionsByRole = (role: 'admin' | 'manager' | 'staff' | 'owner' = 'admin'): string[] => {
  const { userContext, quickActions } = AI_HELPER_CONTENT;
  
  // Filter quick actions based on role focus
  const roleFocus = userContext[role].focus;
  return quickActions.filter(action => 
    roleFocus.some(focus => 
      action.toLowerCase().includes(focus.toLowerCase())
    )
  ).slice(0, 6); // Return max 6 actions
};

// Get time-based greeting
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  const { timeBased } = AI_HELPER_CONTENT;
  
  if (hour < 12) return timeBased.morning;
  if (hour < 17) return timeBased.afternoon;
  if (hour < 21) return timeBased.evening;
  return timeBased.night;
};

// Get system status message
export const getSystemStatus = (status: 'normal' | 'maintenance' | 'outage' | 'performance' = 'normal'): string => {
  return AI_HELPER_CONTENT.systemStatus[status];
};

// Get emergency contact based on issue type
export const getEmergencyContact = (issueType: 'technical' | 'billing' | 'general'): string => {
  return AI_HELPER_CONTENT.emergencyContacts[issueType];
};

// Export types
export type AIResponseType = keyof typeof AI_HELPER_CONTENT.responses;
export type UserRole = keyof typeof AI_HELPER_CONTENT.userContext;
export type SystemStatus = keyof typeof AI_HELPER_CONTENT.systemStatus;
export type IssueCategory = 'technical' | 'functional' | 'setup' | 'billing';