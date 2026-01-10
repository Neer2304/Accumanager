// app/dashboard/all-actions/page.tsx - ALL ACTIONS PAGE
"use client";

import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Button,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material'
import {
  Home as HomeIcon,
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
  ArrowBack as BackIcon,
  People
} from '@mui/icons-material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TrendingUpIcon } from 'lucide-react';

const AllActionsPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()

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
        { label: 'Employee Management', icon: <PersonIcon />, href: '/employees', description: 'Team management' }
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

      {/* Action Categories */}
      {actionCategories.map((category, categoryIndex) => (
        <Box key={categoryIndex} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 4,
                height: 24,
                backgroundColor: category.color,
                borderRadius: 1,
                mr: 2
              }}
            />
            <Typography variant="h5" fontWeight={600}>
              {category.title}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                ml: 2, 
                backgroundColor: alpha(category.color, 0.1),
                color: category.color,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 600
              }}
            >
              {category.actions.length} actions
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {category.actions.map((action, actionIndex) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={actionIndex}>
                <Paper
                  elevation={0}
                  component={Link}
                  href={action.href}
                  sx={{
                    p: 2,
                    height: '100%',
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4],
                      borderColor: category.color,
                      backgroundColor: alpha(category.color, 0.05)
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: alpha(category.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Box sx={{ color: category.color, fontSize: 24 }}>
                      {action.icon}
                    </Box>
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight={600}
                    sx={{ mb: 1, fontSize: '1rem' }}
                  >
                    {action.label}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: '0.875rem' }}
                  >
                    {action.description}
                  </Typography>
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Typography 
                      variant="caption" 
                      color="primary.main"
                      fontWeight={600}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        fontSize: '0.75rem'
                      }}
                    >
                      Click to open →
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Stats Footer */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          backgroundColor: alpha(theme.palette.primary.main, 0.05)
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Can't find what you're looking for? Check our documentation or contact support.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                component={Link}
                href="/help"
                startIcon={<HelpIcon />}
              >
                Help Center
              </Button>
              <Button
                variant="outlined"
                component={Link}
                href="/help/support"
                startIcon={<SupportIcon />}
              >
                Contact Support
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  {actionCategories.reduce((total, cat) => total + cat.actions.length, 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Actions
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {actionCategories.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Categories
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

// Add missing icon components
const PersonIcon = ({ children, ...props }: any) => <span {...props}>{children}</span>
const AccountBalanceIcon = ({ children, ...props }: any) => <span {...props}>{children}</span>
const PlayCircleIcon = ({ children, ...props }: any) => <span {...props}>{children}</span>
const SupportIcon = ({ children, ...props }: any) => <span {...props}>{children}</span>
const FeedbackIcon = ({ children, ...props }: any) => <span {...props}>{children}</span>

export default AllActionsPage