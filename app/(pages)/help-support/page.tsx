// app/help-support/page.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Stack,
  Paper,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Avatar,
  Rating,
  Breadcrumbs,
  Link,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ContactSupport as SupportIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Whatshot as WhatshotIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  SmartToy as AIIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";

// Fixed date to avoid hydration errors
const SYSTEM_LAST_UPDATED = "2024-01-15";

// AI Helper Component
const AIHelper: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<
    Array<{ type: "user" | "ai"; text: string }>
  >([]);

  // Enhanced AI responses for AccumaManage
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("dashboard") ||
      lowerMessage.includes("data") ||
      lowerMessage.includes("chart")
    ) {
      return "I see you're asking about dashboard data. Check if your API endpoints are returning data in correct format. Also verify that you're properly authenticated. Would you like me to help you debug your dashboard integration?";
    }

    if (
      lowerMessage.includes("gst") ||
      lowerMessage.includes("tax") ||
      lowerMessage.includes("invoice")
    ) {
      return "For GST invoicing issues: 1) Verify your business GST details in Settings 2) Check if HSN codes are properly set 3) Ensure customer GSTIN is entered for B2B invoices 4) Verify tax calculation formulas. Need help with specific GST issue?";
    }

    if (
      lowerMessage.includes("inventory") ||
      lowerMessage.includes("stock") ||
      lowerMessage.includes("product")
    ) {
      return "Inventory management: 1) Check product categories and variants 2) Set low stock thresholds 3) Verify batch tracking settings 4) Ensure proper stock movement recording. Would you like guidance on specific inventory feature?";
    }

    if (
      lowerMessage.includes("customer") ||
      lowerMessage.includes("client") ||
      lowerMessage.includes("contact")
    ) {
      return "Customer management: 1) Verify customer GSTIN format 2) Check credit limit settings 3) Review payment terms 4) Ensure proper contact information. Need help with customer-specific issue?";
    }

    if (
      lowerMessage.includes("event") ||
      lowerMessage.includes("expense") ||
      lowerMessage.includes("budget")
    ) {
      return "Event & expense tracking: 1) Set up event categories 2) Configure budget limits 3) Categorize expenses properly 4) Use expense reports for analysis. Can you specify which event feature you need help with?";
    }

    if (
      lowerMessage.includes("api") ||
      lowerMessage.includes("endpoint") ||
      lowerMessage.includes("fetch")
    ) {
      return "API issues: 1) Check network connectivity 2) Verify API endpoint URLs 3) Ensure proper authentication tokens 4) Check CORS settings 5) Review request/response format. Need specific API help?";
    }

    if (
      lowerMessage.includes("error") ||
      lowerMessage.includes("bug") ||
      lowerMessage.includes("issue") ||
      lowerMessage.includes("problem")
    ) {
      return "For errors: 1) Check browser console (F12) for detailed messages 2) Verify all required fields are filled 3) Ensure proper data formatting 4) Check network tab for failed requests. Can you share the exact error message?";
    }

    if (
      lowerMessage.includes("subscription") ||
      lowerMessage.includes("payment") ||
      lowerMessage.includes("plan") ||
      lowerMessage.includes("billing")
    ) {
      return "Subscription & billing: 1) Check current plan limits 2) Verify payment method 3) Review billing history 4) Contact billing support for payment issues. Need specific billing help?";
    }

    if (
      lowerMessage.includes("how to") ||
      lowerMessage.includes("setup") ||
      lowerMessage.includes("configure")
    ) {
      return "For setup guidance: Check our Quick Start guides above or browse the FAQ section. I can walk you through specific setup steps. What exactly are you trying to set up?";
    }

    return "I understand you need assistance with AccumaManage. Could you provide more specific details about your issue or what you're trying to accomplish? This will help me provide more targeted help.";
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMsg = { type: "user" as const, text: message };
    setConversation((prev) => [...prev, userMsg]);

    // Get AI response
    const aiResponse = getAIResponse(message);
    setTimeout(() => {
      setConversation((prev) => [...prev, { type: "ai", text: aiResponse }]);
    }, 1000);

    setMessage("");
  };

  const quickActions = [
    "Dashboard not loading data",
    "GST invoice calculation issue",
    "Inventory stock sync problem",
    "Customer payment tracking",
    "Event expense management",
    "API integration help",
    "Subscription plan questions",
    "How to backup data",
  ];

  return (
    <>
      {/* Floating AI Help Button */}
      <Button
        variant="contained"
        startIcon={<AIIcon />}
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          borderRadius: "25px",
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        }}
      >
        AI Assistant
      </Button>

      {/* AI Helper Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <AIIcon color="primary" />
              <Typography variant="h6">AccumaManage AI Assistant</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Quick Action Chips */}
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Quick questions:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {quickActions.map((action) => (
                <Chip
                  key={action}
                  label={action}
                  size="small"
                  onClick={() => setMessage(action)}
                  variant="outlined"
                  clickable
                />
              ))}
            </Box>
          </Box>

          {/* Conversation */}
          <Box
            sx={{
              maxHeight: 300,
              overflow: "auto",
              mb: 2,
              p: 1,
              bgcolor: "grey.50",
              borderRadius: 1,
            }}
          >
            {conversation.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                py={2}
              >
                Ask me anything about AccumaManage features, issues, or setup!
              </Typography>
            ) : (
              conversation.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.type === "user" ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Card
                    sx={{
                      maxWidth: "80%",
                      bgcolor:
                        msg.type === "user"
                          ? "primary.main"
                          : "background.paper",
                      color: msg.type === "user" ? "white" : "text.primary",
                    }}
                  >
                    <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                      <Typography variant="body2">{msg.text}</Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))
            )}
          </Box>

          {/* Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask about features, issues, or setup..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            size="small"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConversation([])}>Clear Chat</Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            endIcon={<SendIcon />}
            disabled={!message.trim()}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`help-tabpanel-${index}`}
      aria-labelledby={`help-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const faqData = [
  {
    question: "How do I add my first product?",
    answer:
      "Go to Products → Add Product → Fill in product details (name, category, price, stock, GST details) → Save. Your product will now appear in your inventory and be available for invoicing.",
    category: "Products & Inventory",
  },
  {
    question: "How do I create and manage invoices?",
    answer:
      "Navigate to Billing → Create Invoice → Select customer → Add products with quantities → System auto-calculates GST (CGST+SGST for intra-state, IGST for inter-state) → Apply discounts if any → Choose payment method → Generate professional GST invoice with automatic numbering.",
    category: "Billing & Invoicing",
  },
  {
    question: "How do I track event expenses and budgets?",
    answer:
      "Go to Events → Create Event → Add sub-events → Record expenses under each category → Set budgets → View real-time spending reports and budget vs actual comparisons → Generate event profitability reports.",
    category: "Event Management",
  },
  {
    question: "How do I set up my business profile for GST compliance?",
    answer:
      "Click on Business Setup → Enter business details (name, address, GSTIN, state, contact) → Set invoice preferences → Configure tax settings. This information auto-populates on all your GST-compliant invoices.",
    category: "Business Setup",
  },
  {
    question: "How do I manage customer database and payment tracking?",
    answer:
      "Go to Customers → Add Customer with complete details including GSTIN → Track customer transactions → View payment history → Send payment reminders → Maintain customer credit limits.",
    category: "Customer Management",
  },
  {
    question: "Can I use AccumaManage offline?",
    answer:
      "Yes! The system works offline with automatic data sync. Create invoices, record expenses, and manage inventory without internet. Data automatically syncs when you're back online.",
    category: "General",
  },
  {
    question: "How does the GST calculation and compliance work?",
    answer:
      "System automatically detects transaction type (B2B/B2C) and location to apply correct GST rates. Generates GST-compliant invoices with HSN codes, maintains required records for GSTR filings, and provides GST summary reports.",
    category: "GST & Compliance",
  },
  {
    question: "How do I manage subscriptions and payments?",
    answer:
      "Go to Profile → Subscription to view your current plan, usage limits, and upgrade options. Choose from Trial, Monthly (₹999), Quarterly (₹2599), or Yearly (₹8999) plans with UPI payment integration.",
    category: "Subscription & Payments",
  },
  {
    question: "How do I track stock levels and get low stock alerts?",
    answer:
      "Inventory dashboard shows real-time stock levels. Set minimum stock thresholds to receive automatic alerts. Track stock movement across multiple locations with batch tracking support.",
    category: "Products & Inventory",
  },
  {
    question: "How do I generate business reports and analytics?",
    answer:
      "Access comprehensive reports from Analytics dashboard: Sales reports, Expense reports, GST reports, Customer reports, Inventory reports, and Profitability analysis with visual charts and export options.",
    category: "Reports & Analytics",
  },
  {
    question: "How do I backup and secure my business data?",
    answer:
      "Automatic real-time cloud backup. Manual backup/export from Settings → Data Management. Role-based access control, secure authentication, and data encryption ensure your business data is always safe.",
    category: "Data & Security",
  },
  {
    question: "How do I manage multiple users and permissions?",
    answer:
      "Go to Settings → User Management to add team members with role-based permissions (Admin, Manager, Staff). Control access to sensitive data and features based on user roles.",
    category: "User Management",
  },
];

const quickStartGuides = [
  {
    title: "🚀 First Time Setup",
    icon: <BusinessIcon color="primary" />,
    steps: [
      "Complete Business Profile with GST details and bank information",
      "Add your Products & Services with HSN codes and tax rates",
      "Set up Customer Database with complete contact and GST information",
      "Configure your Invoice templates and numbering system",
      "Create your first GST-compliant invoice and test the system",
    ],
  },
  {
    title: "📊 Daily Operations",
    icon: <InventoryIcon color="primary" />,
    steps: [
      "Record sales through the billing system with automatic GST calculation",
      "Track purchases and expenses in relevant categories",
      "Update inventory levels and receive low stock alerts",
      "Manage customer payments and track outstanding amounts",
      "Review daily sales and expense summaries",
    ],
  },
  {
    title: "📅 Monthly Closing",
    icon: <AnalyticsIcon color="primary" />,
    steps: [
      "Generate monthly GST reports for return filing",
      "Review profit & loss statements and balance sheets",
      "Reconcile bank transactions and cash flow",
      "Analyze customer payment patterns and follow up on dues",
      "Backup your data and update product pricing if needed",
    ],
  },
];

const featureHighlights = [
  {
    icon: <ReceiptIcon color="primary" />,
    title: "GST Compliant Invoicing",
    description:
      "Automated GST calculations, HSN code management, and compliant invoice generation for all business types.",
  },
  {
    icon: <InventoryIcon color="primary" />,
    title: "Smart Inventory Management",
    description:
      "Real-time stock tracking, low stock alerts, batch management, and multi-location inventory support.",
  },
  {
    icon: <EventIcon color="primary" />,
    title: "Event & Expense Tracking",
    description:
      "Comprehensive event budgeting, expense categorization, and real-time budget vs actual reporting.",
  },
  {
    icon: <PeopleIcon color="primary" />,
    title: "Customer Relationship Management",
    description:
      "Complete customer database, payment tracking, credit management, and customer analytics.",
  },
  {
    icon: <AnalyticsIcon color="primary" />,
    title: "Advanced Analytics & Reports",
    description:
      "Sales reports, GST summaries, profit analysis, inventory reports, and customizable dashboards.",
  },
  {
    icon: <SecurityIcon color="primary" />,
    title: "Data Security & Backup",
    description:
      "Enterprise-grade security, automatic backups, role-based access, and data encryption.",
  },
];

const subscriptionPlans = [
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
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "RK Traders",
    rating: 5,
    comment:
      "AccumaManage simplified my GST compliance and inventory management. Highly recommended for Indian businesses!",
    avatar: "RK",
  },
  {
    name: "Priya Sharma",
    company: "Event Masters",
    rating: 5,
    comment:
      "The event expense tracking feature saved us 20% in costs. Excellent support and easy to use.",
    avatar: "PS",
  },
  {
    name: "Amit Patel",
    company: "Tech Solutions Inc",
    rating: 4,
    comment:
      "Great product with continuous improvements. Customer support is responsive and helpful.",
    avatar: "AP",
  },
];

export default function HelpSupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tabValue, setTabValue] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "All",
    ...Array.from(new Set(faqData.map((faq) => faq.category))),
  ];

  const filteredFaqs = faqData.filter(
    (faq) =>
      (selectedCategory === "All" || faq.category === selectedCategory) &&
      (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          "Thank you for your message! We will get back to you within 24 hours."
        );
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout title="Help & Support">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            href="/"
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <SupportIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Help & Support
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Paper
          sx={{
            p: { xs: 2.5, sm: 4, md: 6 },
            mb: { xs: 3, sm: 5, md: 6 },
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2, md: 3 },
            }}
          >
            <SupportIcon
              sx={{
                fontSize: { xs: 40, sm: 60, md: 80 },
              }}
            />

            <Box sx={{ width: "100%" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: {
                    xs: "1.5rem", // ~24px for mobile
                    sm: "2rem", // ~32px for small tablets
                    md: "2.5rem", // ~40px for tablets
                    lg: "3rem", // ~48px for desktop
                  },
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  mb: { xs: 1, sm: 1.5 },
                }}
              >
                AccumaManage Help Center
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: {
                    xs: "0.875rem", // ~14px for mobile
                    sm: "1rem", // ~16px for tablets
                    md: "1.125rem", // ~18px for desktop
                  },
                  opacity: 0.9,
                  lineHeight: 1.4,
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                Complete Business Management Solution for Indian Businesses
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontSize: {
                    xs: "0.75rem", // ~12px for mobile
                    sm: "0.875rem", // ~14px for tablets
                    md: "1rem", // ~16px for desktop
                  },
                  opacity: 0.8,
                  lineHeight: 1.5,
                  maxWidth: { xs: "100%", sm: 450, md: 600 },
                  mx: "auto",
                  px: { xs: 1, sm: 0 },
                }}
              >
                Get instant help with our AI Assistant, browse documentation, or
                contact our support team
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Tabs Navigation */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<WhatshotIcon />} label="Quick Help" />
            <Tab icon={<ArticleIcon />} label="Documentation" />
            <Tab icon={<MessageIcon />} label="Contact Support" />
            <Tab icon={<VideoIcon />} label="Video Guides" />
          </Tabs>
        </Paper>

        {/* Tab 1: Quick Help */}
        <TabPanel value={tabValue} index={0}>
          {/* AI Assistant & Quick Actions - Using flexbox */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              mb: 4,
              "& > *": {
                flex: "1 1 calc(50% - 16px)",
                minWidth: 300,
              },
            }}
          >
            {/* AI Assistant Card */}
            <Card
              sx={{ height: "100%", position: "relative", overflow: "visible" }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <AIIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  AI Assistant
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Get instant answers to your questions about AccumaManage
                  features, setup, and troubleshooting.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AIIcon />}
                  onClick={() => {
                    const aiButton = document.querySelector(
                      '[class*="MuiButton-root"]'
                    ) as HTMLElement;
                    if (aiButton) aiButton.click();
                  }}
                  sx={{ borderRadius: "25px", px: 4 }}
                >
                  Open AI Assistant
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  🚀 Quick Actions
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArticleIcon />}
                    onClick={() => setTabValue(1)}
                    fullWidth
                    sx={{ justifyContent: "flex-start", py: 1.5 }}
                  >
                    Browse Documentation
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<VideoIcon />}
                    onClick={() => setTabValue(3)}
                    fullWidth
                    sx={{ justifyContent: "flex-start", py: 1.5 }}
                  >
                    Watch Video Tutorials
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<MessageIcon />}
                    onClick={() => setTabValue(2)}
                    fullWidth
                    sx={{ justifyContent: "flex-start", py: 1.5 }}
                  >
                    Contact Support Team
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Quick Start Guides */}
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            🎯 Quick Start Guides
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              mb: 4,
              "& > *": {
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: 300,
              },
            }}
          >
            {quickStartGuides.map((guide, index) => (
              <Card key={index} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box sx={{ mr: 2 }}>{guide.icon}</Box>
                    <Typography variant="h6" fontWeight="600">
                      {guide.title}
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    {guide.steps.map((step, stepIndex) => (
                      <Box
                        key={stepIndex}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <CheckCircleIcon
                          sx={{ color: "success.main", fontSize: 20, mt: 0.25 }}
                        />
                        <Typography variant="body2">{step}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>

        {/* Tab 2: Documentation */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                📚 Documentation & FAQ
              </Typography>

              {/* Search */}
              <TextField
                fullWidth
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <ArticleIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />

              {/* Category Filters */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    clickable
                    color={
                      selectedCategory === category ? "primary" : "default"
                    }
                    onClick={() => setSelectedCategory(category)}
                  />
                ))}
              </Box>

              {/* FAQ List */}
              <Box>
                {filteredFaqs.map((faq, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography fontWeight="600">{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {faq.answer}
                      </Typography>
                      <Chip
                        label={faq.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Tab 3: Contact Support */}
        <TabPanel value={tabValue} index={2}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              "& > *": {
                flex: "1 1 calc(66.666% - 16px)",
                minWidth: 300,
              },
            }}
          >
            {/* Contact Form */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  📞 Contact Our Support Team
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Fill out the form below and our support team will get back to
                  you within 24 hours.
                </Typography>

                <form onSubmit={handleContactSubmit}>
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        "& > *": {
                          flex: "1 1 calc(50% - 8px)",
                          minWidth: 200,
                        },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Your Name"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="Subject"
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      required
                    />

                    <TextField
                      fullWidth
                      label="How can we help you?"
                      multiline
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      required
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ alignSelf: "flex-start" }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info & Testimonials */}
            <Box>
              <Stack spacing={3}>
                {/* Contact Methods */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Contact Methods
                    </Typography>
                    <Stack spacing={2}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <EmailIcon color="primary" />
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            Email Support
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            support@accumanage.com
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <PhoneIcon color="primary" />
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            Phone Support
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            +91-9876543210
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <ScheduleIcon color="primary" />
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            Support Hours
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Mon-Sun, 9AM-9PM IST
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Testimonials */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      What Our Users Say
                    </Typography>
                    <Stack spacing={2}>
                      {testimonials.map((testimonial, index) => (
                        <Box key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                              {testimonial.avatar}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="600">
                                {testimonial.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {testimonial.company}
                              </Typography>
                            </Box>
                          </Box>
                          <Rating
                            value={testimonial.rating}
                            size="small"
                            readOnly
                          />
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {testimonial.comment}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab 4: Video Guides */}
        <TabPanel value={tabValue} index={3}>
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            🎥 Video Tutorials
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              "& > *": {
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: 250,
              },
            }}
          >
            {[
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
            ].map((video, index) => (
              <Card
                key={index}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <VideoIcon
                    sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {video.title}
                  </Typography>
                  <Chip label={video.duration} size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {video.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>

        {/* System Status */}
        <Alert severity="success" sx={{ mt: 4, mb: 2 }}>
          <Typography variant="body1" fontWeight="600">
            ✅ All Systems Operational
          </Typography>
          <Typography variant="body2">
            AccumaManage is running smoothly • Last updated:{" "}
            {formatDate(SYSTEM_LAST_UPDATED)} • Server Status: Normal • API
            Response: Optimal
          </Typography>
        </Alert>

        {/* AI Helper Component */}
        <AIHelper />
      </Container>
    </MainLayout>
  );
}
