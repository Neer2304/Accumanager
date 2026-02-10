"use client";

import React from 'react'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material'
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Receipt as BillIcon,
  People as EmployeeIcon,
  Inventory as ProductIcon,
  Description as InvoiceIcon,
  Paid as PaymentIcon,
  TrendingUp as AnalyticsIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  Person as CustomerIcon,
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
  People,
  PlayCircle,
  ContactSupport,
  Feedback,
} from '@mui/icons-material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Import Google-themed components
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

// Custom icon for trending up
const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
  </svg>
)

const AllActionsPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const darkMode = theme.palette.mode === 'dark'
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterCategory, setFilterCategory] = React.useState('all')
  const [showAllActions, setShowAllActions] = React.useState(false)

  // COMPACT ACTION CATEGORIES
  const actionCategories = [
    {
      id: 'billing',
      title: 'Billing',
      color: '#1a73e8',
      icon: <InvoiceIcon fontSize="small" />,
      actions: [
        { id: 'invoice-create', label: 'Create Invoice', icon: <InvoiceIcon />, href: '/billing/new' },
        { id: 'invoice-view', label: 'All Invoices', icon: <BillIcon />, href: '/billing' },
        { id: 'invoice-recurring', label: 'Recurring', icon: <TimelineIcon />, href: '/billing/recurring' },
        { id: 'invoice-templates', label: 'Templates', icon: <NoteIcon />, href: '/billing/templates' }
      ]
    },
    {
      id: 'products',
      title: 'Products',
      color: '#0d652d',
      icon: <ProductIcon fontSize="small" />,
      actions: [
        { id: 'product-add', label: 'Add Product', icon: <ProductIcon />, href: '/products/new' },
        { id: 'product-manage', label: 'Manage', icon: <StoreIcon />, href: '/products' },
        { id: 'product-categories', label: 'Categories', icon: <CategoryIcon />, href: '/products/categories' },
        { id: 'stock-manage', label: 'Inventory', icon: <StockIcon />, href: '/inventory' }
      ]
    },
    {
      id: 'people',
      title: 'People',
      color: '#9334e6',
      icon: <People fontSize="small" />,
      actions: [
        { id: 'customer-add', label: 'Add Customer', icon: <CustomerIcon />, href: '/customers/new' },
        { id: 'customer-manage', label: 'Customers', icon: <People />, href: '/customers' },
        { id: 'employee-add', label: 'Add Employee', icon: <EmployeeIcon />, href: '/employees/new' },
        { id: 'employee-manage', label: 'Employees', icon: <People />, href: '/employees' }
      ]
    },
    {
      id: 'finance',
      title: 'Finance',
      color: '#e37400',
      icon: <PaymentIcon fontSize="small" />,
      actions: [
        { id: 'payment-receive', label: 'Receive Payment', icon: <PaymentIcon />, href: '/payments/receive' },
        { id: 'payment-history', label: 'History', icon: <TimelineIcon />, href: '/payments' },
        { id: 'expense-track', label: 'Expenses', icon: <BankIcon />, href: '/expenses' },
        { id: 'bank-accounts', label: 'Accounts', icon: <BankIcon />, href: '/accounts' }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      color: '#1a73e8',
      icon: <AnalyticsIcon fontSize="small" />,
      actions: [
        { id: 'sales-reports', label: 'Sales', icon: <AnalyticsIcon />, href: '/reports/sales' },
        { id: 'revenue-reports', label: 'Revenue', icon: <TrendingUpIcon />, href: '/reports/revenue' },
        { id: 'customer-reports', label: 'Customers', icon: <People />, href: '/reports/customers' },
        { id: 'export-data', label: 'Export', icon: <ExportIcon />, href: '/reports/export' }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      color: '#5f6368',
      icon: <SettingsIcon fontSize="small" />,
      actions: [
        { id: 'general-settings', label: 'General', icon: <SettingsIcon />, href: '/settings' },
        { id: 'theme-appearance', label: 'Theme', icon: <ThemeIcon />, href: '/settings/theme' },
        { id: 'security', label: 'Security', icon: <SecurityIcon />, href: '/settings/security' },
        { id: 'data-backup', label: 'Backup', icon: <BackupIcon />, href: '/settings/backup' }
      ]
    },
    {
      id: 'help',
      title: 'Help',
      color: '#d93025',
      icon: <HelpIcon fontSize="small" />,
      actions: [
        { id: 'help-center', label: 'Help Center', icon: <HelpIcon />, href: '/help' },
        { id: 'video-tutorials', label: 'Tutorials', icon: <PlayCircle />, href: '/help/tutorials' },
        { id: 'contact-support', label: 'Support', icon: <ContactSupport />, href: '/help/support' },
        { id: 'feedback', label: 'Feedback', icon: <Feedback />, href: '/help/feedback' }
      ]
    }
  ]

  // Calculate total actions
  const totalActions = actionCategories.reduce((total, cat) => total + cat.actions.length, 0)

  // Filter actions based on search and category
  const filteredCategories = actionCategories.filter(category => {
    if (filterCategory !== 'all' && category.id !== filterCategory) return false
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const filteredActions = category.actions.filter(action =>
        action.label.toLowerCase().includes(searchLower)
      )
      return filteredActions.length > 0
    }
    
    return true
  })

  // Limit displayed categories if not showing all
  const displayedCategories = showAllActions 
    ? filteredCategories 
    : filteredCategories.slice(0, isMobile ? 2 : 4)

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? "#202124" : "#ffffff",
        color: darkMode ? "#e8eaed" : "#202124",
        minHeight: "100vh",
      }}
    >
      {/* Header - Matching Google Theme */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
          background: darkMode
            ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        }}
      >
        <Box sx={{ 
          maxWidth: 1200, 
          margin: '0 auto' 
        }}>
          <Breadcrumbs
            sx={{
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 400,
                "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
              }}
            >
              <HomeIcon
                sx={{
                  mr: 0.5,
                  fontSize: { xs: "16px", sm: "18px" },
                }}
              />
              Dashboard
            </MuiLink>
            <Typography
              color={darkMode ? "#e8eaed" : "#202124"}
              fontWeight={500}
            >
              All Actions
            </Typography>
          </Breadcrumbs>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              fontWeight={500}
              gutterBottom
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              All Actions
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 400,
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Quick access to all features and tools in your dashboard
            </Typography>
          </Box>

          {/* Stats */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 4,
            flexWrap: 'wrap',
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700} color="#1a73e8">
                {totalActions}
              </Typography>
              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                Total Actions
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700} color="#0d652d">
                {actionCategories.length}
              </Typography>
              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                Categories
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        {/* Search and Filter */}
        <Card
          title="Find Actions"
          subtitle="Search or filter actions by category"
          hover
          sx={{ mb: 4 }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' },
          }}>
            <Box sx={{ flex: 1 }}>
              <Input
                placeholder="Search actions by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<SearchIcon />}
                size="medium"
                sx={{ flex: 1 }}
              />
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: 200 } }}>
              <Select
                size="small"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...actionCategories.map(cat => ({
                    value: cat.id,
                    label: cat.title,
                    icon: cat.icon
                  }))
                ]}
              />
            </Box>
            
            {(searchTerm || filterCategory !== 'all') && (
              <Button
                variant="text"
                onClick={() => {
                  setSearchTerm('')
                  setFilterCategory('all')
                }}
                size="small"
              >
                Clear
              </Button>
            )}
          </Box>
        </Card>

        {/* Action Categories */}
        {displayedCategories.length === 0 ? (
          <Card
            title="No Results Found"
            hover={false}
            sx={{ 
              textAlign: 'center', 
              p: 6,
              bgcolor: darkMode ? '#303134' : '#f8f9fa'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: darkMode ? "#e8eaed" : "#202124" }}>
              No actions found
            </Typography>
            <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"} sx={{ mb: 3 }}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('')
                setFilterCategory('all')
              }}
            >
              Clear All Filters
            </Button>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {displayedCategories.map((category) => (
              <Card key={category.id} sx={{ p: 2.5 }}>
                {/* Category Header */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  mb: 2.5 
                }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      bgcolor: alpha(category.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ color: category.color }}>
                      {category.icon}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                      {category.title}
                    </Typography>
                    <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                      {category.actions.length} actions
                    </Typography>
                  </Box>
                  <Chip
                    label={category.title}
                    size="small"
                    sx={{
                      bgcolor: alpha(category.color, 0.1),
                      color: category.color,
                      fontSize: '0.7rem',
                      height: 22,
                      px: 1,
                    }}
                  />
                </Box>

                {/* Actions Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)'
                    },
                    gap: 1.5
                  }}
                >
                  {category.actions
                    .filter(action => {
                      if (!searchTerm) return true
                      const searchLower = searchTerm.toLowerCase()
                      return action.label.toLowerCase().includes(searchLower)
                    })
                    .map((action) => (
                      <Card
                        key={action.id}
                        hover
                        sx={{
                          p: 1.5,
                          height: '100%',
                          minHeight: 80,
                          bgcolor: darkMode ? '#303134' : '#f8f9fa',
                          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: darkMode 
                              ? '0 4px 12px rgba(0,0,0,0.2)' 
                              : '0 4px 12px rgba(0,0,0,0.08)',
                            borderColor: category.color,
                            bgcolor: darkMode 
                              ? alpha(category.color, 0.08)
                              : alpha(category.color, 0.04)
                          }
                        }}
                        onClick={() => router.push(action.href)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '8px',
                              bgcolor: alpha(category.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Box sx={{ color: category.color, fontSize: 18 }}>
                              {action.icon}
                            </Box>
                          </Box>
                          
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="body2" 
                              fontWeight={500}
                              sx={{ 
                                fontSize: '0.85rem',
                                color: darkMode ? "#e8eaed" : "#202124",
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {action.label}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color={darkMode ? "#9aa0a6" : "#5f6368"}
                              sx={{ 
                                fontSize: '0.7rem',
                                display: 'block',
                                mt: 0.5
                              }}
                            >
                              Click to open
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    ))}
                </Box>
              </Card>
            ))}

            {/* Show More Button */}
            {!showAllActions && filteredCategories.length > displayedCategories.length && (
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowAllActions(true)}
                  size="small"
                  sx={{
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Show All Categories ({filteredCategories.length - displayedCategories.length} more)
                </Button>
              </Box>
            )}

            {/* Show Less Button */}
            {showAllActions && filteredCategories.length > displayedCategories.length && (
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="text"
                  onClick={() => setShowAllActions(false)}
                  size="small"
                >
                  Show Less
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Help Section */}
        <Card sx={{ 
          mt: 4, 
          p: 3,
          bgcolor: darkMode ? '#0d3064' : '#e8f0fe',
          border: 'none'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 3
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: '#1a73e8' }}>
                Need Help?
              </Typography>
              <Typography variant="body2" color={darkMode ? "#e8eaed" : "#202124"} sx={{ mb: 2, fontSize: '0.85rem' }}>
                Can't find what you're looking for?
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  component={Link}
                  href="/help"
                  startIcon={<HelpIcon />}
                  size="small"
                  sx={{ 
                    bgcolor: '#1a73e8',
                    color: 'white',
                    fontSize: '0.8rem'
                  }}
                >
                  Help Center
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  href="/help/support"
                  startIcon={<ContactSupport />}
                  size="small"
                  sx={{ 
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    fontSize: '0.8rem'
                  }}
                >
                  Support
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 3,
              flexWrap: 'wrap'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="#1a73e8">
                  {totalActions}
                </Typography>
                <Typography variant="caption" color={darkMode ? "#8ab4f8" : "#1a73e8"}>
                  Total Actions
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="#0d652d">
                  {actionCategories.length}
                </Typography>
                <Typography variant="caption" color={darkMode ? "#8ab4f8" : "#1a73e8"}>
                  Categories
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

export default AllActionsPage