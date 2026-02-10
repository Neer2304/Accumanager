// components/dashboard/RecentActivity.tsx
"use client";

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Avatar,
  Chip,
  Alert,
  Button,
  alpha,
} from '@mui/material'
import { 
  LocalActivityOutlined as ActivityIcon,
  ShoppingCart,
  PersonAdd,
  Warning,
  Inventory2,
  Upgrade,
  ErrorOutline,
  Refresh,
  TrendingUp,
  AccountBalance,
} from '@mui/icons-material'

interface Activity {
  id: string
  type: 'sale' | 'customer' | 'stock' | 'payment' | 'billing' | 'low_stock'
  message: string
  details: string
  amount?: number
  customerName?: string
  productName?: string
  time: string
  color: 'success' | 'primary' | 'warning' | 'info' | 'error' | 'secondary'
  createdAt: string
  icon: React.ReactNode
}

const RecentActivity: React.FC = () => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionExpired, setSubscriptionExpired] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      setRefreshing(true)
      setError(null)
      setSubscriptionExpired(false)
      
      // Fetch recent orders/billing data
      const billingRes = await fetch('/api/billing/recent?limit=10', { 
        credentials: 'include' 
      })

      // Check for subscription expiration (402 status)
      if (billingRes.status === 402) {
        const data = await billingRes.json()
        setError(data.error || 'Subscription required to view recent activity')
        setSubscriptionExpired(true)
        setActivities([])
        return
      }
      
      if (!billingRes.ok) {
        throw new Error('Failed to fetch billing data')
      }
      
      // Fetch recent customers (only if billing was successful)
      const customersRes = await fetch('/api/customers?limit=5&sort=-createdAt', { 
        credentials: 'include' 
      })
      
      // Fetch low stock products (only if previous calls were successful)
      const productsRes = await fetch('/api/products?limit=20', { 
        credentials: 'include' 
      })

      const activitiesData: Activity[] = []

      // Process billing data (orders)
      if (billingRes.ok) {
        const billingData = await billingRes.json()
        
        // Handle both array response or object with orders property
        const orders = billingData.orders || billingData.data || billingData
        
        if (Array.isArray(orders)) {
          orders.slice(0, 5).forEach((order: any) => {
            activitiesData.push({
              id: order._id || order.id,
              type: 'billing',
              message: 'New invoice created',
              details: `Invoice ${order.invoiceNumber || 'N/A'} created`,
              amount: order.grandTotal || 0,
              customerName: order.customer?.name || 'Customer',
              time: formatTimeAgo(order.createdAt || order.invoiceDate),
              color: 'success',
              createdAt: order.createdAt || new Date().toISOString(),
              icon: <ShoppingCart fontSize="small" />
            })
          })
        }
      }

      // Process new customers
      if (customersRes.ok) {
        const customersData = await customersRes.json()
        
        // Handle both array response or object with customers property
        const customers = customersData.customers || customersData.data || customersData
        
        if (Array.isArray(customers)) {
          customers.slice(0, 3).forEach((customer: any) => {
            activitiesData.push({
              id: customer._id || customer.id,
              type: 'customer',
              message: 'New customer added',
              details: `${customer.name || 'Customer'} registered`,
              customerName: customer.name,
              time: formatTimeAgo(customer.createdAt),
              color: 'primary',
              createdAt: customer.createdAt,
              icon: <PersonAdd fontSize="small" />
            })
          })
        }
      }

      // Process low stock products
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        
        // Handle both array response or object with products property
        const products = productsData.products || productsData.data || productsData
        
        if (Array.isArray(products)) {
          const lowStockProducts = products.filter((product: any) => {
            // Calculate total stock from variations and batches
            const variationsStock = product.variations?.reduce(
              (sum: number, v: any) => sum + (v.stock || 0), 
              0
            ) || 0
            
            const batchesStock = product.batches?.reduce(
              (sum: number, b: any) => sum + (b.quantity || 0), 
              0
            ) || 0
            
            return (variationsStock + batchesStock) < 10
          }).slice(0, 2)

          lowStockProducts.forEach((product: any) => {
            activitiesData.push({
              id: product._id || product.id,
              type: 'low_stock',
              message: 'Low stock alert',
              details: `${product.name || 'Product'} is running low`,
              productName: product.name,
              time: formatTimeAgo(product.updatedAt || product.createdAt),
              color: 'warning',
              createdAt: product.updatedAt || product.createdAt,
              icon: <Warning fontSize="small" />
            })
          })
        }
      }

      // Sort by creation date and take latest 8
      const sortedActivities = activitiesData
        .filter(activity => activity.createdAt)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8)

      setActivities(sortedActivities)

    } catch (error: any) {
      console.error('Error fetching recent activity:', error)
      setError(error.message || 'Failed to load recent activity')
      // Fallback to sample data from actual structure
      setActivities(getSampleActivities())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const formatTimeAgo = (dateString: string | Date): string => {
    if (!dateString) return 'Recently'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
      } else {
        return date.toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'short' 
        })
      }
    } catch {
      return 'Recently'
    }
  }

  const getSampleActivities = (): Activity[] => {
    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    return [
      {
        id: '1',
        type: 'billing',
        message: 'New invoice created',
        details: 'Invoice INV-877482 created',
        amount: 1100,
        customerName: 'Neer Mehta',
        time: formatTimeAgo(twoHoursAgo),
        color: 'success',
        createdAt: twoHoursAgo.toISOString(),
        icon: <ShoppingCart fontSize="small" />
      },
      {
        id: '2',
        type: 'customer',
        message: 'New customer added',
        details: 'Raj Sharma registered',
        customerName: 'Raj Sharma',
        time: formatTimeAgo(yesterday),
        color: 'primary',
        createdAt: yesterday.toISOString(),
        icon: <PersonAdd fontSize="small" />
      },
      {
        id: '3',
        type: 'low_stock',
        message: 'Low stock alert',
        details: 'Product XYZ is running low',
        productName: 'Product XYZ',
        time: formatTimeAgo(yesterday),
        color: 'warning',
        createdAt: yesterday.toISOString(),
        icon: <Warning fontSize="small" />
      }
    ]
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'billing': return '#34a853'
      case 'customer': return '#4285f4'
      case 'low_stock': return '#fbbc04'
      case 'payment': return '#8ab4f8'
      default: return '#5f6368'
    }
  }

  if (loading) {
    return (
      <Card sx={{ 
        height: '100%',
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 200 
        }}>
          <CircularProgress 
            size={24} 
            sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 3,
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: darkMode 
          ? `0 8px 24px ${alpha('#4285f4', 0.3)}`
          : `0 8px 24px ${alpha('#4285f4', 0.2)}`,
        borderColor: '#4285f4'
      }
    }}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: { xs: 1.5, sm: 2 } 
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: { xs: 36, sm: 44 },
                height: { xs: 36, sm: 44 },
                backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
                color: '#4285f4'
              }}
            >
              <ActivityIcon fontSize={isMobile ? "small" : "medium"} />
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  color: darkMode ? '#e8eaed' : '#202124'
                }}
              >
                Recent Activity
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                Latest updates and notifications
              </Typography>
            </Box>
          </Box>
          
          {!subscriptionExpired && activities.length > 0 && (
            <Chip 
              label={`${activities.length} new`}
              size="small"
              sx={{
                backgroundColor: darkMode ? alpha('#34a853', 0.2) : alpha('#34a853', 0.1),
                color: darkMode ? '#81c995' : '#34a853',
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            />
          )}
        </Box>

        {/* Subscription Expired Message */}
        {subscriptionExpired && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.05),
              border: `1px solid ${darkMode ? alpha('#fbbc04', 0.3) : alpha('#fbbc04', 0.2)}`,
              color: darkMode ? '#fdd663' : '#fbbc04',
            }}
            icon={<ErrorOutline />}
            action={
              <Button 
                color="inherit" 
                size="small"
                startIcon={<Upgrade />}
                onClick={() => window.location.href = '/pricing'}
                sx={{ 
                  fontWeight: 600,
                  color: darkMode ? '#fdd663' : '#fbbc04',
                  '&:hover': {
                    backgroundColor: darkMode ? alpha('#fbbc04', 0.2) : alpha('#fbbc04', 0.1),
                  }
                }}
              >
                Upgrade
              </Button>
            }
          >
            <Typography variant="body2" fontWeight={600}>
              {error || 'Your subscription has expired'}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              Renew your subscription to view recent activity
            </Typography>
          </Alert>
        )}

        {/* Activities List */}
        {!subscriptionExpired ? (
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            maxHeight: 350,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: darkMode ? '#202124' : '#f8f9fa',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: darkMode ? '#5f6368' : '#dadce0',
              borderRadius: '10px',
            }
          }}>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    py: 2,
                    px: 1,
                    borderRadius: 2,
                    backgroundColor: index % 2 === 0 
                      ? (darkMode ? alpha('#ffffff', 0.02) : alpha('#000000', 0.02))
                      : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
                      transform: 'translateX(4px)',
                    },
                    mb: index < activities.length - 1 ? 1 : 0
                  }}
                >
                  {/* Icon */}
                  <Avatar
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      backgroundColor: darkMode 
                        ? alpha(getActivityColor(activity.type), 0.2) 
                        : alpha(getActivityColor(activity.type), 0.1),
                      color: getActivityColor(activity.type),
                      fontSize: '1rem'
                    }}
                  >
                    {activity.icon}
                  </Avatar>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1,
                      mb: 0.5
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight={600} 
                        sx={{ 
                          fontSize: { xs: '0.85rem', sm: '0.95rem' },
                          color: darkMode ? '#e8eaed' : '#202124',
                          lineHeight: 1.3 
                        }}
                      >
                        {activity.message}
                      </Typography>
                      
                      {activity.amount && (
                        <Typography 
                          variant="caption" 
                          fontWeight={700} 
                          sx={{
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            color: '#34a853',
                            backgroundColor: darkMode 
                              ? alpha('#34a853', 0.2) 
                              : alpha('#34a853', 0.1),
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          ₹{activity.amount.toLocaleString('en-IN')}
                        </Typography>
                      )}
                    </Box>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        lineHeight: 1.4,
                        mb: 1
                      }}
                    >
                      {activity.details}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      {activity.customerName && (
                        <Chip
                          label={activity.customerName}
                          size="small"
                          sx={{
                            backgroundColor: darkMode 
                              ? alpha('#4285f4', 0.2) 
                              : alpha('#4285f4', 0.1),
                            color: darkMode ? '#8ab4f8' : '#4285f4',
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 22
                          }}
                        />
                      )}

                      {activity.productName && (
                        <Chip
                          label={activity.productName}
                          size="small"
                          sx={{
                            backgroundColor: darkMode 
                              ? alpha('#fbbc04', 0.2) 
                              : alpha('#fbbc04', 0.1),
                            color: darkMode ? '#fdd663' : '#fbbc04',
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 22
                          }}
                        />
                      )}
                    </Box>

                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '0.75rem',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <AccountBalance fontSize="inherit" />
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                px: 2 
              }}>
                <Inventory2 sx={{ 
                  fontSize: 48, 
                  color: darkMode ? '#5f6368' : '#9aa0a6',
                  mb: 2 
                }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1,
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  No recent activity
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: darkMode ? '#5f6368' : '#9aa0a6'
                  }}
                >
                  Recent billing, customers, and stock updates will appear here
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          // Show upgrade prompt when subscription expired
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            py: 4,
            px: 2 
          }}>
            <Upgrade sx={{ 
              fontSize: 48, 
              color: '#fbbc04',
              mb: 2 
            }} />
            <Typography 
              variant="body1" 
              fontWeight={600} 
              sx={{ 
                mb: 1,
                color: darkMode ? '#e8eaed' : '#202124'
              }}
            >
              Subscription Required
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3, 
                maxWidth: 300,
                color: darkMode ? '#9aa0a6' : '#5f6368'
              }}
            >
              Upgrade your plan to view recent activity and access all features
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Upgrade />}
              onClick={() => window.location.href = '/pricing'}
              sx={{ 
                borderRadius: 2,
                backgroundColor: '#4285f4',
                '&:hover': {
                  backgroundColor: '#3367d6',
                }
              }}
            >
              Upgrade Now
            </Button>
          </Box>
        )}

        {/* Footer - Only show if not expired */}
        {!subscriptionExpired && activities.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 3, 
            pt: 2, 
            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontWeight: 500
              }}
            >
              Showing {Math.min(activities.length, 8)} activities
            </Typography>
            
            <Button
              size="small"
              startIcon={refreshing ? <CircularProgress size={14} /> : <Refresh />}
              onClick={fetchRecentActivity}
              disabled={refreshing}
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: darkMode ? '#8ab4f8' : '#4285f4',
                '&:hover': {
                  backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
                }
              }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivity