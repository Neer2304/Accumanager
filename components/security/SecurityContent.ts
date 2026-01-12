export const SECURITY_CONTENT = {
  navigation: {
    logo: {
      text: "AccumaManage Security",
      icon: "Shield"
    },
    links: [
      { text: "Home", href: "/", icon: "Home" },
      { text: "Pricing", href: "/pricing", icon: "CreditCard" },
      { text: "Security", href: "/security", icon: "ShieldCheck", active: true }
    ]
  },

  hero: {
    tagline: "Enterprise-Grade Security",
    title: "Your Data is Protected",
    subtitle: "We implement robust security measures to protect your business data. Transparency and security are at the core of everything we do.",
    gradient: "from-blue-600/5 to-purple-600/5"
  },

  apiSecurity: {
    title: "API Security",
    icon: "Cpu",
    cards: [
      {
        title: "API Authentication",
        icon: "Key",
        features: [
          "JWT-based authentication",
          "API key management with rate limiting",
          "OAuth 2.0 support"
        ]
      },
      {
        title: "Request Security",
        icon: "Shield",
        features: [
          "HTTPS-only API endpoints",
          "CORS policy implementation",
          "Input validation and sanitization"
        ]
      },
      {
        title: "Monitoring",
        icon: "Refresh",
        features: [
          "Real-time API usage monitoring",
          "Anomaly detection for suspicious activity",
          "Detailed access logs"
        ]
      }
    ]
  },

  dataSecurity: {
    title: "Data Security",
    icon: "Database",
    encryption: {
      title: "Encryption",
      items: [
        {
          title: "Data at Rest",
          icon: "Lock",
          description: "AES-256 encryption for all stored data"
        },
        {
          title: "Data in Transit",
          icon: "Globe",
          description: "TLS 1.3 encryption for all communications"
        }
      ]
    },
    storage: {
      title: "Storage & Backup",
      items: [
        {
          title: "Secure Infrastructure",
          icon: "Cloud",
          description: "Data hosted on secure cloud infrastructure with regular security audits"
        },
        {
          title: "Regular Backups",
          icon: "Refresh",
          description: "Automated daily backups with 30-day retention"
        }
      ]
    }
  },

  userAccess: {
    title: "User Access & Authentication",
    icon: "Users",
    cards: [
      {
        title: "Authentication",
        icon: "Fingerprint",
        features: [
          "Secure password hashing with bcrypt",
          "Optional two-factor authentication",
          "Session management with auto-expiry"
        ]
      },
      {
        title: "Access Control",
        icon: "Eye",
        features: [
          "Role-based access control (RBAC)",
          "Granular permission system",
          "Activity logging for all user actions"
        ]
      }
    ]
  },

  infrastructure: {
    title: "Infrastructure Security",
    icon: "Server",
    sections: [
      {
        title: "Network Security",
        features: [
          "Firewall protection",
          "DDoS protection and mitigation",
          "Regular vulnerability scans"
        ]
      },
      {
        title: "Application Security",
        features: [
          "Regular security updates and patches",
          "Secure coding practices",
          "Dependency vulnerability monitoring"
        ]
      }
    ]
  },

  paymentSecurity: {
    title: "Payment Security",
    icon: "CreditCard",
    gradient: "from-blue-50 to-indigo-50",
    cards: [
      {
        title: "Secure Processing",
        icon: "Shield",
        description: "We never store your payment card details. All payments are processed through PCI DSS compliant payment gateways."
      },
      {
        title: "Encrypted Transactions",
        icon: "Lock",
        description: "All payment transactions are encrypted end-to-end. We support secure UPI payments and other digital payment methods."
      },
      {
        title: "Verification",
        icon: "CheckCircle",
        description: "Every payment is verified before account activation. You receive immediate confirmation of successful payments."
      }
    ]
  },

  incidentResponse: {
    title: "Incident Response & Transparency",
    icon: "AlertCircle",
    items: [
      {
        title: "Security Incident Response",
        icon: "Bell",
        description: "We maintain a documented incident response plan. In the event of a security incident, affected users will be notified promptly with details and remediation steps."
      },
      {
        title: "Transparency",
        icon: "FileText",
        description: "We believe in transparency. Any significant security changes or incidents will be communicated to our users through our status page and email notifications."
      }
    ]
  },

  contact: {
    title: "Security Questions or Concerns?",
    subtitle: "We take security seriously. If you have any security concerns or questions about our practices, please don't hesitate to reach out.",
    gradient: "from-blue-600 to-purple-600",
    contactPoints: [
      {
        title: "Email Security Team",
        icon: "Mail",
        details: "security@accumamanage.com"
      },
      {
        title: "Security Vulnerability Reporting",
        icon: "Building",
        details: "report@accumamanage.com"
      }
    ],
    responseTime: "Within 24-48 hours for security-related inquiries.",
    disclosure: "We appreciate responsible disclosure of security vulnerabilities."
  },

  faq: {
    title: "Security FAQs",
    items: [
      {
        question: "Where is my data stored?",
        answer: "Your data is stored on secure cloud servers with multiple layers of protection. We use industry-leading infrastructure providers who maintain high security standards."
      },
      {
        question: "Who has access to my data?",
        answer: "Only you and authorized users from your account can access your business data. Our support team may access data only with your explicit permission for troubleshooting purposes."
      },
      {
        question: "How often are security audits performed?",
        answer: "We conduct regular security assessments, including automated vulnerability scans and manual penetration testing by security professionals."
      },
      {
        question: "What happens if there's a data breach?",
        answer: "In the unlikely event of a breach, we have an incident response plan that includes immediate notification to affected users, investigation, and remediation steps."
      },
      {
        question: "Can I export my data?",
        answer: "Yes, you can export your data at any time through the dashboard. We provide data in standard formats for easy migration."
      },
      {
        question: "How are backups handled?",
        answer: "Automated daily backups are performed with 30-day retention. Backups are encrypted and stored in geographically separate locations for disaster recovery."
      }
    ]
  },

  footer: {
    company: {
      name: "AccumaManage",
      description: "Secure business management platform built with privacy in mind."
    },
    productLinks: [
      { text: "Home", href: "/" },
      { text: "Pricing", href: "/pricing" },
      { text: "Security", href: "/security" }
    ],
    legalLinks: [
      { text: "Privacy Policy", href: "#" },
      { text: "Terms of Service", href: "#" },
      { text: "Cookie Policy", href: "#" }
    ],
    contactInfo: [
      "support@accumamanage.com",
      "security@accumamanage.com"
    ],
    copyright: `© ${new Date().getFullYear()} AccumaManage. All rights reserved.`,
    tagline: "Built with security and privacy as our top priorities."
  }
};