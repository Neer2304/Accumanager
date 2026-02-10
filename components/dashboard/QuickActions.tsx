import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  alpha,
  Paper,
  LinearProgress
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
  InventoryOutlined,
  TrendingUp
} from '@mui/icons-material'
import Link from 'next/link'

const QuickActions: React.FC = () => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const actions = [
    {
      label: 'Create Invoice',
      icon: <InvoiceIcon fontSize={isMobile ? "small" : "medium"} />,
      href: '/billing/new',
      color: '#4285f4',
      description: 'New bill',
      bgColor: darkMode ? alpha('#4285f4', 0.15) : alpha('#4285f4', 0.08)
    },
    {
      label: 'Add Product',
      icon: <ProductIcon fontSize={isMobile ? "small" : "medium"} />,
      href: '/products/new',
      color: '#34a853',
      description: 'New item',
      bgColor: darkMode ? alpha('#34a853', 0.15) : alpha('#34a853', 0.08)
    },
    {
      label: 'View Reports',
      icon: <AnalyticsIcon fontSize={isMobile ? "small" : "medium"} />,
      href: '/reports',
      color: '#ea4335',
      description: 'Analytics',
      bgColor: darkMode ? alpha('#ea4335', 0.15) : alpha('#ea4335', 0.08)
    },
    {
      label: 'Employees',
      icon: <EmployeeIcon fontSize={isMobile ? "small" : "medium"} />,
      href: '/employees',
      color: '#fbbc04',
      description: 'Team',
      bgColor: darkMode ? alpha('#fbbc04', 0.15) : alpha('#fbbc04', 0.08)
    }
  ]

  const secondaryActions = [
    {
      label: 'Payments',
      icon: <PaymentIcon fontSize="small" />,
      href: '/payments',
      color: '#4285f4'
    },
    {
      label: 'Categories',
      icon: <CategoryIcon fontSize="small" />,
      href: '/products/categories',
      color: '#ea4335'
    },
    {
      label: 'Settings',
      icon: <SettingsIcon fontSize="small" />,
      href: '/settings',
      color: darkMode ? '#9aa0a6' : '#5f6368'
    },
    {
      label: 'Delivery',
      icon: <DeliveryIcon fontSize="small" />,
      href: '/delivery',
      color: '#34a853'
    },
    {
      label: 'Customers',
      icon: <People fontSize="small" />,
      href: '/customers',
      color: '#4285f4'
    },
    {
      label: 'Inventory',
      icon: <InventoryOutlined fontSize="small" />,
      href: '/inventory',
      color: '#fbbc04'
    }
  ]

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: darkMode ? '#5f6368' : '#bdc1c6',
          boxShadow: darkMode 
            ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 1.5, sm: 2 },
        gap: 2,
        '&:last-child': { pb: { xs: 1.5, sm: 2 } }
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp 
              sx={{ 
                fontSize: { xs: 20, sm: 24 },
                color: '#4285f4'
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                color: darkMode ? '#e8eaed' : '#202124'
              }}
            >
              Quick Actions
            </Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 600,
              backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
              color: darkMode ? '#8ab4f8' : '#4285f4',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: { xs: '0.7rem', sm: '0.75rem' }
            }}
          >
            {actions.length} actions
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            color: darkMode ? '#9aa0a6' : '#5f6368'
          }}
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
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
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
                  borderColor: action.color,
                  backgroundColor: darkMode 
                    ? alpha(action.color, 0.25) 
                    : alpha(action.color, 0.15),
                  boxShadow: `0 6px 20px ${alpha(action.color, 0.2)}`,
                }
              }}
            >
              <Box
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  borderRadius: '12px',
                  backgroundColor: darkMode 
                    ? alpha(action.color, 0.2) 
                    : alpha(action.color, 0.1),
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
                sx={{ 
                  textAlign: 'center', 
                  mb: 0.5,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  color: darkMode ? '#e8eaed' : '#202124'
                }}
              >
                {action.label}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  textAlign: 'center',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                {action.description}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* More Actions Section */}
        <Box sx={{ mt: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 1 
          }}>
            <Typography 
              variant="caption" 
              fontWeight={600}
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                color: darkMode ? '#9aa0a6' : '#5f6368'
              }}
            >
              More Actions
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: '#4285f4',
                textDecoration: 'none',
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                '&:hover': { textDecoration: 'underline' }
              }}
              component={Link}
              href="/dashboard/all-actions"
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
              background: `linear-gradient(90deg, transparent 0%, ${darkMode ? '#303134' : '#ffffff'} 100%)`,
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
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                borderRadius: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: darkMode ? '#5f6368' : '#bdc1c6',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: darkMode ? '#80868b' : '#9aa0a6',
                }
              },
              scrollbarWidth: 'thin',
              scrollbarColor: `${darkMode ? '#5f6368' : '#bdc1c6'} ${darkMode ? '#3c4043' : '#f1f3f4'}`,
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
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    minWidth: 140,
                    '&:hover': {
                      backgroundColor: darkMode ? '#5f6368' : '#e8eaed',
                      borderColor: darkMode ? '#80868b' : '#bdc1c6',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      backgroundColor: darkMode 
                        ? alpha(action.color, 0.2) 
                        : alpha(action.color, 0.1),
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
                      sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: darkMode ? '#e8eaed' : '#202124'
                      }}
                    >
                      {action.label}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        display: 'block',
                        color: darkMode ? '#9aa0a6' : '#5f6368'
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
              sx={{ 
                mt: 0.5, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                color: darkMode ? '#80868b' : '#9aa0a6'
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
            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              color: darkMode ? '#9aa0a6' : '#5f6368'
            }}
          >
            Last used: Today
          </Typography>
          <Typography 
            variant="caption" 
            component={Link}
            href="/dashboard/all-actions"
            sx={{ 
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              color: '#4285f4',
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