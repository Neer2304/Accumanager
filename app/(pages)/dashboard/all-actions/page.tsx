"use client";

import React from 'react'
import {
  Box,
  Typography,
  Container,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  useTheme
} from '@mui/material'
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  Receipt as BillIcon,
  People as EmployeeIcon,
  Inventory as ProductIcon,
  Description as InvoiceIcon,
  Paid as PaymentIcon,
  Settings as SettingsIcon,
  TrendingUp as AnalyticsIcon,
  Category as CategoryIcon,
  LocalShipping as DeliveryIcon,
  Assignment as ReportIcon,
  Store as StoreIcon,
  Person as CustomerIcon,
  Category as CategoryIcon2,
  Inventory2 as StockIcon,
  AccountBalance as BankIcon,
  Note as NoteIcon,
  Timeline as TimelineIcon,
  Download as ExportIcon,
  Upload as ImportIcon,
  Backup as BackupIcon,
  Help as HelpIcon,
  Security as SecurityIcon,
  Notifications as NotificationIcon,
  ColorLens as ThemeIcon,
  People
} from '@mui/icons-material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TrendingUpIcon } from 'lucide-react'
import { ActionCategory, ActionStats } from '@/components/all-action'

const AllActionsPage = () => {
  const theme = useTheme()
  const router = useRouter()

  // COMPLETE ACTION CATEGORIES WITH ALL ACTIONS
  const actionCategories = [
    {
      title: 'Billing & Invoicing',
      color: theme.palette.primary.main,
      actions: [
        { label: 'Create Invoice', icon: <InvoiceIcon />, href: '/billing/new', description: 'Create new invoice' },
        { label: 'View All Invoices', icon: <BillIcon />, href: '/billing', description: 'Browse all invoices' },
        { label: 'Recurring Invoices', icon: <TimelineIcon />, href: '/billing/recurring', description: 'Manage recurring bills' },
        { label: 'Invoice Templates', icon: <NoteIcon />, href: '/billing/templates', description: 'Custom templates' }
      ]
    },
    {
      title: 'Products & Inventory',
      color: theme.palette.success.main,
      actions: [
        { label: 'Add Product', icon: <ProductIcon />, href: '/products/new', description: 'Add new product' },
        { label: 'Manage Products', icon: <StoreIcon />, href: '/products', description: 'View all products' },
        { label: 'Product Categories', icon: <CategoryIcon />, href: '/products/categories', description: 'Organize categories' },
        { label: 'Stock Management', icon: <StockIcon />, href: '/inventory', description: 'Track inventory' },
        { label: 'Low Stock Alert', icon: <NotificationIcon />, href: '/inventory/alerts', description: 'Stock warnings' }
      ]
    },
    {
      title: 'Customers & Employees',
      color: theme.palette.secondary.main,
      actions: [
        { label: 'Add Customer', icon: <CustomerIcon />, href: '/customers/new', description: 'New customer' },
        { label: 'Manage Customers', icon: <People />, href: '/customers', description: 'Customer list' },
        { label: 'Add Employee', icon: <EmployeeIcon />, href: '/employees/new', description: 'New team member' },
        { label: 'Employee Management', icon: <People />, href: '/employees', description: 'Team management' }
      ]
    },
    {
      title: 'Payments & Finance',
      color: theme.palette.warning.main,
      actions: [
        { label: 'Receive Payment', icon: <PaymentIcon />, href: '/payments/receive', description: 'Record payment' },
        { label: 'Payment History', icon: <TimelineIcon />, href: '/payments', description: 'All transactions' },
        { label: 'Expense Tracking', icon: <AccountBalanceIcon />, href: '/expenses', description: 'Track expenses' },
        { label: 'Bank Accounts', icon: <BankIcon />, href: '/accounts', description: 'Manage accounts' }
      ]
    },
    {
      title: 'Reports & Analytics',
      color: theme.palette.info.main,
      actions: [
        { label: 'Sales Reports', icon: <AnalyticsIcon />, href: '/reports/sales', description: 'Sales analytics' },
        { label: 'Revenue Reports', icon: <TrendingUpIcon />, href: '/reports/revenue', description: 'Revenue analysis' },
        { label: 'Customer Reports', icon: <People />, href: '/reports/customers', description: 'Customer insights' },
        { label: 'Product Reports', icon: <ProductIcon />, href: '/reports/products', description: 'Product performance' },
        { label: 'Export Data', icon: <ExportIcon />, href: '/reports/export', description: 'Data export' }
      ]
    },
    {
      title: 'Settings & Tools',
      color: theme.palette.grey[700],
      actions: [
        { label: 'General Settings', icon: <SettingsIcon />, href: '/settings', description: 'System settings' },
        { label: 'Business Profile', icon: <StoreIcon />, href: '/settings/profile', description: 'Business info' },
        { label: 'Tax Settings', icon: <AccountBalanceIcon />, href: '/settings/taxes', description: 'Tax configuration' },
        { label: 'Theme & Appearance', icon: <ThemeIcon />, href: '/settings/theme', description: 'Customize look' },
        { label: 'Notifications', icon: <NotificationIcon />, href: '/settings/notifications', description: 'Alerts settings' },
        { label: 'Security', icon: <SecurityIcon />, href: '/settings/security', description: 'Security settings' },
        { label: 'Data Backup', icon: <BackupIcon />, href: '/settings/backup', description: 'Backup & restore' },
        { label: 'Import Data', icon: <ImportIcon />, href: '/settings/import', description: 'Bulk import' }
      ]
    },
    {
      title: 'Help & Support',
      color: theme.palette.error.main,
      actions: [
        { label: 'Help Center', icon: <HelpIcon />, href: '/help', description: 'Documentation' },
        { label: 'Video Tutorials', icon: <PlayCircleIcon />, href: '/help/tutorials', description: 'Learn how to use' },
        { label: 'Contact Support', icon: <SupportIcon />, href: '/help/support', description: 'Get help' },
        { label: 'Feedback', icon: <FeedbackIcon />, href: '/help/feedback', description: 'Share feedback' }
      ]
    }
  ]

  const handleBack = () => {
    router.back()
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
          size="small"
        >
          Back to Dashboard
        </Button>

        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink
            component={Link}
            href="/dashboard"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Dashboard
          </MuiLink>
          <Typography color="text.primary">All Actions</Typography>
        </Breadcrumbs>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          All Actions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quick access to all features and tools in your dashboard
        </Typography>
      </Box>

      {/* Render All Categories */}
      {actionCategories.map((category, categoryIndex) => (
        <ActionCategory key={categoryIndex} category={category} />
      ))}

      {/* Stats Footer */}
      <ActionStats categories={actionCategories} />
    </Container>
  )
}

// Missing Icon Components
const AccountBalanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.29l8 4V16l-8 4-8-4V8.29l8-4z"/>
    <path d="M12 12l-8-4v8l8 4 8-4V8l-8 4z"/>
  </svg>
)

const PlayCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>
)

const SupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
  </svg>
)

const FeedbackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
  </svg>
)

export default AllActionsPage