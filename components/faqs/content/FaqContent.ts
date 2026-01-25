export interface FaqQuestion {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
}

export interface FaqCategory {
  id: string;
  title: string;
  description: string;
  icon: string; // keyof FaqIcons
  questions: FaqQuestion[];
}

export const faqCategories: FaqCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics and setup your account',
    icon: 'general',
    questions: [
      {
        id: 'gs-1',
        question: 'How do I create an account?',
        answer: 'To create an account, click on the "Sign Up" button in the top right corner. Enter your email address, create a password, and follow the verification steps sent to your email. Once verified, you can complete your profile setup.',
        tags: ['account', 'setup', 'registration']
      },
      {
        id: 'gs-2',
        question: 'What are the system requirements?',
        answer: 'Our platform works on all modern web browsers (Chrome, Firefox, Safari, Edge). For optimal performance, we recommend Chrome version 90+ or Firefox version 88+. Mobile apps are available for iOS 13+ and Android 9+.',
        tags: ['system', 'requirements', 'compatibility']
      },
      {
        id: 'gs-3',
        question: 'How do I add my first employee?',
        answer: 'Navigate to the Attendance page and click "Add Employee". Fill in the required details including name, contact information, role, and salary details. You can also add additional information like emergency contacts and bank details.',
        tags: ['employee', 'add', 'setup']
      }
    ]
  },
  {
    id: 'attendance-tracking',
    title: 'Attendance Tracking',
    description: 'Manage employee attendance and time tracking',
    icon: 'attendance',
    questions: [
      {
        id: 'at-1',
        question: 'How do I mark attendance for employees?',
        answer: 'On the Attendance page, you\'ll see all your employees listed with daily attendance boxes. Click on any date to toggle between Present/Absent. You can also add check-in/check-out times and notes for each day.',
        tags: ['attendance', 'mark', 'tracking']
      },
      {
        id: 'at-2',
        question: 'Can I track overtime hours?',
        answer: 'Yes! When an employee is marked present, you can add overtime hours in the attendance details. The system automatically calculates total work hours and displays overtime separately in reports.',
        tags: ['overtime', 'hours', 'calculation']
      },
      {
        id: 'at-3',
        question: 'How do attendance reports work?',
        answer: 'Attendance reports are generated automatically. You can view monthly summaries, individual employee reports, and export data to Excel or PDF. Reports include attendance percentage, total hours, and overtime calculations.',
        tags: ['reports', 'analytics', 'export']
      }
    ]
  },
  {
    id: 'billing-payments',
    title: 'Billing & Payments',
    description: 'Understand pricing plans and payment methods',
    icon: 'billing',
    questions: [
      {
        id: 'bp-1',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI payments, net banking, and PayPal. Enterprise customers can also request invoice-based billing.',
        tags: ['payment', 'methods', 'billing']
      },
      {
        id: 'bp-2',
        question: 'Can I upgrade or downgrade my plan?',
        answer: 'Yes, you can change your plan anytime from the Billing page. Upgrades take effect immediately, while downgrades apply at the end of your current billing cycle. No data loss occurs during plan changes.',
        tags: ['upgrade', 'downgrade', 'plan']
      },
      {
        id: 'bp-3',
        question: 'Is there a free trial available?',
        answer: 'We offer a 14-day free trial for all new users. No credit card required. During the trial, you get access to all Premium features. After the trial, you can choose a plan that suits your needs.',
        tags: ['trial', 'free', 'demo']
      }
    ]
  },
  {
    id: 'account-settings',
    title: 'Account & Settings',
    description: 'Manage your account preferences and settings',
    icon: 'settings',
    questions: [
      {
        id: 'as-1',
        question: 'How do I change my account password?',
        answer: 'Go to Settings > Account Security. Click "Change Password", enter your current password, then your new password twice. Make sure your new password is at least 8 characters with a mix of letters, numbers, and symbols.',
        tags: ['password', 'security', 'account']
      },
      {
        id: 'as-2',
        question: 'Can multiple users access the same account?',
        answer: 'Yes! With Business and Enterprise plans, you can add multiple team members with different permission levels (Admin, Manager, Viewer). Admins can manage all aspects, while Viewers have read-only access.',
        tags: ['team', 'permissions', 'collaboration']
      },
      {
        id: 'as-3',
        question: 'How do I export my data?',
        answer: 'Navigate to Reports > Export. You can export attendance data, employee lists, payroll information, and reports in CSV, Excel, or PDF formats. Bulk exports are available for Enterprise customers.',
        tags: ['export', 'data', 'backup']
      }
    ]
  },
  {
    id: 'security-privacy',
    title: 'Security & Privacy',
    description: 'Learn about our security measures and data protection',
    icon: 'security',
    questions: [
      {
        id: 'sp-1',
        question: 'Is my data secure?',
        answer: 'Absolutely. We use enterprise-grade 256-bit SSL encryption for all data transmission. Data is stored on secure AWS servers with regular backups. We are GDPR compliant and never share your data with third parties.',
        tags: ['security', 'encryption', 'gdpr']
      },
      {
        id: 'sp-2',
        question: 'Who has access to my employee data?',
        answer: 'Only authorized users from your organization can access employee data. We employ role-based access control (RBAC) to ensure appropriate permissions. Our staff only accesses data when required for support purposes.',
        tags: ['access', 'privacy', 'permissions']
      },
      {
        id: 'sp-3',
        question: 'What happens if I cancel my subscription?',
        answer: 'Your data is preserved for 90 days after cancellation. You can reactivate your account anytime during this period. After 90 days, data is anonymized and archived. You can request full data deletion at any time.',
        tags: ['cancellation', 'data', 'retention']
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and their solutions',
    icon: 'lightbulb',
    questions: [
      {
        id: 'ts-1',
        question: 'I can\'t log in to my account. What should I do?',
        answer: 'First, try resetting your password. If that doesn\'t work, clear your browser cache and cookies. Ensure cookies are enabled. If issues persist, contact support with your email address and any error messages received.',
        tags: ['login', 'troubleshoot', 'support']
      },
      {
        id: 'ts-2',
        question: 'Why is the attendance not updating in real-time?',
        answer: 'Check your internet connection first. The system updates automatically every few seconds. If changes aren\'t reflecting, refresh the page. For persistent issues, clear browser cache or try a different browser.',
        tags: ['sync', 'updates', 'technical']
      },
      {
        id: 'ts-3',
        question: 'How do I report a bug or issue?',
        answer: 'Use the "Report Issue" button in the help menu or email support@yourapp.com. Include screenshots, steps to reproduce, and your browser/device information. We typically respond within 2 business hours.',
        tags: ['bug', 'report', 'support']
      }
    ]
  }
];

// Popular questions for search suggestions
export const popularQuestions = [
  'How do I add an employee?',
  'Can I export attendance reports?',
  'What payment methods are accepted?',
  'Is there a mobile app available?',
  'How do I reset my password?',
  'Can multiple users access one account?',
  'How secure is my data?',
  'What happens after free trial ends?',
];

// Contact information
export const contactInfo = {
  email: 'support@attendancepro.com',
  phone: '+91 98765 43210',
  hours: 'Monday to Friday, 9 AM to 6 PM IST',
  responseTime: 'Typically within 2 hours',
};