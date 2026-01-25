// components/resources/data/resourcesData.ts

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type:
    | "PDF Guide"
    | "Video"
    | "Excel Template"
    | "Word Template"
    | "Checklist"
    | "Form"
    | "Phone"
    | "Email"
    | "WhatsApp"
    | "Calendar";
  size: string;
  url: string;
  module: string;
  tags: string[];
  detail?: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  module: string;
  color: string;
  items: ResourceItem[];
}

// All resources organized by module
export const resourcesData: ResourceCategory[] = [
  // ATTENDANCE MODULE
  {
    id: "attendance-guides",
    title: "Attendance Management",
    description: "Employee attendance tracking, leave management, and reports",
    module: "Attendance",
    color: "#4CAF50",
    items: [
      {
        id: "att-1",
        title: "How to Add Employees",
        description: "Step-by-step guide to add single or multiple employees",
        type: "PDF Guide",
        size: "1.2 MB",
        url: "/docs/attendance/add-employees.pdf",
        module: "Attendance",
        tags: ["employee", "add", "setup"],
      },
      {
        id: "att-2",
        title: "Daily Attendance Marking",
        description: "How to mark present/absent for employees daily",
        type: "Video",
        size: "5 min",
        url: "/videos/attendance/mark-attendance.mp4",
        module: "Attendance",
        tags: ["daily", "mark", "tracking"],
      },
      {
        id: "att-3",
        title: "Leave Management",
        description: "Manage employee leaves, approvals, and balance",
        type: "PDF Guide",
        size: "1.5 MB",
        url: "/docs/attendance/leave-management.pdf",
        module: "Attendance",
        tags: ["leave", "holiday", "approval"],
      },
      {
        id: "att-4",
        title: "Attendance Reports",
        description: "Generate and download monthly attendance reports",
        type: "PDF Guide",
        size: "1.8 MB",
        url: "/docs/attendance/reports-guide.pdf",
        module: "Attendance",
        tags: ["reports", "export", "analytics"],
      },
    ],
  },

  // PRODUCTS MODULE
  {
    id: "products-guides",
    title: "Product Management",
    description: "Manage your product catalog, inventory, and sales",
    module: "Products",
    color: "#2196F3",
    items: [
      {
        id: "prod-1",
        title: "Add New Products",
        description: "How to add products with details, images, and categories",
        type: "PDF Guide",
        size: "1.3 MB",
        url: "/docs/products/add-products.pdf",
        module: "Products",
        tags: ["add", "catalog", "details"],
      },
      {
        id: "prod-2",
        title: "Product Categories Setup",
        description: "Create and manage product categories and subcategories",
        type: "PDF Guide",
        size: "1.1 MB",
        url: "/docs/products/categories.pdf",
        module: "Products",
        tags: ["categories", "organization", "setup"],
      },
      {
        id: "prod-3",
        title: "Bulk Product Upload",
        description: "Upload multiple products using Excel template",
        type: "Excel Template",
        size: "45 KB",
        url: "/templates/products/bulk-upload.xlsx",
        module: "Products",
        tags: ["bulk", "upload", "excel"],
      },
      {
        id: "prod-4",
        title: "Product Images Management",
        description: "Upload and manage product images and galleries",
        type: "Video",
        size: "4 min",
        url: "/videos/products/images-management.mp4",
        module: "Products",
        tags: ["images", "gallery", "upload"],
      },
    ],
  },

  // MATERIALS MODULE
  {
    id: "materials-guides",
    title: "Material Management",
    description: "Track raw materials, inventory, and stock levels",
    module: "Materials",
    color: "#FF9800",
    items: [
      {
        id: "mat-1",
        title: "Add Raw Materials",
        description: "How to add and categorize raw materials",
        type: "PDF Guide",
        size: "1.4 MB",
        url: "/docs/materials/add-materials.pdf",
        module: "Materials",
        tags: ["raw", "add", "inventory"],
      },
      {
        id: "mat-2",
        title: "Stock Management",
        description: "Track stock levels, reorder points, and alerts",
        type: "PDF Guide",
        size: "1.6 MB",
        url: "/docs/materials/stock-management.pdf",
        module: "Materials",
        tags: ["stock", "levels", "reorder"],
      },
      {
        id: "mat-3",
        title: "Material Issue & Receipt",
        description: "Issue materials to projects and receive new stock",
        type: "PDF Guide",
        size: "1.5 MB",
        url: "/docs/materials/issue-receipt.pdf",
        module: "Materials",
        tags: ["issue", "receipt", "transfer"],
      },
      {
        id: "mat-4",
        title: "Material Report Template",
        description: "Monthly material consumption report format",
        type: "Excel Template",
        size: "55 KB",
        url: "/templates/materials/monthly-report.xlsx",
        module: "Materials",
        tags: ["reports", "template", "excel"],
      },
    ],
  },

  // PROJECTS MODULE
  {
    id: "projects-guides",
    title: "Project Management",
    description: "Manage projects, tasks, timelines, and resources",
    module: "Projects",
    color: "#9C27B0",
    items: [
      {
        id: "proj-1",
        title: "Create New Project",
        description: "Step-by-step guide to create and setup projects",
        type: "PDF Guide",
        size: "1.7 MB",
        url: "/docs/projects/create-project.pdf",
        module: "Projects",
        tags: ["create", "setup", "planning"],
      },
      {
        id: "proj-2",
        title: "Project Timeline & Milestones",
        description: "Set timelines, milestones, and deadlines",
        type: "PDF Guide",
        size: "1.4 MB",
        url: "/docs/projects/timeline.pdf",
        module: "Projects",
        tags: ["timeline", "milestones", "deadlines"],
      },
      {
        id: "proj-3",
        title: "Assign Team Members",
        description: "Assign team members and set responsibilities",
        type: "Video",
        size: "6 min",
        url: "/videos/projects/assign-team.mp4",
        module: "Projects",
        tags: ["team", "assign", "roles"],
      },
      {
        id: "proj-4",
        title: "Project Budget Template",
        description: "Excel template for project budget planning",
        type: "Excel Template",
        size: "65 KB",
        url: "/templates/projects/budget-template.xlsx",
        module: "Projects",
        tags: ["budget", "planning", "template"],
      },
    ],
  },

  // TASKS MODULE
  {
    id: "tasks-guides",
    title: "Task Management",
    description: "Create, assign, and track tasks across projects",
    module: "Tasks",
    color: "#F44336",
    items: [
      {
        id: "task-1",
        title: "Create & Assign Tasks",
        description: "How to create tasks and assign to team members",
        type: "PDF Guide",
        size: "1.2 MB",
        url: "/docs/tasks/create-tasks.pdf",
        module: "Tasks",
        tags: ["create", "assign", "tracking"],
      },
      {
        id: "task-2",
        title: "Task Priority & Status",
        description: "Set task priorities and update status",
        type: "PDF Guide",
        size: "1.1 MB",
        url: "/docs/tasks/priority-status.pdf",
        module: "Tasks",
        tags: ["priority", "status", "update"],
      },
      {
        id: "task-3",
        title: "Task Comments & Updates",
        description: "Add comments and updates to tasks",
        type: "Video",
        size: "3 min",
        url: "/videos/tasks/comments.mp4",
        module: "Tasks",
        tags: ["comments", "updates", "communication"],
      },
      {
        id: "task-4",
        title: "Daily Task Report",
        description: "Daily task completion report format",
        type: "Excel Template",
        size: "50 KB",
        url: "/templates/tasks/daily-report.xlsx",
        module: "Tasks",
        tags: ["report", "daily", "template"],
      },
    ],
  },

  // EVENTS MODULE
  {
    id: "events-guides",
    title: "Event Management",
    description: "Plan, schedule, and manage events and meetings",
    module: "Events",
    color: "#00BCD4",
    items: [
      {
        id: "event-1",
        title: "Schedule New Event",
        description: "How to schedule events and set reminders",
        type: "PDF Guide",
        size: "1.3 MB",
        url: "/docs/events/schedule-event.pdf",
        module: "Events",
        tags: ["schedule", "plan", "reminders"],
      },
      {
        id: "event-2",
        title: "Invite Participants",
        description: "Invite team members and external participants",
        type: "PDF Guide",
        size: "1.2 MB",
        url: "/docs/events/invite-participants.pdf",
        module: "Events",
        tags: ["invite", "participants", "guests"],
      },
      {
        id: "event-3",
        title: "Event Resources Planning",
        description: "Plan and allocate resources for events",
        type: "PDF Guide",
        size: "1.5 MB",
        url: "/docs/events/resources-planning.pdf",
        module: "Events",
        tags: ["resources", "planning", "allocation"],
      },
      {
        id: "event-4",
        title: "Event Checklist Template",
        description: "Comprehensive event planning checklist",
        type: "Checklist",
        size: "Word Doc",
        url: "/templates/events/checklist.docx",
        module: "Events",
        tags: ["checklist", "planning", "template"],
      },
    ],
  },

  // DASHBOARD & REPORTS
  {
    id: "dashboard-guides",
    title: "Dashboard & Analytics",
    description: "Data visualization, reports, and analytics",
    module: "Dashboard",
    color: "#607D8B",
    items: [
      {
        id: "dash-1",
        title: "Customize Dashboard",
        description: "Customize dashboard widgets and layout",
        type: "PDF Guide",
        size: "1.4 MB",
        url: "/docs/dashboard/customize.pdf",
        module: "Dashboard",
        tags: ["customize", "widgets", "layout"],
      },
      {
        id: "dash-2",
        title: "Generate Reports",
        description: "Generate and export various reports",
        type: "PDF Guide",
        size: "1.6 MB",
        url: "/docs/dashboard/reports.pdf",
        module: "Dashboard",
        tags: ["reports", "generate", "export"],
      },
      {
        id: "dash-3",
        title: "Data Visualization",
        description: "Create charts and visual data representations",
        type: "Video",
        size: "7 min",
        url: "/videos/dashboard/visualization.mp4",
        module: "Dashboard",
        tags: ["charts", "visualization", "graphs"],
      },
      {
        id: "dash-4",
        title: "Report Templates",
        description: "Collection of report templates for all modules",
        type: "Excel Template",
        size: "75 KB",
        url: "/templates/dashboard/report-templates.zip",
        module: "Dashboard",
        tags: ["templates", "reports", "collection"],
      },
    ],
  },

  // SUPPORT & CONTACT
  {
    id: "support-contact",
    title: "Support & Contact",
    description: "Get help and contact support team",
    module: "Support",
    color: "#795548",
    items: [
      {
        id: "sup-1",
        title: "Phone Support",
        description: "Call us for immediate assistance",
        type: "Phone",
        size: "Available",
        url: "tel:+919876543210",
        module: "Support",
        tags: ["phone", "call", "immediate"],
        detail: "+91 98765 43210",
      },
      {
        id: "sup-2",
        title: "Email Support",
        description: "Send us your questions and issues",
        type: "Email",
        size: "24/7",
        url: "mailto:support@yourapp.com",
        module: "Support",
        tags: ["email", "support", "query"],
        detail: "support@yourapp.com",
      },
      {
        id: "sup-3",
        title: "WhatsApp Support",
        description: "Quick chat support via WhatsApp",
        type: "WhatsApp",
        size: "Fast Response",
        url: "https://wa.me/919876543210",
        module: "Support",
        tags: ["whatsapp", "chat", "quick"],
        detail: "+91 98765 43210",
      },
      {
        id: "sup-4",
        title: "Schedule Training",
        description: "Book a training session with experts",
        type: "Calendar",
        size: "30 min",
        url: "https://calendly.com/your-training",
        module: "Support",
        tags: ["training", "schedule", "demo"],
        detail: "Book Now",
      },
    ],
  },
  // Add these to the existing resourcesData array:

  // BILLING MODULE
  {
    id: "billing-guides",
    title: "Billing & Invoicing",
    description:
      "Manage invoices, payments, billing cycles, and financial records",
    module: "Billing",
    color: "#673AB7",
    items: [
      {
        id: "bill-1",
        title: "Create New Invoice",
        description:
          "Step-by-step guide to create and send invoices to customers",
        type: "PDF Guide",
        size: "1.4 MB",
        url: "/docs/billing/create-invoice.pdf",
        module: "Billing",
        tags: ["invoice", "create", "send"],
      },
      {
        id: "bill-2",
        title: "Payment Tracking",
        description:
          "Track payments, mark invoices as paid, and send reminders",
        type: "PDF Guide",
        size: "1.6 MB",
        url: "/docs/billing/payment-tracking.pdf",
        module: "Billing",
        tags: ["payment", "track", "reminders"],
      },
      {
        id: "bill-3",
        title: "Recurring Billing Setup",
        description:
          "Set up automatic recurring billing for subscription services",
        type: "Video",
        size: "7 min",
        url: "/videos/billing/recurring-setup.mp4",
        module: "Billing",
        tags: ["recurring", "subscription", "automatic"],
      },
      {
        id: "bill-4",
        title: "Invoice Template",
        description: "Professional invoice template with company branding",
        type: "Word Template",
        size: "Word Doc",
        url: "/templates/billing/invoice-template.docx",
        module: "Billing",
        tags: ["template", "format", "professional"],
      },
    ],
  },

  // INVENTORY MODULE
  {
    id: "inventory-guides",
    title: "Inventory Management",
    description:
      "Track stock levels, manage warehouses, and handle inventory operations",
    module: "Inventory",
    color: "#009688",
    items: [
      {
        id: "inv-1",
        title: "Add Inventory Items",
        description:
          "How to add products to inventory with SKU and stock details",
        type: "PDF Guide",
        size: "1.5 MB",
        url: "/docs/inventory/add-items.pdf",
        module: "Inventory",
        tags: ["add", "sku", "stock"],
      },
      {
        id: "inv-2",
        title: "Stock Adjustment",
        description: "Process stock adjustments, transfers, and corrections",
        type: "PDF Guide",
        size: "1.7 MB",
        url: "/docs/inventory/stock-adjustment.pdf",
        module: "Inventory",
        tags: ["adjustment", "transfer", "correction"],
      },
      {
        id: "inv-3",
        title: "Low Stock Alerts",
        description: "Set up automatic alerts for low stock levels",
        type: "Video",
        size: "5 min",
        url: "/videos/inventory/low-stock-alerts.mp4",
        module: "Inventory",
        tags: ["alerts", "notifications", "low-stock"],
      },
      {
        id: "inv-4",
        title: "Inventory Report Template",
        description: "Comprehensive inventory report with stock levels",
        type: "Excel Template",
        size: "70 KB",
        url: "/templates/inventory/inventory-report.xlsx",
        module: "Inventory",
        tags: ["report", "template", "excel"],
      },
    ],
  },

  // ANALYTICS MODULE
  {
    id: "analytics-guides",
    title: "Analytics & Reports",
    description:
      "Data analysis, business intelligence, and performance reports",
    module: "Analytics",
    color: "#E91E63",
    items: [
      {
        id: "anal-1",
        title: "Sales Analytics Dashboard",
        description: "Understand and customize your sales analytics dashboard",
        type: "PDF Guide",
        size: "1.8 MB",
        url: "/docs/analytics/sales-dashboard.pdf",
        module: "Analytics",
        tags: ["sales", "dashboard", "analysis"],
      },
      {
        id: "anal-2",
        title: "Customer Behavior Reports",
        description: "Generate and interpret customer behavior analytics",
        type: "PDF Guide",
        size: "1.6 MB",
        url: "/docs/analytics/customer-behavior.pdf",
        module: "Analytics",
        tags: ["customer", "behavior", "reports"],
      },
      {
        id: "anal-3",
        title: "Custom Report Builder",
        description: "Create custom reports with drag-and-drop interface",
        type: "Video",
        size: "9 min",
        url: "/videos/analytics/custom-reports.mp4",
        module: "Analytics",
        tags: ["custom", "reports", "builder"],
      },
      {
        id: "anal-4",
        title: "Export Analytics Data",
        description: "Export analytics data to Excel, PDF, or CSV formats",
        type: "PDF Guide",
        size: "1.3 MB",
        url: "/docs/analytics/export-data.pdf",
        module: "Analytics",
        tags: ["export", "data", "formats"],
      },
    ],
  },

  // CUSTOMERS MODULE
  {
    id: "customers-guides",
    title: "Customer Management",
    description: "Manage customer relationships, communications, and support",
    module: "Customers",
    color: "#FF5722",
    items: [
      {
        id: "cust-1",
        title: "Add New Customers",
        description: "How to add customers with contact and business details",
        type: "PDF Guide",
        size: "1.4 MB",
        url: "/docs/customers/add-customers.pdf",
        module: "Customers",
        tags: ["add", "contact", "details"],
      },
      {
        id: "cust-2",
        title: "Customer Segmentation",
        description:
          "Segment customers based on behavior, purchases, and demographics",
        type: "PDF Guide",
        size: "1.7 MB",
        url: "/docs/customers/segmentation.pdf",
        module: "Customers",
        tags: ["segmentation", "groups", "categories"],
      },
      {
        id: "cust-3",
        title: "Customer Communication",
        description: "Send emails, notifications, and updates to customers",
        type: "Video",
        size: "6 min",
        url: "/videos/customers/communication.mp4",
        module: "Customers",
        tags: ["communication", "emails", "notifications"],
      },
      {
        id: "cust-4",
        title: "Customer Database Template",
        description: "Excel template to manage customer database",
        type: "Excel Template",
        size: "65 KB",
        url: "/templates/customers/customer-database.xlsx",
        module: "Customers",
        tags: ["database", "template", "excel"],
      },
    ],
  },
];

// Module icons mapping
export const moduleIcons: Record<string, React.ReactNode> = {
  Attendance: "👥",
  Products: "📦",
  Materials: "📊",
  Projects: "📋",
  Tasks: "✅",
  Events: "📅",
  Dashboard: "📈",
  Support: "🆘",
  Billing: "🧾",
  Inventory: "📦",
  Analytics: "📈",
  Customers: "👥",
};

// Module colors mapping
export const moduleColors: Record<string, string> = {
  Attendance: "#4CAF50",
  Products: "#2196F3",
  Materials: "#FF9800",
  Projects: "#9C27B0",
  Tasks: "#F44336",
  Events: "#00BCD4",
  Dashboard: "#607D8B",
  Support: "#795548",
  Billing: "#673AB7",
  Inventory: "#009688",
  Analytics: "#E91E63",
  Customers: "#FF5722",
};
