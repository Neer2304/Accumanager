// app/(pages)/services-hub/page.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  alpha,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material'
import {
  Search,
  FilterList,
  Refresh,
  Apps,
  GridView,
  List as ListIcon,
  TrendingUp,
  CheckCircle,
  MoreVert,
  Menu,
  Close,
  AttachMoney,
  People,
  Inventory,
  Analytics,
  CalendarToday,
  Business,
  Groups,
  Event,
  Receipt,
  TaskAlt,
  Note,
  Build,
  Notifications,
  Dashboard,
  Settings,
  Store,
  CreditCard,
  ShoppingCart,
  BarChart,
  Timeline,
  PieChart,
  Person,
  Apartment,
  Domain,
  Home,
  School,
  Work,
  LocalShipping,
  Description,
} from '@mui/icons-material'
import { MainLayout } from '@/components/Layout/MainLayout'
import ServiceCard from '@/components/services/ServiceCard'
import QuickStats from '@/components/services/QuickStats'
import RecentActivity from '@/components/services/RecentActivity'
import ServiceStatus from '@/components/services/ServiceStatus'

// Service categories
const serviceCategories = [
  { id: 'finance', name: 'Finance', color: 'success', icon: <AttachMoney /> },
  { id: 'operations', name: 'Operations', color: 'primary', icon: <Business /> },
  { id: 'analytics', name: 'Analytics', color: 'warning', icon: <Analytics /> },
  { id: 'hr', name: 'HR & People', color: 'error', icon: <People /> },
]

// Real services we provide
const allServices = [
  // Finance Services
  {
    id: 'billing',
    name: 'Billing & Invoicing',
    description: 'Generate invoices, track payments, manage billing cycles',
    category: 'finance',
    icon: <CreditCard />,
    color: 'success',
    status: 'available',
    path: '/billing',
    features: ['Invoice Generation', 'Payment Tracking', 'Recurring Billing', 'Tax Calculation']
  },
  {
    id: 'subscription-billing',
    name: 'Subscription Management',
    description: 'Manage subscription plans and recurring payments',
    category: 'finance',
    icon: <Receipt />,
    color: 'success',
    status: 'available',
    path: '/subscription',
    features: ['Plan Management', 'Auto-renewal', 'Proration', 'Trial Periods']
  },
  {
    id: 'expenses',
    name: 'Expense Tracking',
    description: 'Track and categorize business expenses',
    category: 'finance',
    icon: <AttachMoney />,
    color: 'success',
    status: 'available',
    path: '/expenses',
    features: ['Receipt Upload', 'Category Management', 'Reporting', 'Approval Workflow']
  },
  {
    id: 'products',
    name: 'Product Catalog',
    description: 'Manage products, services, and pricing',
    category: 'finance',
    icon: <Store />,
    color: 'success',
    status: 'available',
    path: '/products',
    features: ['Inventory Sync', 'Pricing Rules', 'Product Variants', 'Digital Products']
  },

  // Operations Services
  {
    id: 'inventory',
    name: 'Inventory Management',
    description: 'Real-time inventory tracking and management',
    category: 'operations',
    icon: <Inventory />,
    color: 'primary',
    status: 'available',
    path: '/inventory',
    features: ['Stock Levels', 'Reorder Points', 'Warehouse Management', 'Serial Tracking']
  },
  {
    id: 'tasks',
    name: 'Task Management',
    description: 'Assign, track, and manage tasks across teams',
    category: 'operations',
    icon: <TaskAlt />,
    color: 'primary',
    status: 'available',
    path: '/tasks',
    features: ['Task Assignment', 'Progress Tracking', 'Deadlines', 'Team Collaboration']
  },
  {
    id: 'notes',
    name: 'Notes & Documentation',
    description: 'Create and organize notes, documents, and knowledge base',
    category: 'operations',
    icon: <Note />,
    color: 'primary',
    status: 'available',
    path: '/notes',
    features: ['Rich Text Editor', 'Document Sharing', 'Version Control', 'Search']
  },
  {
    id: 'materials',
    name: 'Materials Management',
    description: 'Manage raw materials, supplies, and consumables',
    category: 'operations',
    icon: <Build />,
    color: 'primary',
    status: 'available',
    path: '/materials',
    features: ['Material Tracking', 'Supplier Management', 'Quality Control', 'Consumption Reports']
  },

  // Analytics Services
  {
    id: 'business-analytics',
    name: 'Business Analytics',
    description: 'Comprehensive business intelligence and reporting',
    category: 'analytics',
    icon: <BarChart />,
    color: 'warning',
    status: 'available',
    path: '/analytics',
    features: ['Revenue Reports', 'Sales Trends', 'Performance Metrics', 'Custom Dashboards']
  },
  {
    id: 'subscription-analytics',
    name: 'Subscription Analytics',
    description: 'Advanced insights for subscription business',
    category: 'analytics',
    icon: <Timeline />,
    color: 'warning',
    status: 'available',
    path: '/analytics/subscription',
    features: ['MRR/ARR Tracking', 'Churn Analysis', 'Customer LTV', 'Growth Forecasting']
  },
  {
    id: 'customer-analytics',
    name: 'Customer Insights',
    description: 'Deep customer behavior and segmentation analysis',
    category: 'analytics',
    icon: <PieChart />,
    color: 'warning',
    status: 'available',
    path: '/analytics/customers',
    features: ['Customer Segmentation', 'Behavior Analysis', 'CLV Calculation', 'Retention Metrics']
  },

  // HR & People Services
  {
    id: 'attendance',
    name: 'Attendance Management',
    description: 'Track employee attendance, leaves, and time-off',
    category: 'hr',
    icon: <CalendarToday />,
    color: 'error',
    status: 'available',
    path: '/attendance',
    features: ['Clock In/Out', 'Leave Management', 'Shift Planning', 'Overtime Tracking']
  },
  {
    id: 'employees',
    name: 'Employee Management',
    description: 'Manage employee profiles, roles, and permissions',
    category: 'hr',
    icon: <Person />,
    color: 'error',
    status: 'available',
    path: '/employees',
    features: ['Employee Directory', 'Role Management', 'Performance Reviews', 'Document Storage']
  },
  {
    id: 'business-setup',
    name: 'Business Setup',
    description: 'Configure business settings, preferences, and modules',
    category: 'hr',
    icon: <Apartment />,
    color: 'error',
    status: 'available',
    path: '/setup',
    features: ['Module Configuration', 'Company Settings', 'User Permissions', 'Integration Setup']
  },
  {
    id: 'customers',
    name: 'Customer Management',
    description: 'Manage customer relationships and communication',
    category: 'hr',
    icon: <Groups />,
    color: 'error',
    status: 'available',
    path: '/customers',
    features: ['Contact Management', 'Communication History', 'Support Tickets', 'CRM Features']
  },
  {
    id: 'community',
    name: 'Community Portal',
    description: 'Engage with users, collect feedback, and build community',
    category: 'hr',
    icon: <Domain />,
    color: 'error',
    status: 'available',
    path: '/community',
    features: ['Discussion Forums', 'Feedback Collection', 'Announcements', 'User Groups']
  },
  {
    id: 'events',
    name: 'Event Management',
    description: 'Plan, organize, and manage events and meetings',
    category: 'hr',
    icon: <Event />,
    color: 'error',
    status: 'available',
    path: '/events',
    features: ['Event Calendar', 'Registration', 'Reminders', 'Attendance Tracking']
  },
  {
    id: 'notifications',
    name: 'Notifications Center',
    description: 'Manage and customize system notifications',
    category: 'hr',
    icon: <Notifications />,
    color: 'error',
    status: 'available',
    path: '/notifications',
    features: ['Push Notifications', 'Email Alerts', 'SMS Alerts', 'Notification Preferences']
  },
]

export default function ServicesHubPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6) // Start with 6 services
  const [loadingMore, setLoadingMore] = useState(false)

  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    return allServices.filter(service => {
      const matchesSearch = searchQuery === '' || 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.features.some((feature: string) => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
      
      const matchesCategory = activeCategory === 'all' || service.category === activeCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(6)
  }, [searchQuery, activeCategory])

  // Get visible services based on current count
  const visibleServices = useMemo(() => {
    return filteredServices.slice(0, visibleCount)
  }, [filteredServices, visibleCount])

  // Load more services
  const loadMoreServices = () => {
    setLoadingMore(true)
    // Simulate loading delay
    setTimeout(() => {
      setVisibleCount(prev => prev + 6)
      setLoadingMore(false)
    }, 500)
  }

  // Check if there are more services to load
  const hasMoreServices = visibleCount < filteredServices.length

  // Calculate stats
  const totalServices = allServices.length
  const availableServices = allServices.filter(s => s.status === 'available').length

  // Get category stats
  const categoryStats = serviceCategories.map(category => {
    const servicesInCategory = allServices.filter(s => s.category === category.id)
    return {
      ...category,
      count: servicesInCategory.length,
    }
  })

  // Handle mobile drawer
  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  // Quick stats
  const quickStats = [
    { label: 'Total Services', value: totalServices, icon: <Apps />, color: 'primary' },
    { label: 'Available Now', value: availableServices, icon: <CheckCircle />, color: 'success' },
    { label: 'Categories', value: serviceCategories.length, icon: <Dashboard />, color: 'warning' },
    { label: 'Active Users', value: '500+', icon: <People />, color: 'info' },
  ]

  // Recent activity
  const recentActivity = [
    { service: 'Billing & Invoicing', action: 'New features added', time: 'Today', user: 'Admin' },
    { service: 'Inventory Management', action: 'Stock alerts improved', time: 'Yesterday', user: 'System' },
    { service: 'Customer Management', action: 'CRM features enhanced', time: '2 days ago', user: 'Admin' },
    { service: 'Analytics Dashboard', action: 'New reports available', time: '3 days ago', user: 'System' },
  ]

  return (
    <MainLayout title="Services Hub">
      <Box sx={{ 
        p: isMobile ? 1 : 2,
      }}>
        {/* Mobile Header */}
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2,
            p: 1,
            background: 'background.paper',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={toggleMobileDrawer} size="small">
                <Menu />
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                Services Hub
              </Typography>
            </Box>
          </Box>
        )}

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={toggleMobileDrawer}
        >
          <Box sx={{ width: 280, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Services Hub
              </Typography>
              <IconButton onClick={toggleMobileDrawer} size="small">
                <Close />
              </IconButton>
            </Box>
            
            <List>
              {serviceCategories.map((category) => (
                <ListItem key={category.id} disablePadding>
                  <ListItemButton 
                    sx={{ 
                      borderRadius: '8px', 
                      mb: 0.5,
                    }}
                    onClick={() => {
                      setActiveCategory(category.id)
                      setMobileDrawerOpen(false)
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{ color: `${category.color}.main` }}>
                        {category.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary={category.name} 
                      primaryTypographyProps={{
                        fontWeight: activeCategory === category.id ? 600 : 400
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Search and Filters */}
        <Card sx={{ 
          mb: 3,
          borderRadius: '12px',
        }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center',
              flexWrap: isTablet ? 'wrap' : 'nowrap',
            }}>
              <TextField
                fullWidth
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: isTablet ? '100%' : '300px',
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="All Services"
                  onClick={() => setActiveCategory('all')}
                  variant={activeCategory === 'all' ? 'filled' : 'outlined'}
                  color="primary"
                />
                
                {serviceCategories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => setActiveCategory(category.id)}
                    variant={activeCategory === category.id ? 'filled' : 'outlined'}
                    color={category.color as any}
                  />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <GridView />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ListIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: 3 
        }}>
          {/* Services Grid */}
          <Box sx={{ 
            flex: { lg: '2 1 0%' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {activeCategory === 'all' ? 'All Services' : 
                  serviceCategories.find(c => c.id === activeCategory)?.name} ({filteredServices.length})
                {visibleServices.length < filteredServices.length && (
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    (Showing {visibleServices.length} of {filteredServices.length})
                  </Typography>
                )}
              </Typography>

              {viewMode === 'grid' ? (
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    md: 'repeat(3, 1fr)' 
                  },
                  gap: 2,
                }}>
                  {visibleServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      viewMode={viewMode}
                    />
                  ))}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {visibleServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      viewMode={viewMode}
                    />
                  ))}
                </Box>
              )}

              {filteredServices.length === 0 && (
                <Card sx={{ 
                  p: 4,
                  textAlign: 'center',
                }}>
                  <Apps sx={{ 
                    fontSize: 48, 
                    color: 'text.secondary',
                    opacity: 0.5,
                    mb: 2,
                  }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No services found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? 'Try a different search term' : 'No services in this category'}
                  </Typography>
                </Card>
              )}

              {/* Load More Button */}
              {hasMoreServices && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 4,
                  mb: 2,
                }}>
                  <Button
                    variant="outlined"
                    onClick={loadMoreServices}
                    disabled={loadingMore}
                    startIcon={loadingMore ? <CircularProgress size={20} /> : null}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: '8px',
                    }}
                  >
                    {loadingMore ? 'Loading...' : `Load More (${filteredServices.length - visibleServices.length} more)`}
                  </Button>
                </Box>
              )}

              {/* Show message when all services are loaded */}
              {!hasMoreServices && filteredServices.length > 0 && (
                <Box sx={{ 
                  textAlign: 'center', 
                  mt: 4,
                  py: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}>
                  <Typography variant="body2" color="text.secondary">
                    All {filteredServices.length} services loaded
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Sidebar */}
          <Box sx={{ 
            flex: { lg: '1 1 0%' },
            minWidth: { lg: '300px' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            <QuickStats stats={quickStats} />
            
            <ServiceStatus 
              services={allServices}
              categories={serviceCategories}
            />
          </Box>
        </Box>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <Box sx={{ 
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            p: 1.5,
            display: 'flex',
            justifyContent: 'space-around',
            zIndex: 1000,
          }}>
            <IconButton
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              <GridView />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
            >
              <ListIcon />
            </IconButton>
            <IconButton>
              <FilterList />
            </IconButton>
            <IconButton>
              <Refresh />
            </IconButton>
          </Box>
        )}

        {/* Add padding for mobile bottom nav */}
        {isMobile && <Box sx={{ height: '70px' }} />}
      </Box>
    </MainLayout>
  )
}