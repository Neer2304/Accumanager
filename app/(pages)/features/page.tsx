'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Stack,
  Button,
  alpha,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  Analytics,
  Inventory,
  People,
  Receipt,
  Security,
  Speed,
  Category,
  LocalShipping,
  Payment,
  Dashboard,
  Report,
  Notifications,
  Settings,
  ExpandMore,
  CheckCircle,
  TrendingUp,
  Smartphone,
  Sync
} from '@mui/icons-material'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface FeatureCategory {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  features: Array<{
    title: string
    description: string
    icon: React.ReactNode
  }>
}

export default function FeaturesPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [activeCategory, setActiveCategory] = useState('all')

  const featureCategories: FeatureCategory[] = [
    {
      id: 'inventory',
      title: 'Inventory Management',
      icon: <Inventory sx={{ fontSize: 40 }} />,
      description: 'Complete control over your stock with real-time tracking',
      features: [
        {
          title: 'Stock Tracking',
          description: 'Real-time tracking of inventory levels across locations',
          icon: <Category />
        },
        {
          title: 'Batch Management',
          description: 'Track batches, expiry dates, and manufacturing details',
          icon: <LocalShipping />
        },
        {
          title: 'Low Stock Alerts',
          description: 'Automated notifications when stock runs low',
          icon: <Notifications />
        },
        {
          title: 'Inventory Reports',
          description: 'Detailed reports on stock movement and turnover',
          icon: <Report />
        }
      ]
    },
    {
      id: 'sales',
      title: 'Sales & Analytics',
      icon: <Analytics sx={{ fontSize: 40 }} />,
      description: 'Powerful analytics to drive your business decisions',
      features: [
        {
          title: 'Sales Dashboard',
          description: 'Real-time insights into revenue, orders, and trends',
          icon: <Dashboard />
        },
        {
          title: 'Revenue Tracking',
          description: 'Track daily, weekly, and monthly revenue with charts',
          icon: <TrendingUp />
        },
        {
          title: 'Customer Analytics',
          description: 'Understand customer behavior and purchase patterns',
          icon: <People />
        },
        {
          title: 'Product Performance',
          description: 'Identify top-selling products and categories',
          icon: <CheckCircle />
        }
      ]
    },
    {
      id: 'customers',
      title: 'Customer CRM',
      icon: <People sx={{ fontSize: 40 }} />,
      description: 'Build lasting relationships with your customers',
      features: [
        {
          title: 'Customer Profiles',
          description: 'Complete customer information and purchase history',
          icon: <People />
        },
        {
          title: 'Contact Management',
          description: 'Organize and segment your customer database',
          icon: <Category />
        },
        {
          title: 'Communication Tools',
          description: 'Email and SMS integration for customer outreach',
          icon: <Notifications />
        },
        {
          title: 'Loyalty Programs',
          description: 'Create and manage customer loyalty programs',
          icon: <CheckCircle />
        }
      ]
    },
    {
      id: 'billing',
      title: 'Invoice & Billing',
      icon: <Receipt sx={{ fontSize: 40 }} />,
      description: 'Professional invoicing and payment management',
      features: [
        {
          title: 'Create Invoices',
          description: 'Generate professional invoices in seconds',
          icon: <Receipt />
        },
        {
          title: 'Payment Tracking',
          description: 'Track payments and outstanding amounts',
          icon: <Payment />
        },
        {
          title: 'GST Compliance',
          description: 'Automated GST calculations and reporting',
          icon: <CheckCircle />
        },
        {
          title: 'Payment Reminders',
          description: 'Automated reminders for pending payments',
          icon: <Notifications />
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Compliance',
      icon: <Security sx={{ fontSize: 40 }} />,
      description: 'Enterprise-grade security for your business data',
      features: [
        {
          title: 'Data Encryption',
          description: 'End-to-end encryption for all sensitive data',
          icon: <Security />
        },
        {
          title: 'User Permissions',
          description: 'Role-based access control for team members',
          icon: <Settings />
        },
        {
          title: 'Audit Logs',
          description: 'Complete audit trail of all system activities',
          icon: <Report />
        },
        {
          title: 'GDPR Compliance',
          description: 'Built-in compliance with data protection regulations',
          icon: <CheckCircle />
        }
      ]
    },
    {
      id: 'mobile',
      title: 'Mobile & Access',
      icon: <Smartphone sx={{ fontSize: 40 }} />,
      description: 'Access your business from anywhere, anytime',
      features: [
        {
          title: 'Mobile App',
          description: 'Full-featured mobile app for on-the-go management',
          icon: <Smartphone />
        },
        {
          title: 'Real-time Sync',
          description: 'Instant sync across all devices and platforms',
          icon: <Sync />
        },
        {
          title: 'Offline Mode',
          description: 'Work offline with automatic sync when connected',
          icon: <Speed />
        },
        {
          title: 'Multi-device Access',
          description: 'Access from any device - desktop, tablet, or mobile',
          icon: <CheckCircle />
        }
      ]
    }
  ]

  const allFeatures = featureCategories.flatMap(cat => cat.features)

  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string
  ) => {
    if (newCategory !== null) {
      setActiveCategory(newCategory)
    }
  }

  const filteredFeatures = activeCategory === 'all' 
    ? allFeatures 
    : featureCategories.find(cat => cat.id === activeCategory)?.features || []

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 12, sm: 14, md: 16 },
          pb: { xs: 6, sm: 8, md: 10 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Chip
              label="Features"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
            <Typography
              variant={isMobile ? "h3" : "h1"}
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ color: 'white' }}
            >
              Everything You Need to Run Your Business
            </Typography>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                opacity: 0.95,
                mb: 4,
                color: 'white'
              }}
            >
              AccumaManage combines all essential business tools into one powerful platform.
              No more switching between multiple apps.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Features Categories - Mobile Accordion */}
      {isMobile ? (
        <Box sx={{ py: { xs: 4, sm: 6 } }}>
          <Container maxWidth="lg">
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              All Features
            </Typography>
            {featureCategories.map((category) => (
              <Accordion
                key={category.id}
                sx={{
                  mb: 2,
                  borderRadius: '8px !important',
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: '8px'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: 'primary.main' }}>
                      {category.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {category.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {category.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                          {feature.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold">
                              {feature.title}
                            </Typography>
                          }
                          secondary={feature.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Container>
        </Box>
      ) : (
        /* Features Categories - Desktop Tabs & Box Layout */
        <Box sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                component="h2"
                fontWeight="bold"
                gutterBottom
              >
                Explore All Features
              </Typography>
              <Typography
                variant={isMobile ? "body1" : "h6"}
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
              >
                Organized by category for easy navigation
              </Typography>

              <ToggleButtonGroup
                value={activeCategory}
                exclusive
                onChange={handleCategoryChange}
                sx={{
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 1,
                  '& .MuiToggleButton-root': {
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main
                    }
                  }
                }}
              >
                <ToggleButton value="all">All Features</ToggleButton>
                {featureCategories.map((category) => (
                  <ToggleButton key={category.id} value={category.id}>
                    {category.title}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            {activeCategory === 'all' ? (
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 4,
                justifyContent: 'center'
              }}>
                {featureCategories.map((category) => (
                  <Box key={category.id} sx={{ 
                    width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' },
                    minWidth: 280 
                  }}>
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[8]
                        }
                      }}
                    >
                      <CardContent sx={{ p: { xs: 3, sm: 4 }, height: '100%' }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                          <Box sx={{ color: 'primary.main', mb: 2 }}>
                            {category.icon}
                          </Box>
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {category.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" paragraph>
                            {category.description}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <List dense>
                          {category.features.slice(0, 3).map((feature, index) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                                {feature.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {feature.title}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="caption" color="text.secondary">
                                    {feature.description}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                          <Chip
                            label={`${category.features.length} features`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 4,
                justifyContent: 'center'
              }}>
                {filteredFeatures.map((feature, index) => (
                  <Box key={index} sx={{ 
                    width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' },
                    minWidth: 280 
                  }}>
                    <Paper
                      sx={{
                        p: { xs: 3, sm: 4 },
                        height: '100%',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      <Box sx={{ color: 'primary.main', mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
            )}
          </Container>
        </Box>
      )}

      {/* Benefits Section */}
      <Box sx={{ py: { xs: 8, sm: 10, md: 12 }, backgroundColor: alpha(theme.palette.grey[100], 0.5) }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              Why Choose AccumaManage?
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              More than just features - real benefits for your business
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 4,
            justifyContent: 'center'
          }}>
            <Box sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' },
              textAlign: 'center', 
              p: 3 
            }}>
              <Speed sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                3x Faster Operations
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Automate repetitive tasks and save hours every day
              </Typography>
            </Box>
            
            <Box sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' },
              textAlign: 'center', 
              p: 3 
            }}>
              <TrendingUp sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Increase Revenue
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Data-driven insights to boost sales and profitability
              </Typography>
            </Box>
            
            <Box sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' },
              textAlign: 'center', 
              p: 3 
            }}>
              <Security sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Reduce Errors
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Automated systems eliminate manual data entry mistakes
              </Typography>
            </Box>
            
            <Box sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' },
              textAlign: 'center', 
              p: 3 
            }}>
              <Sync sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Real-time Updates
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Always work with the latest data across all devices
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Integration Section */}
      <Box sx={{ py: { xs: 8, sm: 10, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 6,
            alignItems: 'center'
          }}>
            <Box sx={{ flex: 1 }}>
              <Box>
                <Chip
                  label="Integration"
                  sx={{ mb: 2 }}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Works with Your Existing Tools
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  AccumaManage integrates seamlessly with popular platforms you already use.
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Connect with payment gateways, accounting software, e-commerce platforms,
                  and more through our robust API and pre-built integrations.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="Payment Gateways" variant="outlined" />
                  <Chip label="Accounting Software" variant="outlined" />
                  <Chip label="E-commerce" variant="outlined" />
                  <Chip label="Banking APIs" variant="outlined" />
                  <Chip label="Shipping Services" variant="outlined" />
                </Stack>
              </Box>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <Paper
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  API Access
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Build custom integrations and extend AccumaManage's functionality
                  with our comprehensive REST API.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText primary="Full REST API with detailed documentation" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText primary="Webhooks for real-time notifications" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText primary="SDKs for popular programming languages" />
                  </ListItem>
                </List>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, sm: 10, md: 12 } }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              borderRadius: 3
            }}
          >
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h2"
              fontWeight="bold"
              gutterBottom
              color="white"
            >
              Ready to Experience All Features?
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              sx={{ mb: 4, opacity: 0.95 }}
              color="white"
            >
              Join thousands of businesses already using AccumaManage to streamline their operations.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center' }}
            >
              {!isAuthenticated && !authLoading ? (
                <>
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    component={Link}
                    href="/dashboard"
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: 'grey.100'
                      }
                    }}
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    component={Link}
                    href="/pricing"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    View Pricing
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  component={Link}
                  href="/dashboard"
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'grey.100'
                    }
                  }}
                >
                  Go to Dashboard
                </Button>
              )}
            </Stack>
            
            {/* Show trial message only for non-authenticated users */}
            {!isAuthenticated && !authLoading && (
              <Typography
                variant="body2"
                sx={{ 
                  mt: 2, 
                  opacity: 0.9,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
                color="white"
              >
                No credit card required • 14-day free trial • Cancel anytime
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}