// components/resources/data/moduleGuides.ts - CORRECTED VERSION

export interface QuickHelp {
  id: string;
  title: string;
  steps: string[];
  module: string;
  icon: string;
  color: string;
}

export const quickHelpData: QuickHelp[] = [
  // Attendance
  {
    id: 'att-quick-1',
    title: 'Add Employee',
    steps: ['Go to Attendance page', 'Click "Add Employee"', 'Fill details', 'Save'],
    module: 'Attendance',
    icon: '👤',
    color: '#4CAF50'
  },
  {
    id: 'att-quick-2',
    title: 'Mark Attendance',
    steps: ['Go to Attendance', 'Find employee', 'Click date', 'Select status'],
    module: 'Attendance',
    icon: '📅',
    color: '#4CAF50'
  },

  // Products
  {
    id: 'prod-quick-1',
    title: 'Add Product',
    steps: ['Go to Products page', 'Click "Add Product"', 'Fill details', 'Add images'],
    module: 'Products',
    icon: '📦',
    color: '#2196F3'
  },
  {
    id: 'prod-quick-2',
    title: 'Manage Categories',
    steps: ['Go to Products', 'Click "Categories"', 'Add/edit categories', 'Save'],
    module: 'Products',
    icon: '🏷️',
    color: '#2196F3'
  },

  // Materials
  {
    id: 'mat-quick-1',
    title: 'Add Material',
    steps: ['Go to Materials', 'Click "Add Material"', 'Enter details', 'Set stock'],
    module: 'Materials',
    icon: '📊',
    color: '#FF9800'
  },
  {
    id: 'mat-quick-2',
    title: 'Check Stock',
    steps: ['Go to Materials', 'View stock list', 'Check levels', 'Reorder if needed'],
    module: 'Materials',
    icon: '📈',
    color: '#FF9800'
  },

  // Projects
  {
    id: 'proj-quick-1',
    title: 'Create Project',
    steps: ['Go to Projects', 'Click "New Project"', 'Fill details', 'Set timeline'],
    module: 'Projects',
    icon: '📋',
    color: '#9C27B0'
  },
  {
    id: 'proj-quick-2',
    title: 'Assign Team',
    steps: ['Open project', 'Click "Team"', 'Add members', 'Set roles'],
    module: 'Projects',
    icon: '👥',
    color: '#9C27B0'
  },

  // Tasks
  {
    id: 'task-quick-1',
    title: 'Create Task',
    steps: ['Go to Tasks', 'Click "New Task"', 'Add details', 'Assign'],
    module: 'Tasks',
    icon: '✅',
    color: '#F44336'
  },
  {
    id: 'task-quick-2',
    title: 'Update Status',
    steps: ['Find task', 'Click status', 'Select new status', 'Save'],
    module: 'Tasks',
    icon: '🔄',
    color: '#F44336'
  },

  // Events
  {
    id: 'event-quick-1',
    title: 'Schedule Event',
    steps: ['Go to Events', 'Click "New Event"', 'Set date/time', 'Add details'],
    module: 'Events',
    icon: '📅',
    color: '#00BCD4'
  },
  {
    id: 'event-quick-2',
    title: 'Send Invites',
    steps: ['Open event', 'Click "Invite"', 'Select people', 'Send'],
    module: 'Events',
    icon: '📧',
    color: '#00BCD4'
  },

  // Billing
  {
    id: 'bill-quick-1',
    title: 'Create Invoice',
    steps: ['Go to Billing', 'Click "New Invoice"', 'Add items', 'Send to customer'],
    module: 'Billing',
    icon: '🧾',
    color: '#673AB7'
  },
  {
    id: 'bill-quick-2',
    title: 'Track Payments',
    steps: ['Open invoice', 'Check status', 'Mark as paid', 'Send receipt'],
    module: 'Billing',
    icon: '💰',
    color: '#673AB7'
  },

  // Inventory
  {
    id: 'inv-quick-1',
    title: 'Add Stock',
    steps: ['Go to Inventory', 'Click "Add Stock"', 'Enter quantity', 'Save'],
    module: 'Inventory',
    icon: '📦',
    color: '#009688'
  },
  {
    id: 'inv-quick-2',
    title: 'Check Levels',
    steps: ['View inventory', 'Filter by category', 'Check stock', 'Reorder if needed'],
    module: 'Inventory',
    icon: '📊',
    color: '#009688'
  },

  // Analytics
  {
    id: 'anal-quick-1',
    title: 'View Dashboard',
    steps: ['Go to Analytics', 'Select timeframe', 'View charts', 'Export data'],
    module: 'Analytics',
    icon: '📈',
    color: '#E91E63'
  },
  {
    id: 'anal-quick-2',
    title: 'Create Report',
    steps: ['Click "New Report"', 'Select metrics', 'Choose format', 'Generate'],
    module: 'Analytics',
    icon: '📋',
    color: '#E91E63'
  },

  // Customers
  {
    id: 'cust-quick-1',
    title: 'Add Customer',
    steps: ['Go to Customers', 'Click "Add Customer"', 'Fill details', 'Save'],
    module: 'Customers',
    icon: '👥',
    color: '#FF5722'
  },
  {
    id: 'cust-quick-2',
    title: 'Send Message',
    steps: ['Select customer', 'Click "Message"', 'Write content', 'Send'],
    module: 'Customers',
    icon: '✉️',
    color: '#FF5722'
  }
];

// Common issues by module
export const commonIssuesData = [
  {
    module: 'Attendance',
    issues: [
      {
        issue: 'Attendance not saving',
        solution: 'Refresh page and check internet connection'
      },
      {
        issue: 'Employee not showing',
        solution: 'Check if employee is marked as "Active"'
      }
    ]
  },
  {
    module: 'Products',
    issues: [
      {
        issue: 'Product image not uploading',
        solution: 'Check file size (max 5MB) and format (jpg, png)'
      },
      {
        issue: 'Category not saving',
        solution: 'Make sure category name is unique'
      }
    ]
  },
  {
    module: 'Materials',
    issues: [
      {
        issue: 'Stock levels not updating',
        solution: 'Refresh page and check transaction history'
      },
      {
        issue: 'Material not found',
        solution: 'Check if material is archived or deleted'
      }
    ]
  },
  {
    module: 'Projects',
    issues: [
      {
        issue: 'Can\'t add team members',
        solution: 'Check if users exist in Attendance module'
      },
      {
        issue: 'Timeline not saving',
        solution: 'Ensure start date is before end date'
      }
    ]
  },
  {
    module: 'Billing',
    issues: [
      {
        issue: 'Invoice not sending',
        solution: 'Check email settings and customer email address. Ensure internet connection is stable.'
      },
      {
        issue: 'Payment status not updating',
        solution: 'Refresh the page and check if payment was properly recorded in transactions.'
      }
    ]
  },
  {
    module: 'Inventory',
    issues: [
      {
        issue: 'Stock levels incorrect',
        solution: 'Check recent transactions and adjustments. Run stock reconciliation report.'
      },
      {
        issue: 'Low stock alerts not working',
        solution: 'Verify alert threshold settings and notification preferences.'
      }
    ]
  },
  {
    module: 'Analytics',
    issues: [
      {
        issue: 'Reports not generating',
        solution: 'Check date range selection and ensure you have data for selected period.'
      },
      {
        issue: 'Data not updating in real-time',
        solution: 'Refresh dashboard. Some reports update at scheduled intervals.'
      }
    ]
  },
  {
    module: 'Customers',
    issues: [
      {
        issue: 'Customer not receiving emails',
        solution: 'Verify email address and check spam folder. Ensure email service is configured.'
      },
      {
        issue: 'Duplicate customer records',
        solution: 'Use merge feature to combine duplicate entries. Check name variations.'
      }
    ]
  }
];