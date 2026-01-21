// components/dashboard/QuickActions.tsx - WITH PROPER HORIZONTAL SCROLL
import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  alpha,
  Paper
} from '@mui/material'
import {
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
  ArrowForward as ArrowIcon,
  People,
  InventoryOutlined
} from '@mui/icons-material'
import Link from 'next/link'

const QuickActions: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const actions = [
    {
      label: 'Create Invoice',
      icon: <InvoiceIcon fontSize={isMobile ? "small" : "medium"} />,
      href: '/billing/new',
      color: theme.palette.primary.main,
      description: 'New bill',
      bgColor: alpha(theme.palette.primary.main, 0.1)
    },
    {
      label: 'Add Product',
      icon: <ProductIcon fontSize={isMobile ? "small" : "medium"} />,
      href: '/products/new',
      color: theme.palette.success.main,
      description: 'New item',
      bgColor: alpha(theme.palette.success.main, 0.1)
    },
    {
      label: 'View Reports',
      icon: <AnalyticsIcon fontSize={isMobile ? "small" : "medium"} />,
      href: '/reports',
      color: theme.palette.info.main,
      description: 'Analytics',
      bgColor: alpha(theme.palette.info.main, 0.1)
    },
    {
      label: 'Employees',
      icon: <EmployeeIcon fontSize={isMobile ? "small" : "medium"} />,
      href: '/employees',
      color: theme.palette.secondary.main,
      description: 'Team',
      bgColor: alpha(theme.palette.secondary.main, 0.1)
    }
  ]

  const secondaryActions = [
    {
      label: 'Payments',
      icon: <PaymentIcon fontSize="small" />,
      href: '/payments',
      color: theme.palette.warning.main
    },
    {
      label: 'Categories',
      icon: <CategoryIcon fontSize="small" />,
      href: '/products/categories',
      color: theme.palette.error.main
    },
    {
      label: 'Settings',
      icon: <SettingsIcon fontSize="small" />,
      href: '/settings',
      color: theme.palette.grey[600]
    },
    {
      label: 'Delivery',
      icon: <DeliveryIcon fontSize="small" />,
      href: '/delivery',
      color: theme.palette.augmentColor.name?.[500] || theme.palette.secondary.dark
    },
    {
      label: 'Customers',
      icon: <People fontSize="small" />,
      href: '/customers',
      color: theme.palette.divider?.[500] || theme.palette.info.dark
    },
    {
      label: 'Inventory',
      icon: <InventoryOutlined fontSize="small" />,
      href: '/inventory',
      color: theme.palette.divider?.[500] || theme.palette.warning.dark
    }
  ]

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: isMobile ? 1.5 : 2,
        gap: 1.5
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 0.5
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}
          >
            Quick Actions
          </Typography>
          <Typography 
            variant="caption" 
            color="primary.main"
            sx={{ 
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              px: 1,
              py: 0.5,
              borderRadius: 1
            }}
          >
            {actions.length} main
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 1.5 }}
        >
          Quick access to frequently used features
        </Typography>

        {/* Main Actions - 2x2 Grid */}
        <Box 
          sx={{ 
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1,
            minHeight: 160
          }}
        >
          {actions.map((action, index) => (
            <Paper
              key={index}
              elevation={0}
              component={Link}
              href={action.href}
              sx={{
                p: isMobile ? 1.5 : 2,
                borderRadius: 2,
                border: `1px solid ${alpha(action.color, 0.2)}`,
                backgroundColor: action.bgColor,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: 100,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 6px 20px ${alpha(action.color, 0.2)}`,
                  borderColor: action.color,
                  backgroundColor: alpha(action.color, 0.15)
                }
              }}
            >
              <Box
                sx={{
                  width: isMobile ? 36 : 44,
                  height: isMobile ? 36 : 44,
                  borderRadius: '12px',
                  backgroundColor: alpha(action.color, 0.15),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5
                }}
              >
                <Box sx={{ color: action.color }}>
                  {action.icon}
                </Box>
              </Box>
              <Typography 
                variant="body2" 
                fontWeight={700}
                color="text.primary"
                sx={{ 
                  textAlign: 'center', 
                  mb: 0.5,
                  fontSize: isMobile ? '0.8rem' : '0.9rem'
                }}
              >
                {action.label}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  textAlign: 'center',
                  fontSize: isMobile ? '0.7rem' : '0.75rem'
                }}
              >
                {action.description}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* More Actions Section - ALWAYS SCROLLABLE */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 1 
          }}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              fontWeight={600}
            >
              More Actions
            </Typography>
            <Typography 
              variant="caption" 
              color="primary.main"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer'
              }}
              component={Link}
              href="/dashboard/all-actions"
              // sx={{ 
              //   textDecoration: 'none',
              //   '&:hover': { textDecoration: 'underline' }
              // }}
            >
              View all <ArrowIcon sx={{ fontSize: 12 }} />
            </Typography>
          </Box>
          
          {/* Horizontal Scroll Container */}
          <Box sx={{ 
            position: 'relative',
            width: '100%',
            overflow: 'hidden'
          }}>
            {/* Gradient Overlay for scroll indication */}
            <Box sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 40,
              background: `linear-gradient(90deg, transparent 0%, ${theme.palette.background.paper} 100%)`,
              zIndex: 1,
              pointerEvents: 'none'
            }} />
            
            {/* Scrollable Content */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              py: 1,
              px: 0.5,
              // Hide scrollbar but keep functionality
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: alpha(theme.palette.divider, 0.1),
                borderRadius: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                }
              },
              // Firefox scrollbar
              scrollbarWidth: 'thin',
              scrollbarColor: `${alpha(theme.palette.primary.main, 0.3)} ${alpha(theme.palette.divider, 0.1)}`,
            }}>
              {secondaryActions.map((action, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  component={Link}
                  href={action.href}
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    minWidth: 140,
                    '&:hover': {
                      backgroundColor: alpha(action.color, 0.1),
                      borderColor: alpha(action.color, 0.3),
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[2]
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      backgroundColor: alpha(action.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Box sx={{ 
                      color: action.color,
                      fontSize: '1rem'
                    }}>
                      {action.icon}
                    </Box>
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      fontWeight={600}
                      color="text.primary"
                      sx={{ 
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {action.label}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.7rem',
                        display: 'block'
                      }}
                    >
                      Click to open
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
          
          {/* Scroll Hint for mobile */}
          {isMobile && (
            <Typography 
              variant="caption" 
              color="text.disabled"
              sx={{ 
                mt: 0.5, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem'
              }}
            >
              ← Scroll for more actions →
            </Typography>
          )}
        </Box>

        {/* Footer */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            pt: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`
          }}
        >
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: '0.7rem' }}
          >
            Last used: Today
          </Typography>
          <Typography 
            variant="caption" 
            color="primary.main"
            component={Link}
            href="/dashboard/all-actions"
            sx={{ 
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.7rem',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            All Actions →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default QuickActions